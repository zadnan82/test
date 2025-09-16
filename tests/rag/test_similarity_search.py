"""
Unit tests for RAG similarity search service.
Tests document loading, embedding generation, and similarity search functionality.
"""

import pytest
import os
import tempfile
import shutil
from unittest.mock import Mock, patch
import numpy as np

# Import the similarity search module
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sevdo_frontend.rag.similarity_search import SimilaritySearchService, Document, SearchResult


class TestSimilaritySearchService:
    """Test cases for the SimilaritySearchService."""
    
    def setup_method(self):
        """Set up test fixtures before each test method."""
        # Create a temporary directory for test knowledge base
        self.test_kb_dir = tempfile.mkdtemp()
        
        # Create test markdown files
        self.create_test_files()
        
        # Initialize service with test directory
        self.service = SimilaritySearchService(knowledge_base_dir=self.test_kb_dir)
    
    def teardown_method(self):
        """Clean up test fixtures after each test method."""
        # Remove temporary directory
        shutil.rmtree(self.test_kb_dir)
    
    def create_test_files(self):
        """Create test markdown files in the temporary knowledge base."""
        
        # Test file 1: Backend components
        backend_content = """---
title: Backend API Endpoints
doc_id: kb:backend:api:v1
tags: [backend, api, endpoints]
updated_at: 2025-01-27
---

## Backend API Endpoints

This document describes the backend API endpoints for user management.

### Authentication Endpoints

- /api/auth/login - User login endpoint
- /api/auth/logout - User logout endpoint
- /api/auth/register - User registration endpoint

### User Management

- /api/users/profile - Get user profile
- /api/users/update - Update user information
"""
        
        # Test file 2: Frontend components
        frontend_content = """---
title: Frontend Component Guide
doc_id: kb:frontend:components:v1
tags: [frontend, components, ui]
updated_at: 2025-01-27
---

## Frontend Components

Guide to frontend UI components in the SEVDO platform.

### Form Components

- LoginForm - User authentication form
- RegisterForm - User registration form
- ProfileForm - User profile editing form

### Navigation

- Navbar - Top navigation bar
- Sidebar - Side navigation menu
"""
        
        # Write test files
        with open(os.path.join(self.test_kb_dir, "backend.md"), 'w') as f:
            f.write(backend_content)
        
        with open(os.path.join(self.test_kb_dir, "frontend.md"), 'w') as f:
            f.write(frontend_content)
    
    def test_initialization(self):
        """Test service initialization."""
        assert self.service.knowledge_base_dir == self.test_kb_dir
        assert len(self.service.documents) == 0
        assert not self.service._is_loaded
    
    def test_yaml_frontmatter_parsing(self):
        """Test YAML frontmatter parsing functionality."""
        content = """---
title: Test Document
doc_id: test:doc:1
tags: [test, example]
---

This is the main content."""
        
        metadata, main_content = self.service._parse_yaml_frontmatter(content)
        
        assert metadata["title"] == "Test Document"
        assert metadata["doc_id"] == "test:doc:1"
        assert metadata["tags"] == ["test", "example"]
        assert main_content == "This is the main content."
    
    def test_yaml_frontmatter_parsing_no_frontmatter(self):
        """Test parsing content without YAML frontmatter."""
        content = "This is just plain content without frontmatter."
        
        metadata, main_content = self.service._parse_yaml_frontmatter(content)
        
        assert metadata == {}
        assert main_content == content
    
    def test_content_chunking(self):
        """Test content chunking functionality."""
        # Short content (should not be chunked)
        short_content = "This is short content."
        chunks = self.service._chunk_content(short_content, chunk_size=100)
        assert len(chunks) == 1
        assert chunks[0] == short_content
        
        # Long content (should be chunked)
        long_content = "Line 1\n" * 50  # 350 characters
        chunks = self.service._chunk_content(long_content, chunk_size=200)
        assert len(chunks) > 1
        
        # Verify all chunks are under size limit (with some tolerance for line breaks)
        for chunk in chunks:
            assert len(chunk) <= 250  # Some tolerance for chunking logic
    
    def test_load_documents(self):
        """Test document loading from knowledge base."""
        count = self.service.load_documents()
        
        assert count == 2  # We created 2 test files
        assert len(self.service.documents) == 2
        assert self.service._is_loaded
        
        # Check document properties
        doc_titles = [doc.title for doc in self.service.documents]
        assert "Backend API Endpoints" in doc_titles
        assert "Frontend Component Guide" in doc_titles
        
        # Check chunks were created
        for doc in self.service.documents:
            assert len(doc.chunks) > 0
            assert doc.embeddings is None  # Not generated yet
    
    def test_load_documents_empty_directory(self):
        """Test loading documents from empty directory."""
        # Create empty directory
        empty_dir = tempfile.mkdtemp()
        try:
            service = SimilaritySearchService(knowledge_base_dir=empty_dir)
            count = service.load_documents()
            assert count == 0
            assert len(service.documents) == 0
        finally:
            shutil.rmtree(empty_dir)
    
    def test_load_documents_nonexistent_directory(self):
        """Test loading documents from nonexistent directory."""
        service = SimilaritySearchService(knowledge_base_dir="/nonexistent/path")
        count = service.load_documents()
        assert count == 0
        assert len(service.documents) == 0
    
    @patch('sevdo_frontend.rag.similarity_search.EmbeddingsService')
    def test_generate_embeddings_success(self, mock_embeddings_service_class):
        """Test successful embedding generation."""
        # Mock embeddings service
        mock_service = Mock()
        mock_service.generate_batch_embeddings.return_value = [
            [0.1, 0.2, 0.3],  # Mock embedding for chunk 1
            [0.4, 0.5, 0.6],  # Mock embedding for chunk 2
        ]
        mock_embeddings_service_class.return_value = mock_service
        
        # Create new service instance with mocked embeddings
        service = SimilaritySearchService(knowledge_base_dir=self.test_kb_dir)
        service.embeddings_service = mock_service
        
        # Load documents first
        service.load_documents()
        
        # Generate embeddings
        success = service.generate_embeddings()
        
        assert success
        # Check that all documents have embeddings
        for doc in service.documents:
            assert doc.embeddings is not None
            assert isinstance(doc.embeddings, np.ndarray)
    
    def test_generate_embeddings_no_service(self):
        """Test embedding generation without embeddings service."""
        self.service.embeddings_service = None
        self.service.load_documents()
        
        success = self.service.generate_embeddings()
        assert not success
    
    def test_generate_embeddings_no_documents(self):
        """Test embedding generation with no loaded documents."""
        # Mock embeddings service
        mock_service = Mock()
        self.service.embeddings_service = mock_service
        
        success = self.service.generate_embeddings()
        assert not success
    
    def test_get_info(self):
        """Test service information retrieval."""
        info = self.service.get_info()
        
        assert info["knowledge_base_dir"] == self.test_kb_dir
        assert info["documents_loaded"] == 0  # No documents loaded yet
        assert not info["is_loaded"]
        assert not info["embeddings_generated"]
        
        # Load documents and check info again
        self.service.load_documents()
        info = self.service.get_info()
        assert info["documents_loaded"] == 2
        assert info["is_loaded"]
    
    @patch('sevdo_frontend.rag.similarity_search.EmbeddingsService')
    def test_search_functionality(self, mock_embeddings_service_class):
        """Test similarity search functionality."""
        # Mock embeddings service
        mock_service = Mock()
        
        # Mock query embedding
        query_embedding = np.array([0.1, 0.2, 0.3])
        mock_service.generate_embedding.return_value = query_embedding
        
        # Mock batch embeddings (2 documents with 2 chunks each)
        mock_service.generate_batch_embeddings.side_effect = [
            [[0.1, 0.2, 0.3], [0.15, 0.25, 0.35]],  # Doc 1 chunks
            [[0.4, 0.5, 0.6], [0.45, 0.55, 0.65]],  # Doc 2 chunks
        ]
        
        # Mock similarity computation
        def mock_similarity(emb1, emb2):
            # Higher similarity for similar vectors
            return float(np.dot(emb1, emb2) / (np.linalg.norm(emb1) * np.linalg.norm(emb2)))
        
        mock_service.compute_similarity.side_effect = mock_similarity
        
        # Create service with mocked embeddings
        service = SimilaritySearchService(knowledge_base_dir=self.test_kb_dir)
        service.embeddings_service = mock_service
        
        # Initialize service
        service.load_documents()
        service.generate_embeddings()
        
        # Perform search
        results = service.search("user login authentication", top_k=2)
        
        assert len(results) <= 2
        assert all(isinstance(result, SearchResult) for result in results)
        
        # Check result structure
        for result in results:
            assert hasattr(result, 'document')
            assert hasattr(result, 'similarity_score')
            assert hasattr(result, 'matching_chunks')
            assert isinstance(result.similarity_score, float)
            assert 0 <= result.similarity_score <= 1
    
    def test_search_no_embeddings_service(self):
        """Test search without embeddings service."""
        self.service.embeddings_service = None
        results = self.service.search("test query")
        assert results == []
    
    def test_search_no_documents(self):
        """Test search with no loaded documents."""
        mock_service = Mock()
        self.service.embeddings_service = mock_service
        
        results = self.service.search("test query")
        assert results == []
    
    def test_search_no_embeddings_generated(self):
        """Test search without generated embeddings."""
        mock_service = Mock()
        self.service.embeddings_service = mock_service
        self.service.load_documents()  # Load docs but don't generate embeddings
        
        results = self.service.search("test query")
        assert results == []
    
    @patch('sevdo_frontend.rag.similarity_search.EmbeddingsService')
    def test_initialize_complete_workflow(self, mock_embeddings_service_class):
        """Test complete initialization workflow."""
        # Mock embeddings service
        mock_service = Mock()
        mock_service.generate_batch_embeddings.return_value = [[0.1, 0.2, 0.3]]
        mock_embeddings_service_class.return_value = mock_service
        
        service = SimilaritySearchService(knowledge_base_dir=self.test_kb_dir)
        
        # Test complete initialization
        success = service.initialize()
        
        assert success
        assert len(service.documents) == 2
        assert service._is_loaded
        
        # Verify all documents have embeddings
        for doc in service.documents:
            assert doc.embeddings is not None
    
    def test_initialize_empty_knowledge_base(self):
        """Test initialization with empty knowledge base."""
        empty_dir = tempfile.mkdtemp()
        try:
            service = SimilaritySearchService(knowledge_base_dir=empty_dir)
            success = service.initialize()
            assert not success
        finally:
            shutil.rmtree(empty_dir)
