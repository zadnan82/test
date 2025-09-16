# sevdo_backend/endpoints/blog_tags.py
"""
Blog tags endpoint - manage and retrieve blog tags with post counts.
"""


def render_endpoint(args=None, props=None):
    """
    Render blog tags endpoint code.

    Args:
        args: String arguments from DSL (optional parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Default values
    endpoint_path = props.get("path", "/api/blog/tags") if props else "/api/blog/tags"
    method = props.get("method", "GET").upper() if props else "GET"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        pass

    # Generate the blog tags endpoint code
    endpoint_code = f'''
# Tag response models
class BlogTagResponse(BaseModel):
    id: int
    name: str
    post_count: int
    slug: str

class BlogTagsListResponse(BaseModel):
    tags: List[BlogTagResponse]
    total: int

class TaggedPostsResponse(BaseModel):
    tag: BlogTagResponse
    posts: List[BlogPostResponse]
    total: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool

@app.{method.lower()}("{endpoint_path}")
def blog_tags_endpoint(
    sort: str = "post_count_desc",
    limit: Optional[int] = None,
    min_posts: int = 1,
    db: Session = Depends(get_db)
):
    """
    List all available blog tags with post counts.
    
    Query parameters:
    - sort: Sort order (post_count_desc, post_count_asc, name_asc, name_desc)
    - limit: Limit number of tags (optional)
    - min_posts: Minimum number of posts to include tag (default: 1)
    """
    # Build query with post counts
    # Count only published posts
    from sqlalchemy import func
    
    tag_query = db.query(
        BlogTagDB.id,
        BlogTagDB.name,
        func.count(PostTagDB.post_id).label('post_count')
    ).outerjoin(
        PostTagDB, BlogTagDB.id == PostTagDB.tag_id
    ).outerjoin(
        BlogPostDB, PostTagDB.post_id == BlogPostDB.id
    ).filter(
        # Only count published posts or tags with no posts
        db.or_(
            BlogPostDB.published == True,
            BlogPostDB.id.is_(None)
        )
    ).group_by(
        BlogTagDB.id, BlogTagDB.name
    ).having(
        func.count(PostTagDB.post_id) >= min_posts
    )
    
    # Apply sorting
    if sort == "post_count_asc":
        tag_query = tag_query.order_by(func.count(PostTagDB.post_id).asc())
    elif sort == "name_asc":
        tag_query = tag_query.order_by(BlogTagDB.name.asc())
    elif sort == "name_desc":
        tag_query = tag_query.order_by(BlogTagDB.name.desc())
    else:  # post_count_desc (default)
        tag_query = tag_query.order_by(func.count(PostTagDB.post_id).desc())
    
    # Apply limit if specified
    if limit and limit > 0:
        tag_query = tag_query.limit(limit)
    
    # Execute query
    tag_results = tag_query.all()
    
    # Build response
    tags = []
    for tag_id, tag_name, post_count in tag_results:
        # Generate slug from tag name
        slug = tag_name.lower().replace(' ', '-').replace('_', '-')
        # Remove special characters for clean URLs
        import re
        slug = re.sub(r'[^a-z0-9-]', '', slug)
        
        tags.append(BlogTagResponse(
            id=tag_id,
            name=tag_name,
            post_count=post_count,
            slug=slug
        ))
    
    return BlogTagsListResponse(
        tags=tags,
        total=len(tags)
    )

@app.get("/api/blog/tags/{{tag_name}}/posts")
def blog_tag_posts_endpoint(
    tag_name: str,
    page: int = 1,
    limit: int = 10,
    sort: str = "created_at_desc",
    db: Session = Depends(get_db)
):
    """
    Get all posts for a specific tag.
    
    Args:
        tag_name: Tag name or slug
        page: Page number (default: 1)
        limit: Posts per page (default: 10, max: 50)
        sort: Sort order (created_at_desc, created_at_asc, title_asc)
    """
    # Validation
    if page < 1:
        raise HTTPException(status_code=400, detail="Page must be >= 1")
    if limit < 1 or limit > 50:
        raise HTTPException(status_code=400, detail="Limit must be between 1 and 50")
    
    # Find tag by name (case insensitive)
    tag = db.query(BlogTagDB).filter(BlogTagDB.name.ilike(tag_name)).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found")
    
    # Build query for posts with this tag
    posts_query = db.query(BlogPostDB).join(
        PostTagDB, BlogPostDB.id == PostTagDB.post_id
    ).filter(
        PostTagDB.tag_id == tag.id,
        BlogPostDB.published == True
    )
    
    # Apply sorting
    if sort == "created_at_asc":
        posts_query = posts_query.order_by(BlogPostDB.created_at.asc())
    elif sort == "title_asc":
        posts_query = posts_query.order_by(BlogPostDB.title.asc())
    else:  # created_at_desc (default)
        posts_query = posts_query.order_by(BlogPostDB.created_at.desc())
    
    # Get total count
    total = posts_query.count()
    
    # Apply pagination
    offset = (page - 1) * limit
    posts = posts_query.offset(offset).limit(limit).all()
    
    # Get post IDs for tag and author queries
    post_ids = [post.id for post in posts]
    
    # Get all tags for these posts
    if post_ids:
        all_tags_query = db.query(PostTagDB.post_id, BlogTagDB.name).join(
            BlogTagDB, PostTagDB.tag_id == BlogTagDB.id
        ).filter(PostTagDB.post_id.in_(post_ids))
        
        post_tags = {{}}
        for post_id, tag_name in all_tags_query:
            if post_id not in post_tags:
                post_tags[post_id] = []
            post_tags[post_id].append(tag_name)
    else:
        post_tags = {{}}
    
    # Build post responses
    post_responses = []
    for post in posts:
        # Get author info
        author = db.query(UserDB).filter(UserDB.id == post.author_id).first()
        
        post_data = BlogPostResponse(
            id=post.id,
            title=post.title,
            slug=post.slug,
            excerpt=post.excerpt,
            content=None,  # Don't include full content in list
            featured_image=post.featured_image,
            published=post.published,
            created_at=post.created_at,
            updated_at=post.updated_at,
            author_id=post.author_id,
            author_username=author.username if author else None,
            tags=post_tags.get(post.id, [])
        )
        post_responses.append(post_data)
    
    # Count total posts for this tag
    tag_post_count = db.query(PostTagDB).join(
        BlogPostDB, PostTagDB.post_id == BlogPostDB.id
    ).filter(
        PostTagDB.tag_id == tag.id,
        BlogPostDB.published == True
    ).count()
    
    # Generate tag slug
    tag_slug = tag.name.lower().replace(' ', '-').replace('_', '-')
    import re
    tag_slug = re.sub(r'[^a-z0-9-]', '', tag_slug)
    
    tag_response = BlogTagResponse(
        id=tag.id,
        name=tag.name,
        post_count=tag_post_count,
        slug=tag_slug
    )
    
    # Pagination info
    has_next = offset + limit < total
    has_prev = page > 1
    
    return TaggedPostsResponse(
        tag=tag_response,
        posts=post_responses,
        total=total,
        page=page,
        limit=limit,
        has_next=has_next,
        has_prev=has_prev
    )

@app.get("/api/blog/tags/popular")
def blog_popular_tags_endpoint(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get the most popular tags (most used).
    
    Args:
        limit: Number of tags to return (max 20)
    """
    if limit > 20:
        limit = 20
    
    # Get most used tags
    from sqlalchemy import func
    
    popular_tags = db.query(
        BlogTagDB.id,
        BlogTagDB.name,
        func.count(PostTagDB.post_id).label('post_count')
    ).join(
        PostTagDB, BlogTagDB.id == PostTagDB.tag_id
    ).join(
        BlogPostDB, PostTagDB.post_id == BlogPostDB.id
    ).filter(
        BlogPostDB.published == True
    ).group_by(
        BlogTagDB.id, BlogTagDB.name
    ).order_by(
        func.count(PostTagDB.post_id).desc()
    ).limit(limit).all()
    
    # Build response
    tags = []
    for tag_id, tag_name, post_count in popular_tags:
        slug = tag_name.lower().replace(' ', '-').replace('_', '-')
        import re
        slug = re.sub(r'[^a-z0-9-]', '', slug)
        
        tags.append(BlogTagResponse(
            id=tag_id,
            name=tag_name,
            post_count=post_count,
            slug=slug
        ))
    
    return {{
        "tags": tags,
        "total": len(tags)
    }}'''

    return endpoint_code.strip()


# Register with token "bt"
ENDPOINT_TOKEN = "bt"
