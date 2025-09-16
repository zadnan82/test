# sevdo_frontend/prefabs/feature_list.py
def render_prefab(args, props):
    # Default values
    title = props.get("title", "Why Choose Our Platform")
    subtitle = props.get(
        "subtitle", "Everything you need to succeed, built for modern teams"
    )
    style = props.get("style", "cards")  # cards, minimal, animated
    layout = props.get("layout", "grid")  # grid, list, masonry

    # Default features with modern SaaS benefits
    default_features = [
        {
            "icon": "⚡",
            "title": "Lightning Fast",
            "description": "Load times under 200ms with our global CDN network",
            "metric": "3x faster",
        },
        {
            "icon": "🔒",
            "title": "Enterprise Security",
            "description": "SOC 2 compliant with end-to-end encryption",
            "metric": "99.9% secure",
        },
        {
            "icon": "🚀",
            "title": "Auto-Scaling",
            "description": "Handle millions of requests without breaking a sweat",
            "metric": "10M+ requests",
        },
        {
            "icon": "📊",
            "title": "Real-time Analytics",
            "description": "Live dashboards with actionable insights",
            "metric": "Live data",
        },
        {
            "icon": "🔄",
            "title": "Zero Downtime",
            "description": "Continuous deployment with instant rollbacks",
            "metric": "99.99% uptime",
        },
        {
            "icon": "🤝",
            "title": "24/7 Support",
            "description": "Expert human support when you need it most",
            "metric": "5min response",
        },
    ]

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

    # Generate feature cards based on style
    if style == "minimal":
        features_html = ""
        for feature in default_features:
            features_html += f"""
        <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-all duration-300">
            <div className="text-2xl">{feature["icon"]}</div>
            <div>
                <h3 className="font-semibold text-gray-900">{feature["title"]}</h3>
                <p className="text-gray-600 text-sm mt-1">{feature["description"]}</p>
            </div>
            <div className="ml-auto text-blue-600 font-bold text-sm">{feature["metric"]}</div>
        </div>"""

    elif style == "animated":
        features_html = ""
        for i, feature in enumerate(default_features):
            features_html += f"""
        <div className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
            <div className="relative z-10">
                <div className="text-3xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature["icon"]}</div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">{feature["title"]}</h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{feature["description"]}</p>
                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                    {feature["metric"]}
                </div>
            </div>
        </div>"""

    else:  # cards (default)
        features_html = ""
        for feature in default_features:
            features_html += f"""
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all duration-300">
            <div className="text-3xl mb-4">{feature["icon"]}</div>
            <h3 className="font-bold text-gray-900 mb-2">{feature["title"]}</h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{feature["description"]}</p>
            <div className="text-blue-600 font-semibold text-sm">{feature["metric"]}</div>
        </div>"""

    # Layout classes
    if layout == "list":
        grid_class = "space-y-4"
    elif layout == "masonry":
        grid_class = "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
    else:  # grid (default)
        grid_class = "grid md:grid-cols-2 lg:grid-cols-3 gap-6"

    return f'''<section className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-12">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
    </div>
    <div className="{grid_class}">{features_html}
    </div>
  </div>
</section>'''


# Register with token "fl"
COMPONENT_TOKEN = "fl"
