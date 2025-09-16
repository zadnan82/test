# user_backend/app/api/v1/endpoints/analytics.py
# ============================================================================

from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import select, func, desc, and_

from user_backend.app.models import (
    Project,
    ProjectGeneration,
    ProjectType,
    TokenUsage,
    User,
    UserActivity,
    GenerationStatus,
)
from user_backend.app.schemas import (
    DashboardAnalyticsSchema,
    ProjectAnalyticsSchema,
    UsageAnalyticsSchema,
    PerformanceMetricsSchema,
    UserActivitySchema,
)
from user_backend.app.core.security import get_current_active_user
from user_backend.app.db_setup import get_db
from user_backend.app.core.logging_config import StructuredLogger

router = APIRouter()
logger = StructuredLogger(__name__)


@router.get("/dashboard", response_model=DashboardAnalyticsSchema)
async def get_dashboard_analytics(
    days: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get user dashboard analytics"""
    start_date = datetime.utcnow() - timedelta(days=days)

    # Total projects
    total_projects = db.execute(
        select(func.count(Project.id)).where(Project.user_id == current_user.id)
    ).scalar()

    # Recent projects
    recent_projects = db.execute(
        select(func.count(Project.id)).where(
            and_(Project.user_id == current_user.id, Project.created_at >= start_date)
        )
    ).scalar()

    # Total generations
    total_generations = db.execute(
        select(func.count(ProjectGeneration.id))
        .join(Project)
        .where(Project.user_id == current_user.id)
    ).scalar()

    # Successful generations
    successful_generations = db.execute(
        select(func.count(ProjectGeneration.id))
        .join(Project)
        .where(
            and_(
                Project.user_id == current_user.id,
                ProjectGeneration.status == GenerationStatus.COMPLETED,
            )
        )
    ).scalar()

    # Most used project type
    most_used_type = db.execute(
        select(Project.project_type, func.count(Project.id).label("count"))
        .where(Project.user_id == current_user.id)
        .group_by(Project.project_type)
        .order_by(desc("count"))
        .limit(1)
    ).first()

    # Recent activity count
    recent_activity_count = db.execute(
        select(func.count(UserActivity.id)).where(
            and_(
                UserActivity.user_id == current_user.id,
                UserActivity.created_at >= start_date,
            )
        )
    ).scalar()

    return DashboardAnalyticsSchema(
        total_projects=total_projects or 0,
        recent_projects=recent_projects or 0,
        total_generations=total_generations or 0,
        successful_generations=successful_generations or 0,
        success_rate=round(
            (successful_generations / total_generations * 100)
            if total_generations > 0
            else 0,
            2,
        ),
        most_used_project_type=most_used_type[0] if most_used_type else None,
        recent_activity_count=recent_activity_count or 0,
        period_days=days,
    )


@router.get("/projects", response_model=List[ProjectAnalyticsSchema])
async def get_project_analytics(
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get detailed project analytics"""
    projects = (
        db.execute(
            select(Project)
            .where(Project.user_id == current_user.id)
            .order_by(desc(Project.updated_at))
            .limit(limit)
        )
        .scalars()
        .all()
    )

    analytics = []
    for project in projects:
        # Get generation stats for this project
        generation_stats = db.execute(
            select(
                func.count(ProjectGeneration.id).label("total"),
                func.sum(
                    func.case(
                        (ProjectGeneration.status == GenerationStatus.COMPLETED, 1),
                        else_=0,
                    )
                ).label("successful"),
                func.avg(ProjectGeneration.generation_time).label("avg_time"),
            ).where(ProjectGeneration.project_id == project.id)
        ).first()

        total_gens = generation_stats.total or 0
        successful_gens = generation_stats.successful or 0
        avg_time = float(generation_stats.avg_time) if generation_stats.avg_time else 0

        analytics.append(
            ProjectAnalyticsSchema(
                project_id=project.id,
                project_name=project.name,
                project_type=project.project_type,
                total_generations=total_gens,
                successful_generations=successful_gens,
                success_rate=round(
                    (successful_gens / total_gens * 100) if total_gens > 0 else 0, 2
                ),
                avg_generation_time=round(avg_time, 2),
                tokens_used=len(project.tokens),
                last_generated_at=project.last_generated_at,
                created_at=project.created_at,
            )
        )

    return analytics


@router.get("/usage", response_model=UsageAnalyticsSchema)
async def get_usage_analytics(
    days: int = Query(30, ge=1, le=365),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get user usage analytics"""
    start_date = datetime.utcnow() - timedelta(days=days)

    # Token usage over time
    daily_token_usage = db.execute(
        select(
            func.date(TokenUsage.created_at).label("date"),
            func.sum(TokenUsage.usage_count).label("count"),
        )
        .where(
            and_(
                TokenUsage.user_id == current_user.id,
                TokenUsage.created_at >= start_date,
            )
        )
        .group_by(func.date(TokenUsage.created_at))
        .order_by("date")
    ).all()

    # Most used tokens
    top_tokens = db.execute(
        select(TokenUsage.token, func.sum(TokenUsage.usage_count).label("total_usage"))
        .where(
            and_(
                TokenUsage.user_id == current_user.id,
                TokenUsage.created_at >= start_date,
            )
        )
        .group_by(TokenUsage.token)
        .order_by(desc("total_usage"))
        .limit(10)
    ).all()

    # Generation frequency over time
    daily_generations = db.execute(
        select(
            func.date(ProjectGeneration.created_at).label("date"),
            func.count(ProjectGeneration.id).label("count"),
        )
        .join(Project)
        .where(
            and_(
                Project.user_id == current_user.id,
                ProjectGeneration.created_at >= start_date,
            )
        )
        .group_by(func.date(ProjectGeneration.created_at))
        .order_by("date")
    ).all()

    return UsageAnalyticsSchema(
        daily_token_usage=[
            {"date": str(row.date), "count": row.count} for row in daily_token_usage
        ],
        top_tokens=[
            {"token": row.token, "usage_count": row.total_usage} for row in top_tokens
        ],
        daily_generations=[
            {"date": str(row.date), "count": row.count} for row in daily_generations
        ],
        period_days=days,
    )


@router.get("/performance", response_model=PerformanceMetricsSchema)
async def get_performance_metrics(
    days: int = Query(7, ge=1, le=90),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get system performance metrics for user"""
    start_date = datetime.utcnow() - timedelta(days=days)

    # Average generation time by status
    generation_metrics = db.execute(
        select(
            ProjectGeneration.status,
            func.avg(ProjectGeneration.generation_time).label("avg_time"),
            func.count(ProjectGeneration.id).label("count"),
        )
        .join(Project)
        .where(
            and_(
                Project.user_id == current_user.id,
                ProjectGeneration.created_at >= start_date,
            )
        )
        .group_by(ProjectGeneration.status)
    ).all()

    # Error rate calculation
    total_gens = sum(row.count for row in generation_metrics)
    failed_gens = sum(
        row.count for row in generation_metrics if row.status == GenerationStatus.FAILED
    )

    error_rate = (failed_gens / total_gens * 100) if total_gens > 0 else 0

    # Average generation time (completed only)
    avg_generation_time = next(
        (
            row.avg_time
            for row in generation_metrics
            if row.status == GenerationStatus.COMPLETED
        ),
        0,
    )

    return PerformanceMetricsSchema(
        avg_generation_time=round(float(avg_generation_time or 0), 2),
        error_rate=round(error_rate, 2),
        total_generations=total_gens,
        successful_generations=total_gens - failed_gens,
        failed_generations=failed_gens,
        period_days=days,
    )


@router.get("/activity", response_model=List[UserActivitySchema])
async def get_user_activity(
    limit: int = Query(20, ge=1, le=100),
    activity_type: Optional[str] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get user activity feed"""
    query = select(UserActivity).where(UserActivity.user_id == current_user.id)

    if activity_type:
        query = query.where(UserActivity.activity_type == activity_type)

    activities = (
        db.execute(query.order_by(desc(UserActivity.created_at)).limit(limit))
        .scalars()
        .all()
    )

    return [UserActivitySchema.model_validate(activity) for activity in activities]
