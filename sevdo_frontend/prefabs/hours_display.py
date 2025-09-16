# sevdo_frontend/prefabs/hours_display.py
def render_prefab(args, props):
    # Default values
    title = props.get("title", "Hours of Operation")
    timezone = props.get("timezone", "EST")
    special_notes = props.get("specialNotes", "")

    # Default restaurant hours
    default_hours = {
        "Monday": "11:00 AM - 10:00 PM",
        "Tuesday": "11:00 AM - 10:00 PM",
        "Wednesday": "11:00 AM - 10:00 PM",
        "Thursday": "11:00 AM - 10:00 PM",
        "Friday": "11:00 AM - 11:00 PM",
        "Saturday": "10:00 AM - 11:00 PM",
        "Sunday": "10:00 AM - 9:00 PM",
    }

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
                    elif node.token == "t" and node.args:
                        special_notes = node.args
        except Exception:
            title = args if args else title

    # Generate hours display
    hours_html = ""
    for day, hours in default_hours.items():
        # Simple current day detection (in real app, would use JavaScript)
        is_today = day == "Friday"  # Static example
        day_class = (
            "bg-blue-50 border-blue-200" if is_today else "bg-white border-gray-200"
        )
        day_text_class = (
            "font-semibold text-blue-900" if is_today else "font-medium text-gray-900"
        )

        hours_html += f'''
        <div className="{day_class} border rounded-lg p-4 flex justify-between items-center">
            <span className="{day_text_class}">{day}</span>
            <span className="text-gray-700 font-medium">{hours}</span>
        </div>'''

    # Generate special notes section
    special_notes_section = ""
    if special_notes:
        special_notes_section = f"""
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
                <svg className="w-5 h-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p className="text-yellow-800 text-sm">{special_notes}</p>
            </div>
        </div>"""

    # Current status (simplified example)
    current_status = """
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
            <span className="font-semibold text-green-900">Currently Open</span>
            <span className="text-green-700 ml-2">• Closes at 11:00 PM</span>
        </div>
    </div>"""

    return f"""<div className="bg-white border border-gray-200 rounded-lg p-6">
    <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
    
    {current_status}
    
    <div className="space-y-3">
        {hours_html}
    </div>
    
    <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            All times are in {timezone}
        </p>
        <p className="text-sm text-gray-600 mt-2">
            Kitchen closes 30 minutes before closing time
        </p>
    </div>
    
    {special_notes_section}
</div>"""


# Register with token "hrs"
COMPONENT_TOKEN = "hrs"
