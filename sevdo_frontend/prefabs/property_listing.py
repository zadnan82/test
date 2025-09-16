# sevdo_frontend/prefabs/property_listing.py
def render_prefab(args, props):
    # Default values
    property_title = props.get("title", "Property Title")
    price = props.get("price", "5000000")
    area = props.get("area", "85")
    rooms = props.get("rooms", "3")
    property_type = props.get("type", "Bostadsrätt")
    address = props.get("address", "Stockholm")
    image = props.get("image", "property-placeholder.jpg")
    monthly_fee = props.get("monthly_fee", "")
    floor = props.get("floor", "")
    balcony = props.get("balcony", False)
    elevator = props.get("elevator", False)
    garden = props.get("garden", False)
    parking = props.get("parking", False)
    fireplace = props.get("fireplace", False)
    year = props.get("year", "")
    plot_area = props.get("plot_area", "")
    description = props.get("description", "")
    featured = props.get("featured", False)
    status = props.get("status", "for_sale")
    sold_price = props.get("sold_price", "")
    days = props.get("days", "")
    role = props.get("role", "")  # For agent profiles
    experience = props.get("experience", "")
    specialties = props.get("specialties", [])
    phone = props.get("phone", "")
    email = props.get("email", "")
    
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
                        property_title = node.args
                        
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
                            
                            # Set property values
                            if key == "price":
                                price = value
                            elif key == "area":
                                area = value
                            elif key == "rooms":
                                rooms = value
                            elif key == "type":
                                property_type = value
                            elif key == "address":
                                address = value
                            elif key == "image":
                                image = value
                            elif key == "monthly_fee":
                                monthly_fee = value
                            elif key == "floor":
                                floor = value
                            elif key == "balcony":
                                balcony = value
                            elif key == "elevator":
                                elevator = value
                            elif key == "garden":
                                garden = value
                            elif key == "parking":
                                parking = value
                            elif key == "fireplace":
                                fireplace = value
                            elif key == "year":
                                year = value
                            elif key == "plot_area":
                                plot_area = value
                            elif key == "description":
                                description = value
                            elif key == "featured":
                                featured = value
                            elif key == "status":
                                status = value
                            elif key == "sold_price":
                                sold_price = value
                            elif key == "days":
                                days = value
                            elif key == "role":
                                role = value
                            elif key == "experience":
                                experience = value
                            elif key == "specialties":
                                specialties = value if isinstance(value, list) else [value]
                            elif key == "phone":
                                phone = value
                            elif key == "email":
                                email = value
        except Exception:
            property_title = args if args else property_title
    
    # If this is an agent profile (has role), render agent card
    if role:
        specialties_html = ""
        if specialties:
            spec_list = specialties if isinstance(specialties, list) else [specialties]
            for specialty in spec_list:
                specialties_html += f'<span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">{specialty}</span>'
        
        return f"""<div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl">
  <div className="flex items-center mb-4">
    <div className="w-16 h-16 rounded-full bg-gray-200 mr-4 overflow-hidden">
      <img src="/images/agents/{image}" alt="{property_title}" 
           className="w-full h-full object-cover"
           onError="this.src='https://via.placeholder.com/64x64?text=Agent'" />
    </div>
    <div>
      <h3 className="text-xl font-bold text-gray-900">{property_title}</h3>
      <p className="text-blue-600 font-semibold">{role}</p>
      <p className="text-gray-600 text-sm">{experience}</p>
    </div>
  </div>
  
  <div className="mb-4">
    <h4 className="text-sm font-semibold text-gray-700 mb-2">Specialiteter:</h4>
    <div className="flex flex-wrap">{specialties_html}</div>
  </div>
  
  <div className="border-t border-gray-200 pt-4">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-600">{phone}</p>
        <p className="text-sm text-gray-600">{email}</p>
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-300">
        Kontakta
      </button>
    </div>
  </div>
</div>"""
    
    # Format price
    formatted_price = f"{int(price):,}".replace(",", " ") if str(price).isdigit() else price
    
    # Status styling
    status_badge = ""
    if status == "sold":
        status_badge = '<div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">SÅLD</div>'
    elif featured:
        status_badge = '<div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">FEATURED</div>'
    
    # Features icons
    features_html = ""
    features = []
    if balcony:
        features.append("Balkong")
    if elevator:
        features.append("Hiss")
    if garden:
        features.append("Trädgård")
    if parking:
        features.append("Parkering")
    if fireplace:
        features.append("Öppen spis")
    
    if features:
        for feature in features[:3]:  # Show max 3 features
            features_html += f'<span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">{feature}</span>'
    
    # Additional info
    additional_info = ""
    if monthly_fee:
        additional_info += f'<div className="text-sm text-gray-600">Avgift: {monthly_fee} kr/mån</div>'
    if floor:
        additional_info += f'<div className="text-sm text-gray-600">Våning: {floor}</div>'
    if year:
        additional_info += f'<div className="text-sm text-gray-600">Byggår: {year}</div>'
    if plot_area:
        additional_info += f'<div className="text-sm text-gray-600">Tomt: {plot_area} kvm</div>'
    
    # Sold information
    sold_info = ""
    if status == "sold" and sold_price:
        sold_formatted = f"{int(sold_price):,}".replace(",", " ") if str(sold_price).isdigit() else sold_price
        sold_info = f'<div className="text-green-600 font-semibold">Såld för: {sold_formatted} kr</div>'
        if days:
            sold_info += f'<div className="text-sm text-gray-600">På marknaden: {days} dagar</div>'
    
    return f"""<div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
  <div className="relative">
    <img src="/images/properties/{image}" alt="{property_title}" 
         className="w-full h-48 object-cover"
         onError="this.src='https://via.placeholder.com/400x300?text=Property'" />
    {status_badge}
    <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
      {property_type}
    </div>
  </div>
  
  <div className="p-6">
    <div className="flex justify-between items-start mb-3">
      <h3 className="text-xl font-bold text-gray-900 flex-1">{property_title}</h3>
      <div className="text-right ml-4">
        <div className="text-2xl font-bold text-blue-600">{formatted_price} kr</div>
        {sold_info}
      </div>
    </div>
    
    <p className="text-gray-600 mb-3">{address}</p>
    
    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
      <div>
        <div className="text-lg font-semibold text-gray-900">{rooms}</div>
        <div className="text-xs text-gray-500">rum</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">{area}</div>
        <div className="text-xs text-gray-500">kvm</div>
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">{"–" if not (area and str(area).isdigit() and str(price).isdigit()) else f"{int(int(str(price).replace(' ', '')) / int(area)):,}".replace(",", " ")}</div>
        <div className="text-xs text-gray-500">kr/kvm</div>
      </div>
    </div>
    
    {f'<div className="mb-3">{additional_info}</div>' if additional_info else ''}
    
    {f'<div className="mb-4">{features_html}</div>' if features_html else ''}
    
    {f'<p className="text-gray-600 text-sm mb-4">{description}</p>' if description else ''}
    
    <div className="flex space-x-2">
      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300">
        {'Se detaljer' if status != 'sold' else 'Se slutpris'}
      </button>
      {f'<button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-300">Boka visning</button>' if status != 'sold' else ''}
    </div>
  </div>
</div>"""

# Register with token "pl"
COMPONENT_TOKEN = "pl"
