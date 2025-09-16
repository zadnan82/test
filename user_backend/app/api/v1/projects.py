# user_backend/app/api/v1/endpoints/projects.py
from typing import List, Optional
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    BackgroundTasks,
    UploadFile,
    File,
)
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from user_backend.app.db_setup import get_db
from user_backend.app.core.security import get_current_active_user
from user_backend.app.models import (
    FileType,
    GenerationStatus,
    ProjectStatus,
    ProjectType,
    User,
    Project,
    ProjectGeneration,
    ProjectFile,
    UserActivity,
)
from user_backend.app.schemas import (
    FileUploadResponseSchema,
    ProjectCreateSchema,
    ProjectFileOutSchema,
    ProjectGenerateSchema,
    ProjectGenerationOutSchema,
    ProjectOutSchema,
    ProjectUpdateSchema,
)


from user_backend.app.core.logging_config import StructuredLogger

router = APIRouter()
logger = StructuredLogger(__name__)

# ==================== PROJECT CRUD ====================


@router.post("/", response_model=ProjectOutSchema, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreateSchema,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Create a new project"""
    try:
        # Validate tokens exist
        # TODO: Add token validation logic here

        new_project = Project(
            name=project_data.name,
            description=project_data.description,
            project_type=project_data.project_type,
            tokens=project_data.tokens,
            config=project_data.config,
            working_directory=project_data.working_directory,
            include_imports=project_data.include_imports,
            user_id=current_user.id,
        )

        db.add(new_project)
        db.commit()
        db.refresh(new_project)

        # Log activity
        background_tasks.add_task(
            log_user_activity,
            db,
            current_user.id,
            "project_created",
            f"Created project: {new_project.name}",
            new_project.id,
        )

        logger.info(
            f"Project created: {new_project.name}",
            user_id=current_user.id,
            project_id=new_project.id,
        )

        return ProjectOutSchema.model_validate(new_project)

    except Exception as e:
        db.rollback()
        logger.error(f"Failed to create project: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create project",
        )


@router.put("/{project_id}", response_model=ProjectOutSchema)
async def update_project(
    project_id: int,
    project_data: ProjectUpdateSchema,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Update project"""
    project = db.execute(
        select(Project).where(
            Project.id == project_id, Project.user_id == current_user.id
        )
    ).scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    # Update fields
    update_data = project_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)

    background_tasks.add_task(
        log_user_activity,
        db,
        current_user.id,
        "project_updated",
        f"Updated project: {project.name}",
        project.id,
    )

    return ProjectOutSchema.model_validate(project)


@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Delete project"""
    project = db.execute(
        select(Project).where(
            Project.id == project_id, Project.user_id == current_user.id
        )
    ).scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    project_name = project.name
    db.delete(project)
    db.commit()

    background_tasks.add_task(
        log_user_activity,
        db,
        current_user.id,
        "project_deleted",
        f"Deleted project: {project_name}",
        None,
    )

    return {"message": "Project deleted successfully"}


# ==================== PROJECT GENERATION ====================


@router.post("/{project_id}/generate", response_model=ProjectGenerationOutSchema)
async def generate_project(
    project_id: int,
    generation_data: ProjectGenerateSchema,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Generate code for project"""
    project = db.execute(
        select(Project).where(
            Project.id == project_id, Project.user_id == current_user.id
        )
    ).scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    # Create generation record
    generation = ProjectGeneration(
        project_id=project.id,
        tokens_used=generation_data.tokens or project.tokens,
        status=GenerationStatus.PENDING,
    )

    db.add(generation)
    db.commit()
    db.refresh(generation)

    # Update project status
    project.status = ProjectStatus.GENERATING
    project.generation_count += 1
    db.commit()

    if generation_data.async_generation:
        # Run generation in background
        background_tasks.add_task(
            run_code_generation, generation.id, project.id, current_user.id
        )
    else:
        # Run synchronously (for quick generations)
        await run_code_generation(generation.id, project.id, current_user.id)
        db.refresh(generation)

    return ProjectGenerationOutSchema.model_validate(generation)


@router.get(
    "/{project_id}/generations", response_model=List[ProjectGenerationOutSchema]
)
async def list_project_generations(
    project_id: int,
    limit: int = 20,
    offset: int = 0,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """List project generations"""
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

    generations = (
        db.execute(
            select(ProjectGeneration)
            .where(ProjectGeneration.project_id == project_id)
            .order_by(desc(ProjectGeneration.created_at))
            .limit(limit)
            .offset(offset)
        )
        .scalars()
        .all()
    )

    return [ProjectGenerationOutSchema.model_validate(g) for g in generations]


@router.get("/{project_id}/status")
async def get_project_status(
    project_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get current project generation status"""
    project = db.execute(
        select(Project).where(
            Project.id == project_id, Project.user_id == current_user.id
        )
    ).scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    # Get latest generation
    latest_generation = db.execute(
        select(ProjectGeneration)
        .where(ProjectGeneration.project_id == project_id)
        .order_by(desc(ProjectGeneration.created_at))
        .limit(1)
    ).scalar_one_or_none()

    return {
        "project_status": project.status,
        "latest_generation": ProjectGenerationOutSchema.model_validate(
            latest_generation
        )
        if latest_generation
        else None,
        "generation_count": project.generation_count,
        "last_generated_at": project.last_generated_at,
    }


# ==================== FILE MANAGEMENT ====================


@router.post("/{project_id}/files/upload", response_model=FileUploadResponseSchema)
async def upload_project_file(
    project_id: int,
    file: UploadFile = File(...),
    file_type: FileType = FileType.SOURCE_CODE,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Upload file to project"""
    project = db.execute(
        select(Project).where(
            Project.id == project_id, Project.user_id == current_user.id
        )
    ).scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    # TODO: Add file validation, virus scanning, etc.
    # TODO: Store file in proper storage (S3, local filesystem, etc.)

    # For now, simulate file storage
    file_path = f"projects/{project_id}/uploads/{file.filename}"

    project_file = ProjectFile(
        project_id=project.id,
        filename=file.filename,
        file_path=file_path,
        file_type=file_type,
        file_size=file.size or 0,
        mime_type=file.content_type,
        is_generated=False,
    )

    db.add(project_file)
    db.commit()
    db.refresh(project_file)

    return FileUploadResponseSchema(
        id=project_file.id,
        filename=project_file.filename,
        file_path=project_file.file_path,
        file_type=project_file.file_type,
        file_size=project_file.file_size,
        mime_type=project_file.mime_type,
        uploaded_at=project_file.uploaded_at,
    )


@router.get("/{project_id}/files", response_model=List[ProjectFileOutSchema])
async def list_project_files(
    project_id: int,
    file_type: Optional[FileType] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """List project files"""
    project = db.execute(
        select(Project).where(
            Project.id == project_id, Project.user_id == current_user.id
        )
    ).scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    query = select(ProjectFile).where(ProjectFile.project_id == project_id)
    if file_type:
        query = query.where(ProjectFile.file_type == file_type)

    files = db.execute(query.order_by(ProjectFile.uploaded_at)).scalars().all()
    return [ProjectFileOutSchema.model_validate(f) for f in files]


# ==================== HELPER FUNCTIONS ====================


async def log_user_activity(
    db: Session,
    user_id: int,
    activity_type: str,
    description: str,
    project_id: Optional[int] = None,
):
    """Log user activity"""
    activity = UserActivity(
        user_id=user_id,
        activity_type=activity_type,
        description=description,
        project_id=project_id,
    )
    db.add(activity)
    db.commit()


async def run_code_generation(generation_id: int, project_id: int, user_id: int):
    """Run actual code generation - integrate with sevdo-backend"""
    # TODO: Integrate with your sevdo-backend compiler
    # This would call the token-to-code generation service
    pass


def convert_project_to_schema(project: Project) -> ProjectOutSchema:
    """Convert project with tokens to user-friendly schema"""
    from user_backend.app.api.v1.ai import tokens_to_features

    # Convert internal tokens to user-friendly features
    features = tokens_to_features(project.tokens)

    return ProjectOutSchema(
        id=project.id,
        name=project.name,
        description=project.description,
        project_type=project.project_type,
        features=features,  # Show features instead of tokens
        status=project.status,
        config=project.config,
        working_directory=project.working_directory,
        include_imports=project.include_imports,
        generation_count=project.generation_count,
        last_generated_at=project.last_generated_at,
        created_at=project.created_at,
        updated_at=project.updated_at,
        user_id=project.user_id,
    )


# REPLACE your existing get_project function with this:
@router.get("/{project_id}", response_model=ProjectOutSchema)
async def get_project(
    project_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Get project by ID - returns user-friendly features"""
    project = db.execute(
        select(Project).where(
            Project.id == project_id, Project.user_id == current_user.id
        )
    ).scalar_one_or_none()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
        )

    return convert_project_to_schema(project)


# REPLACE your existing list_projects function with this:
@router.get("/", response_model=List[ProjectOutSchema])
async def list_projects(
    status_filter: Optional[ProjectStatus] = None,
    project_type: Optional[ProjectType] = None,
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """List user's projects with features instead of tokens"""
    query = select(Project).where(Project.user_id == current_user.id)

    if status_filter:
        query = query.where(Project.status == status_filter)
    if project_type:
        query = query.where(Project.project_type == project_type)

    query = query.order_by(desc(Project.updated_at)).limit(limit).offset(offset)

    projects = db.execute(query).scalars().all()
    return [convert_project_to_schema(p) for p in projects]
