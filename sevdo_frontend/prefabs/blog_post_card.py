# sevdo_frontend/prefabs/blog_post_card.py
def render_prefab(args, props):
    # Default values
    title = props.get("title", "Blog Post Title")
    excerpt = props.get(
        "excerpt",
        "This is a preview of the blog post content. It gives readers a taste of what to expect when they click to read more...",
    )
    date = props.get("date", "March 15, 2024")
    read_more_text = props.get("readMoreText", "Read More")
    image_url = props.get("imageUrl", "")
    author = props.get("author", "")
    tags = props.get("tags", [])

    # Support for nested components
    if args:
        import sys
        import os

        parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        if parent_dir not in sys.path:
            sys.path.append(parent_dir)
        from frontend_compiler import parse_dsl, _jsx_for_token

        try:
            nodes = parse_dsl(args)
            if nodes:
                for node in nodes:
                    if node.token == "h" and node.args:
                        title = node.args
                    elif node.token == "t" and node.args:
                        excerpt = node.args
                    elif node.token == "b" and node.args:
                        read_more_text = node.args
        except Exception:
            title = args if args else title

    # Generate image section if URL provided
    image_section = ""
    if image_url:
        image_section = f'''
        <div className="aspect-w-16 aspect-h-9 mb-4">
            <img className="w-full h-48 object-cover rounded-t-lg" src="{image_url}" alt="{title}" />
        </div>'''

    # Generate author section if provided
    author_section = ""
    if author:
        author_section = f'<span className="text-gray-500">by {author}</span>'

    # Generate tags section if provided
    tags_section = ""
    if tags:
        tags_html = " ".join(
            [
                f'<span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2">#{tag}</span>'
                for tag in tags[:3]
            ]
        )  # Limit to 3 tags
        tags_section = f'<div className="mb-3">{tags_html}</div>'

    return f"""<article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
    {image_section}
    <div className="p-6">
        {tags_section}
        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {title}
        </h2>
        <div className="flex items-center text-sm text-gray-500 mb-3">
            <time className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {date}
            </time>
            {author_section and f'<span className="mx-2">•</span>{author_section}'}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
            {excerpt}
        </p>
        <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200 group-hover:translate-x-1 transform">
            {read_more_text}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
        </button>
    </div>
</article>"""


# Register with token "bpc"
COMPONENT_TOKEN = "bpc"
