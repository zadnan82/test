# user_backend/app/core/security.py - COMPLETE FIX FOR ALL AUTHENTICATION

import base64
import secrets
from datetime import datetime, timedelta, timezone
from typing import Annotated, Optional, Dict, Any
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import select, delete
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from user_backend.app.db_setup import get_db
from user_backend.app.models import Token, User, UserType
from user_backend.app.settings import settings
from user_backend.app.core.logging_config import security_logger, StructuredLogger

logger = StructuredLogger(__name__)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/v1/auth/token")

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Token constants
DEFAULT_ENTROPY = 32
ACCESS_TOKEN_EXPIRE_MINUTES = int(getattr(settings, "ACCESS_TOKEN_EXPIRE_MINUTES", 30))
REFRESH_TOKEN_EXPIRE_DAYS = 30
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_DURATION_MINUTES = 15


class SecurityService:
    """Enhanced security service with comprehensive error handling - FIXED"""

    def __init__(self):
        self.pwd_context = pwd_context
        self.failed_attempts: Dict[str, Dict[str, Any]] = {}

    def hash_password(self, password: str) -> str:
        """Hash password with proper error handling"""
        try:
            if not password:
                raise ValueError("Password cannot be empty")
            return self.pwd_context.hash(password)
        except Exception as e:
            logger.error(f"Password hashing failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Password processing failed",
            )

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify password with proper error handling"""
        try:
            if not plain_password or not hashed_password:
                return False
            return self.pwd_context.verify(plain_password, hashed_password)
        except Exception as e:
            logger.error(f"Password verification failed: {str(e)}")
            return False

    def generate_secure_token(self, nbytes: int = DEFAULT_ENTROPY) -> str:
        """Generate cryptographically secure token"""
        try:
            token_bytes = secrets.token_bytes(nbytes)
            return base64.urlsafe_b64encode(token_bytes).rstrip(b"=").decode("ascii")
        except Exception as e:
            logger.error(f"Token generation failed: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Token generation failed",
            )

    def create_database_token(
        self,
        user_id: int,
        db: Session,
        token_type: str = "access",
        expire_minutes: Optional[int] = None,
    ) -> Token:
        """Create and store database token with error handling"""
        try:
            if expire_minutes is None:
                expire_minutes = (
                    ACCESS_TOKEN_EXPIRE_MINUTES
                    if token_type == "access"
                    else REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60
                )

            token_value = self.generate_secure_token()
            expire_date = datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)

            new_token = Token(
                token=token_value, user_id=user_id, expire_date=expire_date
            )

            db.add(new_token)
            db.commit()
            db.refresh(new_token)

            logger.info(
                f"Token created for user {user_id}",
                user_id=user_id,
                token_type=token_type,
                expires_at=expire_date.isoformat(),
            )

            return new_token

        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Database error creating token: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create authentication token",
            )
        except Exception as e:
            db.rollback()
            logger.error(f"Unexpected error creating token: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Token creation failed",
            )

    def verify_token_access(self, token_str: str, db: Session) -> Token:
        """Verify token with comprehensive error handling"""
        try:
            if not token_str:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token is required",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            # Query token from database
            token = (
                db.execute(select(Token).where(Token.token == token_str))
                .scalars()
                .first()
            )

            if not token:
                security_logger.log_suspicious_activity(
                    "Invalid token access attempt",
                    ip_address="unknown",
                )
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token not found",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            # Check if token is expired
            current_time = datetime.now(timezone.utc)
            expire_date = (
                token.expire_date.replace(tzinfo=timezone.utc)
                if token.expire_date.tzinfo is None
                else token.expire_date
            )

            if expire_date <= current_time:
                # Clean up expired token
                try:
                    db.delete(token)
                    db.commit()
                except SQLAlchemyError:
                    pass

                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has expired",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            return token

        except HTTPException:
            raise
        except SQLAlchemyError as e:
            logger.error(f"Database error verifying token: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Token verification failed",
            )
        except Exception as e:
            logger.error(f"Unexpected error verifying token: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token verification failed",
                headers={"WWW-Authenticate": "Bearer"},
            )

    def authenticate_user(
        self, email: str, password: str, db: Session, ip_address: str = "unknown"
    ) -> User:
        """Authenticate user with brute force protection - FIXED"""
        try:
            # Check for account lockout
            if self._is_account_locked(email):
                raise HTTPException(
                    status_code=status.HTTP_423_LOCKED,
                    detail="Account is temporarily locked due to multiple failed login attempts",
                )

            # Find user by email
            user = db.execute(select(User).where(User.email == email)).scalars().first()

            if not user:
                self._record_failed_attempt(email, ip_address)
                security_logger.log_failed_login(email, ip_address)
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password",
                )

            # Verify password
            if not self.verify_password(password, user.hashed_password):
                self._record_failed_attempt(email, ip_address)
                security_logger.log_failed_login(email, ip_address)
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password",
                )

            # Clear failed attempts on successful login
            self._clear_failed_attempts(email)
            security_logger.log_successful_login(user.id, email, ip_address)

            return user

        except HTTPException:
            raise
        except SQLAlchemyError as e:
            logger.error(f"Database error during authentication: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication failed",
            )
        except Exception as e:
            logger.error(f"Unexpected error during authentication: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Authentication failed",
            )

    # Brute force protection methods
    def _record_failed_attempt(self, email: str, ip_address: str):
        """Record failed login attempt"""
        current_time = datetime.now(timezone.utc)

        if email not in self.failed_attempts:
            self.failed_attempts[email] = {"attempts": [], "locked_until": None}

        self.failed_attempts[email]["attempts"].append(
            {"timestamp": current_time, "ip_address": ip_address}
        )

        # Keep only recent attempts
        cutoff_time = current_time - timedelta(minutes=LOCKOUT_DURATION_MINUTES)
        self.failed_attempts[email]["attempts"] = [
            attempt
            for attempt in self.failed_attempts[email]["attempts"]
            if attempt["timestamp"] > cutoff_time
        ]

        # Check if account should be locked
        if len(self.failed_attempts[email]["attempts"]) >= MAX_FAILED_ATTEMPTS:
            self.failed_attempts[email]["locked_until"] = current_time + timedelta(
                minutes=LOCKOUT_DURATION_MINUTES
            )

    def _is_account_locked(self, email: str) -> bool:
        """Check if account is locked due to failed attempts"""
        if email not in self.failed_attempts:
            return False

        locked_until = self.failed_attempts[email].get("locked_until")
        if not locked_until:
            return False

        if datetime.now(timezone.utc) > locked_until:
            self.failed_attempts[email]["locked_until"] = None
            return False

        return True

    def _clear_failed_attempts(self, email: str):
        """Clear failed attempts for successful login"""
        if email in self.failed_attempts:
            del self.failed_attempts[email]

    def cleanup_expired_tokens(self, db: Session):
        """Clean up expired tokens"""
        try:
            current_time = datetime.now(timezone.utc)
            result = db.execute(delete(Token).where(Token.expire_date <= current_time))
            db.commit()

            if result.rowcount > 0:
                logger.info(f"Cleaned up {result.rowcount} expired tokens")

        except SQLAlchemyError as e:
            db.rollback()
            logger.error(f"Error cleaning up expired tokens: {str(e)}")


# Global security service instance
security_service = SecurityService()


# Dependency functions - FIXED
def get_current_token(
    token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)
) -> Token:
    """Get and verify current token"""
    return security_service.verify_token_access(token, db)


def get_current_user(
    token: Token = Depends(get_current_token), db: Session = Depends(get_db)
) -> User:
    """Get current authenticated user"""
    try:
        user = (
            db.execute(select(User).where(User.id == token.user_id)).scalars().first()
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user

    except HTTPException:
        raise
    except SQLAlchemyError as e:
        logger.error(f"Database error getting current user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to get user information",
        )


def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user"""
    return current_user


def require_admin(
    current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)
) -> User:
    """Require admin privileges"""
    try:
        admin_type = (
            db.execute(select(UserType).where(UserType.name == "admin"))
            .scalars()
            .first()
        )

        if not admin_type:
            logger.error("Admin user type not found in database")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Admin access not configured",
            )

        if current_user.user_type_id != admin_type.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin privileges required for this operation",
            )

        return current_user

    except HTTPException:
        raise
    except SQLAlchemyError as e:
        logger.error(f"Database error checking admin privileges: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to verify admin privileges",
        )


# Utility functions
def hash_password(password: str) -> str:
    """Hash password using security service"""
    return security_service.hash_password(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password using security service"""
    return security_service.verify_password(plain_password, hashed_password)


# FIXED WebSocket authentication - uses simple exceptions
async def get_current_active_user_websocket(token: str, db: Session) -> User:
    """Get current user from WebSocket token parameter - COMPLETELY FIXED"""
    try:
        if not token or not token.strip():
            raise Exception("Authentication token is required")

        db_token = db.execute(
            select(Token).where(Token.token == token.strip())
        ).scalar_one_or_none()

        if not db_token:
            raise Exception("Invalid authentication token")

        current_time = datetime.now(timezone.utc)
        expire_date = (
            db_token.expire_date.replace(tzinfo=timezone.utc)
            if db_token.expire_date.tzinfo is None
            else db_token.expire_date
        )

        if expire_date <= current_time:
            try:
                db.delete(db_token)
                db.commit()
            except:
                db.rollback()
            raise Exception("Authentication token has expired")

        user = db.execute(
            select(User).where(User.id == db_token.user_id)
        ).scalar_one_or_none()

        if not user:
            raise Exception("User account not found")

        return user

    except Exception as e:
        logger.error(f"WebSocket authentication failed: {str(e)}")
        raise Exception(str(e))
