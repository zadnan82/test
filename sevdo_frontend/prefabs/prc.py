# sevdo_frontend/prefabs/program_card.py
def render_prefab(args, props):
    # Default values
    program_name = props.get("name", "Fitness Program")
    duration = props.get("duration", "8 weeks")
    difficulty = props.get("difficulty", "intermediate")
    goal = props.get("goal", "General Fitness")
    includes = props.get("includes", [])
    price = props.get("price", "299")
    trainer = props.get("trainer", "Expert Trainer")
    
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
                        program_name = node.args
                        
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
                            
                            if key == "duration":
                                duration = value
                            elif key == "difficulty":
                                difficulty = value
                            elif key == "goal":
                                goal = value
                            elif key == "includes":
                                includes = value if isinstance(value, list) else [value]
                            elif key == "price":
                                price = value
                            elif key == "trainer":
                                trainer = value
        except Exception:
            program_name = args if args else program_name
    
    # Difficulty badge styling
    difficulty_colors = {
        "beginner": "bg-green-100 text-green-800",
        "intermediate": "bg-yellow-100 text-yellow-800", 
        "advanced": "bg-red-100 text-red-800",
        "all_levels": "bg-blue-100 text-blue-800"
    }
    difficulty_class = difficulty_colors.get(difficulty.lower(), "bg-gray-100 text-gray-800")
    
    # Includes list
    includes_html = ""
    if includes:
        include_list = includes if isinstance(includes, list) else [includes]
        for item in include_list:
            includes_html += f"""
                <li className="flex items-center text-gray-600 mb-2">
                    <svg className="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {item}
                </li>"""
    
    return f"""<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300">
  <div className="flex justify-between items-start mb-4">
    <div className="flex-1">
      <h3 className="text-xl font-bold text-gray-900 mb-2">{program_name}</h3>
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium {difficulty_class}">
        {difficulty.replace('_', ' ').title()}
      </span>
    </div>
    <div className="text-right">
      <div className="text-2xl font-bold text-green-600">${price}</div>
      <div className="text-sm text-gray-500">{duration}</div>
    </div>
  </div>
  
  <div className="mb-4">
    <div className="flex items-center text-sm text-gray-600 mb-2">
      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
      </svg>
      Goal: {goal}
    </div>
    
    <div className="flex items-center text-sm text-gray-600 mb-3">
      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>
      Trainer: {trainer}
    </div>
  </div>
  
  {f'<div className="mb-4"><h4 className="text-sm font-semibold text-gray-700 mb-2">Program Includes:</h4><ul className="space-y-1">{includes_html}</ul></div>' if includes_html else ''}
  
  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
    Enroll Now
  </button>
</div>"""

# Register with token "pc"
COMPONENT_TOKEN = "prc"
