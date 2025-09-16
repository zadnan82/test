import numpy as np
from typing import List, Union
import logging
import os
import hashlib
import time
import random

try:
    from sentence_transformers import SentenceTransformer

    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    SENTENCE_TRANSFORMERS_AVAILABLE = False

try:
    from .errors import RAGModelLoadError
except Exception:
    RAGModelLoadError = RuntimeError


class EmbeddingsService:
    """Embeddings service with graceful fallbacks for SEVDO frontend RAG"""

    def __init__(
        self, model_name: str = "all-MiniLM-L6-v2", strategy: str = None
    ):
        """
        Initialize the embeddings backend.

        Args:
            model_name: Name of the Sentence-Transformers model
            strategy: Optional backend strategy. One of: "auto", "st", "hash".
                      Defaults to env RAG_EMBEDDING_STRATEGY or "auto".
        """
        self.model_name = model_name
        self.model = None
        self.backend = None  # "st" or "hash"
        self.strategy = (
            strategy or os.getenv("RAG_EMBEDDING_STRATEGY", "auto")
        ).lower()
        if self.strategy not in {"auto", "st", "hash"}:
            self.strategy = "auto"

        # Choose backend
        if (
            self.strategy in ("auto", "st")
        ) and SENTENCE_TRANSFORMERS_AVAILABLE:
            self.backend = "st"
            self._load_model()
        elif self.strategy == "st" and not SENTENCE_TRANSFORMERS_AVAILABLE:
            # Explicit ST requested but unavailable
            raise ImportError(
                "Sentence-Transformers not available. Install with: pip install -r requirements-rag.txt"
            )
        else:
            # Hash fallback
            logging.getLogger(__name__).warning(
                "Using hash-based embedding fallback (Sentence-Transformers unavailable or disabled)"
            )
            self.backend = "hash"

            # Provide a lightweight dummy model to satisfy callers/tests
            class _DummyModel:
                def get_sentence_embedding_dimension(self_inner):
                    return 384

            self.model = _DummyModel()

    def _load_model(self):
        """Load the sentence transformer model with simple retries."""
        attempts = int(os.getenv("RAG_MODEL_LOAD_RETRIES", "3"))
        base_delay = float(os.getenv("RAG_MODEL_LOAD_BACKOFF", "0.5"))
        last_err = None
        for attempt in range(1, attempts + 1):
            try:
                logging.info(
                    f"Loading embedding model: {self.model_name} (attempt {attempt}/{attempts})"
                )
                self.model = SentenceTransformer(self.model_name)
                logging.info(
                    f"Model loaded successfully. Embedding dimension: {self.get_embedding_dimension()}"
                )
                return
            except Exception as e:
                last_err = e
                logging.error(
                    f"Failed to load model {self.model_name} on attempt {attempt}: {e}"
                )
                if attempt < attempts:
                    sleep_s = base_delay * (
                        2 ** (attempt - 1)
                    ) + random.uniform(0, 0.2)
                    time.sleep(sleep_s)
        raise RAGModelLoadError(
            f"Failed to load model {self.model_name} after {attempts} attempts: {last_err}"
        )

    def _hash_embed(self, text: str) -> np.ndarray:
        """Deterministic hashing-based embedding as a lightweight fallback (384-dim)."""
        if not text:
            return np.zeros((384,), dtype=np.float32)
        # Seed from stable hash of text
        digest = hashlib.sha256(text.encode("utf-8")).digest()
        seed = int.from_bytes(digest[:8], byteorder="big", signed=False)
        rng = np.random.default_rng(seed)
        vec = rng.standard_normal(384, dtype=np.float32)
        norm = np.linalg.norm(vec)
        if norm == 0:
            return vec
        return vec / norm

    def generate_embedding(self, text: str) -> np.ndarray:
        """Generate embedding for a single text"""
        if not text or not text.strip():
            raise ValueError("Text cannot be empty")

        if self.backend == "st":
            if not self.model:
                raise RuntimeError("Model not loaded")
            embedding = self.model.encode(text)
            return embedding
        # hash fallback
        return self._hash_embed(text)

    def generate_batch_embeddings(self, texts: List[str]) -> np.ndarray:
        """Generate embeddings for multiple texts efficiently"""
        if not texts:
            raise ValueError("Texts list cannot be empty")

        valid_mask = [bool(text and text.strip()) for text in texts]
        valid_texts = [text for text, keep in zip(texts, valid_mask) if keep]
        if len(valid_texts) != len(texts):
            logging.warning(
                f"Filtered out {len(texts) - len(valid_texts)} empty texts"
            )

        if self.backend == "st":
            if not self.model:
                raise RuntimeError("Model not loaded")
            valid_embeddings = self.model.encode(valid_texts)
            # If there were filtered entries, re-align to original indices with zeros
            if len(valid_texts) != len(texts):
                dim = valid_embeddings.shape[1]
                out = np.zeros((len(texts), dim), dtype=valid_embeddings.dtype)
                j = 0
                for i, keep in enumerate(valid_mask):
                    if keep:
                        out[i] = valid_embeddings[j]
                        j += 1
                return out
            return valid_embeddings

        # hash fallback
        out = np.zeros((len(texts), 384), dtype=np.float32)
        j = 0
        for i, keep in enumerate(valid_mask):
            if keep:
                out[i] = self._hash_embed(valid_texts[j])
                j += 1
            else:
                out[i] = np.zeros((384,), dtype=np.float32)
        return out

    def get_embedding_dimension(self) -> int:
        """Get the embedding dimension of the loaded model"""
        if self.backend == "st":
            if not self.model:
                return 0
            return self.model.get_sentence_embedding_dimension()
        # hash fallback dimension
        return 384

    def get_model_info(self) -> dict:
        """Get information about the loaded model"""
        return {
            "model_name": self.model_name,
            "embedding_dimension": self.get_embedding_dimension(),
            "is_loaded": (self.model is not None)
            if self.backend == "st"
            else True,
            "max_seq_length": getattr(self.model, "max_seq_length", None)
            if self.backend == "st" and self.model
            else None,
            "backend": self.backend,
            "strategy": self.strategy,
        }

    def compute_similarity(
        self, embedding1: np.ndarray, embedding2: np.ndarray
    ) -> float:
        """Compute cosine similarity between two embeddings"""
        dot_product = np.dot(embedding1, embedding2)
        norm1 = np.linalg.norm(embedding1)
        norm2 = np.linalg.norm(embedding2)

        if norm1 == 0 or norm2 == 0:
            return 0.0
        cos = float(dot_product / (norm1 * norm2))
        # Map from [-1, 1] to [0, 1] for consistent scoring and tests
        return (cos + 1.0) / 2.0
