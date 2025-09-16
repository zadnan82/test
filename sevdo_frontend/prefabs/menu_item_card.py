# sevdo_frontend/prefabs/menu_item_card.py
def render_prefab(args, props):
    # Default values
    name = props.get("name", "Grilled Salmon")
    description = props.get(
        "description",
        "Fresh Atlantic salmon grilled to perfection, served with seasonal vegetables and lemon butter sauce",
    )
    price = props.get("price", "24.95")
    currency = props.get("currency", "$")
    dietary = props.get(
        "dietary", []
    )  # ["vegetarian", "vegan", "gluten-free", "spicy"]
    image_url = props.get("imageUrl", "")
    popular = props.get("popular", False)

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
                        name = node.args
                    elif node.token == "t" and node.args:
                        description = node.args
        except Exception:
            name = args if args else name

    # Generate dietary indicators
    dietary_badges = ""
    if dietary:
        dietary_icons = {
            "vegetarian": "🥬",
            "vegan": "🌱",
            "gluten-free": "🌾",
            "spicy": "🌶️",
            "organic": "🌿",
            "local": "🏠",
        }

        badges = ""
        for diet in dietary:
            if diet in dietary_icons:
                badges += f'<span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-1" title="{diet.replace("-", " ").title()}">{dietary_icons[diet]}</span>'

        if badges:
            dietary_badges = f'<div className="flex items-center mb-2">{badges}</div>'

    # Generate popular badge
    popular_badge = ""
    if popular:
        popular_badge = """
        <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Popular</span>
        </div>"""

    # Generate image section
    image_section = ""
    if image_url:
        image_section = f'''
        <div className="w-full md:w-32 h-24 md:h-20 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-4 flex-shrink-0">
            <img className="w-full h-full object-cover" src="{image_url}" alt="{name}" />
        </div>'''

    return f"""<div className="relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
    {popular_badge}
    <div className="flex flex-col md:flex-row">
        {image_section}
        <div className="flex-1">
            {dietary_badges}
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                <span className="text-lg font-bold text-red-600 ml-4">{currency}{price}</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
        </div>
    </div>
</div>"""


# Register with token "mic"
COMPONENT_TOKEN = "mic"
