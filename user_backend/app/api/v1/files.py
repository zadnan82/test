# user_backend/app/api/v1/endpoints/files.py
# ============================================================================

import os
import shutil
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import select

from user_backend.app.models import Project, ProjectFile, User, FileType
from user_backend.app.schemas import (
    FileUploadResponseSchema,
    ProjectFileOutSchema,
)
from user_backend.app.core.security import get_current_active_user
from user_backend.app.db_setup import get_db
from user_backend.app.core.logging_config import StructuredLogger

router = APIRouter()
logger = StructuredLogger(__name__)

# File upload settings
UPLOAD_DIR = Path("uploads")
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB
ALLOWED_EXTENSIONS = {
    ".py",
    ".js",
    ".ts",
    ".html",
    ".css",
    ".json",
    ".yaml",
    ".yml",
    ".md",
    ".txt",
    ".sql",
    ".sh",
    ".dockerfile",
    ".env",
}


def ensure_upload_directory():
    """Ensure upload directory exists"""
    UPLOAD_DIR.mkdir(exist_ok=True)


def validate_file(file: UploadFile) -> None:
    """Validate uploaded file"""
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No filename provided"
        )

    # Check file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File type {file_ext} not allowed. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Check file size (approximate from content-length header)
    content_length = getattr(file, "size", None)
    if content_length and content_length > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE // (1024 * 1024)}MB",
        )


@router.post("/upload", response_model=FileUploadResponseSchema)
async def upload_file(
    project_id: int,
    file: UploadFile = File(...),
    file_type: FileType = FileType.SOURCE_CODE,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Upload file to project"""
    # Verify project ownership
    project = db.execute(
        select(Project).where(
            Project.id == project_id, Project.user_id == current_user.id
        )
    ).scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    # Validate file
    validate_file(file)
    ensure_upload_directory()

    # Create unique file path
    user_dir = UPLOAD_DIR / f"user_{current_user.id}" / f"project_{project_id}"
    user_dir.mkdir(parents=True, exist_ok=True)

    # Handle filename conflicts
    base_name = Path(file.filename).stem
    extension = Path(file.filename).suffix
    counter = 1
    file_path = user_dir / file.filename

    while file_path.exists():
        new_filename = f"{base_name}_{counter}{extension}"
        file_path = user_dir / new_filename
        counter += 1

    try:
        # Save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Calculate checksum
        import hashlib

        checksum = hashlib.sha256(content).hexdigest()

        # Create database record
        project_file = ProjectFile(
            project_id=project.id,
            filename=file_path.name,
            file_path=str(file_path),
            file_type=file_type,
            file_size=len(content),
            mime_type=file.content_type,
            checksum=checksum,
            is_generated=False,
        )

        db.add(project_file)
        db.commit()
        db.refresh(project_file)

        logger.info(
            f"File uploaded: {file.filename}",
            user_id=current_user.id,
            project_id=project_id,
            file_id=project_file.id,
            file_size=len(content),
        )

        return FileUploadResponseSchema(
            id=project_file.id,
            filename=project_file.filename,
            file_path=project_file.file_path,
            file_type=project_file.file_type,
            file_size=project_file.file_size,
            mime_type=project_file.mime_type,
            uploaded_at=project_file.uploaded_at,
        )

    except Exception as e:
        # Clean up file if database operation fails
        if file_path.exists():
            file_path.unlink()

        db.rollback()
        logger.error(f"File upload failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="File upload failed",
        )


@router.get("/{file_id}")
async def download_file(
    file_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Download file"""
    # Get file with project ownership check
    file_record = db.execute(
        select(ProjectFile)
        .join(Project)
        .where(ProjectFile.id == file_id, Project.user_id == current_user.id)
    ).scalar_one_or_none()

    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
        )

    file_path = Path(file_record.file_path)
    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found on disk"
        )

    return FileResponse(
        path=str(file_path),
        filename=file_record.filename,
        media_type=file_record.mime_type or "application/octet-stream",
    )


@router.delete("/{file_id}")
async def delete_file(
    file_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Delete file"""
    # Get file with project ownership check
    file_record = db.execute(
        select(ProjectFile)
        .join(Project)
        .where(ProjectFile.id == file_id, Project.user_id == current_user.id)
    ).scalar_one_or_none()

    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
        )

    # Delete from filesystem
    file_path = Path(file_record.file_path)
    if file_path.exists():
        file_path.unlink()

    # Delete from database
    db.delete(file_record)
    db.commit()

    return {"message": "File deleted successfully"}
