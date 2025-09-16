# sevdo_frontend/prefabs/blog_list.py
def render_prefab(args, props):
    # Default values
    title = props.get("title", "Latest Articles")
    subtitle = props.get("subtitle", "Thoughts, tutorials, and insights")
    layout = props.get("layout", "grid")  # grid, list
    posts_per_page = props.get("postsPerPage", 6)
    show_filters = props.get("showFilters", "true")
    show_search = props.get("showSearch", "true")

    # Default categories and sample posts
    categories = props.get(
        "categories",
        ["All", "Web Development", "Tutorial", "Design", "JavaScript", "React"],
    )

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
                        subtitle = node.args
        except Exception:
            title = args if args else title

    # Generate search bar
    search_section = ""
    if show_search == "true":
        search_section = """
        <div className="mb-8">
            <div className="relative max-w-md mx-auto">
                <input 
                    type="text" 
                    placeholder="Search articles..." 
                    className="w-full px-4 py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
            </div>
        </div>"""

    # Generate filter section
    filter_section = ""
    if show_filters == "true":
        category_buttons = " ".join(
            [
                f'''<button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 {"bg-blue-100 text-blue-600" if category == "All" else ""}" data-category="{category.lower().replace(" ", "-")}">{category}</button>'''
                for category in categories
            ]
        )

        filter_section = f"""
        <div className="mb-8">
            <div className="flex flex-wrap gap-2 justify-center">
                {category_buttons}
            </div>
        </div>"""

    # Generate grid layout classes
    if layout == "list":
        grid_class = "space-y-6"
        post_card_class = "flex flex-col md:flex-row md:space-x-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    else:  # grid
        grid_class = "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        post_card_class = "bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"

    # Generate sample blog post cards (in real implementation, these would be dynamic)
    sample_posts = [
        {
            "title": "Getting Started with React Hooks",
            "excerpt": "Learn how to use React Hooks to build more efficient and cleaner functional components in your applications.",
            "date": "March 15, 2024",
            "author": "Jane Smith",
            "category": "React",
            "readTime": "5 min read",
        },
        {
            "title": "CSS Grid vs Flexbox: When to Use What",
            "excerpt": "A comprehensive guide to understanding the differences between CSS Grid and Flexbox and when to use each layout method.",
            "date": "March 12, 2024",
            "author": "John Doe",
            "category": "Design",
            "readTime": "7 min read",
        },
        {
            "title": "Building REST APIs with Node.js",
            "excerpt": "Step-by-step tutorial on creating robust and scalable REST APIs using Node.js, Express, and MongoDB.",
            "date": "March 10, 2024",
            "author": "Mike Johnson",
            "category": "Tutorial",
            "readTime": "12 min read",
        },
        {
            "title": "Modern JavaScript ES6+ Features",
            "excerpt": "Explore the latest JavaScript features including arrow functions, destructuring, async/await, and more.",
            "date": "March 8, 2024",
            "author": "Sarah Wilson",
            "category": "JavaScript",
            "readTime": "8 min read",
        },
        {
            "title": "Responsive Web Design Best Practices",
            "excerpt": "Learn the fundamental principles of responsive web design and how to create websites that work on all devices.",
            "date": "March 5, 2024",
            "author": "Alex Brown",
            "category": "Web Development",
            "readTime": "6 min read",
        },
        {
            "title": "Introduction to TypeScript",
            "excerpt": "Discover how TypeScript can improve your JavaScript development with static typing and better tooling.",
            "date": "March 2, 2024",
            "author": "Emma Davis",
            "category": "Tutorial",
            "readTime": "10 min read",
        },
    ]

    # Generate post cards
    posts_html = ""
    for post in sample_posts:
        if layout == "list":
            posts_html += f'''
            <article className="{post_card_class}">
                <div className="w-full md:w-1/3">
                    <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        Featured Image
                    </div>
                </div>
                <div className="flex-1 p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-3">#{post["category"]}</span>
                        <time>{post["date"]}</time>
                        <span className="mx-2">•</span>
                        <span>{post["readTime"]}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                        {post["title"]}
                    </h2>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        {post["excerpt"]}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">by {post["author"]}</span>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Read More →</button>
                    </div>
                </div>
            </article>'''
        else:  # grid
            posts_html += f'''
            <article className="{post_card_class}">
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                    Featured Image
                </div>
                <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mr-3">#{post["category"]}</span>
                        <time>{post["date"]}</time>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2">
                        {post["title"]}
                    </h2>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                        {post["excerpt"]}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{post["readTime"]}</span>
                        <span className="text-gray-500">by {post["author"]}</span>
                    </div>
                </div>
            </article>'''

    # Generate pagination
    pagination_html = """
    <div className="flex items-center justify-center space-x-2 mt-12">
        <button className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors" disabled>
            ← Previous
        </button>
        <button className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-md">1</button>
        <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">2</button>
        <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">3</button>
        <span className="px-3 py-2 text-sm text-gray-500">...</span>
        <button className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">10</button>
        <button className="px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            Next →
        </button>
    </div>"""

    return f'''<section className="py-12 bg-gray-50 min-h-screen">
  <div className="max-w-7xl mx-auto px-4">
    <!-- Header -->
    <div className="text-center mb-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
    </div>

    {search_section}
    {filter_section}

    <!-- Blog Posts Grid/List -->
    <div className="{grid_class} mb-8">
      {posts_html}
    </div>

    {pagination_html}

    <!-- Empty State (hidden by default) -->
    <div className="hidden text-center py-12">
      <div className="text-gray-400 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
      <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
    </div>
  </div>
</section>'''


# Register with token "bl"
COMPONENT_TOKEN = "bl"
