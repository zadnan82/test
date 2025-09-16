# sevdo_frontend/prefabs/gallery_item.py
def render_prefab(args, props):
    # Default values
    title = props.get("title", "Gallery Item")
    before_image = props.get("before", "before-placeholder.jpg")
    after_image = props.get("after", "after-placeholder.jpg")
    description = props.get("description", "Beautiful transformation")
    category = props.get("category", "wedding")
    
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
                        
            # Parse props from the component usage
            if hasattr(args, 'split') and '{' in args and '}' in args:
                # Extract props from {prop=value,prop2=value2} format
                props_str = args.split('{')[1].split('}')[0] if '{' in args else ""
                if props_str:
                    for prop in props_str.split(','):
                        if '=' in prop:
                            key, value = prop.split('=', 1)
                            key = key.strip()
                            value = value.strip()
                            
                            if key == "before":
                                before_image = value
                            elif key == "after":
                                after_image = value
                            elif key == "description":
                                description = value
                            elif key == "category":
                                category = value
        except Exception:
            title = args if args else title
    
    return f"""<div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
  <div className="relative">
    <div className="grid grid-cols-2 gap-0">
      <!-- Before Image -->
      <div className="relative group">
        <img src="/images/gallery/{before_image}" alt="Before - {title}" 
             className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
             onError="this.src='https://via.placeholder.com/400x300?text=Before'" />
        <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Före
        </div>
      </div>
      
      <!-- After Image -->
      <div className="relative group">
        <img src="/images/gallery/{after_image}" alt="After - {title}" 
             className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
             onError="this.src='https://via.placeholder.com/400x300?text=After'" />
        <div className="absolute top-3 right-3 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Efter
        </div>
      </div>
    </div>
    
    <!-- Category Badge -->
    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
      {category.title()}
    </div>
  </div>
  
  <div className="p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    
    <div className="flex justify-between items-center mt-4">
      <button className="text-pink-600 hover:text-pink-700 font-semibold text-sm transition-colors duration-300">
        Se fler bilder →
      </button>
      <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300">
        Inspireras
      </button>
    </div>
  </div>
</div>"""

# Register with token "gl"
COMPONENT_TOKEN = "gl"
