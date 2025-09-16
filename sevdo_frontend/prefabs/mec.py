# sevdo_frontend/prefabs/membership_card.py
def render_prefab(args, props):
    # Default values
    plan_name = props.get("name", "Membership Plan")
    price = props.get("price", "49/month")
    setup = props.get("setup", "0")
    features = props.get("features", [])
    popular = props.get("popular", False)
    contract = props.get("contract", "No Contract")
    
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
                        plan_name = node.args
                        
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
                            elif key == "setup":
                                setup = value
                            elif key == "features":
                                features = value if isinstance(value, list) else [value]
                            elif key == "popular":
                                popular = value
                            elif key == "contract":
                                contract = value
        except Exception:
            plan_name = args if args else plan_name
    
    # Popular badge
    popular_badge = ""
    if popular:
        popular_badge = """
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
            </div>
        </div>"""
    
    # Card styling based on popularity
    if popular:
        card_classes = "relative bg-white rounded-2xl shadow-xl border-2 border-blue-500 p-6 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1"
        button_class = "w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
    else:
        card_classes = "relative bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300"
        button_class = "w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-300"
    
    # Features list
    features_html = ""
    if features:
        feature_list = features if isinstance(features, list) else [features]
        for feature in feature_list:
            features_html += f"""
                <li className="flex items-center text-gray-600 mb-3">
                    <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                </li>"""
    
    # Setup fee display
    setup_display = ""
    if setup and setup != "0":
        setup_display = f'<div className="text-sm text-gray-600 mb-2">Setup Fee: ${setup}</div>'
    
    return f"""<div className="{card_classes}">{popular_badge}
  <div className="text-center mb-6">
    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan_name}</h3>
    <div className="mb-2">
      <span className="text-4xl font-bold text-gray-900">${price.split('/')[0]}</span>
      <span className="text-gray-600">/{price.split('/')[-1] if '/' in price else 'month'}</span>
    </div>
    {setup_display}
    <div className="text-sm text-blue-600 font-medium">{contract}</div>
  </div>
  
  <ul className="mb-8 space-y-3">{features_html}
  </ul>
  
  <button className="{button_class}">
    Choose Plan
  </button>
</div>"""

# Register with token "mc"
COMPONENT_TOKEN = "mec"
