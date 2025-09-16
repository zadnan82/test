# user_backend/app/api/v1/endpoints/notifications.py

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, update, desc

from user_backend.app.models import User, Notification
from user_backend.app.schemas import (
    NotificationSchema,
    MessageResponseSchema,
)
from user_backend.app.core.security import get_current_active_user
from user_backend.app.db_setup import get_db

router = APIRouter()


@router.get("/", response_model=List[NotificationSchema])
async def get_notifications(
    limit: int = 50,
    offset: int = 0,
    unread_only: bool = False,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get user notifications"""
    query = select(Notification).where(Notification.user_id == current_user.id)

    if unread_only:
        query = query.where(Notification.read == False)

    notifications = (
        db.execute(
            query.order_by(desc(Notification.created_at)).limit(limit).offset(offset)
        )
        .scalars()
        .all()
    )

    return [NotificationSchema.model_validate(n) for n in notifications]


@router.put("/{notification_id}/read", response_model=MessageResponseSchema)
async def mark_notification_read(
    notification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Mark notification as read"""
    result = db.execute(
        update(Notification)
        .where(
            Notification.id == notification_id, Notification.user_id == current_user.id
        )
        .values(read=True)
    )

    if result.rowcount == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found"
        )

    db.commit()
    return MessageResponseSchema(message="Notification marked as read")


@router.put("/mark-all-read", response_model=MessageResponseSchema)
async def mark_all_notifications_read(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Mark all notifications as read"""
    result = db.execute(
        update(Notification)
        .where(Notification.user_id == current_user.id)
        .values(read=True)
    )

    db.commit()
    return MessageResponseSchema(
        message=f"Marked {result.rowcount} notifications as read"
    )


@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Delete notification"""
    notification = db.execute(
        select(Notification).where(
            Notification.id == notification_id, Notification.user_id == current_user.id
        )
    ).scalar_one_or_none()

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found"
        )

    db.delete(notification)
    db.commit()

    return {"message": "Notification deleted successfully"}


@router.get("/unread-count")
async def get_unread_count(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get count of unread notifications"""
    from sqlalchemy import func

    count = db.execute(
        select(func.count(Notification.id)).where(
            Notification.user_id == current_user.id, Notification.read == False
        )
    ).scalar()

    return {"unread_count": count or 0}
