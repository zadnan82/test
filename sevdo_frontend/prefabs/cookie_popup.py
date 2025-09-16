# sevdo_frontend/prefabs/cookie_popup.py
def render_prefab(args, props):
    # Default values
    title = props.get("title", "We use cookies")
    message = props.get(
        "message",
        "We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.",
    )
    accept_text = props.get("acceptText", "Accept All")
    reject_text = props.get("rejectText", "Reject")
    settings_text = props.get("settingsText", "Cookie Settings")
    position = props.get("position", "bottom")  # bottom, top
    style = props.get("style", "banner")  # banner, modal

    # Backend-related props (optional overrides)
    accept_path = props.get("acceptPath")
    accept_method = (props.get("acceptMethod") or "POST").upper()
    accept_action = props.get("acceptAction")

    reject_path = props.get("rejectPath")
    reject_method = (props.get("rejectMethod") or "POST").upper()
    reject_action = props.get("rejectAction")

    settings_path = props.get("settingsPath")
    settings_method = (props.get("settingsMethod") or "POST").upper()
    settings_action = props.get("settingsAction")

    storage_key = props.get("storageKey", "cookieConsent")

    # Support for nested components
    if args:
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
                    elif node.token == "t" and node.args:
                        message = node.args
                    elif node.token == "b" and node.args:
                        accept_text = node.args
        except Exception:
            title = args if args else title

    # Handlers: default to echo so playground logs the API call
    if accept_action:
        safe = accept_action.replace("\\", "\\\\").replace("'", "\\'")
        accept_handler = f" onClick={{() => window.sevdoAct('{safe}')}}"
    else:
        a_endpoint = accept_path or "/api/echo"
        accept_handler = (
            " onClick={() => {"
            + f"localStorage.setItem('{storage_key}','accept');"
            + "window.sevdoAct('api:"
            + accept_method
            + " "
            + a_endpoint
            + "|' + JSON.stringify({choice:'accept', ts: Date.now()}));"
            + "const el=document.getElementById('cookie-popup'); if(el) el.remove();"
            + "}}"
        )

    if reject_action:
        safe_r = reject_action.replace("\\", "\\\\").replace("'", "\\'")
        reject_handler = f" onClick={{() => window.sevdoAct('{safe_r}')}}"
    else:
        r_endpoint = reject_path or "/api/echo"
        reject_handler = (
            " onClick={() => {"
            + f"localStorage.setItem('{storage_key}','reject');"
            + "window.sevdoAct('api:"
            + reject_method
            + " "
            + r_endpoint
            + "|' + JSON.stringify({choice:'reject', ts: Date.now()}));"
            + "const el=document.getElementById('cookie-popup'); if(el) el.remove();"
            + "}}"
        )

    if settings_action:
        safe_s = settings_action.replace("\\", "\\\\").replace("'", "\\'")
        settings_handler = f" onClick={{() => window.sevdoAct('{safe_s}')}}"
    else:
        s_endpoint = settings_path or "/api/echo"
        settings_handler = (
            " onClick={() => {"
            + "window.sevdoAct('api:"
            + settings_method
            + " "
            + s_endpoint
            + "|' + JSON.stringify({choice:'settings', ts: Date.now()}));"
            + "console.log('Cookie settings clicked');"
            + "}}"
        )

    # Position classes
    position_class = "bottom-0" if position == "bottom" else "top-0"

    # Style variants
    if style == "modal":
        return f"""<div id="cookie-popup" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full shadow-xl">
    <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 mb-6 text-sm">{message}</p>
    <div className="flex flex-col sm:flex-row gap-3">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded text-sm transition-colors"{accept_handler}>
        {accept_text}
      </button>
      <button className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded text-sm transition-colors"{reject_handler}>
        {reject_text}
      </button>
      <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium px-4 py-2 rounded text-sm transition-colors"{settings_handler}>
        {settings_text}
      </button>
    </div>
  </div>
</div>"""

    # Banner style (default)
    return f"""<div id="cookie-popup" className="fixed {position_class} left-0 right-0 bg-gray-900 text-white p-4 shadow-lg z-50">
  <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div className="flex-1">
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-gray-300 text-sm">{message}</p>
    </div>
    <div className="flex flex-wrap gap-3 flex-shrink-0">
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded text-sm transition-colors"{accept_handler}>
        {accept_text}
      </button>
      <button className="bg-gray-600 hover:bg-gray-700 text-white font-medium px-4 py-2 rounded text-sm transition-colors"{reject_handler}>
        {reject_text}
      </button>
      <button className="border border-gray-500 hover:bg-gray-800 text-white font-medium px-4 py-2 rounded text-sm transition-colors"{settings_handler}>
        {settings_text}
      </button>
    </div>
  </div>
</div>"""


# Register with token "co"
COMPONENT_TOKEN = "co"
