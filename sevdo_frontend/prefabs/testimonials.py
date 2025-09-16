# sevdo_frontend/prefabs/testimonials.py
def render_prefab(args, props):
    # Default values
    title = props.get("title", "What Our Customers Say")
    refresh_text = props.get("refreshText", "Refresh")
    testimonials_data = [
        {
            "name": "Sarah Johnson",
            "role": "CEO, TechCorp",
            "text": "This product has transformed our workflow completely.",
        },
        {
            "name": "Mike Chen",
            "role": "Developer",
            "text": "Amazing experience, highly recommended!",
        },
        {
            "name": "Anna Smith",
            "role": "Designer",
            "text": "The best tool I've used in years.",
        },
    ]

    # Optional backend props for refresh echo
    refresh_path = props.get("refreshPath")
    refresh_method = (props.get("refreshMethod") or "POST").upper()
    refresh_action = props.get("refreshAction")

    # Support for nested components
    if args:
        # Import parser when needed to avoid circular imports
        import sys
        import os

        parent_dir = os.path.dirname(
            os.path.dirname(os.path.abspath(__file__)))
        if parent_dir not in sys.path:
            sys.path.append(parent_dir)
        from frontend_compiler import parse_dsl, _jsx_for_token

        try:
            nodes = parse_dsl(args)
            if nodes:
                for node in nodes:
                    if node.token == "h" and node.args:
                        title = node.args
        except Exception:
            title = args if args else title

    # Build refresh handler (echo to backend; logs in console)
    if refresh_action:
        safe = refresh_action.replace("\\", "\\\\").replace("'", "\\'")
        refresh_handler = f" onClick={{() => window.sevdoAct('{safe}')}}"
    else:
        endpoint = refresh_path or "/api/echo"
        refresh_handler = (
            " onClick={() => {"
            + "window.sevdoAct('api:"
            + refresh_method
            + " "
            + endpoint
            + "|' + JSON.stringify({event:'testimonials_refresh', ts: Date.now()}));"
            + "}}"
        )

    # Generate testimonial cards
    testimonial_cards = ""
    for testimonial in testimonials_data:
        testimonial_cards += f'''
    <div className="bg-white p-6 rounded-lg shadow-md">
      <p className="text-gray-600 mb-4">"{testimonial["text"]}"</p>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
        <div>
          <h4 className="font-semibold text-gray-900">{testimonial["name"]}</h4>
          <p className="text-gray-600 text-sm">{testimonial["role"]}</p>
        </div>
      </div>
    </div>'''

    return f"""<section className="py-12 bg-gray-50">
  <div className="max-w-6xl mx-auto px-4">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded text-sm"{refresh_handler}>
        {refresh_text}
      </button>
    </div>
    <div className="grid md:grid-cols-3 gap-8">{testimonial_cards}
    </div>
  </div>
</section>"""


# Register with token "tt"
COMPONENT_TOKEN = "tt"
