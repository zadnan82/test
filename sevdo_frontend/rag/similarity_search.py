"""
In-memory cosine similarity search for RAG system.
Handles document ingestion, embedding storage, and similarity queries.
"""

import os
import glob
from typing import List, Dict, Tuple, Optional
import numpy as np
from dataclasses import dataclass
import yaml
import logging

logger = logging.getLogger(__name__)

try:
    from .embeddings import EmbeddingsService
except ImportError:
    EmbeddingsService = None


@dataclass
class Document:
    """Represents a document with metadata and content chunks."""

    doc_id: str
    title: str
    file_path: str
    content: str
    chunks: List[str]
    metadata: Dict
    embeddings: Optional[np.ndarray] = None


@dataclass
class SearchResult:
    """Represents a search result with similarity score."""

    document: Document
    similarity_score: float
    matching_chunks: List[Tuple[str, float]]  # (chunk_content, similarity)


class SimilaritySearchService:
    """
    In-memory cosine similarity search service for RAG.

    Features:
    - Document ingestion from markdown files
    - Automatic embedding generation and caching
    - Fast cosine similarity search
    - Chunk-level similarity for better precision
    """

    def __init__(self, knowledge_base_dir: str = "knowledge_base_RAG"):
        """
        Initialize the similarity search service.

        Args:
            knowledge_base_dir: Directory containing markdown documents
        """
        self.knowledge_base_dir = knowledge_base_dir
        self.documents: List[Document] = []
        self.embeddings_service = None
        self._is_loaded = False
        # Feature flags via env
        self.enable_keyword_fallback = str(
            os.getenv("RAG_ENABLE_KEYWORD_FALLBACK", "0")
        ).lower() in {"1", "true", "yes"}
        self.circuit_breaker_threshold = int(
            os.getenv("RAG_CIRCUIT_BREAKER_THRESHOLD", "3")
        )
        self._recent_failures = 0
        self._embedding_backend_disabled = False
        self.enable_cache = str(os.getenv("RAG_CACHE", "0")).lower() in {
            "1",
            "true",
            "yes",
        }
        self._cache_hits = 0
        self._cache_misses = 0

        # Try to initialize embeddings service
        if EmbeddingsService:
            try:
                self.embeddings_service = EmbeddingsService()
                logger.info(
                    "Embeddings service initialized for similarity search"
                )
            except Exception as e:
                logger.warning(
                    "Could not initialize embeddings service: %s", e
                )
        else:
            logger.warning(
                "Embeddings service not available (install requirements-rag.txt)"
            )

    def _parse_yaml_frontmatter(self, content: str) -> Tuple[Dict, str]:
        """Parse YAML frontmatter from markdown content."""
        if not content.startswith("---"):
            return {}, content

        try:
            # Split frontmatter and content
            parts = content.split("---", 2)
            if len(parts) < 3:
                return {}, content

            frontmatter_yaml = parts[1].strip()
            main_content = parts[2].strip()

            # Parse YAML
            metadata = yaml.safe_load(frontmatter_yaml) or {}
            return metadata, main_content

        except Exception as e:
            logger.warning("Error parsing YAML frontmatter: %s", e)
            return {}, content

    def _chunk_content(self, content: str, chunk_size: int = 500) -> List[str]:
        """
        Split content into chunks for better similarity matching.

        Args:
            content: Text content to chunk
            chunk_size: Maximum characters per chunk

        Returns:
            List of content chunks
        """
        if len(content) <= chunk_size:
            return [content]

        chunks = []
        lines = content.split("\n")
        current_chunk = []
        current_length = 0

        for line in lines:
            line_length = len(line) + 1  # +1 for newline

            # If adding this line would exceed chunk size, start new chunk
            if current_length + line_length > chunk_size and current_chunk:
                chunks.append("\n".join(current_chunk))
                current_chunk = [line]
                current_length = line_length
            else:
                current_chunk.append(line)
                current_length += line_length

        # Add remaining content
        if current_chunk:
            chunks.append("\n".join(current_chunk))

        return chunks

    def load_documents(self) -> int:
        """
        Load all markdown documents from knowledge base directory.

        Returns:
            Number of documents loaded
        """
        if not os.path.exists(self.knowledge_base_dir):
            logger.warning(
                "Knowledge base directory not found: %s",
                self.knowledge_base_dir,
            )
            return 0

        pattern = os.path.join(self.knowledge_base_dir, "*.md")
        md_files = glob.glob(pattern)

        if not md_files:
            logger.warning(
                "No markdown files found in %s", self.knowledge_base_dir
            )
            return 0

        logger.info(
            "Loading %d documents from knowledge base...", len(md_files)
        )

        for file_path in md_files:
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()

                # Parse frontmatter and content
                metadata, main_content = self._parse_yaml_frontmatter(content)

                # Create document
                doc_id = metadata.get("doc_id", os.path.basename(file_path))
                title = metadata.get("title", os.path.basename(file_path))

                # Chunk content for better similarity matching
                chunks = self._chunk_content(main_content)

                document = Document(
                    doc_id=doc_id,
                    title=title,
                    file_path=file_path,
                    content=main_content,
                    chunks=chunks,
                    metadata=metadata,
                )

                self.documents.append(document)
                logger.info(
                    "Loaded document '%s' with %d chunks", title, len(chunks)
                )

            except Exception as e:
                logger.error("Error loading %s: %s", file_path, e)

        self._is_loaded = True
        return len(self.documents)

    def generate_embeddings(self) -> bool:
        """
        Generate embeddings for all loaded documents and chunks.

        Returns:
            True if successful, False otherwise
        """
        if not self.embeddings_service:
            logger.error("Embeddings service not available")
            return False

        if not self.documents:
            logger.error("No documents loaded. Call load_documents() first.")
            return False

        logger.info("Generating embeddings for documents and chunks...")

        try:
            for i, doc in enumerate(self.documents):
                # Generate embeddings for all chunks
                chunk_texts = doc.chunks

                # Try cache first
                if self.enable_cache:
                    cached = self._load_cached_embeddings(doc)
                    if cached is not None and cached.shape[0] == len(
                        chunk_texts
                    ):
                        doc.embeddings = cached
                        self._cache_hits += 1
                        logger.info(
                            "Loaded cached embeddings for '%s' (%d chunks)",
                            doc.title,
                            len(chunk_texts),
                        )
                        continue
                    else:
                        self._cache_misses += 1

                embeddings = self.embeddings_service.generate_batch_embeddings(
                    chunk_texts
                )

                # Store embeddings in document
                doc.embeddings = np.array(embeddings)

                # Save to cache
                if self.enable_cache:
                    self._save_cached_embeddings(doc)

                logger.info(
                    "Generated embeddings for '%s' (%d chunks)",
                    doc.title,
                    len(chunk_texts),
                )

            logger.info(
                "Successfully generated embeddings for %d documents",
                len(self.documents),
            )
            return True

        except Exception as e:
            logger.error("Error generating embeddings: %s", e)
            return False

    def _embedding_cache_path(self, document: Document) -> str:
        base = document.file_path
        model_info = (
            self.embeddings_service.get_model_info()
            if self.embeddings_service
            else {"backend": "unknown", "model_name": "unknown"}
        )
        backend = model_info.get("backend", "unknown")
        model_name = (
            model_info.get("model_name", "unknown")
            .replace(os.sep, "_")
            .replace("/", "_")
        )
        return f"{base}.{backend}.{model_name}.chunks.npy"

    def _load_cached_embeddings(
        self, document: Document
    ) -> Optional[np.ndarray]:
        try:
            path = self._embedding_cache_path(document)
            if os.path.exists(path):
                arr = np.load(path)
                return arr
        except Exception as e:
            logger.warning(
                "Failed to load cache for %s: %s", document.title, e
            )
        return None

    def _save_cached_embeddings(self, document: Document) -> None:
        try:
            path = self._embedding_cache_path(document)
            if document.embeddings is not None:
                np.save(path, document.embeddings)
        except Exception as e:
            logger.warning(
                "Failed to save cache for %s: %s", document.title, e
            )

    def _tokenize(self, text: str) -> List[str]:
        return [
            tok
            for tok in "".join(
                [c.lower() if c.isalnum() else " " for c in text]
            ).split()
            if tok
        ]

    def _keyword_overlap_score(
        self, query_tokens: List[str], chunk: str
    ) -> float:
        chunk_tokens = self._tokenize(chunk)
        if not chunk_tokens:
            return 0.0
        qset = set(query_tokens)
        cset = set(chunk_tokens)
        intersection = len(qset.intersection(cset))
        union = len(qset.union(cset))
        if union == 0:
            return 0.0
        return float(intersection) / float(union)

    def _search_with_keywords(
        self, query: str, top_k: int = 5
    ) -> List[SearchResult]:
        logger.info("Running keyword-based fallback search")
        query_tokens = self._tokenize(query)
        results: List[SearchResult] = []
        for doc in self.documents:
            chunk_scores: List[Tuple[str, float]] = []
            for chunk in doc.chunks:
                score = self._keyword_overlap_score(query_tokens, chunk)
                if score > 0:
                    chunk_scores.append((chunk, score))
            chunk_scores.sort(key=lambda x: x[1], reverse=True)
            doc_score = chunk_scores[0][1] if chunk_scores else 0.0
            results.append(
                SearchResult(
                    document=doc,
                    similarity_score=float(doc_score),
                    matching_chunks=chunk_scores[:3],
                )
            )
        results.sort(key=lambda x: x.similarity_score, reverse=True)
        return results[:top_k]

    def search(self, query: str, top_k: int = 5) -> List[SearchResult]:
        """
        Search for similar documents using cosine similarity.

        Args:
            query: Search query text
            top_k: Number of top results to return

        Returns:
            List of search results with similarity scores
        """
        if not self.embeddings_service or self._embedding_backend_disabled:
            logger.error("Embeddings service not available")
            if self.enable_keyword_fallback and self.documents:
                return self._search_with_keywords(query, top_k)
            return []

        if not self.documents:
            logger.error("No documents loaded")
            return []

        # Check if embeddings are generated
        if not all(doc.embeddings is not None for doc in self.documents):
            logger.error(
                "Embeddings not generated. Call generate_embeddings() first."
            )
            if self.enable_keyword_fallback:
                return self._search_with_keywords(query, top_k)
            return []

        try:
            # Generate query embedding
            query_embedding = self.embeddings_service.generate_embedding(query)

            results = []

            for doc in self.documents:
                # Calculate similarities with all chunks
                chunk_similarities = []

                for i, chunk in enumerate(doc.chunks):
                    chunk_embedding = doc.embeddings[i]
                    similarity = self.embeddings_service.compute_similarity(
                        query_embedding, chunk_embedding
                    )
                    chunk_similarities.append((chunk, float(similarity)))

                # Sort chunks by similarity
                chunk_similarities.sort(key=lambda x: x[1], reverse=True)

                # Use highest similarity as document score
                doc_score = (
                    chunk_similarities[0][1] if chunk_similarities else 0.0
                )

                # Create search result
                result = SearchResult(
                    document=doc,
                    similarity_score=doc_score,
                    matching_chunks=chunk_similarities[:3],  # Top 3 chunks
                )

                results.append(result)

            # Sort by similarity score (descending)
            results.sort(key=lambda x: x.similarity_score, reverse=True)

            return results[:top_k]

        except Exception as e:
            self._recent_failures += 1
            logger.error(
                "Search error: %s (failure %d)", e, self._recent_failures
            )
            if self._recent_failures >= self.circuit_breaker_threshold:
                self._embedding_backend_disabled = True
                logger.error(
                    "Embedding backend disabled due to repeated failures"
                )
            if self.enable_keyword_fallback:
                return self._search_with_keywords(query, top_k)
            return []

    def get_info(self) -> Dict:
        """Get information about the search service state."""
        return {
            "knowledge_base_dir": self.knowledge_base_dir,
            "documents_loaded": len(self.documents),
            "is_loaded": self._is_loaded,
            "embeddings_available": self.embeddings_service is not None,
            "embeddings_generated": all(
                doc.embeddings is not None for doc in self.documents
            )
            if self.documents
            else False,
            "model_info": self.embeddings_service.get_model_info()
            if self.embeddings_service
            else None,
            "keyword_fallback_enabled": self.enable_keyword_fallback,
            "circuit_breaker_threshold": self.circuit_breaker_threshold,
            "recent_failures": self._recent_failures,
            "embedding_backend_disabled": self._embedding_backend_disabled,
            "cache_enabled": self.enable_cache,
            "cache_hits": self._cache_hits,
            "cache_misses": self._cache_misses,
        }

    def initialize(self) -> bool:
        """
        Complete initialization: load documents and generate embeddings.

        Returns:
            True if successful, False otherwise
        """
        logger.info("Initializing RAG similarity search service...")

        # Load documents
        doc_count = self.load_documents()
        if doc_count == 0:
            return False

        # Generate embeddings
        if not self.generate_embeddings():
            return False

        logger.info("RAG similarity search ready with %d documents", doc_count)
        return True
