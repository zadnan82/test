# sevdo_backend/endpoints/blog_search.py
"""
Blog search endpoint - advanced search functionality for blog posts.
"""


def render_endpoint(args=None, props=None):
    """
    Render blog search endpoint code.

    Args:
        args: String arguments from DSL (optional parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Default values
    endpoint_path = (
        props.get("path", "/api/blog/search") if props else "/api/blog/search"
    )
    method = props.get("method", "GET").upper() if props else "GET"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        pass

    # Generate the blog search endpoint code
    endpoint_code = f'''
# Search result response model
class BlogSearchResult(BaseModel):
    id: int
    title: str
    slug: str
    excerpt: Optional[str] = None
    featured_image: Optional[str] = None
    created_at: datetime
    author_username: str
    tags: List[str] = []
    match_score: float
    match_type: str  # "title", "content", "tag", "author"

class BlogSearchResponse(BaseModel):
    results: List[BlogSearchResult]
    total: int
    query: str
    page: int
    limit: int
    has_next: bool
    has_prev: bool
    search_time_ms: float
    suggestions: List[str] = []

@app.{method.lower()}("{endpoint_path}")
def blog_search_endpoint(
    q: str,
    page: int = 1,
    limit: int = 10,
    author: Optional[str] = None,
    tag: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    sort: str = "relevance",
    db: Session = Depends(get_db)
):
    """
    Advanced search in blog posts.
    
    Query parameters:
    - q: Search term (required)
    - page: Page number (default: 1)
    - limit: Results per page (default: 10, max: 50)
    - author: Filter by author username
    - tag: Filter by tag
    - date_from: Filter from date (YYYY-MM-DD)
    - date_to: Filter to date (YYYY-MM-DD)
    - sort: Sort order (relevance, date_desc, date_asc, title_asc)
    """
    import time
    start_time = time.time()
    
    # Validation
    if not q or len(q.strip()) < 2:
        raise HTTPException(status_code=400, detail="Search query must be at least 2 characters")
    
    if page < 1:
        raise HTTPException(status_code=400, detail="Page must be >= 1")
    if limit < 1 or limit > 50:
        raise HTTPException(status_code=400, detail="Limit must be between 1 and 50")
    
    query_term = q.strip().lower()
    
    # Base query - only published posts
    base_query = db.query(BlogPostDB).filter(BlogPostDB.published == True)
    
    # Join with author for filtering and result data
    base_query = base_query.join(UserDB, BlogPostDB.author_id == UserDB.id)
    
    # Author filter
    if author:
        base_query = base_query.filter(UserDB.username.ilike(f"%{{author}}%"))
    
    # Date filters
    if date_from:
        try:
            from_date = datetime.strptime(date_from, "%Y-%m-%d")
            base_query = base_query.filter(BlogPostDB.created_at >= from_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date_from format. Use YYYY-MM-DD")
    
    if date_to:
        try:
            to_date = datetime.strptime(date_to, "%Y-%m-%d")
            # Add 1 day to include the entire day
            to_date = to_date.replace(hour=23, minute=59, second=59)
            base_query = base_query.filter(BlogPostDB.created_at <= to_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date_to format. Use YYYY-MM-DD")
    
    # Tag filter
    if tag:
        base_query = base_query.join(PostTagDB, BlogPostDB.id == PostTagDB.post_id)
        base_query = base_query.join(BlogTagDB, PostTagDB.tag_id == BlogTagDB.id)
        base_query = base_query.filter(BlogTagDB.name.ilike(f"%{{tag}}%"))
    
    # Text search with scoring
    search_conditions = []
    
    # Title search (highest score)
    title_condition = BlogPostDB.title.ilike(f"%{{query_term}}%")
    search_conditions.append(title_condition)
    
    # Content search
    content_condition = BlogPostDB.content.ilike(f"%{{query_term}}%")
    search_conditions.append(content_condition)
    
    # Excerpt search
    excerpt_condition = BlogPostDB.excerpt.ilike(f"%{{query_term}}%")
    search_conditions.append(excerpt_condition)
    
    # Apply search conditions
    if search_conditions:
        from sqlalchemy import or_
        search_query = base_query.filter(or_(*search_conditions))
    else:
        search_query = base_query
    
    # Get total count
    total = search_query.count()
    
    # Apply sorting
    if sort == "date_asc":
        search_query = search_query.order_by(BlogPostDB.created_at.asc())
    elif sort == "title_asc":
        search_query = search_query.order_by(BlogPostDB.title.asc())
    elif sort == "date_desc":
        search_query = search_query.order_by(BlogPostDB.created_at.desc())
    else:  # relevance (default)
        # Simple relevance: title matches first, then by date
        search_query = search_query.order_by(
            BlogPostDB.title.ilike(f"%{{query_term}}%").desc(),
            BlogPostDB.created_at.desc()
        )
    
    # Pagination
    offset = (page - 1) * limit
    posts = search_query.offset(offset).limit(limit).all()
    
    # Prepare results with scoring
    results = []
    post_ids = [post.id for post in posts]
    
    # Get tags for all posts
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
    
    # Calculate match scores and types
    for post in posts:
        # Simple scoring algorithm
        score = 0.0
        match_type = "content"
        
        title_lower = post.title.lower()
        content_lower = (post.content or "").lower()
        excerpt_lower = (post.excerpt or "").lower()
        
        # Title match (highest score)
        if query_term in title_lower:
            if title_lower == query_term:
                score = 1.0  # Exact title match
            elif title_lower.startswith(query_term):
                score = 0.9  # Title starts with query
            else:
                score = 0.8  # Title contains query
            match_type = "title"
        
        # Excerpt match
        elif query_term in excerpt_lower:
            score = 0.6
            match_type = "excerpt"
        
        # Content match
        elif query_term in content_lower:
            # Count occurrences for better scoring
            occurrences = content_lower.count(query_term)
            score = min(0.5 + (occurrences * 0.05), 0.7)
            match_type = "content"
        
        # Tag match
        post_tag_names = [tag.lower() for tag in post_tags.get(post.id, [])]
        if any(query_term in tag for tag in post_tag_names):
            score = max(score, 0.4)
            if score == 0.4:
                match_type = "tag"
        
        # Get author info
        author = db.query(UserDB).filter(UserDB.id == post.author_id).first()
        
        result = BlogSearchResult(
            id=post.id,
            title=post.title,
            slug=post.slug,
            excerpt=post.excerpt,
            featured_image=post.featured_image,
            created_at=post.created_at,
            author_username=author.username if author else "Unknown",
            tags=post_tags.get(post.id, []),
            match_score=score,
            match_type=match_type
        )
        results.append(result)
    
    # Sort by score if relevance sorting
    if sort == "relevance":
        results.sort(key=lambda x: x.match_score, reverse=True)
    
    # Calculate search time
    search_time_ms = (time.time() - start_time) * 1000
    
    # Generate search suggestions (simple implementation)
    suggestions = []
    if total == 0:
        # Suggest similar terms or popular tags
        popular_tags = db.query(BlogTagDB.name).limit(5).all()
        suggestions = [tag[0] for tag in popular_tags]
    
    # Pagination info
    has_next = offset + limit < total
    has_prev = page > 1
    
    return BlogSearchResponse(
        results=results,
        total=total,
        query=q,
        page=page,
        limit=limit,
        has_next=has_next,
        has_prev=has_prev,
        search_time_ms=round(search_time_ms, 2),
        suggestions=suggestions
    )

# Quick search endpoint for autocomplete
@app.get("/api/blog/search/suggestions")
def blog_search_suggestions_endpoint(
    q: str,
    limit: int = 5,
    db: Session = Depends(get_db)
):
    """
    Quick search suggestions for autocomplete.
    
    Args:
        q: Partial search term
        limit: Number of suggestions (max 10)
    
    Returns:
        List of title suggestions
    """
    if len(q.strip()) < 2:
        return {{"suggestions": []}}
    
    if limit > 10:
        limit = 10
    
    query_term = q.strip()
    
    # Search in titles for quick suggestions
    suggestions = db.query(BlogPostDB.title).filter(
        BlogPostDB.published == True,
        BlogPostDB.title.ilike(f"%{{query_term}}%")
    ).limit(limit).all()
    
    return {{
        "suggestions": [title[0] for title in suggestions]
    }}'''

    return endpoint_code.strip()


# Register with token "bs"
ENDPOINT_TOKEN = "bs"
