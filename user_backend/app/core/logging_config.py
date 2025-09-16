# user_backend/app/core/logging_config.py

import logging
import logging.config
import sys
from pathlib import Path
from typing import Dict, Any
import contextvars
from user_backend.app.settings import settings


def setup_logging():
    """Configure logging for the application"""

    # Create logs directory if it doesn't exist
    log_dir = Path("logs")
    log_dir.mkdir(exist_ok=True)

    # Determine log level based on environment
    log_level = "DEBUG" if settings.SEVDO_ENV == "development" else "INFO"

    logging_config: Dict[str, Any] = {
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "default": {
                "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "detailed": {
                "format": (
                    "%(asctime)s - %(name)s - %(levelname)s - "
                    "[%(filename)s:%(lineno)d] - %(funcName)s() - %(message)s"
                ),
                "datefmt": "%Y-%m-%d %H:%M:%S",
            },
            "json": {
                "()": "pythonjsonlogger.jsonlogger.JsonFormatter",
                "format": (
                    "%(asctime)s %(name)s %(levelname)s %(filename)s "
                    "%(lineno)d %(funcName)s %(message)s"
                ),
            },
        },
        "filters": {
            "correlation_id": {
                "()": "user_backend.app.core.logging_config.CorrelationIdFilter",
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": log_level,
                "formatter": "detailed"
                if settings.SEVDO_ENV == "development"
                else "default",
                "stream": sys.stdout,
                "filters": ["correlation_id"],
            },
            "file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "INFO",
                "formatter": "json"
                if settings.SEVDO_ENV == "production"
                else "detailed",
                "filename": "logs/app.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 5,
                "filters": ["correlation_id"],
            },
            "error_file": {
                "class": "logging.handlers.RotatingFileHandler",
                "level": "ERROR",
                "formatter": "json"
                if settings.SEVDO_ENV == "production"
                else "detailed",
                "filename": "logs/error.log",
                "maxBytes": 10485760,  # 10MB
                "backupCount": 10,
                "filters": ["correlation_id"],
            },
        },
        "loggers": {
            "user_backend": {
                "level": log_level,
                "handlers": ["console", "file", "error_file"],
                "propagate": False,
            },
            "sqlalchemy.engine": {
                "level": "WARNING" if settings.SEVDO_ENV == "production" else "INFO",
                "handlers": ["console", "file"],
                "propagate": False,
            },
            "uvicorn": {
                "level": "INFO",
                "handlers": ["console", "file"],
                "propagate": False,
            },
            "uvicorn.access": {
                "level": "INFO",
                "handlers": ["file"],
                "propagate": False,
            },
        },
        "root": {
            "level": "INFO",
            "handlers": ["console", "file"],
        },
    }

    logging.config.dictConfig(logging_config)

    # Set up correlation ID context
    setup_correlation_id_context()

    logger = logging.getLogger(__name__)
    logger.info(f"Logging configured for environment: {settings.SEVDO_ENV}")


class CorrelationIdFilter(logging.Filter):
    """Add correlation ID to log records"""

    def filter(self, record):
        # Try to get correlation ID from context
        try:
            correlation_id = correlation_id_context.get()
            record.correlation_id = correlation_id
        except LookupError:
            record.correlation_id = "N/A"

        return True


# Context variable for correlation ID


correlation_id_context: contextvars.ContextVar[str] = contextvars.ContextVar(
    "correlation_id", default="N/A"
)


def setup_correlation_id_context():
    """Setup correlation ID context variable"""
    pass  # Context variable is already set up above


def get_correlation_id() -> str:
    """Get current correlation ID"""
    try:
        return correlation_id_context.get()
    except LookupError:
        return "N/A"


def set_correlation_id(correlation_id: str):
    """Set correlation ID for current context"""
    correlation_id_context.set(correlation_id)


# Structured logging helpers
class StructuredLogger:
    """Helper class for structured logging"""

    def __init__(self, logger_name: str):
        self.logger = logging.getLogger(logger_name)

    def info(self, message: str, **kwargs):
        """Log info with structured data"""
        extra = self._prepare_extra(**kwargs)
        self.logger.info(message, extra=extra)

    def warning(self, message: str, **kwargs):
        """Log warning with structured data"""
        extra = self._prepare_extra(**kwargs)
        self.logger.warning(message, extra=extra)

    def error(self, message: str, **kwargs):
        """Log error with structured data"""
        extra = self._prepare_extra(**kwargs)
        self.logger.error(message, extra=extra)

    def debug(self, message: str, **kwargs):
        """Log debug with structured data"""
        extra = self._prepare_extra(**kwargs)
        self.logger.debug(message, extra=extra)

    def _prepare_extra(self, **kwargs) -> Dict[str, Any]:
        """Prepare extra data for logging"""
        return {
            "structured_data": kwargs,
            "correlation_id": get_correlation_id(),
        }


# Security-focused logging
class SecurityLogger:
    """Logger for security events"""

    def __init__(self):
        self.logger = logging.getLogger("security")
        self.logger.setLevel(logging.WARNING)

        # Add security log handler
        if not self.logger.handlers:
            handler = logging.handlers.RotatingFileHandler(
                "logs/security.log",
                maxBytes=10485760,  # 10MB
                backupCount=20,
            )
            formatter = logging.Formatter(
                "%(asctime)s - SECURITY - %(levelname)s - %(message)s"
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)

    def log_failed_login(self, email: str, ip_address: str, user_agent: str = None):
        """Log failed login attempt"""
        self.logger.warning(
            f"Failed login attempt for email: {email}",
            extra={
                "event_type": "failed_login",
                "email": email,
                "ip_address": ip_address,
                "user_agent": user_agent,
                "correlation_id": get_correlation_id(),
            },
        )

    def log_successful_login(self, user_id: int, email: str, ip_address: str):
        """Log successful login"""
        self.logger.info(
            f"Successful login for user: {email}",
            extra={
                "event_type": "successful_login",
                "user_id": user_id,
                "email": email,
                "ip_address": ip_address,
                "correlation_id": get_correlation_id(),
            },
        )

    def log_password_change(self, user_id: int, email: str, ip_address: str):
        """Log password change"""
        self.logger.warning(
            f"Password changed for user: {email}",
            extra={
                "event_type": "password_change",
                "user_id": user_id,
                "email": email,
                "ip_address": ip_address,
                "correlation_id": get_correlation_id(),
            },
        )

    def log_suspicious_activity(
        self, description: str, user_id: int = None, ip_address: str = None
    ):
        """Log suspicious activity"""
        self.logger.error(
            f"Suspicious activity: {description}",
            extra={
                "event_type": "suspicious_activity",
                "description": description,
                "user_id": user_id,
                "ip_address": ip_address,
                "correlation_id": get_correlation_id(),
            },
        )


# Global loggers
security_logger = SecurityLogger()


# Performance logging
class PerformanceLogger:
    """Logger for performance metrics"""

    def __init__(self):
        self.logger = logging.getLogger("performance")

    def log_slow_query(self, query: str, duration: float, threshold: float = 1.0):
        """Log slow database queries"""
        if duration > threshold:
            self.logger.warning(
                f"Slow query detected: {duration:.2f}s",
                extra={
                    "event_type": "slow_query",
                    "duration": duration,
                    "query": query[:200] + "..." if len(query) > 200 else query,
                    "correlation_id": get_correlation_id(),
                },
            )

    def log_request_duration(
        self, path: str, method: str, duration: float, status_code: int
    ):
        """Log request duration"""
        level = "WARNING" if duration > 2.0 else "INFO"

        self.logger.log(
            getattr(logging, level),
            f"Request completed: {method} {path} - {duration:.2f}s - {status_code}",
            extra={
                "event_type": "request_duration",
                "path": path,
                "method": method,
                "duration": duration,
                "status_code": status_code,
                "correlation_id": get_correlation_id(),
            },
        )


# Global performance logger
performance_logger = PerformanceLogger()
