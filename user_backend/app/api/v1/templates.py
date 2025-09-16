from typing import List, Optional, Dict, Any
import json
import os
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
import logging
import zipfile
import tempfile
from fastapi.responses import FileResponse, HTMLResponse, StreamingResponse
from user_backend.app.models import (
    Project,
    ProjectType,
    User,
)
from user_backend.app.schemas import (
    ProjectOutSchema,
    TemplateUseSchema,
)
from user_backend.app.core.security import get_current_active_user
from user_backend.app.db_setup import get_db
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

logger = logging.getLogger(__name__)


logger.info("Xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
# Correct path: templates are in /app/templates within the container
TEMPLATES_DIR = Path("/app/templates")

logger.info(f"Templates directory: {TEMPLATES_DIR}")
logger.info(f"Templates directory exists: {TEMPLATES_DIR.exists()}")

if TEMPLATES_DIR.exists():
    logger.info(
        f"Templates found: {[d.name for d in TEMPLATES_DIR.iterdir() if d.is_dir()]}"
    )
else:
    logger.warning(f"Templates directory does not exist: {TEMPLATES_DIR}")


# Pydantic models for SEVDO template format
class TemplateStructureBackend(BaseModel):
    description: str
    files: List[str]
    features: List[str]


class TemplateStructureFrontend(BaseModel):
    description: str
    files: List[str]
    pages: Optional[Dict[str, str]] = {}


class TemplateStructure(BaseModel):
    backend: Optional[TemplateStructureBackend] = None
    frontend: Optional[TemplateStructureFrontend] = None


class TemplateInstallation(BaseModel):
    backend: Optional[str] = None
    frontend: Optional[str] = None
    customization: Optional[str] = None


class SevdoTemplateMetadata(BaseModel):
    name: str
    description: str = "No description available"
    version: str = "1.0.0"  # Provide default value
    category: str = "general"
    author: str = "Unknown Author"  # Provide default value
    tags: List[str] = []
    structure: Optional[TemplateStructure] = None
    required_prefabs: Optional[List[str]] = []
    customization: Optional[Dict[str, Any]] = {}
    features: Optional[List[str]] = []
    installation: Optional[TemplateInstallation] = None

    # Add model config to handle extra fields
    class Config:
        extra = "allow"  # This allows extra fields in the JSON


class TemplateOutSchema(BaseModel):
    id: str
    name: str
    description: str
    version: str
    category: str
    author: str
    tags: List[str]
    is_featured: bool
    is_public: bool
    usage_count: int
    rating: float
    structure: Optional[TemplateStructure] = None
    required_prefabs: List[str]
    customization: Dict[str, Any]
    features: List[str]
    installation: Optional[TemplateInstallation] = None
    created_at: str
    updated_at: str


def get_template_metadata(template_dir: Path) -> Optional[SevdoTemplateMetadata]:
    """Read SEVDO template metadata from template.json with better error handling"""
    metadata_file = template_dir / "template.json"

    if not metadata_file.exists():
        logger.warning(f"No template.json found in {template_dir.name}")
        return None

    try:
        with open(metadata_file, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Ensure required fields have at least default values
        if "name" not in data:
            data["name"] = template_dir.name.replace("_", " ").title()

        if "version" not in data:
            data["version"] = "1.0.0"

        if "author" not in data:
            data["author"] = "Unknown Author"

        if "category" not in data:
            data["category"] = "general"

        return SevdoTemplateMetadata(**data)

    except (json.JSONDecodeError, UnicodeDecodeError) as e:
        logger.error(f"Error reading metadata file {metadata_file}: {e}")
        return None
    except Exception as e:
        logger.error(f"Error parsing template metadata {metadata_file}: {e}")
        return None


def determine_featured_status(
    template_id: str, metadata: SevdoTemplateMetadata
) -> bool:
    """Determine if template should be featured based on category and features"""
    featured_categories = ["fitness", "real_estate", "ecommerce"]

    if metadata.category in featured_categories:
        return True

    # Feature-rich templates
    if metadata.features and len(metadata.features) > 8:
        return True

    return False


def calculate_template_rating(metadata: SevdoTemplateMetadata) -> float:
    """Calculate template rating based on features and complexity"""
    base_rating = 4.5

    # Bonus for more features
    if metadata.features:
        feature_bonus = min(len(metadata.features) * 0.05, 0.5)
        base_rating += feature_bonus

    # Bonus for backend + frontend
    if metadata.structure:
        if metadata.structure.backend and metadata.structure.frontend:
            base_rating += 0.2

    # Category bonuses
    category_bonuses = {
        "fitness": 0.1,
        "real_estate": 0.2,
        "restaurant": 0.1,
        "ecommerce": 0.2,
    }

    base_rating += category_bonuses.get(metadata.category, 0)

    return min(base_rating, 5.0)


def convert_to_output_schema(
    template_id: str, metadata: SevdoTemplateMetadata
) -> TemplateOutSchema:
    """Convert SEVDO template metadata to output schema"""

    return TemplateOutSchema(
        id=template_id,
        name=metadata.name,
        description=metadata.description,
        version=metadata.version,
        category=metadata.category,
        author=metadata.author,
        tags=metadata.tags,
        is_featured=determine_featured_status(template_id, metadata),
        is_public=True,
        usage_count=0,  # TODO: Track actual usage
        rating=calculate_template_rating(metadata),
        structure=metadata.structure,
        required_prefabs=metadata.required_prefabs or [],
        customization=metadata.customization or {},
        features=metadata.features or [],
        installation=metadata.installation,
        created_at="2024-01-01T00:00:00Z",
        updated_at=datetime.now().isoformat() + "Z",
    )


@router.get("/", response_model=List[TemplateOutSchema])
async def list_templates(
    category: Optional[str] = Query(None),
    featured_only: bool = Query(False),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    """List available SEVDO project templates"""
    templates = []

    logger.info(f"Listing templates from: {TEMPLATES_DIR}")

    if not TEMPLATES_DIR.exists():
        logger.error(f"Templates directory not found: {TEMPLATES_DIR}")
        return []

    # Read all template directories
    for template_dir in TEMPLATES_DIR.iterdir():
        if template_dir.is_dir() and not template_dir.name.startswith("."):
            try:
                metadata = get_template_metadata(template_dir)
                if metadata is None:
                    logger.warning(
                        f"Skipping template {template_dir.name}: no valid metadata"
                    )
                    continue

                template_output = convert_to_output_schema(template_dir.name, metadata)

                # Apply filters
                if category and template_output.category != category:
                    continue
                if featured_only and not template_output.is_featured:
                    continue

                templates.append(template_output)

            except Exception as e:
                logger.error(f"Error processing template {template_dir}: {e}")
                continue

    logger.info(f"Found {len(templates)} valid templates")

    # Sort by featured first, then by rating, then by name
    templates.sort(key=lambda x: (-int(x.is_featured), -x.rating, x.name))

    # Apply pagination
    start_idx = offset
    end_idx = offset + limit
    return templates[start_idx:end_idx]


@router.get("/{template_name}/preview")
async def get_template_preview(template_name: str):
    """Get template preview with SEVDO metadata and file contents"""
    template_path = TEMPLATES_DIR / template_name

    if not template_path.exists() or not template_path.is_dir():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template '{template_name}' not found",
        )

    try:
        logger.info(f"Loading preview for template: {template_name}")

        # Get template metadata
        metadata = get_template_metadata(template_path)
        if metadata is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Template metadata is invalid",
            )

        preview_data = {
            "template_name": template_name,
            "metadata": metadata.dict(),
            "frontend": "",
            "backend": "",
            "files": {},
            "structure": [],
            "frontend_files": [],
            "backend_files": [],
        }

        # Get file structure from metadata
        if metadata.structure:
            if metadata.structure.frontend:
                preview_data["frontend_files"] = metadata.structure.frontend.files
            if metadata.structure.backend:
                preview_data["backend_files"] = metadata.structure.backend.files

        # Read actual files
        for file_path in template_path.rglob("*"):
            if file_path.is_file():
                relative_path = file_path.relative_to(template_path)
                preview_data["structure"].append(str(relative_path))

                # Skip binary files and very large files
                if file_path.suffix.lower() in [
                    ".png",
                    ".jpg",
                    ".jpeg",
                    ".gif",
                    ".ico",
                    ".pdf",
                    ".zip",
                ]:
                    continue

                if file_path.stat().st_size > 1024 * 1024:  # Skip files > 1MB
                    continue

                # Read text files
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                        preview_data["files"][str(relative_path)] = content

                        # Categorize files based on SEVDO structure
                        filename = file_path.name.lower()
                        relative_str = str(relative_path).lower()

                        # Frontend files (.s files for SEVDO DSL)
                        if (
                            filename.endswith(".s")
                            or relative_str.startswith("frontend/")
                            or filename in preview_data["frontend_files"]
                        ):
                            if not preview_data["frontend"]:
                                preview_data["frontend"] = (
                                    f"// SEVDO Frontend File: {relative_path}\n{content}"
                                )

                        # Backend files (.py files)
                        elif (
                            filename.endswith(".py")
                            or relative_str.startswith("backend/")
                            or filename in preview_data["backend_files"]
                        ):
                            if not preview_data["backend"]:
                                preview_data["backend"] = (
                                    f"# SEVDO Backend File: {relative_path}\n{content}"
                                )

                except UnicodeDecodeError:
                    logger.debug(f"Skipping binary file: {relative_path}")
                    continue
                except Exception as file_error:
                    logger.error(f"Error reading file {relative_path}: {file_error}")
                    continue

        # Add summary stats
        preview_data.update(
            {
                "file_count": len(preview_data["files"]),
                "has_frontend": bool(preview_data["frontend"]),
                "has_backend": bool(preview_data["backend"]),
                "template_type": metadata.category,
                "version": metadata.version,
                "author": metadata.author,
                "feature_count": len(metadata.features) if metadata.features else 0,
                "prefab_count": len(metadata.required_prefabs)
                if metadata.required_prefabs
                else 0,
            }
        )

        logger.info(
            f"Preview loaded for template {template_name}: "
            f"{preview_data['file_count']} files, "
            f"frontend: {preview_data['has_frontend']}, "
            f"backend: {preview_data['has_backend']}, "
            f"features: {preview_data['feature_count']}"
        )

        return preview_data

    except Exception as e:
        logger.error(f"Error loading template preview for {template_name}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load template preview: {str(e)}",
        )


@router.get("/{template_name}/files/{file_path:path}")
async def get_template_file(template_name: str, file_path: str):
    """Get a specific file from a template"""
    template_path = TEMPLATES_DIR / template_name
    file_full_path = template_path / file_path

    if not template_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template '{template_name}' not found",
        )

    if not file_full_path.exists() or not file_full_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"File '{file_path}' not found in template '{template_name}'",
        )

    # Security check: ensure file is within template directory
    try:
        file_full_path.resolve().relative_to(template_path.resolve())
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: file outside template directory",
        )

    try:
        with open(file_full_path, "r", encoding="utf-8") as f:
            content = f.read()

        return {
            "template_name": template_name,
            "file_path": file_path,
            "content": content,
            "size": len(content),
            "extension": file_full_path.suffix,
        }
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="File is not a text file"
        )
    except Exception as e:
        logger.error(
            f"Error reading file {file_path} from template {template_name}: {e}"
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to read file: {str(e)}",
        )


@router.post("/{template_name}/use", response_model=ProjectOutSchema)
async def use_template(
    template_name: str,
    template_use: TemplateUseSchema,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Create project from SEVDO template"""
    template_path = TEMPLATES_DIR / template_name

    if not template_path.exists() or not template_path.is_dir():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template '{template_name}' not found",
        )

    # Read template metadata
    metadata = get_template_metadata(template_path)
    if metadata is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Template metadata is invalid",
        )

    # Create project in database
    new_project = Project(
        name=template_use.project_name,
        description=template_use.project_description or metadata.description,
        project_type=ProjectType.WEB_APP,  # All SEVDO templates are web apps
        tokens=metadata.required_prefabs or [],
        config={
            "template_source": template_name,
            "template_version": metadata.version,
            "template_author": metadata.author,
            "customization": metadata.customization,
            **template_use.customize_config,
        }
        if template_use.customize_config
        else {
            "template_source": template_name,
            "template_version": metadata.version,
            "template_author": metadata.author,
            "customization": metadata.customization,
        },
        user_id=current_user.id,
        template_source=template_name,
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return ProjectOutSchema.model_validate(new_project)


@router.get("/{template_name}/download")
async def download_template(template_name: str):
    """Download SEVDO template as a ZIP file"""
    logger.info(f"Download request for template: {template_name}")

    template_path = TEMPLATES_DIR / template_name

    if not template_path.exists() or not template_path.is_dir():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template '{template_name}' not found",
        )

    # Files to exclude from download
    EXCLUDE_PATTERNS = {
        "__pycache__",
        ".git",
        ".vscode",
        ".pytest_cache",
        "venv",
        "env",
        ".env",
        "node_modules",
        ".next",
        "dist",
        "build",
        "coverage",
        ".coverage",
        ".DS_Store",
        "Thumbs.db",
    }

    def should_exclude(file_path: Path) -> bool:
        """Check if file should be excluded from download"""
        path_parts = file_path.parts

        for part in path_parts:
            if part in EXCLUDE_PATTERNS:
                return True
            if part.endswith((".log", ".cache", ".tmp")):
                return True

        # Exclude very large files (> 10MB)
        try:
            if file_path.stat().st_size > 10 * 1024 * 1024:
                logger.warning(
                    f"Excluding large file: {file_path} ({file_path.stat().st_size} bytes)"
                )
                return True
        except:
            pass

        return False

    try:
        temp_zip = tempfile.NamedTemporaryFile(delete=False, suffix=".zip")

        with zipfile.ZipFile(temp_zip.name, "w", zipfile.ZIP_DEFLATED) as zipf:
            file_count = 0
            excluded_count = 0

            for file_path in template_path.rglob("*"):
                if file_path.is_file():
                    if should_exclude(file_path):
                        excluded_count += 1
                        continue

                    arc_name = file_path.relative_to(template_path)
                    zipf.write(file_path, arc_name)
                    file_count += 1

            logger.info(
                f"Created ZIP with {file_count} files, excluded {excluded_count} files"
            )

        def iter_file():
            try:
                with open(temp_zip.name, "rb") as file:
                    while chunk := file.read(8192):
                        yield chunk
            finally:
                try:
                    os.unlink(temp_zip.name)
                except:
                    pass

        return StreamingResponse(
            iter_file(),
            media_type="application/zip",
            headers={
                "Content-Disposition": f'attachment; filename="{template_name}-sevdo-template.zip"'
            },
        )

    except Exception as e:
        logger.error(f"Error creating ZIP for template {template_name}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create template download: {str(e)}",
        )


@router.get("/health")
async def templates_health_check():
    """Health check for SEVDO templates system"""
    template_info = []
    valid_templates = 0

    if TEMPLATES_DIR.exists():
        for template_dir in TEMPLATES_DIR.iterdir():
            if template_dir.is_dir():
                metadata = get_template_metadata(template_dir)
                files = list(template_dir.glob("*"))

                template_status = {
                    "name": template_dir.name,
                    "has_metadata": metadata is not None,
                    "file_count": len(files),
                    "files": [f.name for f in files[:5]],  # Show first 5 files
                }

                if metadata:
                    valid_templates += 1
                    template_status.update(
                        {
                            "template_name": metadata.name,
                            "category": metadata.category,
                            "version": metadata.version,
                            "author": metadata.author,
                            "feature_count": len(metadata.features)
                            if metadata.features
                            else 0,
                            "prefab_count": len(metadata.required_prefabs)
                            if metadata.required_prefabs
                            else 0,
                        }
                    )

                template_info.append(template_status)

    return {
        "status": "healthy" if valid_templates > 0 else "warning",
        "templates_directory": str(TEMPLATES_DIR),
        "directory_exists": TEMPLATES_DIR.exists(),
        "total_directories": len(template_info),
        "valid_templates": valid_templates,
        "template_details": template_info,
        "sevdo_format": "SEVDO template format with structure, prefabs, and customization",
    }


@router.get("/{template_name}", response_model=TemplateOutSchema)
async def get_template(template_name: str):
    """Get a single SEVDO template by name"""
    template_path = TEMPLATES_DIR / template_name

    if not template_path.exists() or not template_path.is_dir():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template '{template_name}' not found",
        )

    try:
        metadata = get_template_metadata(template_path)
        if metadata is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Template metadata is invalid",
            )

        return convert_to_output_schema(template_name, metadata)

    except Exception as e:
        logger.error(f"Error loading template {template_name}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load template: {str(e)}",
        )


@router.get("/{template_name}/live-preview")
async def get_template_live_preview(template_name: str):
    """Serve the live preview of a SEVDO template"""
    template_path = TEMPLATES_DIR / template_name

    if not template_path.exists() or not template_path.is_dir():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template '{template_name}' not found",
        )

    # Get template metadata first
    metadata = get_template_metadata(template_path)
    if metadata is None:
        return HTMLResponse(
            content=create_error_page(template_name, "Invalid template metadata"),
            status_code=500,
        )

    # For SEVDO templates, create a dynamic preview page
    try:
        # Get all .s files (SEVDO frontend files)
        sevdo_files = list(template_path.glob("frontend/*.s"))

        if not sevdo_files:
            # Fallback: look for .s files in root
            sevdo_files = list(template_path.glob("*.s"))

        # Find the home/main page
        home_file = None
        for file_path in sevdo_files:
            filename = file_path.stem.lower()
            if filename in ["home", "hem", "index", "main"]:
                home_file = file_path
                break

        # If no home file found, use the first .s file
        if not home_file and sevdo_files:
            home_file = sevdo_files[0]

        if home_file:
            # Read the SEVDO file and convert to HTML preview
            with open(home_file, "r", encoding="utf-8") as f:
                sevdo_content = f.read()

            # Create HTML preview from SEVDO content
            html_content = create_sevdo_preview_html(
                template_name, metadata, sevdo_content, sevdo_files
            )
            return HTMLResponse(content=html_content)
        else:
            # No SEVDO files found, show template info
            return HTMLResponse(
                content=create_template_info_page(template_name, metadata)
            )

    except Exception as e:
        logger.error(f"Error serving live preview for {template_name}: {e}")
        return HTMLResponse(
            content=create_error_page(template_name, str(e)), status_code=500
        )


def create_sevdo_preview_html(
    template_name: str,
    metadata: SevdoTemplateMetadata,
    sevdo_content: str,
    all_files: list,
) -> str:
    """Create HTML preview from SEVDO content"""

    # Extract navigation and content from SEVDO
    nav_items = extract_navigation(sevdo_content)
    page_sections = parse_sevdo_content(sevdo_content)

    # Generate page list
    page_links = ""
    for file_path in all_files:
        page_name = file_path.stem
        page_links += (
            f'<a href="#{page_name.lower()}" class="page-link">{page_name}</a> '
        )

    html_template = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{metadata.name} - Live Preview</title>
        <style>
            * {{ margin: 0; padding: 0; box-sizing: border-box; }}
            body {{ 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6; color: #333; background: #f8fafc;
            }}
            .preview-header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; padding: 1rem; text-align: center;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }}
            .preview-header h1 {{ font-size: 1.8rem; margin-bottom: 0.5rem; }}
            .preview-header p {{ opacity: 0.9; font-size: 0.9rem; }}
            .preview-nav {{
                background: white; padding: 1rem; border-bottom: 1px solid #e5e7eb;
                text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }}
            .page-link {{
                display: inline-block; margin: 0 0.5rem; padding: 0.5rem 1rem;
                background: #f3f4f6; color: #374151; text-decoration: none;
                border-radius: 6px; transition: all 0.2s;
            }}
            .page-link:hover {{ background: #e5e7eb; }}
            .page-link.active {{ background: #3b82f6; color: white; }}
            .content {{ max-width: 1200px; margin: 2rem auto; padding: 0 1rem; }}
            .section {{ 
                background: white; margin-bottom: 2rem; padding: 2rem; 
                border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }}
            .section h2 {{ 
                color: #1f2937; margin-bottom: 1rem; font-size: 1.5rem;
                border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem;
            }}
            .section p {{ margin-bottom: 1rem; color: #6b7280; }}
            .hero {{ 
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white; text-align: center; padding: 4rem 2rem;
                border-radius: 12px; margin-bottom: 2rem;
            }}
            .hero h1 {{ font-size: 2.5rem; margin-bottom: 1rem; }}
            .hero p {{ font-size: 1.1rem; opacity: 0.9; margin-bottom: 2rem; }}
            .btn {{
                display: inline-block; padding: 0.75rem 1.5rem; 
                background: #3b82f6; color: white; text-decoration: none;
                border-radius: 6px; transition: all 0.2s;
            }}
            .btn:hover {{ background: #2563eb; transform: translateY(-1px); }}
            .features {{ 
                display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1.5rem; margin: 2rem 0;
            }}
            .feature {{
                background: #f8fafc; padding: 1.5rem; border-radius: 8px;
                border-left: 4px solid #3b82f6;
            }}
            .feature h3 {{ color: #1f2937; margin-bottom: 0.5rem; }}
            .stats {{
                display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem; margin: 2rem 0;
            }}
            .stat {{
                background: #f3f4f6; padding: 1.5rem; border-radius: 8px; text-align: center;
            }}
            .stat-value {{ font-size: 2rem; font-weight: bold; color: #3b82f6; }}
            .stat-label {{ color: #6b7280; font-size: 0.9rem; }}
            .template-info {{
                background: #eff6ff; border: 1px solid #bfdbfe; padding: 1rem;
                border-radius: 8px; margin-bottom: 2rem;
            }}
            .template-info h3 {{ color: #1e40af; margin-bottom: 0.5rem; }}
            .template-info p {{ color: #1e3a8a; font-size: 0.9rem; }}
            @media (max-width: 768px) {{
                .hero {{ padding: 2rem 1rem; }}
                .hero h1 {{ font-size: 1.8rem; }}
                .content {{ padding: 0 0.5rem; }}
                .section {{ padding: 1.5rem; }}
            }}
        </style>
    </head>
    <body>
        <div class="preview-header">
            <h1>{metadata.name}</h1>
            <p>SEVDO Template Live Preview Version {metadata.version} by {metadata.author}</p>
        </div>
        
        <div class="preview-nav">
            <div class="template-info">
                <h3>Template: {template_name}</h3>
                <p>Category: {metadata.category}   {len(metadata.features or [])} features   {len(metadata.required_prefabs or [])} components</p>
            </div>
            <div>Available Pages: {page_links}</div>
        </div>
        
        <div class="content">
            {page_sections}
        </div>
        
        <script>
            // Simple page navigation simulation
            document.querySelectorAll('.page-link').forEach(link => {{
                link.addEventListener('click', (e) => {{
                    e.preventDefault();
                    document.querySelectorAll('.page-link').forEach(l => l.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    // You could load different page content here
                    console.log('Navigating to:', e.target.textContent);
                }});
            }});
            
            // Set first page as active
            document.querySelector('.page-link')?.classList.add('active');
        </script>
    </body>
    </html>
    """

    return html_template


def extract_navigation(sevdo_content: str) -> list:
    """Extract navigation items from SEVDO content"""
    lines = sevdo_content.split("\n")
    for line in lines:
        if line.strip().startswith("mn("):
            # Extract navigation items between parentheses
            nav_content = line.strip()[3:-1]  # Remove 'mn(' and ')'
            return [item.strip() for item in nav_content.split(",")]
    return []


def parse_sevdo_content(sevdo_content: str) -> str:
    """Parse SEVDO content and convert to functional HTML sections"""
    lines = sevdo_content.split("\n")
    sections = []
    nav_items = []
    current_section = ""

    # Extract navigation first
    for line in lines:
        if line.strip().startswith("mn("):
            nav_content = line.strip()[3:-1]  # Remove 'mn(' and ')'
            nav_items = [item.strip() for item in nav_content.split(",")]
            break

    # Create functional navigation
    nav_html = ""
    # if nav_items:
    #     nav_links = "".join(
    #         [
    #             f'<a href="#{item.lower().replace(" ", "-")}" class="nav-link" onclick="navigateToSection(\'{item.lower().replace(" ", "-")}\')">{item}</a>'
    #             for item in nav_items
    #         ]
    #     )

    #     nav_html = f'<nav class="navbar"><div class="nav-container"><div class="nav-brand">Template Preview</div><div class="nav-links">{nav_links}</div></div></nav>'

    for line in lines:
        line = line.strip()
        if not line or line.startswith("mn("):
            continue

        # Hero section
        if line.startswith("ho("):
            content = line[3:-1]
            parts = content.split(",")
            if len(parts) >= 3:
                title = parts[0].replace("h(", "").replace(")", "")
                desc = parts[1].replace("t(", "").replace(")", "")
                btn_text = parts[2].replace("b(", "").replace(")", "")
                action = determine_button_action(btn_text)

                sections.append(f"""
                <div class="hero">
                    <h1>{title}</h1>
                    <p>{desc}</p>
                    <a href="#" class="btn btn-primary" data-action="{action}" onclick="handleButtonClick('{action}')">{btn_text}</a>
                </div>
                """)

        # Regular heading
        elif line.startswith("h("):
            if current_section:
                current_section += "</div>"
                sections.append(current_section)
            title = line[2:-1]
            current_section = f'<div class="section"><h2>{title}</h2>'

        # Text content
        elif line.startswith("t("):
            text = line[2:-1]
            if current_section:
                current_section += f"<p>{text}</p>"

        # Contact form
        elif line.startswith("cf("):
            if current_section:
                current_section += f"""
                <div class="contact-form">
                    <form onsubmit="handleFormSubmit(event, 'contact')">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" name="name" required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label>Message</label>
                            <textarea name="message" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Send Message</button>
                    </form>
                </div>
                """

        # Call to Action
        elif line.startswith("cta"):
            content = line[4:-1] if line.startswith("cta(") else ""
            parts = content.split(",") if content else []
            if len(parts) >= 3:
                title = parts[0].replace("h(", "").replace(")", "")
                desc = parts[1].replace("t(", "").replace(")", "")
                btn_text = parts[2].replace("b(", "").replace(")", "")
                action = determine_button_action(btn_text)

                if current_section:
                    current_section += f"""
                    <div class="cta-section">
                        <h3>{title}</h3>
                        <p>{desc}</p>
                        <a href="#" class="btn btn-secondary" data-action="{action}" onclick="handleButtonClick('{action}')">{btn_text}</a>
                    </div>
                    """

    # Close final section
    if current_section:
        current_section += "</div>"
        sections.append(current_section)

    # Add JavaScript for functionality
    javascript = """
    <script>
        function navigateToSection(sectionId) {
            console.log('Navigating to:', sectionId);
            showNotification('Navigating to ' + sectionId.replace('-', ' '));
        }
        
        function handleButtonClick(action) {
            console.log('Button clicked:', action);
            showNotification('Action: ' + action);
        }
        
        function handleFormSubmit(event, formType) {
            event.preventDefault();
            console.log('Form submitted:', formType);
            showNotification('Form submitted! (Preview mode)');
        }
        
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed; top: 20px; right: 20px; z-index: 1000;
                background: #4CAF50; color: white; padding: 12px 20px;
                border-radius: 6px; font-size: 14px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            `;
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        }
    </script>
    """

    return nav_html + "\n".join(sections) + javascript


def determine_button_action(btn_text):
    text_lower = btn_text.lower()
    if "menu" in text_lower:
        return "view-menu"
    elif "reservation" in text_lower or "book" in text_lower:
        return "make-reservation"
    elif "read" in text_lower or "blog" in text_lower:
        return "read-posts"
    elif "contact" in text_lower:
        return "contact"
    else:
        return "default"


def create_template_info_page(
    template_name: str, metadata: SevdoTemplateMetadata
) -> str:
    """Create a template information page when no preview is available"""
    features_list = ""
    if metadata.features:
        features_list = "".join(
            [f"<li>{feature}</li>" for feature in metadata.features]
        )

    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{metadata.name} - Template Info</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; background: #f8fafc; }}
            .container {{ max-width: 800px; margin: 0 auto; background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }}
            .header {{ text-align: center; margin-bottom: 2rem; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; }}
            .info-grid {{ display: grid; gap: 1rem; margin: 2rem 0; }}
            .info-item {{ background: #f8fafc; padding: 1rem; border-radius: 6px; border-left: 4px solid #3b82f6; }}
            .features {{ columns: 2; gap: 1rem; }}
            .prefabs {{ background: #eff6ff; padding: 1rem; border-radius: 6px; margin: 1rem 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>{metadata.name}</h1>
                <p>{metadata.description}</p>
                <p><strong>Version:</strong> {metadata.version}   <strong>Category:</strong> {metadata.category}</p>
            </div>
            
            <div class="info-grid">
                <div class="info-item">
                    <h3>Author</h3>
                    <p>{metadata.author}</p>
                </div>
                <div class="info-item">
                    <h3>Template Type</h3>
                    <p>SEVDO Frontend Template</p>
                </div>
            </div>
            
            <div class="info-item">
                <h3>Features ({len(metadata.features or [])})</h3>
                <ul class="features">{features_list}</ul>
            </div>
            
            <div class="prefabs">
                <h3>Required Components</h3>
                <p>{", ".join(metadata.required_prefabs or [])}</p>
            </div>
            
            <div class="info-item">
                <h3>Note</h3>
                <p>This is a SEVDO template that requires compilation to generate the final HTML. The live preview shows the template structure and information.</p>
            </div>
        </div>
    </body>
    </html>
    """


def create_error_page(template_name: str, error_message: str) -> str:
    """Create an error page for failed previews"""
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview Error - {template_name}</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; background: #fef2f2; color: #991b1b; }}
            .container {{ max-width: 600px; margin: 0 auto; text-align: center; }}
            .error-icon {{ font-size: 4rem; margin-bottom: 1rem; }}
            .error-box {{ background: white; padding: 2rem; border-radius: 8px; border: 1px solid #fecaca; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="error-box">
                <div class="error-icon">âš ï¸</div>
                <h1>Preview Error</h1>
                <p>Failed to load preview for template: <strong>{template_name}</strong></p>
                <p><strong>Error:</strong> {error_message}</p>
                <p>This SEVDO template may require compilation or have missing files.</p>
            </div>
        </div>
    </body>
    </html>
    """


@router.get("/{template_name}/assets/{file_path:path}")
async def get_template_asset(template_name: str, file_path: str):
    """Get static assets (CSS, JS, images) for template live preview"""
    template_path = TEMPLATES_DIR / template_name
    asset_path = template_path / file_path

    if not template_path.exists():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Template '{template_name}' not found",
        )

    if not asset_path.exists() or not asset_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Asset '{file_path}' not found in template '{template_name}'",
        )

    # Security check
    try:
        asset_path.resolve().relative_to(template_path.resolve())
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: asset outside template directory",
        )

    # Determine media type based on file extension
    media_type = "application/octet-stream"
    if asset_path.suffix == ".css":
        media_type = "text/css"
    elif asset_path.suffix == ".js":
        media_type = "application/javascript"
    elif asset_path.suffix in [".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg"]:
        media_type = f"image/{asset_path.suffix[1:]}"

    try:
        return FileResponse(asset_path, media_type=media_type)
    except Exception as e:
        logger.error(
            f"Error serving asset {file_path} from template {template_name}: {e}"
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to serve asset: {str(e)}",
        )
