# sevdo_frontend/prefabs/menu_component.py
def render_prefab(args, props):
    # Default values
    title = props.get("title", "Menu")
    orientation = props.get("orientation", "horizontal")  # horizontal or vertical
    items = props.get("items", ["Home", "About", "Services", "Contact"])
    brand_text = props.get("brandText", "Brand")
    
    # Support for nested components 
    # If the args is a nested structure like "h(Custom Title)" 
    # we can extract and use those values
    if args:
        # Import parser when needed to avoid circular imports
        import sys
        import os
        # Get the parent directory path
        parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        if parent_dir not in sys.path:
            sys.path.append(parent_dir)
        # Import directly from the file
        from frontend_compiler import parse_dsl, _jsx_for_token
        try:
            # Try to parse args as DSL
            nodes = parse_dsl(args)
            if nodes:
                for node in nodes:
                    # Replace title/brand if h() token is found  
                    if node.token == "h" and node.args:
                        brand_text = node.args
                    # Replace orientation if o() token is found
                    elif node.token == "o" and node.args:
                        orientation = node.args
                    # Replace items if m() token is found (comma-separated)
                    elif node.token == "m" and node.args:
                        items = [item.strip() for item in node.args.split(",")]
        except Exception:
            # If parsing fails, just use args as the brand text
            brand_text = args
    
    # Generate menu items
    if orientation == "vertical":
        # Vertical menu (sidebar style)
        menu_items = "\n".join([
            f'    <li><a href="#" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600 transition-colors duration-200">{item}</a></li>'
            for item in items
        ])
        
        return f"""<div className="w-64 bg-white border-r border-gray-200 shadow-sm">
  <div className="px-6 py-4 border-b border-gray-200">
    <h2 className="text-lg font-semibold text-gray-800">{brand_text}</h2>
  </div>
  <nav className="py-4">
    <ul className="space-y-1">
{menu_items}
    </ul>
  </nav>
</div>"""
    
    else:
        # Horizontal menu (navbar style)
        menu_items = "\n".join([
            f'        <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">{item}</a>'
            for item in items
        ])
        
        return f"""<nav className="bg-white shadow-sm border-b border-gray-200">
  <div className="max-w-6xl mx-auto px-4">
    <div className="flex justify-between items-center py-4">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-gray-800">{brand_text}</h1>
      </div>
      <div className="hidden md:flex space-x-1">
{menu_items}
      </div>
      <div className="md:hidden">
        <button className="text-gray-700 hover:text-blue-600 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</nav>"""

# Register with token "mn"
COMPONENT_TOKEN = "mn"
