"""
Custom exception hierarchy for the SEVDO RAG components.
"""


class RAGError(Exception):
    """Base class for all RAG-related errors."""


class RAGConfigurationError(RAGError):
    """Raised for configuration or dependency issues (e.g., missing packages)."""


class RAGModelLoadError(RAGError):
    """Raised when loading an embedding model fails."""


class RAGEmbeddingError(RAGError):
    """Raised when generating embeddings fails."""


class RAGIndexNotReadyError(RAGError):
    """Raised when attempting to search before the index is ready."""


class RAGSearchError(RAGError):
    """Raised when a search operation fails unexpectedly."""


class RAGCacheError(RAGError):
    """Raised for caching load/save errors."""
