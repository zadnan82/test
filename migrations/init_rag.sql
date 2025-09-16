-- SEVDO RAG System - PostgreSQL pgvector setup
-- This script initializes the vector extension and creates tables for RAG functionality

-- Create vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Table for storing RAG documents and their embeddings
CREATE TABLE IF NOT EXISTS rag_documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,                -- Document title: "React Button Component"
    category VARCHAR(100) NOT NULL,             -- Document category: "component", "dsl_example", "pattern"
    content TEXT NOT NULL,                      -- Full document content (preprocessed)
    content_summary TEXT,                       -- Brief summary of content (for better retrieval)
    embedding VECTOR(384),                      -- sentence-transformers embedding (384 dimensions)
    metadata JSONB DEFAULT '{}',                -- Additional metadata: {"complexity": "basic", "props": [...]}
    source_file VARCHAR(500),                   -- Original source file path
    chunk_id INTEGER DEFAULT 0,                 -- Chunk number if document is split
    parent_doc_id INTEGER REFERENCES rag_documents(id) ON DELETE CASCADE, -- For document chunks
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast vector similarity search
CREATE INDEX IF NOT EXISTS rag_documents_embedding_idx 
    ON rag_documents USING hnsw (embedding vector_cosine_ops);

-- Indexes for metadata filtering
CREATE INDEX IF NOT EXISTS rag_documents_category_idx ON rag_documents(category);
CREATE INDEX IF NOT EXISTS rag_documents_title_idx ON rag_documents(title);
CREATE INDEX IF NOT EXISTS rag_documents_metadata_idx ON rag_documents USING gin(metadata);

-- Table for RAG query logs (for analytics and improvement)
CREATE TABLE IF NOT EXISTS rag_query_logs (
    id SERIAL PRIMARY KEY,
    query_text TEXT NOT NULL,                   -- Original user query
    query_embedding VECTOR(384),                -- Query embedding for similarity
    retrieved_doc_ids INTEGER[],                -- Array of retrieved document IDs
    similarity_scores FLOAT[],                  -- Corresponding similarity scores
    response_text TEXT,                         -- Generated response
    response_time_ms INTEGER,                   -- Query processing time
    user_feedback INTEGER,                      -- User rating: 1-5, NULL if no feedback
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for query analytics
CREATE INDEX IF NOT EXISTS rag_query_logs_created_at_idx ON rag_query_logs(created_at);
CREATE INDEX IF NOT EXISTS rag_query_logs_query_embedding_idx 
    ON rag_query_logs USING hnsw (query_embedding vector_cosine_ops);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update timestamps
CREATE TRIGGER update_rag_documents_updated_at 
    BEFORE UPDATE ON rag_documents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some example metadata for testing (can be removed later)
INSERT INTO rag_documents (title, category, content, content_summary, metadata, source_file) 
VALUES 
    ('SEVDO Button DSL', 'dsl_syntax', 'b - Basic button element', 'Creates interactive button elements', '{"component": "button", "complexity": "basic"}', 'sevdo_frontend/mappings.txt'),
    ('React Button Pattern', 'react_component', '<Button>Click</Button>', 'Standard React button component', '{"framework": "react", "styling": "tailwind"}', 'generated_example')
ON CONFLICT DO NOTHING;

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE 'SEVDO RAG Database initialized successfully!';
    RAISE NOTICE 'Tables created: rag_documents, rag_query_logs';
    RAISE NOTICE 'Vector extension enabled: pgvector';
END $$;
