# sevdo_backend/endpoints/blog_get.py
"""
Blog get endpoint - retrieve a specific blog post by ID or slug.
"""


def render_endpoint(args=None, props=None):
    """
    Render blog get endpoint code.

    Args:
        args: String arguments from DSL (optional parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Default values
    endpoint_path = (
        props.get("path", "/api/blog/posts/{post_id}")
        if props
        else "/api/blog/posts/{post_id}"
    )
    method = props.get("method", "GET").upper() if props else "GET"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        pass

    # Generate the blog get endpoint code
    endpoint_code = f'''
# Single blog post response model
class BlogPostDetailResponse(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str] = None
    content: str
    featured_image: Optional[str] = None
    published: bool
    created_at: datetime
    updated_at: datetime
    author_id: int
    author_username: str
    author_email: Optional[str] = None
    tags: List[str] = []
    word_count: int
    reading_time_minutes: int

@app.{method.lower()}("{endpoint_path}")
def blog_get_endpoint(
    post_id: str,
    db: Session = Depends(get_db)
):
    """
    Retrieve specific blog post by ID or slug.
    
    Args:
        post_id: Blog post ID (integer) or slug (string)
    
    Returns:
        BlogPostDetailResponse: Complete blog post with metadata
    """
    # Try first with ID (if numeric)
    post = None
    
    # Check if post_id is numeric (ID) or string (slug)
    if post_id.isdigit():
        # Search by ID
        post_id_int = int(post_id)
        post = db.query(BlogPostDB).filter(BlogPostDB.id == post_id_int).first()
    else:
        # Search by slug
        post = db.query(BlogPostDB).filter(BlogPostDB.slug == post_id).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    # Check if post is published (unless user is author)
    if not post.published:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    # Get author information
    author = db.query(UserDB).filter(UserDB.id == post.author_id).first()
    if not author:
        raise HTTPException(status_code=500, detail="Author not found")
    
    # Get tags for this post
    tag_query = db.query(BlogTagDB.name).join(
        PostTagDB, BlogTagDB.id == PostTagDB.tag_id
    ).filter(PostTagDB.post_id == post.id)
    
    tags = [tag[0] for tag in tag_query.all()]
    
    # Calculate reading metrics
    word_count = len(post.content.split()) if post.content else 0
    # Assume average reading speed of 200 words per minute
    reading_time_minutes = max(1, round(word_count / 200))
    
    # Build response
    return BlogPostDetailResponse(
        id=post.id,
        title=post.title,
        slug=post.slug,
        excerpt=post.excerpt,
        content=post.content,
        featured_image=post.featured_image,
        published=post.published,
        created_at=post.created_at,
        updated_at=post.updated_at,
        author_id=post.author_id,
        author_username=author.username,
        author_email=author.email,
        tags=tags,
        word_count=word_count,
        reading_time_minutes=reading_time_minutes
    )

# Alternative endpoint for slug-based access
@app.get("/api/blog/slug/{{slug}}")
def blog_get_by_slug_endpoint(
    slug: str,
    db: Session = Depends(get_db)
):
    """
    Retrieve blog post by slug (SEO-friendly URL).
    
    Args:
        slug: Blog post slug (URL-friendly identifier)
    
    Returns:
        BlogPostDetailResponse: Complete blog post
    """
    post = db.query(BlogPostDB).filter(BlogPostDB.slug == slug).first()
    
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    if not post.published:
        raise HTTPException(status_code=404, detail="Blog post not found")
    
    # Get author information
    author = db.query(UserDB).filter(UserDB.id == post.author_id).first()
    if not author:
        raise HTTPException(status_code=500, detail="Author not found")
    
    # Get tags
    tag_query = db.query(BlogTagDB.name).join(
        PostTagDB, BlogTagDB.id == PostTagDB.tag_id
    ).filter(PostTagDB.post_id == post.id)
    
    tags = [tag[0] for tag in tag_query.all()]
    
    # Calculate metrics
    word_count = len(post.content.split()) if post.content else 0
    reading_time_minutes = max(1, round(word_count / 200))
    
    return BlogPostDetailResponse(
        id=post.id,
        title=post.title,
        slug=post.slug,
        excerpt=post.excerpt,
        content=post.content,
        featured_image=post.featured_image,
        published=post.published,
        created_at=post.created_at,
        updated_at=post.updated_at,
        author_id=post.author_id,
        author_username=author.username,
        author_email=author.email,
        tags=tags,
        word_count=word_count,
        reading_time_minutes=reading_time_minutes
    )'''

    return endpoint_code.strip()


# Register with token "bg"
ENDPOINT_TOKEN = "bg"
