"""
RAG Integration Helper for SEVDO Agent System
Connects the agent system with the RAG knowledge base for smarter task planning.
"""

import sys
import os
from pathlib import Path
from typing import List, Dict, Any, Optional
import logging

# Add sevdo_frontend to path for RAG imports
project_root = Path(__file__).parent.parent
sevdo_frontend_path = project_root / "sevdo_frontend"
if str(sevdo_frontend_path) not in sys.path:
    sys.path.append(str(sevdo_frontend_path))

try:
    from sevdo_frontend.rag.similarity_search import SimilaritySearchService
    from sevdo_frontend.rag.embeddings import EmbeddingsService

    RAG_AVAILABLE = True
except ImportError as e:
    print(f"RAG system not available: {e}")
    RAG_AVAILABLE = False

logger = logging.getLogger(__name__)


class AgentRAGService:
    """RAG service specifically designed for agent system integration."""

    def __init__(self, knowledge_base_dir: str = "knowledge_base_RAG"):
        self.rag_service = None
        self.is_initialized = False

        if RAG_AVAILABLE:
            try:
                # Use relative path from project root
                kb_path = project_root / knowledge_base_dir
                self.rag_service = SimilaritySearchService(str(kb_path))
                self.is_initialized = self.rag_service.initialize()
                if self.is_initialized:
                    logger.info(
                        "RAG service successfully initialized for agents"
                    )
                else:
                    logger.warning("RAG service initialization failed")
            except Exception as e:
                logger.error(f"Failed to initialize RAG service: {e}")
        else:
            logger.warning(
                "RAG system not available - running without RAG integration"
            )

    def get_relevant_context(
        self, task_description: str, top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """Get relevant context from RAG system for a task description."""
        if not self.is_initialized or not self.rag_service:
            return []

        try:
            search_results = self.rag_service.search(
                task_description, top_k=top_k
            )

            context_items = []
            for result in search_results:
                context_items.append(
                    {
                        "title": result.document.title,
                        "content": result.matching_chunks[0][0]
                        if result.matching_chunks
                        else "",
                        "similarity": result.similarity_score,
                        "doc_id": result.document.doc_id,
                    }
                )

            return context_items

        except Exception as e:
            logger.error(f"RAG search failed: {e}")
            return []

    def _get_backend_tokens(self) -> List[str]:
        """Get backend-specific tokens from knowledge base."""
        import re
        backend_tokens = []
        if self.rag_service:
            for doc in self.rag_service.documents:
                if "backend" in doc.title.lower():
                    tokens = re.findall(r'^- ([a-z]+):', doc.content, re.MULTILINE)
                    backend_tokens.extend(tokens)
        return list(set(backend_tokens))
    
    def _get_frontend_tokens(self) -> List[str]:
        """Get frontend-specific tokens from knowledge base."""
        import re
        frontend_tokens = []
        if self.rag_service:
            for doc in self.rag_service.documents:
                if "frontend" in doc.title.lower():
                    tokens = re.findall(r'^- ([a-z]+):', doc.content, re.MULTILINE)
                    frontend_tokens.extend(tokens)
        return list(set(frontend_tokens))

    def suggest_tokens(self, task_description: str) -> List[str]:
        """Suggest relevant SEVDO tokens based on task description with context filtering."""
        task_lower = task_description.lower()
        
        # Determine if this is backend or frontend focused
        is_backend = any(keyword in task_lower for keyword in [
            "api", "endpoint", "backend", "server", "database", "auth", "login system", "registration system"
        ])
        
        is_frontend = any(keyword in task_lower for keyword in [
            "html", "page", "form", "ui", "frontend", "website", "structure", "layout", "button", "input", "field", "username", "password", "text", "header", "navigation"
        ])
        
        # Get context-appropriate tokens
        if is_backend and not is_frontend:
            available_tokens = self._get_backend_tokens()
        elif is_frontend and not is_backend:
            available_tokens = self._get_frontend_tokens()
        else:
            # Mixed or unclear context - use both but prioritize based on keywords
            available_tokens = self._get_frontend_tokens() + self._get_backend_tokens()
        
        context = self.get_relevant_context(task_description)
        suggested_tokens = []
        
        for item in context:
            content = item["content"].lower()

            # Context-aware token suggestions
            if is_backend or ("api" in task_lower or "backend" in task_lower):
                # Backend-focused suggestions
                if "login" in content or "authentication" in content:
                    suggested_tokens.extend(["l", "r", "m"])
                if "logout" in content:
                    suggested_tokens.append("o")
                if "session" in content:
                    suggested_tokens.extend(["t", "s"])  # Backend 't' for refresh token
                    
            if is_frontend or ("html" in task_lower or "page" in task_lower or "form" in task_lower):
                # Frontend-focused suggestions
                if "login form" in content or ("login" in content and "form" in content):
                    suggested_tokens.append("lf")
                if "register form" in content or ("register" in content and "form" in content):
                    suggested_tokens.append("rf")
                if "contact form" in content:
                    suggested_tokens.append("cf")
                if "form" in content:
                    suggested_tokens.extend(["i", "b"])
                if "page" in content or "website" in content:
                    suggested_tokens.extend(["h", "t", "n"])  # Frontend 't' for text
                if "button" in content:
                    suggested_tokens.append("b")
                if "input" in content or "field" in content:
                    suggested_tokens.append("i")
                    
        # Direct task-based suggestions (regardless of RAG context)
        if is_frontend:
            if "username" in task_lower or "password" in task_lower or "field" in task_lower:
                suggested_tokens.append("i")  # input field
            if "login" in task_lower and "form" in task_lower:
                suggested_tokens.append("lf")
            if "button" in task_lower or "submit" in task_lower:
                suggested_tokens.append("b")
            if "header" in task_lower or "title" in task_lower:
                suggested_tokens.append("h")

        # Filter suggestions to only include available tokens
        filtered_tokens = [token for token in suggested_tokens if token in available_tokens]
        
        # Remove duplicates while preserving order
        seen = set()
        unique_tokens = []
        for token in filtered_tokens:
            if token not in seen:
                seen.add(token)
                unique_tokens.append(token)

        return unique_tokens

    def get_all_tokens(self) -> List[str]:
        """Get all valid SEVDO tokens from knowledge base (both backend and frontend)."""
        return self._get_backend_tokens() + self._get_frontend_tokens()

    def get_service_info(self) -> Dict[str, Any]:
        """Get information about RAG service status."""
        return {
            "rag_available": RAG_AVAILABLE,
            "initialized": self.is_initialized,
            "service_info": self.rag_service.get_info()
            if self.rag_service
            else None,
        }
