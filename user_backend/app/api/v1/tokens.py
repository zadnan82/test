# user_backend/app/api/v1/core/endpoints/tokens.py
# REPLACE YOUR ENTIRE tokens.py FILE WITH THIS

from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, func, desc, or_

from user_backend.app.models import (
    Project,
    ProjectType,
    TokenCategory,
    TokenComplexity,
    TokenDefinition,
    TokenUsage,
    User,
)
from user_backend.app.schemas import (
    TokenAnalyticsSchema,
    TokenDefinitionOutSchema,
    TokenValidationResultSchema,
    TokenValidationSchema,
)
from user_backend.app.core.logging_config import StructuredLogger
from user_backend.app.core.security import get_current_active_user, require_admin
from user_backend.app.db_setup import get_db

router = APIRouter()
logger = StructuredLogger(__name__)

# ============================================================================
# ADMIN ONLY ENDPOINTS
# ============================================================================


@router.get("/", response_model=List[TokenDefinitionOutSchema])
async def list_tokens(
    category: Optional[TokenCategory] = None,
    complexity: Optional[TokenComplexity] = None,
    search: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """List all available tokens - ADMIN ONLY"""
    logger.info(f"Admin token list request from user {current_user.id}")

    query = select(TokenDefinition).where(TokenDefinition.is_active)

    if category:
        query = query.where(TokenDefinition.category == category)
    if complexity:
        query = query.where(TokenDefinition.complexity == complexity)
    if search:
        query = query.where(
            or_(
                TokenDefinition.name.ilike(f"%{search}%"),
                TokenDefinition.description.ilike(f"%{search}%"),
                TokenDefinition.token.ilike(f"%{search}%"),
            )
        )

    query = (
        query.order_by(TokenDefinition.usage_count.desc()).limit(limit).offset(offset)
    )
    tokens = db.execute(query).scalars().all()
    return [TokenDefinitionOutSchema.model_validate(t) for t in tokens]


@router.post("/validate", response_model=TokenValidationResultSchema)
async def validate_tokens(
    validation_data: TokenValidationSchema,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Validate token combination - ADMIN ONLY"""
    tokens = validation_data.tokens
    token_defs = (
        db.execute(select(TokenDefinition).where(TokenDefinition.token.in_(tokens)))
        .scalars()
        .all()
    )

    found_tokens = {t.token: t for t in token_defs}
    errors = []
    warnings = []
    suggestions = []
    missing_dependencies = []
    conflicts = []

    # Check if all tokens exist
    for token in tokens:
        if token not in found_tokens:
            errors.append(f"Token '{token}' does not exist")

    # Check dependencies and conflicts
    for token in tokens:
        if token in found_tokens:
            token_def = found_tokens[token]

            for dep in token_def.dependencies:
                if dep not in tokens:
                    missing_dependencies.append(dep)
                    suggestions.append(
                        f"Consider adding '{dep}' as it's required by '{token}'"
                    )

            for conflict in token_def.conflicts_with:
                if conflict in tokens:
                    conflicts.append(f"Token '{token}' conflicts with '{conflict}'")

    is_valid = len(errors) == 0 and len(conflicts) == 0

    return TokenValidationResultSchema(
        is_valid=is_valid,
        errors=errors,
        warnings=warnings,
        suggestions=suggestions,
        missing_dependencies=list(set(missing_dependencies)),
        conflicts=conflicts,
    )


@router.get("/analytics", response_model=List[TokenAnalyticsSchema])
async def get_token_analytics(
    limit: int = 20,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    """Get token usage analytics - ADMIN ONLY"""
    logger.info(f"Admin token analytics request from user {current_user.id}")

    token_usage = db.execute(
        select(TokenUsage.token, func.sum(TokenUsage.usage_count).label("total_usage"))
        .group_by(TokenUsage.token)
        .order_by(desc("total_usage"))
        .limit(limit)
    ).all()

    analytics = []
    for token, usage in token_usage:
        token_def = db.execute(
            select(TokenDefinition).where(TokenDefinition.token == token)
        ).scalar_one_or_none()

        if token_def:
            analytics.append(
                TokenAnalyticsSchema(
                    token=token,
                    name=token_def.name,
                    usage_count=usage,
                    success_rate=0.95,
                    avg_generation_time=2.5,
                    most_combined_with=[],
                )
            )

    return analytics


# ============================================================================
# INTERNAL SYSTEM ENDPOINTS
# ============================================================================


@router.get("/suggest")
async def suggest_tokens(
    description: Optional[str] = None,
    existing_tokens: Optional[List[str]] = None,
    project_type: Optional[ProjectType] = None,
    db: Session = Depends(get_db),
):
    """Internal token suggestion system"""
    from user_backend.app.api.v1.ai import (
        suggest_tokens_from_description,
    )

    if not description:
        return {"suggested_tokens": [], "reasoning": "No description provided"}

    suggested_tokens = suggest_tokens_from_description(description, project_type)

    if existing_tokens:
        suggested_tokens = [t for t in suggested_tokens if t not in existing_tokens]

    return {
        "suggested_tokens": suggested_tokens[:10],
        "reasoning": "Based on description analysis and project type",
    }
