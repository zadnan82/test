# user_backend/app/api/v1/auth.py - FIXED LOGIN ENDPOINT

from typing import Annotated
from fastapi import APIRouter, Depends, Request, status, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import select, delete
import re

from user_backend.app.core import security
from user_backend.app.db_setup import get_db
from user_backend.app.models import Token, User
from user_backend.app.schemas import (
    TokenResponseSchema,
    UserOutSchema,
    UserRegisterSchema,
    UserUpdateSchema,
    PasswordChangeSchema,
    MessageResponseSchema,
)
from user_backend.app.core.security import (
    get_current_active_user,
    get_current_token,
    hash_password,
    security_service,
)
from user_backend.app.core.logging_config import StructuredLogger, security_logger

router = APIRouter()
logger = StructuredLogger(__name__)


def get_client_ip(request: Request) -> str:
    """Extract client IP address from request"""
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip

    return getattr(request.client, "host", "unknown")


def validate_password_strength(password: str) -> None:
    """Validate password strength with detailed error messages"""
    errors = []

    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")

    if len(password) > 64:
        errors.append("Password must be less than 64 characters long")

    if not re.search(r"[a-z]", password):
        errors.append("Password must contain at least one lowercase letter")

    if not re.search(r"[A-Z]", password):
        errors.append("Password must contain at least one uppercase letter")

    if not re.search(r"\d", password):
        errors.append("Password must contain at least one number")

    if not re.search(r"[^a-zA-Z0-9]", password):
        errors.append("Password must contain at least one special character")

    if errors:
        raise HTTPException(status_code=422, detail=". ".join(errors))


def validate_name(name: str, field_name: str) -> str:
    """Validate name fields with specific error messages"""
    if not name or not name.strip():
        raise HTTPException(status_code=422, detail=f"{field_name} is required")

    clean_name = name.strip()
    if len(clean_name) < 2:
        raise HTTPException(
            status_code=422, detail=f"{field_name} must be at least 2 characters long"
        )

    if len(clean_name) > 50:
        raise HTTPException(
            status_code=422, detail=f"{field_name} must be less than 50 characters long"
        )

    if not re.match(r"^[a-zA-Z\s\-']+$", clean_name):
        raise HTTPException(
            status_code=422,
            detail=f"{field_name} can only contain letters, spaces, hyphens, and apostrophes",
        )

    return clean_name


def validate_email(email: str) -> str:
    """Validate email with specific error messages"""
    if not email or not email.strip():
        raise HTTPException(status_code=422, detail="Email address is required")

    clean_email = email.lower().strip()

    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    if not re.match(email_pattern, clean_email):
        raise HTTPException(
            status_code=422, detail="Please enter a valid email address"
        )

    if len(clean_email) > 254:
        raise HTTPException(status_code=422, detail="Email address is too long")

    return clean_email


@router.post("/token", response_model=TokenResponseSchema)
async def login(
    request: Request,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db),
):
    """FIXED user login endpoint with HTTPException instead of custom exceptions"""
    try:
        client_ip = get_client_ip(request)
        user_agent = request.headers.get("user-agent", "unknown")

        # Basic input validation
        if not form_data.username or not form_data.username.strip():
            raise HTTPException(status_code=422, detail="Email address is required")

        if not form_data.password:
            raise HTTPException(status_code=422, detail="Password is required")

        # Validate email format
        clean_email = validate_email(form_data.username)

        logger.info(
            f"Login attempt for email: {clean_email}",
            email=clean_email,
            ip_address=client_ip,
            user_agent=user_agent,
        )

        # FIXED: Use the authenticate_user method directly
        user = security_service.authenticate_user(
            email=clean_email,
            password=form_data.password,
            db=db,
            ip_address=client_ip,
        )

        # Create access token
        token = security_service.create_database_token(
            user_id=user.id, db=db, token_type="access"
        )

        logger.info(
            f"Successful login for user: {user.email}",
            user_id=user.id,
            email=user.email,
            ip_address=client_ip,
        )

        return TokenResponseSchema(
            access_token=token.token,
            token_type="bearer",
            expires_in=security.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            f"Login failed for email: {form_data.username}",
            email=form_data.username,
            ip_address=get_client_ip(request),
            error=str(e),
            error_type=type(e).__name__,
        )
        raise HTTPException(
            status_code=500,
            detail="Login failed due to server error. Please try again later.",
        )


@router.post(
    "/register", response_model=UserOutSchema, status_code=status.HTTP_201_CREATED
)
async def register(
    request: Request,
    user_data: UserRegisterSchema,
    db: Session = Depends(get_db),
):
    """FIXED user registration endpoint"""
    try:
        client_ip = get_client_ip(request)

        logger.info(
            f"Registration attempt for email: {user_data.email}",
            email=user_data.email,
            ip_address=client_ip,
        )

        # Enhanced validation
        clean_first_name = validate_name(user_data.first_name, "First name")
        clean_last_name = validate_name(user_data.last_name, "Last name")
        clean_email = validate_email(user_data.email)

        # Validate password strength
        validate_password_strength(user_data.password)

        # Validate password confirmation
        if user_data.password != user_data.confirm_password:
            raise HTTPException(status_code=422, detail="Passwords do not match")

        # Check if user already exists
        existing_user = (
            db.execute(select(User).where(User.email == clean_email)).scalars().first()
        )

        if existing_user:
            logger.warning(
                f"Registration failed - user already exists: {clean_email}",
                email=clean_email,
                ip_address=client_ip,
            )
            raise HTTPException(
                status_code=409,
                detail="An account with this email address already exists. Please use a different email or try logging in.",
            )

        # Create new user
        hashed_password = hash_password(user_data.password)

        new_user = User(
            first_name=clean_first_name,
            last_name=clean_last_name,
            email=clean_email,
            hashed_password=hashed_password,
            user_type_id=user_data.user_type_id or 1,
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        logger.info(
            f"User registered successfully: {new_user.email}",
            user_id=new_user.id,
            email=new_user.email,
            ip_address=client_ip,
        )

        return UserOutSchema.model_validate(new_user)

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logger.error(
            f"Registration failed for email: {user_data.email}",
            email=user_data.email,
            ip_address=get_client_ip(request),
            error=str(e),
            error_type=type(e).__name__,
        )
        raise HTTPException(
            status_code=500,
            detail="Registration failed due to server error. Please try again later.",
        )


# Rest of the endpoints with HTTPException instead of custom exceptions
@router.get("/me", response_model=UserOutSchema)
async def get_current_user_profile(
    current_user: User = Depends(get_current_active_user),
):
    """Get current user profile"""
    try:
        logger.info(
            f"Profile access for user: {current_user.email}",
            user_id=current_user.id,
            email=current_user.email,
        )

        return UserOutSchema.model_validate(current_user)

    except Exception as e:
        logger.error(
            f"Failed to get user profile: {str(e)}",
            user_id=current_user.id,
            error=str(e),
            error_type=type(e).__name__,
        )
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve user profile. Please try again later.",
        )


@router.delete(
    "/logout", response_model=MessageResponseSchema, status_code=status.HTTP_200_OK
)
async def logout(
    request: Request,
    current_token: Token = Depends(get_current_token),
    db: Session = Depends(get_db),
):
    """Logout from current session"""
    try:
        client_ip = get_client_ip(request)
        logger.info(f"Logout attempt for token: {current_token.token[:8]}...")

        db.delete(current_token)
        db.commit()

        logger.info("User logged out successfully")
        return MessageResponseSchema(message="Logged out successfully")

    except Exception as e:
        db.rollback()
        logger.error(f"Logout failed: {str(e)}")
        raise HTTPException(status_code=500, detail="Logout failed. Please try again.")


@router.delete(
    "/logout/all", response_model=MessageResponseSchema, status_code=status.HTTP_200_OK
)
async def logout_all_sessions(
    request: Request,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Logout from all sessions"""
    try:
        client_ip = get_client_ip(request)
        logger.info(f"Logout all sessions for user: {current_user.email}")

        result = db.execute(delete(Token).where(Token.user_id == current_user.id))
        db.commit()

        sessions_count = result.rowcount
        return MessageResponseSchema(
            message=f"Logged out from all sessions ({sessions_count} sessions revoked)"
        )

    except Exception as e:
        db.rollback()
        logger.error(f"Logout all sessions failed: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Failed to logout from all sessions. Please try again.",
        )
