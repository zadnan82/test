# sevdo_backend/endpoints/blog_posts.py
"""
Blog posts endpoint - list all published blog posts with pagination and filtering.
"""


def render_endpoint(args=None, props=None):
    """
    Render blog posts list endpoint code.

    Args:
        args: String arguments from DSL (optional parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Default values
    endpoint_path = props.get("path", "/api/blog/posts") if props else "/api/blog/posts"
    method = props.get("method", "GET").upper() if props else "GET"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        pass

    # Generate the blog posts endpoint code
    endpoint_code = f'''
# Blog post data models
class BlogPostResponse(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str] = None
    content: Optional[str] = None
    featured_image: Optional[str] = None
    published: bool
    created_at: datetime
    updated_at: datetime
    author_id: int
    author_username: Optional[str] = None
    tags: List[str] = []

class BlogPostsListResponse(BaseModel):
    posts: List[BlogPostResponse]
    total: int
    page: int
    limit: int
    has_next: bool
    has_prev: bool

# Blog post database model
class BlogPostDB(Base):
    __tablename__ = "blog_posts"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    slug = Column(String(200), unique=True, index=True)
    excerpt = Column(Text)
    content = Column(Text, nullable=False)
    featured_image = Column(String(500))
    published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    author_id = Column(Integer, ForeignKey("users.id"))

# Blog tags model
class BlogTagDB(Base):
    __tablename__ = "blog_tags"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), unique=True, nullable=False)

# Post-tag relationship table
class PostTagDB(Base):
    __tablename__ = "post_tags"
    post_id = Column(Integer, ForeignKey("blog_posts.id"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("blog_tags.id"), primary_key=True)

@app.{method.lower()}("{endpoint_path}")
def blog_posts_endpoint(
    page: int = 1,
    limit: int = 10,
    published: Optional[bool] = None,
    author_id: Optional[int] = None,
    tag: Optional[str] = None,
    search: Optional[str] = None,
    sort: str = "created_at_desc",
    include_content: bool = False,
    db: Session = Depends(get_db)
):
    """
    List blog posts with pagination and filtering.
    
    Query parameters:
    - page: Page number (default: 1)
    - limit: Posts per page (default: 10, max: 100)
    - published: Filter by published status (true/false)
    - author_id: Filter by author ID
    - tag: Filter by tag name
    - search: Text search in title and content
    - sort: Sort order (created_at_desc, created_at_asc, title_asc, title_desc)
    - include_content: Include full content (default: false)
    """
    # Validate parameters
    if page < 1:
        raise HTTPException(status_code=400, detail="Page must be >= 1")
    if limit < 1 or limit > 100:
        raise HTTPException(status_code=400, detail="Limit must be between 1 and 100")
    
    # Base query
    query = db.query(BlogPostDB)
    
    # Join with users for author info
    query = query.join(UserDB, BlogPostDB.author_id == UserDB.id)
    
    # Filter by published status
    if published is not None:
        query = query.filter(BlogPostDB.published == published)
    
    # Filter by author
    if author_id:
        query = query.filter(BlogPostDB.author_id == author_id)
    
    # Filter by tag
    if tag:
        query = query.join(PostTagDB, BlogPostDB.id == PostTagDB.post_id)
        query = query.join(BlogTagDB, PostTagDB.tag_id == BlogTagDB.id)
        query = query.filter(BlogTagDB.name == tag)
    
    # Text search
    if search:
        search_term = f"%{{search}}%"
        query = query.filter(
            db.or_(
                BlogPostDB.title.ilike(search_term),
                BlogPostDB.content.ilike(search_term),
                BlogPostDB.excerpt.ilike(search_term)
            )
        )
    
    # Sorting
    if sort == "created_at_asc":
        query = query.order_by(BlogPostDB.created_at.asc())
    elif sort == "title_asc":
        query = query.order_by(BlogPostDB.title.asc())
    elif sort == "title_desc":
        query = query.order_by(BlogPostDB.title.desc())
    else:  # default: created_at_desc
        query = query.order_by(BlogPostDB.created_at.desc())
    
    # Count total
    total = query.count()
    
    # Pagination
    offset = (page - 1) * limit
    posts = query.offset(offset).limit(limit).all()
    
    # Get tags for each post
    post_ids = [post.id for post in posts]
    if post_ids:
        tag_query = db.query(PostTagDB.post_id, BlogTagDB.name).join(
            BlogTagDB, PostTagDB.tag_id == BlogTagDB.id
        ).filter(PostTagDB.post_id.in_(post_ids))
        post_tags = {{}}
        for post_id, tag_name in tag_query:
            if post_id not in post_tags:
                post_tags[post_id] = []
            post_tags[post_id].append(tag_name)
    else:
        post_tags = {{}}
    
    # Build response
    post_responses = []
    for post in posts:
        # Get author info
        author = db.query(UserDB).filter(UserDB.id == post.author_id).first()
        
        post_data = {{
            "id": post.id,
            "title": post.title,
            "slug": post.slug,
            "excerpt": post.excerpt,
            "content": post.content if include_content else None,
            "featured_image": post.featured_image,
            "published": post.published,
            "created_at": post.created_at,
            "updated_at": post.updated_at,
            "author_id": post.author_id,
            "author_username": author.username if author else None,
            "tags": post_tags.get(post.id, [])
        }}
        post_responses.append(post_data)
    
    # Pagination info
    has_next = offset + limit < total
    has_prev = page > 1
    
    return BlogPostsListResponse(
        posts=post_responses,
        total=total,
        page=page,
        limit=limit,
        has_next=has_next,
        has_prev=has_prev
    )'''

    return endpoint_code.strip()


# Register with token "bp"
ENDPOINT_TOKEN = "bp"
