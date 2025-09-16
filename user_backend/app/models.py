from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional, Any, Dict
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import JSONB, ARRAY
from sqlalchemy import (
    Boolean,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Float,
    Text,
    UniqueConstraint,
    func,
    Enum as SQLEnum,
)


# ----- Base (for common fields) -----


class Base(DeclarativeBase):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)


# ----- Token -----


class Token(Base):
    __tablename__ = "tokens"

    id: Mapped[int] = mapped_column(primary_key=True)
    token: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    expire_date: Mapped[datetime] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )

    # Relationship
    user: Mapped["User"] = relationship(back_populates="tokens")


# ----- User -----


class UserType(Base):
    """User type model, e.g., admin, regular user, guest."""

    __tablename__ = "user_types"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    # Relationship
    users: Mapped[List["User"]] = relationship()

    def __repr__(self) -> str:
        return f"<UserType {self.name}>"


class User(Base):
    """User model for the platform"""

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(100), index=True)
    last_name: Mapped[str] = mapped_column(String(100), index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    user_type_id: Mapped[int] = mapped_column(
        ForeignKey("user_types.id", ondelete="SET NULL"),
        nullable=True,
        server_default="1",
    )

    # Relationships
    user_type: Mapped["UserType"] = relationship(back_populates="users")
    tokens: Mapped[List["Token"]] = relationship(back_populates="user")
    # New relationships for enhanced features
    projects: Mapped[List["Project"]] = relationship(
        back_populates="user", cascade="all, delete-orphan"
    )
    preferences: Mapped[Optional["UserPreferences"]] = relationship(
        "UserPreferences", uselist=False
    )
    activities: Mapped[List["UserActivity"]] = relationship(
        "UserActivity", cascade="all, delete-orphan"
    )
    analytics: Mapped[List["UserAnalytics"]] = relationship(
        "UserAnalytics", cascade="all, delete-orphan"
    )
    ai_conversations: Mapped[List["AIConversation"]] = relationship(
        "AIConversation", cascade="all, delete-orphan"
    )
    ai_insights: Mapped[List["AIInsight"]] = relationship(
        "AIInsight", cascade="all, delete-orphan"
    )

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

    def __repr__(self) -> str:
        return f"<User {self.email} ({self.full_name})>"


class ProjectStatus(str, Enum):
    DRAFT = "draft"
    GENERATING = "generating"
    COMPLETED = "completed"
    FAILED = "failed"
    ARCHIVED = "archived"


class ProjectType(str, Enum):
    WEB_APP = "web_app"
    API_BACKEND = "api_backend"
    MOBILE_BACKEND = "mobile_backend"
    MICROSERVICE = "microservice"


class Project(Base):
    __tablename__ = "projects"

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    project_type: Mapped[ProjectType] = mapped_column(
        SQLEnum(ProjectType), default=ProjectType.WEB_APP
    )
    tokens: Mapped[List[str]] = mapped_column(ARRAY(String), default=[])
    status: Mapped[ProjectStatus] = mapped_column(
        SQLEnum(ProjectStatus), default=ProjectStatus.DRAFT
    )

    # Configuration
    config: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, default={})
    working_directory: Mapped[Optional[str]] = mapped_column(String(500))
    include_imports: Mapped[bool] = mapped_column(Boolean, default=True)

    # Metadata
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))

    # Generation tracking
    generation_count: Mapped[int] = mapped_column(Integer, default=0)
    last_generated_at: Mapped[Optional[datetime]] = mapped_column(DateTime)

    # Relationships
    user: Mapped["User"] = relationship(back_populates="projects")
    generations: Mapped[List["ProjectGeneration"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )
    files: Mapped[List["ProjectFile"]] = relationship(
        back_populates="project", cascade="all, delete-orphan"
    )

    def __repr__(self) -> str:
        return f"<Project {self.name} ({self.status})>"


class GenerationStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class ProjectGeneration(Base):
    __tablename__ = "project_generations"

    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE")
    )
    status: Mapped[GenerationStatus] = mapped_column(
        SQLEnum(GenerationStatus), default=GenerationStatus.PENDING
    )

    # Generation details
    tokens_used: Mapped[List[str]] = mapped_column(ARRAY(String), default=[])
    output_path: Mapped[Optional[str]] = mapped_column(String(500))
    error_message: Mapped[Optional[str]] = mapped_column(Text)
    logs: Mapped[Optional[str]] = mapped_column(Text)

    # Timing
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Metrics
    generation_time_seconds: Mapped[Optional[float]] = mapped_column(Float)
    files_generated: Mapped[int] = mapped_column(Integer, default=0)
    lines_of_code: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    project: Mapped["Project"] = relationship(back_populates="generations")


# ==================== TOKEN MANAGEMENT MODELS ====================


class TokenCategory(str, Enum):
    AUTHENTICATION = "authentication"
    SESSION_MANAGEMENT = "session_management"
    USER_MANAGEMENT = "user_management"
    DATA_MANAGEMENT = "data_management"
    API_OPERATIONS = "api_operations"
    FRONTEND_COMPONENTS = "frontend_components"
    DEPLOYMENT = "deployment"


class TokenComplexity(str, Enum):
    BASIC = "basic"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"


class TokenDefinition(Base):
    __tablename__ = "token_definitions"

    token: Mapped[str] = mapped_column(
        String(10), unique=True, index=True, nullable=False
    )
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[TokenCategory] = mapped_column(SQLEnum(TokenCategory))
    complexity: Mapped[TokenComplexity] = mapped_column(
        SQLEnum(TokenComplexity), default=TokenComplexity.BASIC
    )

    # Technical details
    dependencies: Mapped[List[str]] = mapped_column(ARRAY(String), default=[])
    conflicts_with: Mapped[List[str]] = mapped_column(ARRAY(String), default=[])
    code_template: Mapped[Optional[str]] = mapped_column(Text)

    # Metadata
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    usage_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Examples and documentation
    example_usage: Mapped[Optional[str]] = mapped_column(Text)
    documentation_url: Mapped[Optional[str]] = mapped_column(String(500))

    def __repr__(self) -> str:
        return f"<TokenDefinition {self.token}: {self.name}>"


class TokenCombination(Base):
    __tablename__ = "token_combinations"

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    tokens: Mapped[List[str]] = mapped_column(ARRAY(String), nullable=False)
    category: Mapped[Optional[TokenCategory]] = mapped_column(SQLEnum(TokenCategory))

    # Metadata
    is_public: Mapped[bool] = mapped_column(Boolean, default=False)
    usage_count: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))

    # Relationships
    user: Mapped["User"] = relationship("User")


class TokenUsage(Base):
    __tablename__ = "token_usage"

    token: Mapped[str] = mapped_column(String(10), nullable=False, index=True)
    project_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("projects.id", ondelete="SET NULL")
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    usage_count: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Context
    context: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, default={})


# ==================== TEMPLATE SYSTEM ====================


class ProjectTemplate(Base):
    __tablename__ = "project_templates"

    name: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    project_type: Mapped[ProjectType] = mapped_column(SQLEnum(ProjectType))
    tokens: Mapped[List[str]] = mapped_column(ARRAY(String), nullable=False)

    # Configuration
    config: Mapped[Dict[str, Any]] = mapped_column(JSONB, default={})
    preview_image_url: Mapped[Optional[str]] = mapped_column(String(500))

    # Metadata
    is_public: Mapped[bool] = mapped_column(Boolean, default=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False)
    usage_count: Mapped[int] = mapped_column(Integer, default=0)
    rating: Mapped[Optional[float]] = mapped_column(Float)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    created_by: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL")
    )

    # Tags for discovery
    tags: Mapped[List[str]] = mapped_column(ARRAY(String), default=[])


# ==================== AI INTEGRATION ====================


class AIConversation(Base):
    __tablename__ = "ai_conversations"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    project_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("projects.id", ondelete="SET NULL")
    )

    # Conversation data
    messages: Mapped[List[Dict[str, Any]]] = mapped_column(JSONB, default=[])
    context: Mapped[Dict[str, Any]] = mapped_column(JSONB, default={})

    # Status
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )


class AIInsightType(str, Enum):
    TOKEN_SUGGESTION = "token_suggestion"
    OPTIMIZATION = "optimization"
    BEST_PRACTICE = "best_practice"
    ERROR_DIAGNOSIS = "error_diagnosis"


class AIInsight(Base):
    __tablename__ = "ai_insights"

    insight_type: Mapped[AIInsightType] = mapped_column(SQLEnum(AIInsightType))
    content: Mapped[str] = mapped_column(Text, nullable=False)
    confidence: Mapped[float] = mapped_column(Float, default=0.0)

    # Context
    project_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE")
    )
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))

    # Metadata
    meta_data: Mapped[Dict[str, Any]] = mapped_column(JSONB, default={})
    is_applied: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


# ==================== FILE MANAGEMENT ====================


class FileType(str, Enum):
    SOURCE_CODE = "source_code"
    CONFIGURATION = "configuration"
    DOCUMENTATION = "documentation"
    ASSET = "asset"
    GENERATED = "generated"


class ProjectFile(Base):
    __tablename__ = "project_files"

    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id", ondelete="CASCADE")
    )
    filename: Mapped[str] = mapped_column(String(500), nullable=False)
    file_path: Mapped[str] = mapped_column(String(1000), nullable=False)
    file_type: Mapped[FileType] = mapped_column(SQLEnum(FileType))

    # File metadata
    file_size: Mapped[int] = mapped_column(Integer, default=0)
    mime_type: Mapped[Optional[str]] = mapped_column(String(100))
    checksum: Mapped[Optional[str]] = mapped_column(String(64))  # SHA-256

    # Metadata
    is_generated: Mapped[bool] = mapped_column(Boolean, default=False)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    project: Mapped["Project"] = relationship(back_populates="files")


# ==================== USER ENHANCEMENTS ====================


class UserPreferences(Base):
    __tablename__ = "user_preferences"

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True
    )

    # UI Preferences
    theme: Mapped[str] = mapped_column(String(20), default="light")
    language: Mapped[str] = mapped_column(String(10), default="en")
    timezone: Mapped[str] = mapped_column(String(50), default="UTC")

    # Notification preferences
    email_notifications: Mapped[bool] = mapped_column(Boolean, default=True)
    push_notifications: Mapped[bool] = mapped_column(Boolean, default=True)
    notification_frequency: Mapped[str] = mapped_column(String(20), default="immediate")

    # Default project settings
    default_project_type: Mapped[ProjectType] = mapped_column(
        SQLEnum(ProjectType), default=ProjectType.WEB_APP
    )
    default_include_imports: Mapped[bool] = mapped_column(Boolean, default=True)
    favorite_tokens: Mapped[List[str]] = mapped_column(ARRAY(String), default=[])

    # AI settings
    ai_assistance_level: Mapped[str] = mapped_column(
        String(20), default="balanced"
    )  # minimal, balanced, aggressive
    auto_suggest_tokens: Mapped[bool] = mapped_column(Boolean, default=True)

    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now()
    )


class UserActivity(Base):
    __tablename__ = "user_activities"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    activity_type: Mapped[str] = mapped_column(String(50), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False)

    # Context
    project_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("projects.id", ondelete="SET NULL")
    )
    meta_data: Mapped[Dict[str, Any]] = mapped_column(JSONB, default={})

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())


# ==================== ANALYTICS ====================


class UserAnalytics(Base):
    __tablename__ = "user_analytics"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    date: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    # Daily metrics
    projects_created: Mapped[int] = mapped_column(Integer, default=0)
    generations_run: Mapped[int] = mapped_column(Integer, default=0)
    tokens_used: Mapped[int] = mapped_column(Integer, default=0)
    time_spent_minutes: Mapped[int] = mapped_column(Integer, default=0)

    # Weekly/Monthly aggregates
    weekly_projects: Mapped[int] = mapped_column(Integer, default=0)
    monthly_projects: Mapped[int] = mapped_column(Integer, default=0)

    __table_args__ = (
        UniqueConstraint("user_id", "date", name="uq_user_analytics_date"),
    )


class Notification(Base):
    __tablename__ = "notifications"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    type: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # info, warning, error, success
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    read: Mapped[bool] = mapped_column(Boolean, default=False)

    # Optional metadata
    meta_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSONB, default={})

    # Related entities
    project_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("projects.id", ondelete="SET NULL")
    )
    generation_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("project_generations.id", ondelete="SET NULL")
    )

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # Relationships
    user: Mapped["User"] = relationship("User")
    project: Mapped[Optional["Project"]] = relationship("Project")
