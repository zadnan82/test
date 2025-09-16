# sevdo_frontend/prefabs/trainer_card.py
def render_prefab(args, props):
    # Default values
    trainer_name = props.get("name", "Trainer Name")
    title = props.get("title", "Fitness Instructor")
    specialty = props.get("specialty", "General Fitness")
    experience = props.get("experience", "5 years")
    certifications = props.get("certifications", [])
    bio = props.get("bio", "")
    image = props.get("image", "trainer-placeholder.jpg")
    rate = props.get("rate", "75/hour")
    background = props.get("background", "")
    focus = props.get("focus", "")
    vision = props.get("vision", "")
    passion = props.get("passion", "")
    
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
                        trainer_name = node.args
                        
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
                            
                            if key == "title":
                                title = value
                            elif key == "specialty":
                                specialty = value
                            elif key == "experience":
                                experience = value
                            elif key == "certifications":
                                certifications = value if isinstance(value, list) else [value]
                            elif key == "bio":
                                bio = value
                            elif key == "image":
                                image = value
                            elif key == "rate":
                                rate = value
                            elif key == "background":
                                background = value
                            elif key == "focus":
                                focus = value
                            elif key == "vision":
                                vision = value
                            elif key == "passion":
                                passion = value
        except Exception:
            trainer_name = args if args else trainer_name
    
    # Certifications list
    certifications_html = ""
    if certifications:
        cert_items = ""
        certs = certifications if isinstance(certifications, list) else [certifications]
        for cert in certs:
            cert_items += f'<span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2">{cert}</span>'
        
        certifications_html = f"""
        <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Certifications</h4>
            <div className="flex flex-wrap">
                {cert_items}
            </div>
        </div>"""
    
    # Bio section - use bio if provided, otherwise use background/focus/vision/passion
    bio_content = bio
    if not bio_content and (background or focus or vision or passion):
        bio_parts = []
        if background:
            bio_parts.append(background)
        if focus:
            bio_parts.append(f"Focus: {focus}")
        if vision:
            bio_parts.append(f"Vision: {vision}")
        if passion:
            bio_parts.append(f"Passion: {passion}")
        bio_content = ". ".join(bio_parts)
    
    bio_html = f'<p className="text-gray-600 text-sm mb-4">{bio_content}</p>' if bio_content else ''
    
    return f"""<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-300">
  <div className="flex flex-col items-center text-center mb-4">
    <div className="w-24 h-24 rounded-full bg-gray-200 mb-4 overflow-hidden">
      <img src="/images/{image}" alt="{trainer_name}" className="w-full h-full object-cover" 
           onError="this.src='https://via.placeholder.com/96x96?text=Trainer'" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-1">{trainer_name}</h3>
    <p className="text-blue-600 font-semibold mb-2">{title}</p>
    <div className="flex items-center text-sm text-gray-600 mb-2">
      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
      </svg>
      {specialty}
    </div>
    <div className="flex items-center text-sm text-gray-600 mb-3">
      <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      {experience} experience
    </div>
  </div>
  
  {bio_html}
  
  {certifications_html}
  
  <div className="text-center border-t border-gray-200 pt-4">
    <div className="text-lg font-bold text-green-600 mb-3">${rate}</div>
    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
      Book Session
    </button>
  </div>
</div>"""

# Register with token "tc"
COMPONENT_TOKEN = "tc"
