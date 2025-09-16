# user_backend/app/settings.py

import os
import logging
from typing import Optional, List
from pydantic import Field, validator
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    """Enhanced application settings with validation"""

    # Environment
    SEVDO_ENV: str = Field(
        default="development",
        description="Environment (development, staging, production)",
    )

    # Database
    DB_URL: str = Field(..., description="Database connection URL")
    DB_ECHO: bool = Field(default=False, description="Echo SQL queries to logs")
    DB_POOL_SIZE: int = Field(default=10, description="Database connection pool size")
    DB_MAX_OVERFLOW: int = Field(
        default=20, description="Database max overflow connections"
    )

    # Security
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=30, description="Access token expiration in minutes"
    )
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(
        default=30, description="Refresh token expiration in days"
    )
    SECRET_KEY: str = Field(
        default="your-secret-key-change-in-production",
        description="Secret key for signing tokens",
    )

    # Rate Limiting
    RATE_LIMIT_ENABLED: bool = Field(default=True, description="Enable rate limiting")
    RATE_LIMIT_REQUESTS: int = Field(
        default=1000, description="Max requests per window"
    )
    RATE_LIMIT_WINDOW_SECONDS: int = Field(
        default=3600, description="Rate limit window in seconds"
    )

    # CORS
    CORS_ORIGINS: List[str] = Field(
        default=[
            "http://localhost:3000",
            "http://localhost:5173",
            "http://localhost:8080",
        ],
        description="Allowed CORS origins",
    )
    CORS_ALLOW_CREDENTIALS: bool = Field(
        default=True, description="Allow credentials in CORS"
    )

    # Logging
    LOG_LEVEL: str = Field(default="INFO", description="Logging level")
    LOG_FORMAT: str = Field(default="json", description="Log format (json, text)")
    LOG_FILE_ENABLED: bool = Field(default=True, description="Enable file logging")
    LOG_FILE_PATH: str = Field(default="logs/app.log", description="Log file path")
    LOG_FILE_MAX_SIZE: int = Field(
        default=10485760, description="Max log file size in bytes (10MB)"
    )
    LOG_FILE_BACKUP_COUNT: int = Field(
        default=5, description="Number of log file backups"
    )

    # External Services
    OPENAI_API_KEY: Optional[str] = Field(default=None, description="OpenAI API key")
    SMTP_HOST: Optional[str] = Field(default=None, description="SMTP server host")
    SMTP_PORT: int = Field(default=587, description="SMTP server port")
    SMTP_USER: Optional[str] = Field(default=None, description="SMTP username")
    SMTP_PASSWORD: Optional[str] = Field(default=None, description="SMTP password")
    SMTP_USE_TLS: bool = Field(default=True, description="Use TLS for SMTP")

    # File Upload
    UPLOAD_MAX_SIZE: int = Field(
        default=5242880, description="Max upload size in bytes (5MB)"
    )
    UPLOAD_ALLOWED_EXTENSIONS: List[str] = Field(
        default=[".jpg", ".jpeg", ".png", ".gif", ".pdf", ".doc", ".docx"],
        description="Allowed file extensions",
    )
    UPLOAD_PATH: str = Field(default="uploads", description="Upload directory path")

    # Cache
    CACHE_ENABLED: bool = Field(default=True, description="Enable caching")
    CACHE_TTL_SECONDS: int = Field(default=3600, description="Cache TTL in seconds")
    REDIS_URL: Optional[str] = Field(default=None, description="Redis connection URL")

    # Security Headers
    SECURITY_HEADERS_ENABLED: bool = Field(
        default=True, description="Enable security headers"
    )
    CSP_ENABLED: bool = Field(
        default=True, description="Enable Content Security Policy"
    )

    # Monitoring
    METRICS_ENABLED: bool = Field(default=True, description="Enable metrics collection")
    HEALTH_CHECK_ENABLED: bool = Field(
        default=True, description="Enable health check endpoint"
    )

    # Email
    EMAIL_FROM: str = Field(
        default="noreply@sevdo.com", description="Default from email"
    )
    EMAIL_FROM_NAME: str = Field(
        default="SEVDO Platform", description="Default from name"
    )

    # Application
    APP_NAME: str = Field(default="SEVDO User API", description="Application name")
    APP_VERSION: str = Field(default="2.0.0", description="Application version")
    APP_DESCRIPTION: str = Field(
        default="Enhanced user management API with comprehensive error handling",
        description="Application description",
    )

    # Development
    RELOAD_ON_CHANGE: bool = Field(default=False, description="Reload on file changes")
    DEBUG_ENABLED: bool = Field(default=False, description="Enable debug mode")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        validate_assignment=True,
    )

    # Validators
    @validator("SEVDO_ENV")
    def validate_environment(cls, v):
        """Validate environment setting"""
        allowed_envs = ["development", "staging", "production", "testing"]
        if v not in allowed_envs:
            raise ValueError(f"SEVDO_ENV must be one of: {', '.join(allowed_envs)}")
        return v

    @validator("DB_URL")
    def validate_database_url(cls, v):
        """Validate database URL format"""
        if not v:
            raise ValueError("DB_URL is required")

        if not v.startswith(("postgresql://", "postgresql+psycopg2://")):
            raise ValueError(
                "DB_URL must be a PostgreSQL connection string (postgresql:// or postgresql+psycopg2://)"
            )

        return v

    @validator("ACCESS_TOKEN_EXPIRE_MINUTES")
    def validate_token_expiry(cls, v):
        """Validate token expiry time"""
        if v < 1:
            raise ValueError("ACCESS_TOKEN_EXPIRE_MINUTES must be at least 1")
        if v > 10080:  # 1 week
            raise ValueError(
                "ACCESS_TOKEN_EXPIRE_MINUTES cannot exceed 1 week (10080 minutes)"
            )
        return v

    @validator("SECRET_KEY")
    def validate_secret_key(cls, v):
        """Validate secret key"""
        if len(v) < 32:
            logger.warning(
                "SECRET_KEY should be at least 32 characters long for security"
            )

        if v == "your-secret-key-change-in-production":
            logger.warning("Using default SECRET_KEY - change this in production!")

        return v

    @validator("LOG_LEVEL")
    def validate_log_level(cls, v):
        """Validate log level"""
        allowed_levels = ["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"]
        if v.upper() not in allowed_levels:
            raise ValueError(f"LOG_LEVEL must be one of: {', '.join(allowed_levels)}")
        return v.upper()

    @validator("LOG_FORMAT")
    def validate_log_format(cls, v):
        """Validate log format"""
        allowed_formats = ["json", "text"]
        if v not in allowed_formats:
            raise ValueError(f"LOG_FORMAT must be one of: {', '.join(allowed_formats)}")
        return v

    @validator("RATE_LIMIT_REQUESTS")
    def validate_rate_limit(cls, v):
        """Validate rate limit settings"""
        if v < 1:
            raise ValueError("RATE_LIMIT_REQUESTS must be at least 1")
        if v > 100000:
            raise ValueError("RATE_LIMIT_REQUESTS cannot exceed 100000")
        return v

    @validator("UPLOAD_MAX_SIZE")
    def validate_upload_size(cls, v):
        """Validate upload size"""
        if v < 1024:  # 1KB minimum
            raise ValueError("UPLOAD_MAX_SIZE must be at least 1024 bytes (1KB)")
        if v > 104857600:  # 100MB maximum
            raise ValueError("UPLOAD_MAX_SIZE cannot exceed 104857600 bytes (100MB)")
        return v

    @validator("CORS_ORIGINS")
    def validate_cors_origins(cls, v):
        """Validate CORS origins"""
        if not v:
            return ["*"]  # Allow all if none specified

        for origin in v:
            if not origin.startswith(("http://", "https://")):
                logger.warning(
                    f"CORS origin '{origin}' should start with http:// or https://"
                )

        return v

    # Properties
    @property
    def is_development(self) -> bool:
        """Check if running in development mode"""
        return self.SEVDO_ENV == "development"

    @property
    def is_production(self) -> bool:
        """Check if running in production mode"""
        return self.SEVDO_ENV == "production"

    @property
    def is_testing(self) -> bool:
        """Check if running in testing mode"""
        return self.SEVDO_ENV == "testing"

    @property
    def database_config(self) -> dict:
        """Get database configuration"""
        return {
            "url": self.DB_URL,
            "echo": self.DB_ECHO and self.is_development,
            "pool_size": self.DB_POOL_SIZE,
            "max_overflow": self.DB_MAX_OVERFLOW,
            "pool_pre_ping": True,
            "future": True,
        }

    @property
    def cors_config(self) -> dict:
        """Get CORS configuration"""
        return {
            "allow_origins": self.CORS_ORIGINS,
            "allow_credentials": self.CORS_ALLOW_CREDENTIALS,
            "allow_methods": ["*"],
            "allow_headers": ["*"],
        }

    @property
    def rate_limit_config(self) -> dict:
        """Get rate limit configuration"""
        return {
            "enabled": self.RATE_LIMIT_ENABLED,
            "max_requests": self.RATE_LIMIT_REQUESTS,
            "window_seconds": self.RATE_LIMIT_WINDOW_SECONDS,
        }

    def get_smtp_config(self) -> Optional[dict]:
        """Get SMTP configuration if available"""
        if not all([self.SMTP_HOST, self.SMTP_USER, self.SMTP_PASSWORD]):
            return None

        return {
            "host": self.SMTP_HOST,
            "port": self.SMTP_PORT,
            "username": self.SMTP_USER,
            "password": self.SMTP_PASSWORD,
            "use_tls": self.SMTP_USE_TLS,
        }

    def log_configuration(self):
        """Log current configuration (without sensitive data)"""
        config_info = {
            "environment": self.SEVDO_ENV,
            "database": "configured" if self.DB_URL else "not configured",
            "rate_limiting": self.RATE_LIMIT_ENABLED,
            "caching": self.CACHE_ENABLED,
            "smtp": "configured" if self.get_smtp_config() else "not configured",
            "redis": "configured" if self.REDIS_URL else "not configured",
            "debug": self.DEBUG_ENABLED,
        }

        logger.info(f"Application configuration: {config_info}")


def get_settings() -> Settings:
    """Get settings instance with error handling"""
    try:
        settings = Settings()

        # Log configuration in development
        if settings.is_development:
            settings.log_configuration()

        # Validate critical settings
        if settings.is_production:
            if settings.SECRET_KEY == "your-secret-key-change-in-production":
                raise ValueError("SECRET_KEY must be changed in production!")

            if settings.DEBUG_ENABLED:
                logger.warning(
                    "DEBUG is enabled in production - this is not recommended"
                )

        return settings

    except Exception as e:
        logger.error(f"Failed to load settings: {str(e)}")
        raise


# Global settings instance
try:
    settings = get_settings()
except Exception as e:
    # Fallback to minimal settings for testing/development
    logger.error(f"Using fallback settings due to error: {str(e)}")

    class FallbackSettings:
        SEVDO_ENV = os.getenv("SEVDO_ENV", "development")
        DB_URL = os.getenv(
            "DB_URL", "postgresql://sevdo_user:postgres123@localhost:5432/sevdo_db"
        )
        ACCESS_TOKEN_EXPIRE_MINUTES = int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
        )
        SECRET_KEY = os.getenv(
            "SECRET_KEY",
            "fallback-secret-key-for-development-only-change-in-production",
        )
        LOG_LEVEL = "INFO"

        @property
        def is_development(self):
            return self.SEVDO_ENV == "development"

        @property
        def is_production(self):
            return self.SEVDO_ENV == "production"

        @property
        def is_testing(self):
            return self.SEVDO_ENV == "testing"

    settings = FallbackSettings()
