# sevdo_frontend/prefabs/article_layout.py
def render_prefab(args, props):
    # Default values
    title = props.get("title", "How to Build Better Web Applications")
    content = props.get(
        "content",
        "This is the main article content. It would contain the full text of the blog post with proper formatting and structure.",
    )
    author = props.get("author", "John Doe")
    date = props.get("date", "March 15, 2024")
    reading_time = props.get("readingTime", "5 min read")
    tags = props.get("tags", ["web-development", "programming", "tutorial"])
    featured_image = props.get("featuredImage", "")
    back_to_blog_text = props.get("backToBlogText", "← Back to Blog")

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
                        content = node.args
                    elif node.token == "b" and node.args:
                        back_to_blog_text = node.args
        except Exception:
            title = args if args else title

    # Generate featured image section
    featured_image_section = ""
    if featured_image:
        featured_image_section = f'''
        <div className="mb-8">
            <img className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md" src="{featured_image}" alt="{title}" />
        </div>'''

    # Generate tags section
    tags_html = " ".join(
        [
            f'<span className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-3 py-1 rounded-full mr-2 mb-2 transition-colors cursor-pointer">#{tag}</span>'
            for tag in tags
        ]
    )

    return f"""<article className="max-w-4xl mx-auto px-4 py-8">
    <!-- Back to Blog Navigation -->
    <nav className="mb-8">
        <button className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            {back_to_blog_text}
        </button>
    </nav>

    <!-- Article Header -->
    <header className="mb-8">
        <div className="mb-4">
            {tags_html}
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {title}
        </h1>
        
        <div className="flex flex-wrap items-center text-gray-600 text-sm mb-6">
            <div className="flex items-center mr-6 mb-2">
                <div className="w-8 h-8 bg-gray-300 rounded-full mr-3"></div>
                <span className="font-medium">{author}</span>
            </div>
            
            <div className="flex items-center mr-6 mb-2">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <time>{date}</time>
            </div>
            
            <div className="flex items-center mb-2">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{reading_time}</span>
            </div>
        </div>
    </header>

    {featured_image_section}

    <!-- Article Content -->
    <div className="prose prose-lg max-w-none mb-12">
        <div className="text-gray-700 leading-relaxed text-lg">
            {content}
        </div>
    </div>

    <!-- Article Footer -->
    <footer className="border-t border-gray-200 pt-8">
        <!-- Share Buttons -->
        <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
            <div className="flex space-x-4">
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                    Twitter
                </button>
                
                <button className="inline-flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors duration-200 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                </button>
                
                <button className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 text-sm">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                    </svg>
                    Copy Link
                </button>
            </div>
        </div>

        <!-- Author Bio -->
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0"></div>
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">About {author}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Software developer with a passion for creating beautiful, functional web applications. 
                        I love sharing knowledge and helping others learn to code.
                    </p>
                    <div className="flex space-x-4 mt-3">
                        <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">Website</a>
                        <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">Twitter</a>
                        <a href="#" className="text-blue-600 hover:text-blue-700 text-sm">LinkedIn</a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Related Posts Placeholder -->
        <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
                    <p>Related post 1</p>
                    <p className="text-sm">Use blog post cards here</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
                    <p>Related post 2</p>
                    <p className="text-sm">Use blog post cards here</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
                    <p>Related post 3</p>
                    <p className="text-sm">Use blog post cards here</p>
                </div>
            </div>
        </div>
    </footer>
</article>"""


# Register with token "al"
COMPONENT_TOKEN = "al"
