# user_backend/app/api/v1/core/schemas.py

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, validator, ConfigDict
import re
from typing import Optional, Dict, Any, List
from user_backend.app.models import (
    AIInsightType,
    FileType,
    GenerationStatus,
    ProjectStatus,
    ProjectType,
    TokenCategory,
    TokenComplexity,
)


# ----- Base Schemas -----


class BaseResponseSchema(BaseModel):
    """Base response schema with success indicator"""

    success: bool = True
    message: Optional[str] = None


class ErrorResponseSchema(BaseModel):
    """Error response schema"""

    success: bool = False
    error: Dict[str, Any]
    data: Optional[Any] = None
    timestamp: str
    request_id: Optional[str] = None


class MessageResponseSchema(BaseResponseSchema):
    """Simple message response"""

    message: str


# ----- Auth Token Schemas -----


class TokenResponseSchema(BaseModel):
    """Token response for login"""

    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                "token_type": "bearer",
                "expires_in": 1800,
            }
        }
    )


class RefreshTokenSchema(BaseModel):
    """Refresh token request"""

    refresh_token: str


# ----- User Schemas -----


class UserBaseSchema(BaseModel):
    """Base user schema with common fields"""

    first_name: str = Field(
        ..., min_length=1, max_length=100, description="User's first name"
    )
    last_name: str = Field(
        ..., min_length=1, max_length=100, description="User's last name"
    )
    email: EmailStr = Field(..., description="User's email address")

    @validator("first_name", "last_name")
    def validate_names(cls, v):
        """Validate name fields"""
        if not v or not v.strip():
            raise ValueError("Name cannot be empty or just whitespace")

        # Remove extra whitespace and validate characters
        cleaned = v.strip()
        if len(cleaned) < 1:
            raise ValueError("Name must be at least 1 character after trimming")

        # Allow letters, spaces, hyphens, and apostrophes
        if not re.match(r"^[a-zA-Z\s\-']+$", cleaned):
            raise ValueError(
                "Name can only contain letters, spaces, hyphens, and apostrophes"
            )

        return cleaned

    @validator("email")
    def validate_email(cls, v):
        """Additional email validation"""
        email_str = str(v).lower().strip()

        # Check for reasonable length
        if len(email_str) > 254:
            raise ValueError("Email address is too long")

        return email_str


class UserRegisterSchema(UserBaseSchema):
    """Schema for user registration"""

    password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="Password must be 8-128 characters with uppercase, lowercase, and number",
    )
    confirm_password: str = Field(..., description="Password confirmation")
    user_type_id: Optional[int] = Field(
        default=1, description="User type ID (default: 1 for regular user)"
    )

    @validator("password")
    def validate_password(cls, v):
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")

        if len(v) > 128:
            raise ValueError("Password must be less than 128 characters")

        # Check for at least one uppercase, lowercase, and digit
        has_upper = any(c.isupper() for c in v)
        has_lower = any(c.islower() for c in v)
        has_digit = any(c.isdigit() for c in v)

        if not has_upper:
            raise ValueError("Password must contain at least one uppercase letter")
        if not has_lower:
            raise ValueError("Password must contain at least one lowercase letter")
        if not has_digit:
            raise ValueError("Password must contain at least one number")

        # Check for common weak passwords
        weak_passwords = ["password123", "12345678", "qwerty123", "admin123"]
        if v.lower() in weak_passwords:
            raise ValueError(
                "Password is too common, please choose a stronger password"
            )

        return v

    @validator("confirm_password")
    def passwords_match(cls, v, values):
        """Validate that passwords match"""
        if "password" in values and v != values["password"]:
            raise ValueError("Passwords do not match")
        return v

    @validator("user_type_id")
    def validate_user_type(cls, v):
        """Validate user type ID"""
        if v is not None and v not in [1, 2, 3]:  # 1=regular, 2=admin, 3=guest
            raise ValueError("Invalid user type ID")
        return v

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "first_name": "John",
                "last_name": "Doe",
                "email": "john.doe@example.com",
                "password": "SecurePass123",
                "confirm_password": "SecurePass123",
                "user_type_id": 1,
            }
        }
    )


class UserUpdateSchema(BaseModel):
    """Schema for updating user profile"""

    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None

    @validator("first_name", "last_name")
    def validate_names(cls, v):
        """Validate name fields"""
        if v is not None:
            if not v or not v.strip():
                raise ValueError("Name cannot be empty or just whitespace")

            cleaned = v.strip()
            if len(cleaned) < 1:
                raise ValueError("Name must be at least 1 character after trimming")

            if not re.match(r"^[a-zA-Z\s\-']+$", cleaned):
                raise ValueError(
                    "Name can only contain letters, spaces, hyphens, and apostrophes"
                )

            return cleaned
        return v

    @validator("email")
    def validate_email(cls, v):
        """Additional email validation"""
        if v is not None:
            email_str = str(v).lower().strip()
            if len(email_str) > 254:
                raise ValueError("Email address is too long")
            return email_str
        return v

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "first_name": "John",
                "last_name": "Smith",
                "email": "john.smith@example.com",
            }
        }
    )


class UserOutSchema(BaseModel):
    """Schema for user output (public info)"""

    id: int
    first_name: str
    last_name: str
    email: str
    user_type_id: int
    created_at: datetime

    @property
    def full_name(self) -> str:
        """Get user's full name"""
        return f"{self.first_name} {self.last_name}"

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 1,
                "first_name": "John",
                "last_name": "Doe",
                "email": "john.doe@example.com",
                "user_type_id": 1,
                "created_at": "2024-01-15T10:30:00Z",
            }
        },
    )


class UserDetailSchema(UserOutSchema):
    """Extended user schema with additional details"""

    last_login: Optional[datetime] = None
    is_active: bool = True

    model_config = ConfigDict(from_attributes=True)


# ----- Password Schemas -----


class PasswordChangeSchema(BaseModel):
    """Schema for password change"""

    current_password: str = Field(..., description="Current password")
    new_password: str = Field(
        ...,
        min_length=8,
        max_length=128,
        description="New password with strength requirements",
    )
    confirm_new_password: str = Field(..., description="Confirm new password")

    @validator("new_password")
    def validate_new_password(cls, v):
        """Validate new password strength"""
        if len(v) < 8:
            raise ValueError("New password must be at least 8 characters long")

        if len(v) > 128:
            raise ValueError("New password must be less than 128 characters")

        # Check for at least one uppercase, lowercase, and digit
        has_upper = any(c.isupper() for c in v)
        has_lower = any(c.islower() for c in v)
        has_digit = any(c.isdigit() for c in v)

        if not (has_upper and has_lower and has_digit):
            raise ValueError(
                "New password must contain at least one uppercase letter, "
                "one lowercase letter, and one number"
            )

        return v

    @validator("confirm_new_password")
    def passwords_match(cls, v, values):
        """Validate that new passwords match"""
        if "new_password" in values and v != values["new_password"]:
            raise ValueError("New passwords do not match")
        return v

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "current_password": "CurrentPass123",
                "new_password": "NewSecurePass456",
                "confirm_new_password": "NewSecurePass456",
            }
        }
    )


class PasswordResetRequestSchema(BaseModel):
    """Schema for password reset request"""

    email: EmailStr = Field(..., description="Email address to send reset link")

    model_config = ConfigDict(
        json_schema_extra={"example": {"email": "user@example.com"}}
    )


class PasswordResetSchema(BaseModel):
    """Schema for password reset confirmation"""

    token: str = Field(..., description="Password reset token")
    new_password: str = Field(
        ..., min_length=8, max_length=128, description="New password"
    )
    confirm_password: str = Field(..., description="Confirm new password")

    @validator("new_password")
    def validate_password(cls, v):
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")

        if len(v) > 128:
            raise ValueError("Password must be less than 128 characters")

        has_upper = any(c.isupper() for c in v)
        has_lower = any(c.islower() for c in v)
        has_digit = any(c.isdigit() for c in v)

        if not (has_upper and has_lower and has_digit):
            raise ValueError(
                "Password must contain at least one uppercase letter, "
                "one lowercase letter, and one number"
            )

        return v

    @validator("confirm_password")
    def passwords_match(cls, v, values):
        """Validate that passwords match"""
        if "new_password" in values and v != values["new_password"]:
            raise ValueError("Passwords do not match")
        return v


# ----- Session/Token Schemas -----


class SessionSchema(BaseModel):
    """Schema for user session information"""

    id: int
    token_preview: str
    created_at: datetime
    expires_at: datetime
    is_current: bool = False

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "example": {
                "id": 123,
                "token_preview": "abc12345...",
                "created_at": "2024-01-15T10:30:00Z",
                "expires_at": "2024-01-15T11:30:00Z",
                "is_current": True,
            }
        },
    )


# ----- Admin Schemas -----


class UserListSchema(BaseModel):
    """Schema for paginated user list"""

    users: list[UserOutSchema]
    total: int
    page: int
    per_page: int
    has_next: bool
    has_prev: bool

    model_config = ConfigDict(from_attributes=True)


class AdminUserCreateSchema(UserBaseSchema):
    """Schema for admin user creation"""

    password: str = Field(..., min_length=8, max_length=128)
    user_type_id: int = Field(..., description="User type ID")
    is_active: bool = Field(default=True, description="User active status")

    @validator("password")
    def validate_password(cls, v):
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")

        has_upper = any(c.isupper() for c in v)
        has_lower = any(c.islower() for c in v)
        has_digit = any(c.isdigit() for c in v)

        if not (has_upper and has_lower and has_digit):
            raise ValueError(
                "Password must contain at least one uppercase letter, "
                "one lowercase letter, and one number"
            )

        return v


class AdminUserUpdateSchema(BaseModel):
    """Schema for admin user updates"""

    first_name: Optional[str] = Field(None, min_length=1, max_length=100)
    last_name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    user_type_id: Optional[int] = None
    is_active: Optional[bool] = None

    @validator("first_name", "last_name")
    def validate_names(cls, v):
        if v is not None:
            cleaned = v.strip()
            if not cleaned:
                raise ValueError("Name cannot be empty")
            return cleaned
        return v


# ----- Validation Schemas -----


class EmailValidationSchema(BaseModel):
    """Schema for email validation"""

    email: EmailStr

    @validator("email")
    def validate_email_format(cls, v):
        email_str = str(v).lower().strip()
        if len(email_str) > 254:
            raise ValueError("Email address is too long")
        return email_str


class PaginationSchema(BaseModel):
    """Schema for pagination parameters"""

    page: int = Field(default=1, ge=1, description="Page number (1-based)")
    per_page: int = Field(
        default=20, ge=1, le=100, description="Items per page (1-100)"
    )

    @validator("per_page")
    def validate_per_page(cls, v):
        if v > 100:
            raise ValueError("Maximum 100 items per page")
        return v


# ----- Metrics Schema -----


class MetricsSchema(BaseModel):
    """Schema for application metrics"""

    users_total: int
    active_sessions: int
    environment: str
    uptime_seconds: Optional[float] = None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "users_total": 1250,
                "active_sessions": 45,
                "environment": "production",
                "uptime_seconds": 3600.5,
            }
        }
    )


# ----- Request/Response Wrappers -----


class APIResponse(BaseModel):
    """Generic API response wrapper"""

    success: bool = True
    data: Optional[Any] = None
    message: Optional[str] = None
    errors: Optional[Dict[str, Any]] = None
    meta: Optional[Dict[str, Any]] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "success": True,
                "data": {"id": 1, "name": "example"},
                "message": "Operation completed successfully",
                "errors": None,
                "meta": {"total": 1, "page": 1},
                "timestamp": "2024-01-15T10:30:00Z",
            }
        }
    )


class PaginatedResponse(BaseModel):
    """Paginated response wrapper"""

    data: list
    pagination: Dict[str, Any]
    success: bool = True

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "data": [{"id": 1, "name": "item1"}],
                "pagination": {
                    "page": 1,
                    "per_page": 20,
                    "total": 1,
                    "has_next": False,
                    "has_prev": False,
                },
                "success": True,
            }
        }
    )


class ProjectCreateSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    project_type: ProjectType = ProjectType.WEB_APP
    features: List[str] = Field(default=[], description="List of feature names")
    config: Dict[str, Any] = Field(default={})
    working_directory: Optional[str] = None
    include_imports: bool = True


class ProjectFeatureSchema(BaseModel):
    """User-friendly feature representation"""

    name: str
    description: str
    category: str
    complexity: str
    icon: Optional[str] = None


class ProjectUpdateSchema(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    project_type: Optional[ProjectType] = None
    tokens: Optional[List[str]] = None
    config: Optional[Dict[str, Any]] = None
    working_directory: Optional[str] = None
    include_imports: Optional[bool] = None


class ProjectOutSchema(BaseModel):
    id: int
    name: str
    description: Optional[str]
    project_type: ProjectType
    tokens: List[str]
    status: ProjectStatus
    config: Dict[str, Any]
    working_directory: Optional[str]
    include_imports: bool
    generation_count: int
    last_generated_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime
    user_id: int

    model_config = {"from_attributes": True}


class ProjectGenerateSchema(BaseModel):
    tokens: Optional[List[str]] = None  # Override project tokens
    config: Optional[Dict[str, Any]] = None  # Override project config
    async_generation: bool = True  # Run generation in background


class ProjectGenerationOutSchema(BaseModel):
    id: int
    project_id: int
    status: GenerationStatus
    tokens_used: List[str]
    output_path: Optional[str]
    error_message: Optional[str]
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    generation_time_seconds: Optional[float]
    files_generated: int
    lines_of_code: int

    model_config = {"from_attributes": True}


# ==================== TOKEN SCHEMAS ====================


class TokenDefinitionOutSchema(BaseModel):
    token: str
    name: str
    description: str
    category: TokenCategory
    complexity: TokenComplexity
    dependencies: List[str]
    conflicts_with: List[str]
    example_usage: Optional[str]
    usage_count: int

    model_config = {"from_attributes": True}


class TokenSearchSchema(BaseModel):
    query: Optional[str] = None
    category: Optional[TokenCategory] = None
    complexity: Optional[TokenComplexity] = None
    limit: int = Field(default=50, le=200)


class TokenValidationSchema(BaseModel):
    tokens: List[str]


class TokenValidationResultSchema(BaseModel):
    is_valid: bool
    errors: List[str] = []
    warnings: List[str] = []
    suggestions: List[str] = []
    missing_dependencies: List[str] = []
    conflicts: List[str] = []


class TokenCombinationCreateSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    tokens: List[str] = Field(..., min_items=1)
    category: Optional[TokenCategory] = None
    is_public: bool = False


class TokenCombinationOutSchema(BaseModel):
    id: int
    name: str
    description: Optional[str]
    tokens: List[str]
    category: Optional[TokenCategory]
    is_public: bool
    usage_count: int
    created_at: datetime
    user_id: int

    model_config = {"from_attributes": True}


# ==================== AI SCHEMAS ====================


class AIProjectFromDescriptionSchema(BaseModel):
    description: str = Field(..., min_length=10, max_length=2000)
    project_type: Optional[ProjectType] = None
    complexity_preference: Optional[TokenComplexity] = None


class AIProjectFromDescriptionResultSchema(BaseModel):
    suggested_name: str
    suggested_description: str
    suggested_tokens: List[str]
    confidence: float
    reasoning: str
    project_type: ProjectType


class AIChatMessageSchema(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    project_id: Optional[int] = None
    conversation_id: Optional[int] = None


class AIChatResponseSchema(BaseModel):
    response: str
    suggestions: List[str] = []
    suggested_features: List[str] = []
    conversation_id: int


class AIInsightOutSchema(BaseModel):
    id: int
    insight_type: AIInsightType
    content: str
    confidence: float
    metadata: Dict[str, Any]
    is_applied: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ==================== USER ENHANCEMENT SCHEMAS ====================


class UserActivityOutSchema(BaseModel):
    id: int
    activity_type: str
    description: str
    project_id: Optional[int]
    metadata: Dict[str, Any]
    created_at: datetime

    model_config = {"from_attributes": True}


class UserAnalyticsOutSchema(BaseModel):
    date: datetime
    projects_created: int
    generations_run: int
    tokens_used: int
    time_spent_minutes: int
    weekly_projects: int
    monthly_projects: int

    model_config = {"from_attributes": True}


# ==================== FILE SCHEMAS ====================


class FileUploadResponseSchema(BaseModel):
    id: int
    filename: str
    file_path: str
    file_type: FileType
    file_size: int
    mime_type: Optional[str]
    uploaded_at: datetime


class ProjectFileOutSchema(BaseModel):
    id: int
    project_id: int
    filename: str
    file_path: str
    file_type: FileType
    file_size: int
    mime_type: Optional[str]
    checksum: Optional[str]
    is_generated: bool
    uploaded_at: datetime

    model_config = {"from_attributes": True}


# ==================== ANALYTICS SCHEMAS ====================


class DashboardStatsSchema(BaseModel):
    total_projects: int
    active_projects: int
    completed_projects: int
    total_generations: int
    favorite_tokens: List[Dict[str, Any]]
    recent_activity: List[UserActivityOutSchema]
    usage_over_time: List[Dict[str, Any]]


class TokenAnalyticsSchema(BaseModel):
    token: str
    name: str
    usage_count: int
    success_rate: float
    avg_generation_time: float
    most_combined_with: List[str]


class PerformanceMetricsSchema(BaseModel):
    avg_generation_time: float
    success_rate: float
    most_popular_tokens: List[TokenAnalyticsSchema]
    project_type_distribution: Dict[str, int]
    monthly_usage: List[Dict[str, Any]]


class SystemHealthSchema(BaseModel):
    overall_status: str
    services: List["SystemStatusSchema"]
    version: str
    uptime: int
    last_updated: datetime


class SystemStatusSchema(BaseModel):
    service: str
    status: str  # "healthy", "degraded", "down"
    response_time: Optional[float] = None
    last_checked: datetime


class DashboardAnalyticsSchema(BaseModel):
    total_projects: int
    recent_projects: int
    total_generations: int
    successful_generations: int
    success_rate: float
    most_used_project_type: Optional[str]
    recent_activity_count: int
    period_days: int


class ProjectAnalyticsSchema(BaseModel):
    project_id: int
    project_name: str
    project_type: str
    total_generations: int
    successful_generations: int
    success_rate: float
    avg_generation_time: float
    tokens_used: int
    last_generated_at: Optional[datetime]
    created_at: datetime


class UsageAnalyticsSchema(BaseModel):
    daily_token_usage: List[Dict[str, Any]]
    top_tokens: List[Dict[str, Any]]
    daily_generations: List[Dict[str, Any]]
    period_days: int


# ==================== WebSocket & Real-time Schemas ====================


class WebSocketMessageSchema(BaseModel):
    type: str
    data: Dict
    timestamp: Optional[datetime] = None


class GenerationProgressSchema(BaseModel):
    project_id: int
    generation_id: int
    status: str
    progress_percentage: float
    current_step: str
    estimated_time_remaining: Optional[int] = None
    logs: List[str] = []


# ==================== Enhanced Project Schemas ====================


class ProjectExportSchema(BaseModel):
    format: str = "json"  # "json", "yaml", "zip"
    include_files: bool = True
    include_history: bool = False


class ProjectImportSchema(BaseModel):
    project_data: Dict
    import_files: bool = True
    overwrite_existing: bool = False


class ProjectShareSchema(BaseModel):
    share_type: str = "read"  # "read", "write", "admin"
    expires_at: Optional[datetime] = None
    password_protected: bool = False
    password: Optional[str] = None


# ==================== Token Enhancement Schemas ====================


class TokenSuggestionSchema(BaseModel):
    token: str
    name: str
    confidence: float
    reasoning: str
    category: str


class TokenExampleSchema(BaseModel):
    title: str
    description: str
    code_snippet: str
    language: str
    tokens_used: List[str]


class TokenCombinationSaveSchema(BaseModel):
    name: str
    description: str
    tokens: List[str]
    category: Optional[str] = None
    is_public: bool = False


class HealthCheckSchema(BaseModel):
    status: str
    environment: str
    version: str
    database: str
    timestamp: datetime


class UserPreferencesOutSchema(BaseModel):
    theme: str
    language: str
    timezone: str
    email_notifications: bool
    push_notifications: bool
    notification_frequency: str
    default_project_type: str
    default_include_imports: bool
    favorite_tokens: List[str]
    ai_assistance_level: str
    auto_suggest_tokens: bool
    updated_at: datetime

    class Config:
        from_attributes = True


class UserPreferencesUpdateSchema(BaseModel):
    theme: Optional[str] = Field(None, pattern="^(light|dark|auto)$")
    language: Optional[str] = None
    timezone: Optional[str] = None
    email_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None
    notification_frequency: Optional[str] = Field(
        None, pattern="^(immediate|daily|weekly|never)$"
    )
    default_project_type: Optional[str] = None
    default_include_imports: Optional[bool] = None
    favorite_tokens: Optional[List[str]] = None
    ai_assistance_level: Optional[str] = Field(
        None, pattern="^(minimal|balanced|aggressive)$"
    )
    auto_suggest_tokens: Optional[bool] = None


class UserActivitySchema(BaseModel):
    id: int
    activity_type: str
    description: str
    project_id: Optional[int]
    meta_data: Optional[Dict]  # Changed from metadata
    created_at: datetime

    class Config:
        from_attributes = True


class NotificationSchema(BaseModel):
    id: int
    type: str
    title: str
    message: str
    read: bool
    meta_data: Optional[Dict[str, Any]] = None  # Changed from metadata
    project_id: Optional[int] = None
    generation_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ErrorReportSchema(BaseModel):
    error_type: str
    message: str
    stack_trace: Optional[str] = None
    context: Optional[Dict] = None
    user_agent: Optional[str] = None
    url: Optional[str] = None


class FeedbackSchema(BaseModel):
    type: str  # "bug", "feature", "general"
    message: str
    rating: Optional[int] = None
    category: Optional[str] = None
    meta_data: Optional[Dict] = None  # Changed from metadata


# ==================== TEMPLATE SCHEMAS ====================


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


class ProjectTemplateOutSchema(BaseModel):
    """Updated schema for SEVDO template format"""

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

    model_config = {"from_attributes": True}


# Template Use Schema (updated)
class TemplateUseSchema(BaseModel):
    project_name: str = Field(..., min_length=1, max_length=200)
    project_description: Optional[str] = None
    customize_config: Optional[Dict[str, Any]] = None
