# sevdo_frontend/prefabs/menu_category.py
def render_prefab(args, props):
    # Default values
    category_name = props.get("categoryName", "Appetizers")
    description = props.get(
        "description", "Start your meal with our delicious selection of appetizers"
    )
    category_image = props.get("categoryImage", "")

    # Default sample menu items for the category
    default_items = [
        {
            "name": "Bruschetta Trio",
            "description": "Three varieties of our signature bruschetta with fresh tomatoes, basil, and mozzarella",
            "price": "12.95",
            "dietary": ["vegetarian"],
        },
        {
            "name": "Calamari Fritti",
            "description": "Crispy fried squid rings served with spicy marinara sauce and lemon",
            "price": "14.95",
            "dietary": [],
        },
        {
            "name": "Antipasto Platter",
            "description": "Selection of cured meats, artisanal cheeses, olives, and roasted vegetables",
            "price": "18.95",
            "dietary": ["gluten-free"],
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
                        category_name = node.args
                    elif node.token == "t" and node.args:
                        description = node.args
        except Exception:
            category_name = args if args else category_name

    # Generate category header with optional image
    header_image = ""
    if category_image:
        header_image = f'''
        <div className="w-full md:w-32 h-20 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-6">
            <img className="w-full h-full object-cover" src="{category_image}" alt="{category_name}" />
        </div>'''

    # Generate menu items using the default structure
    menu_items_html = ""
    for item in default_items:
        # Generate dietary badges for each item
        dietary_badges = ""
        if item["dietary"]:
            dietary_icons = {
                "vegetarian": "🥬",
                "vegan": "🌱",
                "gluten-free": "🌾",
                "spicy": "🌶️",
            }
            badges = ""
            for diet in item["dietary"]:
                if diet in dietary_icons:
                    badges += f'<span className="inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-1" title="{diet.replace("-", " ").title()}">{dietary_icons[diet]}</span>'

            if badges:
                dietary_badges = (
                    f'<div className="flex items-center mb-2">{badges}</div>'
                )

        menu_items_html += f"""
        <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
            <div className="flex-1">
                {dietary_badges}
                <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{item["name"]}</h4>
                    <span className="text-lg font-bold text-red-600 ml-4">${item["price"]}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{item["description"]}</p>
            </div>
        </div>"""

    return f"""<section className="mb-12">
    <!-- Category Header -->
    <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex flex-col md:flex-row items-start">
            {header_image}
            <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{category_name}</h2>
                <p className="text-gray-600 text-lg">{description}</p>
            </div>
        </div>
    </div>
    
    <!-- Menu Items Grid -->
    <div className="grid gap-4 md:gap-6">
        {menu_items_html}
    </div>
</section>"""


# Register with token "mc"
COMPONENT_TOKEN = "mc"
