# sevdo_frontend/prefabs/card_component.py
def render_prefab(args, props):
    # Default values
    title = "Card Title"
    content = props.get("content", "This is a card with some content.")
    button_text = props.get("buttonText", "Learn More")
    image_url = props.get("imageUrl", "")
    footer_text = props.get("footerText", "")
    
    # Support for nested components 
    # If the args is a nested structure like "b(Custom Button Text)" 
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
                    # Replace button text if b() token is found
                    if node.token == "b" and node.args:
                        button_text = node.args
                    # Replace title if h() token is found  
                    elif node.token == "h" and node.args:
                        title = node.args
                    # Replace content if t() token is found (text)
                    elif node.token == "t" and node.args:
                        content = node.args
                    # Replace image if i() token is found
                    elif node.token == "i" and node.args:
                        image_url = node.args
                    # Replace footer if ft() token is found
                    elif node.token == "ft" and node.args:
                        footer_text = node.args
        except Exception:
            # If parsing fails, just use args as the title
            title = args
    
    # Generate image section if URL provided
    image_section = ""
    if image_url:
        image_section = f'<img className="w-full h-48 object-cover rounded-t-lg" src="{image_url}" alt="{title}" />'
    
    # Generate footer section if text provided
    footer_section = ""
    if footer_text:
        footer_section = f'''
    <div className="px-6 py-3 bg-gray-50 border-t rounded-b-lg">
      <p className="text-sm text-gray-600">{footer_text}</p>
    </div>'''
            
    # Generate card with customized parts
    return f"""<div className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
  {image_section}
  <div className="p-6">
    <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
    <p className="text-gray-600 mb-4 leading-relaxed">{content}</p>
    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200">
      {button_text}
    </button>
  </div>{footer_section}
</div>"""

# Register with token "cd"
COMPONENT_TOKEN = "cd"
