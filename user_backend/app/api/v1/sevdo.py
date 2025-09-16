# user_backend/app/api/v1/core/endpoints/sevdo.py
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from user_backend.app.core.security import get_current_active_user
from user_backend.app.models import User
from user_backend.app.services.sevdo_service import sevdo_service

router = APIRouter()


class BackendGenerateRequest(BaseModel):
    tokens: List[str]
    include_imports: bool = True


class FrontendGenerateRequest(BaseModel):
    dsl_content: str
    component_name: str = "GeneratedComponent"
    include_imports: bool = True


class ProjectGenerateRequest(BaseModel):
    project_name: str
    backend_tokens: List[str]
    frontend_dsl: Optional[str] = None
    include_imports: bool = True


@router.post("/generate/backend")
async def generate_backend(
    request: BackendGenerateRequest,
    current_user: User = Depends(get_current_active_user),
):
    """Generate backend code using SEVDO tokens"""
    result = await sevdo_service.generate_backend_code(
        tokens=request.tokens, include_imports=request.include_imports
    )

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])

    return result


@router.post("/generate/frontend")
async def generate_frontend(
    request: FrontendGenerateRequest,
    current_user: User = Depends(get_current_active_user),
):
    """Generate frontend code using SEVDO DSL"""
    result = await sevdo_service.generate_frontend_code(
        dsl_content=request.dsl_content,
        component_name=request.component_name,
        include_imports=request.include_imports,
    )

    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["error"])

    return result


@router.post("/generate/project")
async def generate_project(
    request: ProjectGenerateRequest,
    current_user: User = Depends(get_current_active_user),
):
    """Generate complete project with backend and frontend"""
    result = await sevdo_service.generate_full_project(
        project_name=request.project_name,
        backend_tokens=request.backend_tokens,
        frontend_dsl=request.frontend_dsl,
        include_imports=request.include_imports,
    )

    if not result["success"]:
        raise HTTPException(status_code=400, detail="Project generation failed")

    return result
