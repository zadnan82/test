# user_backend/app/api/v1/websockets.py - FIXED VERSION

import json
import asyncio
from datetime import datetime
from typing import Dict, List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from user_backend.app.models import (
    Project,
    ProjectGeneration,
    User,
    Notification,
)
from user_backend.app.core.security import get_current_active_user_websocket
from user_backend.app.core.exceptions import (
    InvalidCredentialsError,
    InvalidTokenError,
    TokenExpiredError,
    AuthenticationError,
)
from user_backend.app.db_setup import get_db
from user_backend.app.core.logging_config import StructuredLogger

router = APIRouter()
logger = StructuredLogger(__name__)


class ConnectionManager:
    """Manages WebSocket connections"""

    def __init__(self):
        self.active_connections: Dict[int, List[WebSocket]] = {}
        self.project_connections: Dict[int, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        """Connect a user"""
        await websocket.accept()

        if user_id not in self.active_connections:
            self.active_connections[user_id] = []

        self.active_connections[user_id].append(websocket)

        logger.info(f"WebSocket connected for user {user_id}")

    def disconnect(self, websocket: WebSocket, user_id: int):
        """Disconnect a user"""
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)

            if not self.active_connections[user_id]:
                del self.active_connections[user_id]

        # Remove from project connections
        for project_id, connections in self.project_connections.items():
            if websocket in connections:
                connections.remove(websocket)

        logger.info(f"WebSocket disconnected for user {user_id}")

    async def connect_to_project(self, websocket: WebSocket, project_id: int):
        """Connect to project-specific updates"""
        if project_id not in self.project_connections:
            self.project_connections[project_id] = []

        self.project_connections[project_id].append(websocket)

    async def send_personal_message(self, message: dict, user_id: int):
        """Send message to specific user"""
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except:
                    # Connection is closed, will be cleaned up on next disconnect
                    pass

    async def send_project_message(self, message: dict, project_id: int):
        """Send message to all users watching a project"""
        if project_id in self.project_connections:
            for connection in self.project_connections[project_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except:
                    # Connection is closed, will be cleaned up on next disconnect
                    pass

    async def broadcast_to_all(self, message: dict):
        """Broadcast message to all connected users"""
        for user_id, connections in self.active_connections.items():
            for connection in connections:
                try:
                    await connection.send_text(json.dumps(message))
                except:
                    # Connection is closed, will be cleaned up on next disconnect
                    pass


# Global connection manager
manager = ConnectionManager()


@router.websocket("/notifications")
async def websocket_notifications(
    websocket: WebSocket, token: str, db: Session = Depends(get_db)
):
    """WebSocket endpoint for user notifications - FIXED"""
    user = None
    try:
        # FIXED: Better authentication with proper error handling
        try:
            user = await get_current_active_user_websocket(token, db)
        except (
            InvalidCredentialsError,
            InvalidTokenError,
            TokenExpiredError,
            AuthenticationError,
        ) as auth_error:
            logger.warning(f"WebSocket auth failed: {auth_error}")
            # Send proper close code for authentication failure
            await websocket.close(code=4001, reason="Authentication failed")
            return
        except Exception as unexpected_error:
            logger.error(f"Unexpected WebSocket auth error: {unexpected_error}")
            await websocket.close(code=4000, reason="Authentication error")
            return

        # Connect user
        await manager.connect(websocket, user.id)

        # Send initial unread notifications
        try:
            unread_notifications = (
                db.execute(
                    select(Notification)
                    .where(Notification.user_id == user.id, Notification.read == False)
                    .order_by(Notification.created_at.desc())
                    .limit(10)
                )
                .scalars()
                .all()
            )

            for notification in unread_notifications:
                await websocket.send_text(
                    json.dumps(
                        {
                            "type": "notification",
                            "data": {
                                "id": notification.id,
                                "title": notification.title,
                                "message": notification.message,
                                "type": notification.type,
                                "created_at": notification.created_at.isoformat(),
                                "read": notification.read,
                                "metadata": notification.metadata,
                            },
                        }
                    )
                )
        except Exception as e:
            logger.error(f"Failed to send initial notifications: {str(e)}")

        # Keep connection alive and handle messages
        while True:
            try:
                data = await websocket.receive_text()
                message = json.loads(data)

                if message.get("type") == "mark_read":
                    notification_id = message.get("notification_id")
                    if notification_id:
                        try:
                            notification = db.execute(
                                select(Notification).where(
                                    Notification.id == notification_id,
                                    Notification.user_id == user.id,
                                )
                            ).scalar_one_or_none()

                            if notification:
                                notification.read = True
                                db.commit()

                                await websocket.send_text(
                                    json.dumps(
                                        {
                                            "type": "notification_read",
                                            "data": {
                                                "notification_id": notification_id
                                            },
                                        }
                                    )
                                )
                        except Exception as e:
                            logger.error(
                                f"Failed to mark notification as read: {str(e)}"
                            )
                            db.rollback()

            except json.JSONDecodeError as e:
                logger.warning(f"Invalid JSON received from WebSocket: {str(e)}")
                await websocket.send_text(
                    json.dumps(
                        {"type": "error", "data": {"message": "Invalid message format"}}
                    )
                )
            except Exception as e:
                logger.error(f"Error processing WebSocket message: {str(e)}")
                break

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected normally")
    except Exception as e:
        logger.error(f"Unexpected WebSocket error: {str(e)}")
    finally:
        # Always clean up connection
        if user:
            manager.disconnect(websocket, user.id)


@router.websocket("/projects/{project_id}/generation")
async def websocket_project_generation(
    websocket: WebSocket, project_id: int, token: str, db: Session = Depends(get_db)
):
    """WebSocket endpoint for project generation progress - FIXED"""
    user = None
    try:
        # FIXED: Better authentication with proper error handling
        try:
            user = await get_current_active_user_websocket(token, db)
        except (
            InvalidCredentialsError,
            InvalidTokenError,
            TokenExpiredError,
            AuthenticationError,
        ) as auth_error:
            logger.warning(f"WebSocket project auth failed: {auth_error}")
            await websocket.close(code=4001, reason="Authentication failed")
            return
        except Exception as unexpected_error:
            logger.error(f"Unexpected WebSocket project auth error: {unexpected_error}")
            await websocket.close(code=4000, reason="Authentication error")
            return

        # Verify project ownership
        try:
            project = db.execute(
                select(Project).where(
                    Project.id == project_id, Project.user_id == user.id
                )
            ).scalar_one_or_none()

            if not project:
                logger.warning(
                    f"Project {project_id} not found or access denied for user {user.id}"
                )
                await websocket.close(
                    code=4004, reason="Project not found or access denied"
                )
                return
        except Exception as e:
            logger.error(f"Failed to verify project ownership: {str(e)}")
            await websocket.close(code=4000, reason="Project verification failed")
            return

        await manager.connect(websocket, user.id)
        await manager.connect_to_project(websocket, project_id)

        # Send current project status
        try:
            latest_generation = db.execute(
                select(ProjectGeneration)
                .where(ProjectGeneration.project_id == project_id)
                .order_by(ProjectGeneration.created_at.desc())
                .limit(1)
            ).scalar_one_or_none()

            if latest_generation:
                await websocket.send_text(
                    json.dumps(
                        {
                            "type": "generation_status",
                            "data": {
                                "project_id": project_id,
                                "generation_id": latest_generation.id,
                                "status": latest_generation.status.value,
                                "progress_percentage": latest_generation.progress_percentage
                                or 0,
                                "current_step": latest_generation.current_step
                                or "Initializing",
                                "created_at": latest_generation.created_at.isoformat(),
                            },
                        }
                    )
                )
        except Exception as e:
            logger.error(f"Failed to send project status: {str(e)}")

        # Keep connection alive
        while True:
            try:
                data = await websocket.receive_text()
                # Handle any incoming messages if needed
                logger.debug(f"Received project WebSocket message: {data}")
            except Exception as e:
                logger.error(f"Error processing project WebSocket message: {str(e)}")
                break

    except WebSocketDisconnect:
        logger.info(f"Project WebSocket disconnected for project {project_id}")
    except Exception as e:
        logger.error(f"Unexpected project WebSocket error: {str(e)}")
    finally:
        # Always clean up connection
        if user:
            manager.disconnect(websocket, user.id)


@router.websocket("/system-status")
async def websocket_system_status(websocket: WebSocket):
    """WebSocket endpoint for system status updates - FIXED"""
    try:
        await websocket.accept()
        logger.info("System status WebSocket connected")

        while True:
            try:
                # Send system status every 30 seconds
                status_message = {
                    "type": "system_status",
                    "data": {
                        "timestamp": datetime.utcnow().isoformat(),
                        "services": {
                            "database": "healthy",
                            "file_storage": "healthy",
                            "ai_service": "healthy",
                            "generation_queue": "healthy",
                        },
                        "active_generations": 0,  # TODO: Get actual count
                        "queue_length": 0,  # TODO: Get actual queue length
                    },
                }

                await websocket.send_text(json.dumps(status_message))
                await asyncio.sleep(30)

            except Exception as e:
                logger.error(f"Error sending system status: {str(e)}")
                break

    except WebSocketDisconnect:
        logger.info("System status WebSocket disconnected")
    except Exception as e:
        logger.error(f"System status WebSocket error: {str(e)}")


# Helper functions to send updates from other parts of the application
async def notify_generation_progress(
    project_id: int,
    generation_id: int,
    status: str,
    progress_percentage: float,
    current_step: str,
    estimated_time_remaining: int = None,
    logs: List[str] = None,
):
    """Send generation progress update to connected clients"""
    message = {
        "type": "generation_progress",
        "data": {
            "project_id": project_id,
            "generation_id": generation_id,
            "status": status,
            "progress_percentage": progress_percentage,
            "current_step": current_step,
            "estimated_time_remaining": estimated_time_remaining,
            "logs": logs or [],
            "timestamp": datetime.utcnow().isoformat(),
        },
    }

    await manager.send_project_message(message, project_id)


async def notify_generation_complete(
    project_id: int,
    generation_id: int,
    success: bool,
    output_path: str = None,
    error_message: str = None,
):
    """Send generation completion notification"""
    message = {
        "type": "generation_complete",
        "data": {
            "project_id": project_id,
            "generation_id": generation_id,
            "success": success,
            "output_path": output_path,
            "error_message": error_message,
            "timestamp": datetime.utcnow().isoformat(),
        },
    }

    await manager.send_project_message(message, project_id)


async def send_user_notification(
    user_id: int,
    title: str,
    message: str,
    notification_type: str = "info",
    metadata: dict = None,
):
    """Send real-time notification to user"""
    notification_message = {
        "type": "notification",
        "data": {
            "title": title,
            "message": message,
            "type": notification_type,
            "metadata": metadata or {},
            "timestamp": datetime.utcnow().isoformat(),
        },
    }

    await manager.send_personal_message(notification_message, user_id)


async def broadcast_system_announcement(
    title: str, message: str, severity: str = "info"
):
    """Broadcast system announcement to all users"""
    announcement = {
        "type": "system_announcement",
        "data": {
            "title": title,
            "message": message,
            "severity": severity,
            "timestamp": datetime.utcnow().isoformat(),
        },
    }

    await manager.broadcast_to_all(announcement)
