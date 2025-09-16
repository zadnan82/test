# sevdo_frontend/prefabs/wedding_package.py
def render_prefab(args, props):
    # Default values
    package_name = props.get("name", "Wedding Package")
    price = props.get("price", "50000")
    guests = props.get("guests", "75")
    duration = props.get("duration", "8 timmar")
    includes = props.get("includes", [])
    popular = props.get("popular", False)
    description = props.get("description", "Beautiful wedding package")
    
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
                        package_name = node.args
                        
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
                            
                            # Handle array values
                            if value.startswith('[') and value.endswith(']'):
                                value = value[1:-1].split(',')
                                value = [item.strip() for item in value]
                            
                            # Handle boolean values
                            if value.lower() in ['true', 'false']:
                                value = value.lower() == 'true'
                            
                            if key == "price":
                                price = value
                            elif key == "guests":
                                guests = value
                            elif key == "duration":
                                duration = value
                            elif key == "includes":
                                includes = value if isinstance(value, list) else [value]
                            elif key == "popular":
                                popular = value
                            elif key == "description":
                                description = value
        except Exception:
            package_name = args if args else package_name
    
    # Popular badge
    popular_badge = ""
    if popular:
        popular_badge = """
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                Mest populär
            </div>
        </div>"""
    
    # Card styling based on popularity
    if popular:
        card_classes = "relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl shadow-xl border-2 border-pink-300 p-8 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2"
        button_class = "w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
    else:
        card_classes = "relative bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-8 transition-all duration-300 hover:shadow-xl hover:border-pink-300"
        button_class = "w-full bg-gray-100 hover:bg-pink-50 text-gray-800 hover:text-pink-700 font-semibold py-4 px-6 rounded-xl border-2 border-gray-300 hover:border-pink-300 transition-all duration-300"
    
    # Format price
    formatted_price = f"{int(price):,}".replace(",", " ") if price.isdigit() else price
    
    # Includes list
    includes_html = ""
    if includes:
        include_list = includes if isinstance(includes, list) else [includes]
        for item in include_list:
            includes_html += f"""
                <li className="flex items-start text-gray-600 mb-3">
                    <svg className="w-5 h-5 text-pink-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    {item}
                </li>"""
    
    return f"""<div className="{card_classes}">{popular_badge}
  <div className="text-center mb-8">
    <h3 className="text-3xl font-bold text-gray-900 mb-3">{package_name}</h3>
    <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
    
    <div className="mb-6">
      <span className="text-5xl font-bold text-pink-600">{formatted_price}</span>
      <span className="text-gray-600 text-lg"> kr</span>
    </div>
    
    <div className="grid grid-cols-2 gap-4 mb-6">
      <div className="bg-white bg-opacity-50 rounded-lg p-3">
        <div className="text-2xl font-bold text-gray-900">{guests}</div>
        <div className="text-sm text-gray-600">gäster</div>
      </div>
      <div className="bg-white bg-opacity-50 rounded-lg p-3">
        <div className="text-lg font-bold text-gray-900">{duration}</div>
        <div className="text-sm text-gray-600">varaktighet</div>
      </div>
    </div>
  </div>
  
  <div className="mb-8">
    <h4 className="text-lg font-semibold text-gray-800 mb-4">Ingår i paketet:</h4>
    <ul className="space-y-2">{includes_html}
    </ul>
  </div>
  
  <button className="{button_class}">
    Välj detta paket
  </button>
  
  <div className="text-center mt-4">
    <button className="text-pink-600 hover:text-pink-700 font-semibold text-sm transition-colors duration-300">
      Anpassa paketet →
    </button>
  </div>
</div>"""

# Register with token "wp"
COMPONENT_TOKEN = "wp"
