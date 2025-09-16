import pytest
import numpy as np
from pathlib import Path
import sys

# Add sevdo_frontend to path for imports
repo_root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(repo_root))

from sevdo_frontend.rag.embeddings import EmbeddingsService


def test_embeddings_service_init():
    """Test embeddings service initialization"""
    service = EmbeddingsService()
    
    assert service.model_name == "all-MiniLM-L6-v2"
    assert service.model is not None
    assert service.get_embedding_dimension() == 384
    
    print(f"✅ Model loaded: {service.get_model_info()}")


def test_single_embedding_generation():
    """Test generating embedding for single text"""
    service = EmbeddingsService()
    
    text = "h: Header — Top-level title/branding area"
    embedding = service.generate_embedding(text)
    
    assert isinstance(embedding, np.ndarray)
    assert embedding.shape == (384,)
    assert not np.isnan(embedding).any()
    assert not np.isinf(embedding).any()
    
    print(f"✅ Generated embedding shape: {embedding.shape}")
    print(f"   First 5 values: {embedding[:5]}")


def test_batch_embeddings_generation():
    """Test generating embeddings for multiple texts"""
    service = EmbeddingsService()
    
    texts = [
        "h: Header — Top-level title",
        "t: Text/Paragraph — Body copy",
        "b: Button — Clickable control"
    ]
    
    embeddings = service.generate_batch_embeddings(texts)
    
    assert isinstance(embeddings, np.ndarray)
    assert embeddings.shape == (3, 384)
    assert not np.isnan(embeddings).any()
    assert not np.isinf(embeddings).any()
    
    print(f"✅ Generated batch embeddings shape: {embeddings.shape}")


def test_cosine_similarity():
    """Test similarity computation between embeddings"""
    service = EmbeddingsService()
    
    text1 = "h: Header — Top-level title"
    text2 = "h: Header — Page title"
    text3 = "b: Button — Submit button"
    
    emb1 = service.generate_embedding(text1)
    emb2 = service.generate_embedding(text2)
    emb3 = service.generate_embedding(text3)
    
    sim_similar = service.compute_similarity(emb1, emb2)
    sim_different = service.compute_similarity(emb1, emb3)
    
    assert 0.0 <= sim_similar <= 1.0
    assert 0.0 <= sim_different <= 1.0
    assert sim_similar > sim_different
    
    print(f"✅ Similarity header-header: {sim_similar:.3f}")
    print(f"   Similarity header-button: {sim_different:.3f}")


def test_empty_text_handling():
    """Test error handling with empty text"""
    service = EmbeddingsService()
    
    with pytest.raises(ValueError, match="Text cannot be empty"):
        service.generate_embedding("")
    
    with pytest.raises(ValueError, match="Text cannot be empty"):
        service.generate_embedding("   ")
    
    print("✅ Empty text validation working correctly")
