# sevdo_frontend/prefabs/fitness_class_card.py
def render_prefab(args, props):
    # Default values
    class_name = props.get("name", "Fitness Class")
    time = props.get("time", "TBD")
    duration = props.get("duration", "45")
    difficulty = props.get("difficulty", "all_levels")
    trainer = props.get("trainer", "Instructor")
    spots = props.get("spots", "15")
    description = props.get("description", "")
    equipment = props.get("equipment", [])
    
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
                        class_name = node.args
                        
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
                            
                            if key == "time":
                                time = value
                            elif key == "duration":
                                duration = value
                            elif key == "difficulty":
                                difficulty = value
                            elif key == "trainer":
                                trainer = value
                            elif key == "spots":
                                spots = value
                            elif key == "description":
                                description = value
                            elif key == "equipment":
                                equipment = value if isinstance(value, list) else [value]
        except Exception:
            class_name = args if args else class_name
    
    # Difficulty badge styling
    difficulty_colors = {
        "beginner": "bg-green-100 text-green-800",
        "intermediate": "bg-yellow-100 text-yellow-800", 
        "advanced": "bg-red-100 text-red-800",
        "all_levels": "bg-blue-100 text-blue-800"
    }
    difficulty_class = difficulty_colors.get(difficulty.lower(), "bg-gray-100 text-gray-800")
    
    # Equipment list
    equipment_html = ""
    if equipment:
        equipment_items = ", ".join(equipment) if isinstance(equipment, list) else equipment
        equipment_html = f"""
        <div className="flex items-center text-sm text-gray-600 mb-2">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.781 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 9.172V5L8 4z"></path>
            </svg>
            Equipment: {equipment_items}
        </div>"""
    
    return f"""<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300">
  <div className="flex justify-between items-start mb-4">
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{class_name}</h3>
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium {difficulty_class}">
        {difficulty.replace('_', ' ').title()}
      </span>
    </div>
    <div className="text-right">
      <div className="text-sm text-gray-500">Available Spots</div>
      <div className="text-lg font-bold text-blue-600">{spots}</div>
    </div>
  </div>
  
  <div className="space-y-3 mb-4">
    <div className="flex items-center text-sm text-gray-600">
      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      {time} • {duration} minutes
    </div>
    
    <div className="flex items-center text-sm text-gray-600">
      <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
      </svg>
      Instructor: {trainer}
    </div>
    
    {equipment_html}
  </div>
  
  {f'<p className="text-gray-600 text-sm mb-4">{description}</p>' if description else ''}
  
  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
    Book Class
  </button>
</div>"""

# Register with token "fc"
COMPONENT_TOKEN = "fc"
