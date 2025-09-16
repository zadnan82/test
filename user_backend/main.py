# user_backend/app/main.py

from datetime import datetime
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn
import os
import logging

from user_backend.app.core.exceptions import (
    UserAlreadyExistsError,
    InvalidCredentialsError,
    ValidationError,
    DatabaseError,
)
from user_backend.app.db_setup import init_db

# Initialize logger
try:
    from user_backend.app.core.logging_config import StructuredLogger

    logger = StructuredLogger(__name__)
except ImportError:
    import logging

    logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("🚀 Starting SEVDO User Backend API v2.0.0")

    try:
        init_db()
        logger.info("✅ Database initialized successfully")
    except Exception as e:
        logger.error(f"❌ Database initialization failed: {str(e)}")

    yield

    # Shutdown
    logger.info("🛑 Shutting down SEVDO User Backend API")


# Create FastAPI application
app = FastAPI(
    title="SEVDO User Backend API",
    description="""
    ## Enhanced Backend API for SEVDO Platform
    
    A comprehensive backend service with clean, organized endpoints for all SEVDO platform features.
    """,
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/api/v1/openapi.json",
)

# Configure CORS
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5000",
    "https://sevdo.com",
    "https://app.sevdo.com",
]

if os.getenv("ENVIRONMENT", "development") == "development":
    ALLOWED_ORIGINS.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)


# Exception handlers
@app.exception_handler(UserAlreadyExistsError)
async def user_already_exists_handler(request: Request, exc: UserAlreadyExistsError):
    return JSONResponse(
        status_code=409,
        content={
            "success": False,
            "error": {
                "type": "UserAlreadyExistsError",
                "message": str(exc),
                "code": "USER_EXISTS",
            },
            "timestamp": datetime.utcnow().isoformat(),
        },
    )


@app.exception_handler(InvalidCredentialsError)
async def invalid_credentials_handler(request: Request, exc: InvalidCredentialsError):
    return JSONResponse(
        status_code=401,
        content={
            "success": False,
            "error": {
                "type": "InvalidCredentialsError",
                "message": str(exc),
                "code": "INVALID_CREDENTIALS",
            },
            "timestamp": datetime.utcnow().isoformat(),
        },
    )


@app.exception_handler(ValidationError)
async def validation_error_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "type": "ValidationError",
                "message": str(exc),
                "code": "VALIDATION_FAILED",
            },
            "timestamp": datetime.utcnow().isoformat(),
        },
    )


@app.exception_handler(DatabaseError)
async def database_error_handler(request: Request, exc: DatabaseError):
    logger.error(f"Database error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "type": "DatabaseError",
                "message": "An internal server error occurred",
                "code": "DATABASE_ERROR",
            },
            "timestamp": datetime.utcnow().isoformat(),
        },
    )


# =============================================================================
# DIRECT ROUTER IMPORTS AND REGISTRATION
# =============================================================================

# Track successful registrations
registered_routers = []
failed_routers = []

# Core routers (required)
core_routers = [
    {"name": "auth", "prefix": "/api/v1/auth", "tags": ["Authentication"]},
    {"name": "projects", "prefix": "/api/v1/projects", "tags": ["Projects"]},
    {"name": "sevdo", "prefix": "/api/v1/sevdo", "tags": ["Sevdo Builder"]},
    {"name": "tokens", "prefix": "/api/v1/tokens", "tags": ["Tokens"]},
    {"name": "templates", "prefix": "/api/v1/templates", "tags": ["Templates"]},
    {"name": "ai", "prefix": "/api/v1/ai", "tags": ["AI Integration"]},
]

# Enhanced routers (optional)
enhanced_routers = [
    {
        "name": "analytics",
        "prefix": "/api/v1/analytics",
        "tags": ["Analytics & Reporting"],
    },
    {"name": "system", "prefix": "/api/v1/system", "tags": ["System Monitoring"]},
    {
        "name": "user_preferences",
        "prefix": "/api/v1/preferences",
        "tags": ["User Preferences"],
    },
    {
        "name": "notifications",
        "prefix": "/api/v1/notifications",
        "tags": ["Notifications"],
    },
    {"name": "websockets", "prefix": "/api/v1/ws", "tags": ["Real-time Updates"]},
]


def register_router(router_config, required=True):
    """Register a router with error handling and duplicate prevention"""
    try:
        # Check if already registered
        router_name = router_config["name"]
        if any(r["name"] == router_name for r in registered_routers):
            logger.warning(f"⚠️  Router {router_name} already registered, skipping...")
            return True

        # Import the router
        module_path = f"user_backend.app.api.v1.{router_config['name']}"
        module = __import__(module_path, fromlist=["router"])
        router = getattr(module, "router")

        # Verify it's an APIRouter instance
        from fastapi import APIRouter

        if not isinstance(router, APIRouter):
            raise ValueError(f"Expected APIRouter instance, got {type(router)}")

        # Include the router with explicit configuration
        app.include_router(
            router,
            prefix=router_config["prefix"],
            tags=router_config["tags"],
            # Add this to ensure unique registration
            include_in_schema=True,
        )

        registered_routers.append(
            {
                "name": router_config["name"],
                "prefix": router_config["prefix"],
                "tags": router_config["tags"],
                "type": "core" if required else "enhanced",
            }
        )

        logger.info(
            f"✅ Registered {router_config['name']} router at {router_config['prefix']}"
        )
        return True

    except ImportError as e:
        failed_routers.append(
            {
                "name": router_config["name"],
                "prefix": router_config["prefix"],
                "error": f"Import failed: {str(e)}",
                "required": required,
            }
        )

        if required:
            logger.error(
                f"❌ Failed to import required router {router_config['name']}: {str(e)}"
            )
        else:
            logger.info(
                f"⚠️  Optional router {router_config['name']} not available: {str(e)}"
            )
        return False

    except Exception as e:
        failed_routers.append(
            {
                "name": router_config["name"],
                "prefix": router_config["prefix"],
                "error": f"Registration failed: {str(e)}",
                "required": required,
            }
        )

        logger.error(f"❌ Failed to register router {router_config['name']}: {str(e)}")
        return False


# Register core routers
logger.info("🔧 Registering core routers...")
for router_config in core_routers:
    register_router(router_config, required=True)

# Register enhanced routers
logger.info("⭐ Registering enhanced routers...")
for router_config in enhanced_routers:
    register_router(router_config, required=False)

# Log summary
core_registered = len([r for r in registered_routers if r["type"] == "core"])
enhanced_registered = len([r for r in registered_routers if r["type"] == "enhanced"])
total_failed = len(failed_routers)

logger.info(f"📊 Router registration summary:")
logger.info(f"   ✅ Core routers: {core_registered}/{len(core_routers)}")
logger.info(f"   ⭐ Enhanced routers: {enhanced_registered}/{len(enhanced_routers)}")
logger.info(f"   ❌ Failed: {total_failed}")

if failed_routers:
    critical_failures = [f for f in failed_routers if f["required"]]
    if critical_failures:
        logger.error("🚨 Critical router failures:")
        for failure in critical_failures:
            logger.error(f"   - {failure['name']}: {failure['error']}")

# =============================================================================
# API STATUS ENDPOINTS
# =============================================================================


@app.get("/api/v1/status", tags=["API Info"])
async def api_status():
    """Get API status and registered endpoints"""

    return {
        "api_version": "v1",
        "status": "operational" if core_registered > 0 else "degraded",
        "timestamp": datetime.utcnow().isoformat(),
        "summary": {
            "total_registered": len(registered_routers),
            "core_routers": core_registered,
            "enhanced_routers": enhanced_registered,
            "failed_routers": total_failed,
        },
        "registered_routers": registered_routers,
        "failed_routers": failed_routers if failed_routers else [],
        "documentation": {"swagger_ui": "/docs", "redoc": "/redoc"},
    }


# =============================================================================
# ROOT ENDPOINTS
# =============================================================================


@app.get("/", tags=["Root"])
async def root():
    """API information"""
    return {
        "name": "SEVDO User Backend API",
        "version": "2.0.0",
        "status": "operational",
        "registered_endpoints": len(registered_routers),
        "documentation": "/docs",
        "api_status": "/api/v1/status",
    }


@app.get("/health", tags=["Root"])
async def health_check():
    """Health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "registered_routers": len(registered_routers),
    }


if __name__ == "__main__":
    uvicorn.run(
        "user_backend.app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
        access_log=True,
    )
