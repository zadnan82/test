# user_backend/app/api/v1/endpoints/user_preferences.py
# ============================================================================

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from user_backend.app.models import User, UserPreferences
from user_backend.app.schemas import (
    UserPreferencesOutSchema,
    UserPreferencesUpdateSchema,
    MessageResponseSchema,
)
from user_backend.app.core.security import get_current_active_user
from user_backend.app.db_setup import get_db
from user_backend.app.core.logging_config import StructuredLogger

router = APIRouter()
logger = StructuredLogger(__name__)


@router.get("/preferences", response_model=UserPreferencesOutSchema)
async def get_user_preferences(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get user preferences"""
    preferences = db.execute(
        select(UserPreferences).where(UserPreferences.user_id == current_user.id)
    ).scalar_one_or_none()

    if not preferences:
        # Create default preferences
        preferences = UserPreferences(user_id=current_user.id)
        db.add(preferences)
        db.commit()
        db.refresh(preferences)

    return UserPreferencesOutSchema.model_validate(preferences)


@router.put("/preferences", response_model=UserPreferencesOutSchema)
async def update_user_preferences(
    preferences_data: UserPreferencesUpdateSchema,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Update user preferences"""
    preferences = db.execute(
        select(UserPreferences).where(UserPreferences.user_id == current_user.id)
    ).scalar_one_or_none()

    if not preferences:
        preferences = UserPreferences(user_id=current_user.id)
        db.add(preferences)

    # Update only provided fields
    update_data = preferences_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(preferences, field, value)

    db.commit()
    db.refresh(preferences)

    logger.info(
        f"User preferences updated",
        user_id=current_user.id,
        updated_fields=list(update_data.keys()),
    )

    return UserPreferencesOutSchema.model_validate(preferences)


@router.get("/usage")
async def get_user_usage_stats(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get user usage statistics"""
    from sqlalchemy import func
    from user_backend.app.models import (
        Project,
        ProjectGeneration,
        TokenUsage,
    )

    # Project stats
    total_projects = (
        db.execute(
            select(func.count(Project.id)).where(Project.user_id == current_user.id)
        ).scalar()
        or 0
    )

    # Generation stats
    total_generations = (
        db.execute(
            select(func.count(ProjectGeneration.id))
            .join(Project)
            .where(Project.user_id == current_user.id)
        ).scalar()
        or 0
    )

    # Token usage stats
    total_token_usage = (
        db.execute(
            select(func.sum(TokenUsage.usage_count)).where(
                TokenUsage.user_id == current_user.id
            )
        ).scalar()
        or 0
    )

    # Most used tokens
    top_tokens = db.execute(
        select(TokenUsage.token, func.sum(TokenUsage.usage_count).label("total"))
        .where(TokenUsage.user_id == current_user.id)
        .group_by(TokenUsage.token)
        .order_by(func.sum(TokenUsage.usage_count).desc())
        .limit(5)
    ).all()

    return {
        "total_projects": total_projects,
        "total_generations": total_generations,
        "total_token_usage": total_token_usage,
        "top_tokens": [
            {"token": token, "usage_count": total} for token, total in top_tokens
        ],
        "account_created": current_user.created_at,
        "member_since_days": (datetime.utcnow() - current_user.created_at).days,
    }
