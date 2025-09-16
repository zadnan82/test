# user_backend/app/core/error_handlers.py

import logging
import traceback
from typing import Dict, Any
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from pydantic import ValidationError as PydanticValidationError

from user_backend.app.core.exceptions import BaseAPIException

logger = logging.getLogger(__name__)


def create_error_response(
    status_code: int,
    error_code: str,
    message: str,
    details: Dict[str, Any] = None,
    request_id: str = None,
) -> JSONResponse:
    """Create standardized error response"""

    error_response = {
        "success": False,
        "error": {
            "code": error_code,
            "message": message,
            "details": details or {},
        },
        "data": None,
        "timestamp": __import__("datetime").datetime.utcnow().isoformat() + "Z",
    }

    if request_id:
        error_response["request_id"] = request_id

    return JSONResponse(status_code=status_code, content=error_response)


async def base_api_exception_handler(request: Request, exc: BaseAPIException):
    """Handler for custom API exceptions"""

    request_id = getattr(request.state, "request_id", None)

    logger.warning(
        f"API Exception: {exc.error_code} - {exc.detail['message']}",
        extra={
            "error_code": exc.error_code,
            "status_code": exc.status_code,
            "request_id": request_id,
            "path": str(request.url),
            "method": request.method,
        },
    )

    return create_error_response(
        status_code=exc.status_code,
        error_code=exc.error_code,
        message=exc.detail["message"],
        details=exc.detail.get("details", {}),
        request_id=request_id,
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handler for Pydantic validation errors"""

    request_id = getattr(request.state, "request_id", None)

    # Extract field errors from Pydantic validation error
    field_errors = {}
    for error in exc.errors():
        field_name = ".".join(str(loc) for loc in error["loc"] if loc != "body")
        field_errors[field_name] = error["msg"]

    logger.warning(
        f"Validation error: {field_errors}",
        extra={
            "error_code": "VALIDATION_ERROR",
            "request_id": request_id,
            "path": str(request.url),
            "method": request.method,
            "field_errors": field_errors,
        },
    )

    return create_error_response(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        error_code="VALIDATION_ERROR",
        message="Input validation failed",
        details={"field_errors": field_errors},
        request_id=request_id,
    )


async def pydantic_validation_exception_handler(
    request: Request, exc: PydanticValidationError
):
    """Handler for direct Pydantic validation errors"""

    request_id = getattr(request.state, "request_id", None)

    field_errors = {}
    for error in exc.errors():
        field_name = ".".join(str(loc) for loc in error["loc"])
        field_errors[field_name] = error["msg"]

    logger.warning(
        f"Pydantic validation error: {field_errors}",
        extra={
            "error_code": "VALIDATION_ERROR",
            "request_id": request_id,
            "field_errors": field_errors,
        },
    )

    return create_error_response(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        error_code="VALIDATION_ERROR",
        message="Data validation failed",
        details={"field_errors": field_errors},
        request_id=request_id,
    )


async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    """Handler for SQLAlchemy database errors"""

    request_id = getattr(request.state, "request_id", None)

    # Handle specific database errors
    if isinstance(exc, IntegrityError):
        # Check for unique constraint violations (user already exists)
        error_msg = str(exc.orig)

        if "unique constraint" in error_msg.lower():
            if "email" in error_msg.lower():
                # Extract email from the error message if possible
                logger.warning(
                    "User registration failed - email already exists",
                    extra={
                        "error_code": "USER_ALREADY_EXISTS",
                        "request_id": request_id,
                        "path": str(request.url),
                    },
                )

                return create_error_response(
                    status_code=status.HTTP_409_CONFLICT,
                    error_code="USER_ALREADY_EXISTS",
                    message="A user with this email already exists",
                    request_id=request_id,
                )

        logger.error(
            f"Database integrity error: {error_msg}",
            extra={
                "error_code": "DATABASE_INTEGRITY_ERROR",
                "request_id": request_id,
                "path": str(request.url),
            },
        )

        return create_error_response(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            error_code="DATABASE_INTEGRITY_ERROR",
            message="Data integrity constraint violation",
            request_id=request_id,
        )

    # Generic database error
    logger.error(
        f"Database error: {str(exc)}",
        extra={
            "error_code": "DATABASE_ERROR",
            "request_id": request_id,
            "path": str(request.url),
            "exception_type": type(exc).__name__,
        },
    )

    return create_error_response(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        error_code="DATABASE_ERROR",
        message="A database error occurred",
        request_id=request_id,
    )


async def generic_exception_handler(request: Request, exc: Exception):
    """Handler for unhandled exceptions"""

    request_id = getattr(request.state, "request_id", None)

    # Log the full traceback for debugging
    logger.error(
        f"Unhandled exception: {str(exc)}",
        extra={
            "error_code": "INTERNAL_SERVER_ERROR",
            "request_id": request_id,
            "path": str(request.url),
            "method": request.method,
            "exception_type": type(exc).__name__,
            "traceback": traceback.format_exc(),
        },
    )

    return create_error_response(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        error_code="INTERNAL_SERVER_ERROR",
        message="An unexpected error occurred",
        request_id=request_id,
    )


async def http_exception_handler(request: Request, exc: Exception):
    """Handler for HTTP exceptions"""

    from fastapi import HTTPException

    if not isinstance(exc, HTTPException):
        return await generic_exception_handler(request, exc)

    request_id = getattr(request.state, "request_id", None)

    logger.warning(
        f"HTTP Exception: {exc.status_code} - {exc.detail}",
        extra={
            "error_code": "HTTP_ERROR",
            "status_code": exc.status_code,
            "request_id": request_id,
            "path": str(request.url),
            "method": request.method,
        },
    )

    # If detail is already a dict (from our custom exceptions), use it
    if isinstance(exc.detail, dict):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": exc.detail,
                "data": None,
                "timestamp": __import__("datetime").datetime.utcnow().isoformat() + "Z",
                "request_id": request_id,
            },
        )

    return create_error_response(
        status_code=exc.status_code,
        error_code="HTTP_ERROR",
        message=str(exc.detail),
        request_id=request_id,
    )


def register_exception_handlers(app):
    """Register all exception handlers"""

    # Custom API exceptions
    app.add_exception_handler(BaseAPIException, base_api_exception_handler)

    # Validation errors
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(
        PydanticValidationError, pydantic_validation_exception_handler
    )

    # Database errors
    app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)

    # HTTP exceptions
    from fastapi import HTTPException

    app.add_exception_handler(HTTPException, http_exception_handler)

    # Catch-all for unhandled exceptions
    app.add_exception_handler(Exception, generic_exception_handler)
