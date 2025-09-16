# user_backend/app/core/middleware.py

import time
import uuid
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.base import RequestResponseEndpoint


from user_backend.app.core.logging_config import (
    set_correlation_id,
    performance_logger,
    StructuredLogger,
)


class CorrelationIdMiddleware(BaseHTTPMiddleware):
    """Add correlation ID to all requests"""

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        # Generate or extract correlation ID
        correlation_id = (
            request.headers.get("X-Correlation-ID")
            or request.headers.get("X-Request-ID")
            or str(uuid.uuid4())
        )

        # Set in context
        set_correlation_id(correlation_id)

        # Store in request state for access in handlers
        request.state.request_id = correlation_id

        # Process request
        response = await call_next(request)

        # Add correlation ID to response headers
        response.headers["X-Correlation-ID"] = correlation_id

        return response


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log all requests and responses"""

    def __init__(self, app, exclude_paths: list = None):
        super().__init__(app)
        self.logger = StructuredLogger("requests")
        self.exclude_paths = exclude_paths or [
            "/health",
            "/metrics",
            "/docs",
            "/redoc",
            "/openapi.json",
        ]

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        start_time = time.time()

        # Skip logging for excluded paths
        if request.url.path in self.exclude_paths:
            return await call_next(request)

        # Log request
        self.logger.info(
            f"Request started: {request.method} {request.url.path}",
            method=request.method,
            path=request.url.path,
            query_params=dict(request.query_params),
            user_agent=request.headers.get("user-agent"),
            ip_address=self._get_client_ip(request),
        )

        # Process request
        try:
            response = await call_next(request)

            # Calculate duration
            duration = time.time() - start_time

            # Log response
            self.logger.info(
                f"Request completed: {request.method} {request.url.path} - {response.status_code} - {duration:.3f}s",
                method=request.method,
                path=request.url.path,
                status_code=response.status_code,
                duration=duration,
            )

            # Log performance metrics
            performance_logger.log_request_duration(
                request.url.path, request.method, duration, response.status_code
            )

            return response

        except Exception as e:
            duration = time.time() - start_time

            self.logger.error(
                f"Request failed: {request.method} {request.url.path} - {duration:.3f}s",
                method=request.method,
                path=request.url.path,
                duration=duration,
                error=str(e),
                error_type=type(e).__name__,
            )
            raise

    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP address"""
        # Check for common proxy headers
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()

        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip

        # Fallback to direct connection
        return getattr(request.client, "host", "unknown")


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses"""

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        response = await call_next(request)

        # Add security headers
        security_headers = {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "Content-Security-Policy": (
                "default-src 'self'; "
                "script-src 'self' 'unsafe-inline'; "
                "style-src 'self' 'unsafe-inline'; "
                "img-src 'self' data: https:; "
                "font-src 'self' data:; "
                "connect-src 'self'; "
                "frame-ancestors 'none';"
            ),
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        }

        for header, value in security_headers.items():
            response.headers[header] = value

        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Simple in-memory rate limiting"""

    def __init__(self, app, max_requests: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = {}  # In production, use Redis
        self.logger = StructuredLogger("rate_limit")

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        client_ip = self._get_client_ip(request)
        current_time = time.time()

        # Clean old entries
        self._clean_old_entries(current_time)

        # Check rate limit
        if self._is_rate_limited(client_ip, current_time):
            self.logger.warning(
                f"Rate limit exceeded for IP: {client_ip}",
                ip_address=client_ip,
                path=request.url.path,
                method=request.method,
            )

            from user_backend.app.core.exceptions import RateLimitError

            raise RateLimitError(retry_after=self.window_seconds)

        # Record request
        self._record_request(client_ip, current_time)

        return await call_next(request)

    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP address"""
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()

        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip

        return getattr(request.client, "host", "unknown")

    def _clean_old_entries(self, current_time: float):
        """Remove old entries outside the time window"""
        cutoff_time = current_time - self.window_seconds

        for ip in list(self.requests.keys()):
            self.requests[ip] = [
                timestamp for timestamp in self.requests[ip] if timestamp > cutoff_time
            ]
            if not self.requests[ip]:
                del self.requests[ip]

    def _is_rate_limited(self, client_ip: str, current_time: float) -> bool:
        """Check if client is rate limited"""
        if client_ip not in self.requests:
            return False

        return len(self.requests[client_ip]) >= self.max_requests

    def _record_request(self, client_ip: str, current_time: float):
        """Record request timestamp"""
        if client_ip not in self.requests:
            self.requests[client_ip] = []

        self.requests[client_ip].append(current_time)


class DatabaseTransactionMiddleware(BaseHTTPMiddleware):
    """Handle database transactions per request"""

    def __init__(self, app):
        super().__init__(app)
        self.logger = StructuredLogger("database")

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        # Only handle transactional operations (POST, PUT, PATCH, DELETE)
        if request.method in ["POST", "PUT", "PATCH", "DELETE"]:
            # Note: This is a simplified example
            # In practice, you'd integrate with your database session management
            try:
                response = await call_next(request)

                # If response is successful, commit would happen in the route
                # This middleware is mainly for cleanup and error handling
                return response

            except Exception as e:
                # Log database transaction error
                self.logger.error(
                    f"Database transaction failed for {request.method} {request.url.path}",
                    method=request.method,
                    path=request.url.path,
                    error=str(e),
                    error_type=type(e).__name__,
                )
                raise

        return await call_next(request)


class ErrorTrackingMiddleware(BaseHTTPMiddleware):
    """Track and log errors for monitoring"""

    def __init__(self, app):
        super().__init__(app)
        self.logger = StructuredLogger("error_tracking")

    async def dispatch(
        self, request: Request, call_next: RequestResponseEndpoint
    ) -> Response:
        try:
            response = await call_next(request)

            # Log 4xx and 5xx responses
            if response.status_code >= 400:
                self.logger.warning(
                    f"HTTP error response: {response.status_code}",
                    method=request.method,
                    path=request.url.path,
                    status_code=response.status_code,
                    ip_address=self._get_client_ip(request),
                )

            return response

        except Exception as e:
            # Log unhandled exceptions
            self.logger.error(
                f"Unhandled exception in request: {str(e)}",
                method=request.method,
                path=request.url.path,
                error=str(e),
                error_type=type(e).__name__,
                ip_address=self._get_client_ip(request),
            )
            raise

    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP address"""
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()

        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip

        return getattr(request.client, "host", "unknown")


def setup_middleware(app):
    """Setup all middleware for the application"""

    # Add middleware in reverse order (last added = first executed)

    # Error tracking (outermost)
    app.add_middleware(ErrorTrackingMiddleware)

    # Security headers
    app.add_middleware(SecurityHeadersMiddleware)

    # Rate limiting
    app.add_middleware(RateLimitMiddleware, max_requests=1000, window_seconds=60)

    # Database transactions
    app.add_middleware(DatabaseTransactionMiddleware)

    # Request logging
    app.add_middleware(RequestLoggingMiddleware)

    # Correlation ID (innermost - should be first to set context)
    app.add_middleware(CorrelationIdMiddleware)
