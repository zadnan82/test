# user_backend/app/core/exceptions.py - FIXED VERSION

from typing import Any, Dict, Optional
from fastapi import HTTPException, status


class BaseAPIException(HTTPException):
    """Base exception for all API exceptions - FIXED"""

    def __init__(
        self,
        status_code: int,
        message: str,
        *,  # Everything after this is keyword-only
        error_code: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None,
        headers: Optional[Dict[str, str]] = None,
        **kwargs,
    ):
        # FIXED: Handle duplicate error_code properly
        final_error_code = kwargs.pop("error_code", error_code)
        if final_error_code is None:
            final_error_code = self.__class__.__name__

        self.error_code = final_error_code
        self.details = details or {}

        detail = {
            "error_code": self.error_code,
            "message": message,
            "details": self.details,
        }

        super().__init__(status_code=status_code, detail=detail, headers=headers)


# Authentication Exceptions
class AuthenticationError(BaseAPIException):
    def __init__(self, message: str = "Authentication failed", **kwargs):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message=message,
            error_code="AUTH_FAILED",
            **kwargs,
        )


class InvalidCredentialsError(AuthenticationError):
    def __init__(self, message: str = "Invalid email or password", **kwargs):
        super().__init__(message=message, error_code="INVALID_CREDENTIALS", **kwargs)


class TokenExpiredError(AuthenticationError):
    def __init__(self, message: str = "Token has expired", **kwargs):
        super().__init__(message=message, error_code="TOKEN_EXPIRED", **kwargs)


class InvalidTokenError(AuthenticationError):
    def __init__(self, message: str = "Invalid token", **kwargs):
        # FIXED: Remove error_code from kwargs to avoid conflict
        filtered_kwargs = {k: v for k, v in kwargs.items() if k != "error_code"}
        super().__init__(
            message=message,
            error_code="INVALID_TOKEN",
            **filtered_kwargs,
        )


# Authorization Exceptions
class AuthorizationError(BaseAPIException):
    def __init__(self, message: str = "Access denied", **kwargs):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            message=message,
            error_code="ACCESS_DENIED",
            **kwargs,
        )


class InsufficientPermissionsError(AuthorizationError):
    def __init__(self, message: str = "Insufficient permissions", **kwargs):
        super().__init__(
            message=message, error_code="INSUFFICIENT_PERMISSIONS", **kwargs
        )


# User Exceptions
class UserNotFoundError(BaseAPIException):
    def __init__(self, user_id: Optional[str] = None, **kwargs):
        message = "User not found"
        if user_id:
            message += f" (ID: {user_id})"

        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            message=message,
            error_code="USER_NOT_FOUND",
            details={"user_id": user_id} if user_id else {},
            **kwargs,
        )


class UserAlreadyExistsError(BaseAPIException):
    def __init__(self, email: str, **kwargs):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            message=f"User with email '{email}' already exists",
            error_code="USER_ALREADY_EXISTS",
            details={"email": email},
            **kwargs,
        )


class UserInactiveError(BaseAPIException):
    def __init__(self, message: str = "User account is inactive", **kwargs):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            message=message,
            error_code="USER_INACTIVE",
            **kwargs,
        )


# Validation Exceptions
class ValidationError(BaseAPIException):
    def __init__(
        self,
        message: str = "Validation failed",
        field_errors: Optional[Dict[str, str]] = None,
        **kwargs,
    ):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            message=message,
            error_code="VALIDATION_ERROR",
            details={"field_errors": field_errors or {}},
            **kwargs,
        )


class EmailValidationError(ValidationError):
    def __init__(self, email: str, **kwargs):
        super().__init__(
            message=f"Invalid email format: {email}",
            error_code="INVALID_EMAIL",
            field_errors={"email": "Invalid email format"},
            **kwargs,
        )


class PasswordValidationError(ValidationError):
    def __init__(self, message: str, **kwargs):
        super().__init__(
            message=message,
            error_code="INVALID_PASSWORD",
            field_errors={"password": message},
            **kwargs,
        )


# Database Exceptions
class DatabaseError(BaseAPIException):
    def __init__(self, message: str = "Database operation failed", **kwargs):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=message,
            error_code="DATABASE_ERROR",
            **kwargs,
        )


class DatabaseConnectionError(DatabaseError):
    def __init__(self, message: str = "Database connection failed", **kwargs):
        super().__init__(message=message, error_code="DB_CONNECTION_ERROR", **kwargs)


class DatabaseTransactionError(DatabaseError):
    def __init__(self, message: str = "Database transaction failed", **kwargs):
        super().__init__(message=message, error_code="DB_TRANSACTION_ERROR", **kwargs)


# Rate Limiting Exceptions
class RateLimitError(BaseAPIException):
    def __init__(
        self,
        message: str = "Too many requests",
        retry_after: Optional[int] = None,
        **kwargs,
    ):
        headers = {}
        if retry_after:
            headers["Retry-After"] = str(retry_after)

        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            message=message,
            error_code="RATE_LIMIT_EXCEEDED",
            details={"retry_after": retry_after},
            headers=headers,
            **kwargs,
        )


# File/Upload Exceptions
class FileUploadError(BaseAPIException):
    def __init__(self, message: str = "File upload failed", **kwargs):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=message,
            error_code="FILE_UPLOAD_ERROR",
            **kwargs,
        )


class FileTooLargeError(FileUploadError):
    def __init__(self, max_size: int, actual_size: int, **kwargs):
        super().__init__(
            message=f"File too large. Maximum size: {max_size} bytes, actual: {actual_size} bytes",
            error_code="FILE_TOO_LARGE",
            details={"max_size": max_size, "actual_size": actual_size},
            **kwargs,
        )


class InvalidFileTypeError(FileUploadError):
    def __init__(self, file_type: str, allowed_types: list, **kwargs):
        super().__init__(
            message=f"Invalid file type: {file_type}. Allowed types: {', '.join(allowed_types)}",
            error_code="INVALID_FILE_TYPE",
            details={"file_type": file_type, "allowed_types": allowed_types},
            **kwargs,
        )


# External Service Exceptions
class ExternalServiceError(BaseAPIException):
    def __init__(
        self, service_name: str, message: str = "External service error", **kwargs
    ):
        super().__init__(
            status_code=status.HTTP_502_BAD_GATEWAY,
            message=f"{service_name}: {message}",
            error_code="EXTERNAL_SERVICE_ERROR",
            details={"service": service_name},
            **kwargs,
        )


class EmailServiceError(ExternalServiceError):
    def __init__(self, message: str = "Email service unavailable", **kwargs):
        super().__init__(
            service_name="Email Service",
            message=message,
            error_code="EMAIL_SERVICE_ERROR",
            **kwargs,
        )


# Business Logic Exceptions
class BusinessLogicError(BaseAPIException):
    def __init__(self, message: str, **kwargs):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            message=message,
            error_code="BUSINESS_LOGIC_ERROR",
            **kwargs,
        )


class AccountLockedException(BusinessLogicError):
    def __init__(self, unlock_time: Optional[str] = None, **kwargs):
        message = "Account is temporarily locked due to multiple failed login attempts"
        if unlock_time:
            message += f". Try again after {unlock_time}"

        super().__init__(
            message=message,
            error_code="ACCOUNT_LOCKED",
            details={"unlock_time": unlock_time} if unlock_time else {},
            **kwargs,
        )


class EmailNotVerifiedError(BusinessLogicError):
    def __init__(self, message: str = "Email address must be verified", **kwargs):
        super().__init__(message=message, error_code="EMAIL_NOT_VERIFIED", **kwargs)


# Configuration Exceptions
class ConfigurationError(BaseAPIException):
    def __init__(self, message: str = "Configuration error", **kwargs):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            message=message,
            error_code="CONFIGURATION_ERROR",
            **kwargs,
        )


class MissingEnvironmentVariableError(ConfigurationError):
    def __init__(self, variable_name: str, **kwargs):
        super().__init__(
            message=f"Missing required environment variable: {variable_name}",
            error_code="MISSING_ENV_VAR",
            details={"variable": variable_name},
            **kwargs,
        )
