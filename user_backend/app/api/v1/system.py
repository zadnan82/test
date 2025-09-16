# user_backend/app/api/v1/endpoints/system.py

import sys
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text

from user_backend.app.models import User
from user_backend.app.schemas import (
    MessageResponseSchema,
    HealthCheckSchema,
    ErrorReportSchema,
    FeedbackSchema,
)
from user_backend.app.core.security import get_current_active_user
from user_backend.app.db_setup import get_db
from user_backend.app.core.logging_config import StructuredLogger

router = APIRouter()
logger = StructuredLogger(__name__)


@router.get("/health", response_model=HealthCheckSchema)
async def health_check(db: Session = Depends(get_db)):
    """System health check"""
    try:
        # Test database connection
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        db_status = "disconnected"

    return HealthCheckSchema(
        status="healthy" if db_status == "connected" else "unhealthy",
        environment="development",  # TODO: Get from config
        version="2.0.0",  # TODO: Get from version file
        database=db_status,
        timestamp=datetime.utcnow(),
    )


@router.get("/status")
async def system_status(db: Session = Depends(get_db)):
    """Detailed system status"""
    services = {}

    # Database status
    try:
        start_time = datetime.utcnow()
        db.execute(text("SELECT 1"))
        response_time = (datetime.utcnow() - start_time).total_seconds()
        services["database"] = {
            "status": "healthy",
            "response_time": response_time,
            "last_checked": datetime.utcnow(),
        }
    except Exception as e:
        services["database"] = {
            "status": "down",
            "error": str(e),
            "last_checked": datetime.utcnow(),
        }

    # File storage status
    try:
        from pathlib import Path

        UPLOAD_DIR = Path("uploads")
        UPLOAD_DIR.mkdir(exist_ok=True)
        services["file_storage"] = {
            "status": "healthy",
            "last_checked": datetime.utcnow(),
        }
    except Exception as e:
        services["file_storage"] = {
            "status": "degraded",
            "error": str(e),
            "last_checked": datetime.utcnow(),
        }

    # Overall status
    overall_status = "healthy"
    if any(s.get("status") == "down" for s in services.values()):
        overall_status = "down"
    elif any(s.get("status") == "degraded" for s in services.values()):
        overall_status = "degraded"

    return {
        "overall_status": overall_status,
        "services": services,
        "version": "2.0.0",
        "python_version": sys.version,
        "timestamp": datetime.utcnow(),
    }


@router.get("/metrics")
async def get_system_metrics():
    """Get basic system metrics"""
    try:
        # Basic system information
        return {
            "python_version": sys.version,
            "platform": sys.platform,
            "timestamp": datetime.utcnow(),
            "uptime_info": "Service running normally",
        }

    except Exception as e:
        logger.error(f"Failed to get system metrics: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get system metrics",
        )


@router.post("/errors/report", response_model=MessageResponseSchema)
async def report_error(
    error_report: ErrorReportSchema,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Report application error"""
    try:
        # Log the error report
        logger.error(
            f"User error report: {error_report.error_type}",
            user_id=current_user.id,
            error_type=error_report.error_type,
            message=error_report.message,
            context=error_report.context,
        )

        # TODO: Store in database for tracking
        # TODO: Send to error tracking service (Sentry, etc.)

        return MessageResponseSchema(
            message="Error report submitted successfully. Thank you for helping us improve!"
        )

    except Exception as e:
        logger.error(f"Failed to submit error report: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit error report",
        )


@router.post("/feedback", response_model=MessageResponseSchema)
async def submit_feedback(
    feedback: FeedbackSchema,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Submit user feedback"""
    try:
        # Log the feedback
        logger.info(
            f"User feedback: {feedback.type}",
            user_id=current_user.id,
            feedback_type=feedback.type,
            message=feedback.message,
            rating=feedback.rating,
        )

        # TODO: Store in database
        # TODO: Send notification to team

        return MessageResponseSchema(
            message="Feedback submitted successfully. Thank you!"
        )

    except Exception as e:
        logger.error(f"Failed to submit feedback: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit feedback",
        )
