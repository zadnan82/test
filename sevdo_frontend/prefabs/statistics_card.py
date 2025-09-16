# sevdo_frontend/prefabs/statistics_card.py
def render_prefab(args, props):
    # Default values
    stat_title = props.get("title", "Statistic")
    value = props.get("value", "0")
    unit = props.get("unit", "")
    change = props.get("change", "")
    period = props.get("period", "")
    area = props.get("area", "")
    description = props.get("description", "")
    
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
                        stat_title = node.args
                        
            # Parse props from the component usage
            if hasattr(args, 'split') and '{' in args and '}' in args:
                # Extract props from {prop=value,prop2=value2} format
                props_str = args.split('{')[1].split('}')[0] if '{' in args else ""
                if props_str:
                    for prop in props_str.split(','):
                        if '=' in prop:
                            key, value_prop = prop.split('=', 1)
                            key = key.strip()
                            value_prop = value_prop.strip()
                            
                            if key == "value":
                                value = value_prop
                            elif key == "unit":
                                unit = value_prop
                            elif key == "change":
                                change = value_prop
                            elif key == "period":
                                period = value_prop
                            elif key == "area":
                                area = value_prop
                            elif key == "description":
                                description = value_prop
        except Exception:
            stat_title = args if args else stat_title
    
    # Format value with proper spacing
    formatted_value = value
    if str(value).isdigit() and int(value) >= 1000:
        formatted_value = f"{int(value):,}".replace(",", " ")
    
    # Change indicator styling
    change_html = ""
    if change:
        change_color = "text-green-600" if change.startswith('+') else "text-red-600" if change.startswith('-') else "text-gray-600"
        change_icon = "↗" if change.startswith('+') else "↘" if change.startswith('-') else "→"
        change_html = f'<div className="flex items-center {change_color} text-sm font-semibold"><span className="mr-1">{change_icon}</span>{change}</div>'
    
    # Area badge
    area_html = f'<div className="text-xs text-blue-600 font-medium mb-1">{area}</div>' if area else ''
    
    # Period info
    period_html = f'<div className="text-xs text-gray-500">{period}</div>' if period else ''
    
    # Description
    description_html = f'<p className="text-sm text-gray-600 mt-2">{description}</p>' if description else ''
    
    return f"""<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300">
  {area_html}
  <div className="flex justify-between items-start mb-2">
    <h3 className="text-lg font-semibold text-gray-900 flex-1">{stat_title}</h3>
    {change_html}
  </div>
  
  <div className="flex items-baseline mb-1">
    <span className="text-3xl font-bold text-blue-600">{formatted_value}</span>
    {f'<span className="text-lg text-gray-600 ml-1">{unit}</span>' if unit else ''}
  </div>
  
  {period_html}
  {description_html}
</div>"""

# Register with token "st"
COMPONENT_TOKEN = "st"
