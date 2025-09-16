# sevdo_frontend/prefabs/page_component.py
def render_prefab(args, props):
    # Default values
    title = props.get("title", "Page Title")
    nav_title = props.get("navTitle", "My Website")
    content = props.get("content", "Welcome to this page!")

    footer_text = props.get("footerText", "© 2025 My Website. All rights reserved.")

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
 
                    # Replace title if h() token is found
 
                    if node.token == "h" and node.args:
                        title = node.args
                    # Replace content if c() token is found
                    elif node.token == "c" and node.args:
                        content = node.args
                    # Replace nav title if n() token is found
                    elif node.token == "n" and node.args:
                        nav_title = node.args
        except Exception:
            # If parsing fails, just use args as the title
            title = args
 
    # Generate full page layout with customized parts
    return f"""<div className="min-h-screen flex flex-col">
  <header className="bg-blue-600 text-white shadow-lg">
    <nav className="max-w-6xl mx-auto px-4 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{nav_title}</h1>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-blue-200">Home</a>
          <a href="#" className="hover:text-blue-200">About</a>
          <a href="#" className="hover:text-blue-200">Contact</a>
        </div>
      </div>
    </nav>
  </header>
  
  <main className="flex-1 max-w-6xl mx-auto px-4 py-8">
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>
      <div className="prose max-w-none">
        <p className="text-gray-600 leading-relaxed">{content}</p>
      </div>
    </div>
  </main>
  
  <footer className="bg-gray-800 text-white py-6 mt-8">
    <div className="max-w-6xl mx-auto px-4 text-center">
      <p className="text-gray-300">{footer_text}</p>
    </div>
  </footer>
</div>"""

 
# Register with token "pg"
COMPONENT_TOKEN = "pg"
