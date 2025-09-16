import pytest
import yaml
from pathlib import Path


def test_read_markdown_file():
    """Test basic markdown file reading functionality"""
    # Build path from repository root
    repo_root = Path(__file__).resolve().parents[1]
    markdown_file = repo_root / "knowledge_base_RAG" / "frontend_component_symbols.md"
    
    # Validate file exists and read content
    assert markdown_file.exists(), f"File not found: {markdown_file}"
    content = markdown_file.read_text(encoding='utf-8')
    
    # Basic content validation
    assert content != "", "File is empty"
    assert len(content) > 100, "File too short - might be corrupted"
    assert "title:" in content, "Missing YAML frontmatter"
    
    print(f"✅ Successfully read {len(content)} characters from markdown file")
    


def test_parse_yaml_frontmatter():
    """Test YAML frontmatter extraction and parsing"""
    # Read markdown file
    repo_root = Path(__file__).resolve().parents[1]
    markdown_file = repo_root / "knowledge_base_RAG" / "frontend_component_symbols.md"
    content = markdown_file.read_text(encoding='utf-8')
    
    # Find YAML boundaries (between --- markers)
    lines = content.split('\n')
    yaml_start = None
    yaml_end = None
    
    for i, line in enumerate(lines):
        if line.strip() == '---':
            if yaml_start is None:
                yaml_start = i
            else:
                yaml_end = i
                break
    
    # Extract and parse YAML content
    assert yaml_start is not None, "No YAML frontmatter start found"
    assert yaml_end is not None, "No YAML frontmatter end found"
    
    yaml_lines = lines[yaml_start + 1:yaml_end]
    yaml_content = '\n'.join(yaml_lines)
    metadata = yaml.safe_load(yaml_content)
    
    # Validate expected fields and values
    assert 'title' in metadata, "Missing 'title' in YAML"
    assert 'doc_id' in metadata, "Missing 'doc_id' in YAML"
    assert 'tags' in metadata, "Missing 'tags' in YAML"
    
    # Validate specific values from Emil's file
    assert metadata['title'] == "Frontend Component Symbols Legend"
    assert metadata['doc_id'] == "kb:frontend:symbols:v1"
    assert 'frontend' in metadata['tags']
    
    print(f"✅ Parsed metadata: {metadata}")


def test_chunk_content():
    """Test header-based content chunking for RAG optimization"""
    # Read markdown file
    repo_root = Path(__file__).resolve().parents[1]
    markdown_file = repo_root / "knowledge_base_RAG" / "frontend_component_symbols.md"
    content = markdown_file.read_text(encoding='utf-8')
    
    # Remove YAML frontmatter
    lines = content.split('\n')
    yaml_start = None
    yaml_end = None
    
    for i, line in enumerate(lines):
        if line.strip() == '---':
            if yaml_start is None:
                yaml_start = i
            else:
                yaml_end = i
                break
    
    # Extract content after YAML
    content_lines = lines[yaml_end + 1:] if yaml_end else lines
    clean_content = '\n'.join(content_lines).strip()
    
    # Split by headers (## sections)
    chunks = []
    current_chunk = []
    
    for line in content_lines:
        if line.startswith('##') and current_chunk:
            # Save previous chunk and start new one
            chunks.append('\n'.join(current_chunk).strip())
            current_chunk = [line]
        else:
            current_chunk.append(line)
    
    # Add final chunk
    if current_chunk:
        chunks.append('\n'.join(current_chunk).strip())
    
    # Remove empty chunks
    chunks = [chunk for chunk in chunks if chunk.strip()]
    
    # Validate chunks
    assert len(chunks) >= 1, "Should have at least one chunk"
    assert len(chunks) <= 5, "Too many chunks - check splitting logic"
    
    for i, chunk in enumerate(chunks):
        assert len(chunk) > 20, f"Chunk {i} too short: {len(chunk)} chars"
        assert len(chunk) < 2000, f"Chunk {i} too long: {len(chunk)} chars"
    
    # Add metadata to chunks
    enriched_chunks = []
    for i, chunk in enumerate(chunks):
        chunk_data = {
            'content': chunk,
            'chunk_id': f"frontend_symbols_chunk_{i}",
            'source_file': 'frontend_component_symbols.md',
            'content_type': 'header_section' if chunk.startswith('##') else 'content_section'
        }
        enriched_chunks.append(chunk_data)
    
    print(f"✅ Created {len(enriched_chunks)} chunks with metadata")
    for i, chunk_data in enumerate(enriched_chunks):
        content_preview = chunk_data['content'][:50].replace('\n', ' ')
        print(f"   Chunk {i}: {content_preview}...")
    
    # Test chunk quality
    assert any('##' in chunk['content'] for chunk in enriched_chunks), "Should have header chunks"
    assert all(chunk['chunk_id'] for chunk in enriched_chunks), "All chunks need IDs"


def test_file_not_found():
    """Test graceful handling when markdown file is missing"""
    repo_root = Path(__file__).resolve().parents[1]
    non_existent_file = repo_root / "knowledge_base_RAG" / "does_not_exist.md"
    
    # Should raise FileNotFoundError or handle gracefully
    with pytest.raises(FileNotFoundError):
        non_existent_file.read_text(encoding='utf-8')


def test_invalid_yaml_frontmatter():
    """Test handling of corrupted YAML metadata"""
    # Create mock content with invalid YAML
    invalid_content = """---
title: Frontend Symbols
invalid_yaml: [unclosed bracket
tags: frontend
---

## Content here
"""
    
    lines = invalid_content.split('\n')
    yaml_start = None
    yaml_end = None
    
    for i, line in enumerate(lines):
        if line.strip() == '---':
            if yaml_start is None:
                yaml_start = i
            else:
                yaml_end = i
                break
    
    yaml_lines = lines[yaml_start + 1:yaml_end]
    yaml_content = '\n'.join(yaml_lines)
    
    # Should raise yaml.YAMLError for invalid syntax
    with pytest.raises(yaml.YAMLError):
        yaml.safe_load(yaml_content)


def test_empty_file_handling():
    """Test behavior with empty or minimal content"""
    empty_content = ""
    minimal_content = "---\n---\n"
    
    # Empty file should fail gracefully
    assert len(empty_content.strip()) == 0, "Empty content detected"
    
    # Minimal content with just YAML markers
    lines = minimal_content.split('\n')
    content_lines = lines[2:]  # Skip YAML markers
    clean_content = '\n'.join(content_lines).strip()
    
    # Should handle minimal content without crashing
    assert len(clean_content) == 0, "No actual content after YAML"


def test_no_yaml_frontmatter():
    """Test handling markdown without YAML metadata"""
    plain_markdown = """## Just a Header

Some content without YAML frontmatter.

- List item 1
- List item 2
"""
    
    lines = plain_markdown.split('\n')
    yaml_start = None
    yaml_end = None
    
    # Look for YAML markers
    for i, line in enumerate(lines):
        if line.strip() == '---':
            if yaml_start is None:
                yaml_start = i
            else:
                yaml_end = i
                break
    
    # Should handle missing YAML gracefully
    assert yaml_start is None, "No YAML frontmatter found (expected)"
    assert yaml_end is None, "No YAML end marker found (expected)"
    
    # All content should be treated as body content
    content_lines = lines
    clean_content = '\n'.join(content_lines).strip()
    assert len(clean_content) > 0, "Should have content even without YAML"
    assert '## Just a Header' in clean_content, "Content should be preserved"


def test_chunk_size_validation():
    """Test chunking behavior with various content sizes"""
    # Very short content
    short_content = "## Short\n\nJust a bit."
    
    # Simulate chunking process
    lines = short_content.split('\n')
    chunks = []
    current_chunk = []
    
    for line in lines:
        if line.startswith('##') and current_chunk:
            chunks.append('\n'.join(current_chunk).strip())
            current_chunk = [line]
        else:
            current_chunk.append(line)
    
    if current_chunk:
        chunks.append('\n'.join(current_chunk).strip())
    
    chunks = [chunk for chunk in chunks if chunk.strip()]
    
    # Validate chunks exist and have reasonable content
    assert len(chunks) >= 1, "Should create at least one chunk"
    for chunk in chunks:
        assert len(chunk) > 0, "Chunks should not be empty"
        print(f"✅ Chunk validated: {len(chunk)} chars")
