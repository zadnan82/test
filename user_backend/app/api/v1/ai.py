from datetime import datetime, timezone
from typing import Any, Dict, List
from fastapi import APIRouter, Depends, HTTPException, status
import json

from sqlalchemy.orm import Session
from sqlalchemy import select

from user_backend.app.models import (
    AIConversation,
    ProjectType,
    User,
    Project,
)
from user_backend.app.schemas import (
    AIChatMessageSchema,
    AIChatResponseSchema,
    AIProjectFromDescriptionResultSchema,
    AIProjectFromDescriptionSchema,
    ProjectFeatureSchema,
)
from user_backend.app.core.security import get_current_active_user
from user_backend.app.db_setup import get_db
from user_backend.app.core.logging_config import StructuredLogger

router = APIRouter()
logger = StructuredLogger(__name__)

# Feature mapping: tokens to user-friendly features
FEATURE_MAPPING = {
    # Authentication features
    "r": ProjectFeatureSchema(
        name="User Registration",
        description="Allow users to create accounts with email and password",
        category="User Management",
        complexity="Basic",
        icon="👤",
    ),
    "l": ProjectFeatureSchema(
        name="User Login",
        description="Secure user authentication and session management",
        category="User Management",
        complexity="Basic",
        icon="🔐",
    ),
    "m": ProjectFeatureSchema(
        name="User Profiles",
        description="User profile management and account information",
        category="User Management",
        complexity="Basic",
        icon="👤",
    ),
    "o": ProjectFeatureSchema(
        name="User Logout",
        description="Secure user logout and session cleanup",
        category="User Management",
        complexity="Basic",
        icon="🚪",
    ),
    "u": ProjectFeatureSchema(
        name="Profile Updates",
        description="Allow users to update their profile information",
        category="User Management",
        complexity="Intermediate",
        icon="✏️",
    ),
    # Session management
    "t": ProjectFeatureSchema(
        name="Session Management",
        description="Advanced session handling and token refresh",
        category="Security",
        complexity="Advanced",
        icon="🔄",
    ),
    "a": ProjectFeatureSchema(
        name="Multi-Device Logout",
        description="Logout from all devices and sessions",
        category="Security",
        complexity="Advanced",
        icon="📱",
    ),
    "s": ProjectFeatureSchema(
        name="Session Monitoring",
        description="View and manage active user sessions",
        category="Security",
        complexity="Advanced",
        icon="📊",
    ),
    # Website features
    "c": ProjectFeatureSchema(
        name="Contact Form",
        description="Contact form with email notifications",
        category="Communication",
        complexity="Basic",
        icon="📧",
    ),
    "b": ProjectFeatureSchema(
        name="Blog System",
        description="Content management system for blog posts and news",
        category="Content",
        complexity="Intermediate",
        icon="📝",
    ),
    "e": ProjectFeatureSchema(
        name="E-commerce",
        description="Online store with shopping cart and payments",
        category="E-commerce",
        complexity="Advanced",
        icon="🛒",
    ),
    "f": ProjectFeatureSchema(
        name="File Upload",
        description="File upload and management system",
        category="File Management",
        complexity="Intermediate",
        icon="📁",
    ),
}

# AI suggestion logic: description keywords to tokens
DESCRIPTION_TO_TOKENS = {
    # E-commerce keywords
    "shop": ["r", "l", "m", "e", "c"],
    "store": ["r", "l", "m", "e", "c"],
    "ecommerce": ["r", "l", "m", "e", "c"],
    "e-commerce": ["r", "l", "m", "e", "c"],
    "buy": ["r", "l", "m", "e"],
    "sell": ["r", "l", "m", "e"],
    "cart": ["r", "l", "e"],
    "payment": ["r", "l", "e"],
    # Restaurant keywords
    "restaurant": ["c", "b", "f"],
    "menu": ["b", "c"],
    "food": ["c", "b"],
    "order": ["r", "l", "e", "c"],
    # Blog/Content keywords
    "blog": ["b", "c"],
    "news": ["b", "c"],
    "article": ["b"],
    "content": ["b"],
    "post": ["b"],
    # Business keywords
    "business": ["c", "b", "f"],
    "company": ["c", "b", "f"],
    "corporate": ["c", "b", "f"],
    # Portfolio keywords
    "portfolio": ["c", "f", "b"],
    "gallery": ["f", "b"],
    "showcase": ["f", "b"],
    # User account keywords
    "login": ["r", "l", "m", "o"],
    "register": ["r", "l", "m"],
    "account": ["r", "l", "m", "u"],
    "user": ["r", "l", "m"],
    "profile": ["r", "l", "m", "u"],
    # Contact keywords
    "contact": ["c"],
    "email": ["c"],
    "form": ["c"],
}


def suggest_tokens_from_description(
    description: str, project_type: ProjectType = None
) -> List[str]:
    """AI-powered token suggestion based on description"""
    description_lower = description.lower()
    suggested_tokens = set()

    # Analyze keywords in description
    for keyword, tokens in DESCRIPTION_TO_TOKENS.items():
        if keyword in description_lower:
            suggested_tokens.update(tokens)

    # Add default tokens based on project type
    if project_type == ProjectType.WEB_APP:
        suggested_tokens.update(["c"])  # Most websites need contact
    elif project_type == ProjectType.API_BACKEND:
        suggested_tokens.update(["r", "l", "m"])  # APIs usually need auth

    # Convert to list and ensure logical dependencies
    tokens = list(suggested_tokens)

    # Add dependencies
    if "e" in tokens and "r" not in tokens:  # E-commerce needs user accounts
        tokens.extend(["r", "l", "m"])
    if "u" in tokens and "l" not in tokens:  # Profile updates need login
        tokens.extend(["r", "l", "m"])

    return list(set(tokens))  # Remove duplicates


def tokens_to_features(tokens: List[str]) -> List[ProjectFeatureSchema]:
    """Convert internal tokens to user-friendly features"""
    features = []
    for token in tokens:
        if token in FEATURE_MAPPING:
            features.append(FEATURE_MAPPING[token])
    return features


def validate_token_combination(tokens: List[str]) -> dict:
    """Validate that tokens work together"""
    errors = []
    warnings = []
    suggestions = []

    # Check for required dependencies
    if "e" in tokens and "r" not in tokens:
        suggestions.append("E-commerce usually requires user accounts")
    if "u" in tokens and ("r" not in tokens or "l" not in tokens):
        errors.append("Profile updates require user registration and login")

    # Check for conflicts (none currently defined)

    return {
        "is_valid": len(errors) == 0,
        "errors": errors,
        "warnings": warnings,
        "suggestions": suggestions,
    }


@router.post(
    "/project-from-description", response_model=AIProjectFromDescriptionResultSchema
)
async def create_project_from_description(
    ai_request: AIProjectFromDescriptionSchema,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Convert natural language description to project features (not tokens)"""
    try:
        logger.info(
            f"AI project generation request from user {current_user.id}",
            description=ai_request.description,
            project_type=ai_request.project_type,
        )

        # Use AI to suggest tokens based on description
        suggested_tokens = suggest_tokens_from_description(
            ai_request.description, ai_request.project_type
        )

        # Validate token combination
        validation = validate_token_combination(suggested_tokens)

        if not validation["is_valid"]:
            # Fix issues automatically where possible
            if "e" in suggested_tokens and "r" not in suggested_tokens:
                suggested_tokens.extend(["r", "l", "m"])
                validation = validate_token_combination(suggested_tokens)

        # Convert tokens to user-friendly features
        suggested_features = tokens_to_features(suggested_tokens)

        # Generate project name from description
        words = ai_request.description.split()[:3]
        suggested_name = " ".join(word.capitalize() for word in words)
        if len(suggested_name) < 5:
            suggested_name += " Website"

        # Calculate confidence based on keyword matches
        confidence = min(0.95, 0.4 + (len(suggested_tokens) * 0.1))

        # Create reasoning
        feature_names = [f.name for f in suggested_features]
        reasoning = f"Based on your description, I suggest these features: {', '.join(feature_names)}"

        # Store tokens in project internally (create the project)
        new_project = Project(
            name=suggested_name,
            description=ai_request.description,
            project_type=ai_request.project_type or ProjectType.WEB_APP,
            tokens=suggested_tokens,  # Store tokens internally
            user_id=current_user.id,
        )

        db.add(new_project)
        db.commit()
        db.refresh(new_project)

        logger.info(
            f"AI project created successfully",
            project_id=new_project.id,
            suggested_tokens=suggested_tokens,
            confidence=confidence,
        )

        return AIProjectFromDescriptionResultSchema(
            suggested_name=suggested_name,
            suggested_description=ai_request.description,
            suggested_features=suggested_features,  # Return features, not tokens
            confidence=confidence,
            reasoning=reasoning,
            project_type=ai_request.project_type or ProjectType.WEB_APP,
        )

    except Exception as e:
        logger.error(f"AI project generation failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process project description",
        )


@router.post("/chat", response_model=AIChatResponseSchema)
async def ai_chat(
    chat_request: AIChatMessageSchema,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Enhanced AI chat with better responses"""
    try:
        # Find or create conversation
        conversation_id = chat_request.conversation_id
        if not conversation_id:
            conversation = AIConversation(
                user_id=current_user.id, project_id=chat_request.project_id
            )
            db.add(conversation)
            db.commit()
            db.refresh(conversation)
            conversation_id = conversation.id
        else:
            conversation = db.execute(
                select(AIConversation).where(AIConversation.id == conversation_id)
            ).scalar_one_or_none()

            if not conversation:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Conversation not found",
                )

        # Add user message to conversation
        conversation.messages.append(
            {
                "role": "user",
                "content": chat_request.message,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        )

        # Analyze message for feature suggestions
        suggested_tokens = suggest_tokens_from_description(chat_request.message)
        suggested_features = tokens_to_features(suggested_tokens)

        # Generate contextual AI response
        if suggested_tokens:
            feature_names = [f.name for f in suggested_features]
            response_content = f"Great idea! For '{chat_request.message}', I recommend adding: {', '.join(feature_names)}. "
            response_content += "These features will work well together and provide a complete solution."
        else:
            response_content = (
                f"I understand you want to {chat_request.message.lower()}. "
            )
            response_content += "Can you provide more details about the specific functionality you need?"

        # Add AI response to conversation
        conversation.messages.append(
            {
                "role": "assistant",
                "content": response_content,
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "suggested_features": [f.dict() for f in suggested_features],
            }
        )

        db.commit()

        # Generate follow-up suggestions
        suggestions = [
            "What specific features do you need?",
            "Should users be able to create accounts?",
            "Do you need a contact form?",
            "Will you need file uploads?",
        ]

        return AIChatResponseSchema(
            response=response_content,
            suggestions=suggestions,
            suggested_tokens=suggested_tokens,  # Keep for backward compatibility
            conversation_id=conversation_id,
        )

    except Exception as e:
        logger.error(f"AI chat failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI chat processing failed",
        )


@router.post("/analyze-website-description")
async def analyze_website_description(
    request: Dict[str, Any],
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    """Analyze user description and detect website components"""
    try:
        description = request.get("description", "")
        analysis_type = request.get("analysis_type", "website_components")

        # Your AI analysis logic here
        # This could integrate with OpenAI, Claude, or your own ML model

        # For now, return structured analysis
        detected_elements = analyze_description_advanced(description)

        return {
            "success": True,
            "detected_elements": detected_elements,
            "confidence": 0.85,
            "suggestions": [
                "Consider adding more details about your target audience",
                "Specify the main goal of your website",
            ],
        }

    except Exception as e:
        logger.error(f"Website description analysis failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Analysis failed"
        )


def analyze_description_advanced(description: str) -> dict:
    """Advanced description analysis with business intelligence"""
    # Implement your AI logic here
    # This is where you'd integrate with your preferred AI service

    return {
        "navigation": True,
        "hero": True,
        "services": "service" in description.lower(),
        "contact": "contact" in description.lower(),
        "businessType": detect_business_type(description),
    }


def detect_business_type(description: str) -> str:
    """Detect the type of business from description"""
    desc_lower = description.lower()

    business_keywords = {
        "restaurant": ["restaurant", "food", "menu", "dining"],
        "medical": ["doctor", "medical", "health", "clinic"],
        "ecommerce": ["shop", "store", "products", "buy"],
        "portfolio": ["portfolio", "work", "showcase", "gallery"],
        # Add more business types as needed
    }

    for business_type, keywords in business_keywords.items():
        if any(keyword in desc_lower for keyword in keywords):
            return business_type

    return "general"
