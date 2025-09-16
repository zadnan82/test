# sevdo_frontend/prefabs/email_component.py
def render_prefab(args, props):
    # Default values
    title = props.get("title", "Compose Email")
    to_label = props.get("toLabel", "To")
    subject_label = props.get("subjectLabel", "Subject")
    message_label = props.get("messageLabel", "Message")
    send_text = props.get("sendText", "Send Email")
    draft_text = props.get("draftText", "Save Draft")

    # Backend action-related props
    send_path = props.get("sendPath")  # e.g., /api/email
    send_method = (props.get("sendMethod") or "POST").upper()
    send_action = props.get("sendAction")  # optional direct action
    draft_path = props.get("draftPath")  # optional, defaults to echo too
    draft_method = (props.get("draftMethod") or "POST").upper()
    draft_action = props.get("draftAction")

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
                    if node.token == "b" and node.args:
                        send_text = node.args
                    elif node.token == "h" and node.args:
                        title = node.args
                    elif node.token == "s" and node.args:
                        subject_label = node.args
        except Exception:
            title = args

    # Stable ids for inputs
    to_id = "em-to"
    subject_id = "em-subject"
    message_id = "em-message"

    # Click handlers (default to echo so it logs in console)
    if send_action:
        safe = send_action.replace("\\", "\\\\").replace("'", "\\'")
        send_handler = f" onClick={{() => window.sevdoAct('{safe}')}}"
    else:
        endpoint = send_path or "/api/echo"
        send_handler = (
            " onClick={() => {"
            + "const data={"
            + f"to: document.getElementById('{to_id}').value, "
            + f"subject: document.getElementById('{subject_id}').value, "
            + f"message: document.getElementById('{message_id}').value"
            + "};"
            + "window.sevdoAct('api:"
            + send_method
            + " "
            + endpoint
            + "|' + JSON.stringify(data));"
            + "}}"
        )

    if draft_action:
        safe_d = draft_action.replace("\\", "\\\\").replace("'", "\\'")
        draft_handler = f" onClick={{() => window.sevdoAct('{safe_d}')}}"
    else:
        d_endpoint = draft_path or "/api/echo"
        draft_handler = (
            " onClick={() => {"
            + "const data={"
            + f"to: document.getElementById('{to_id}').value, "
            + f"subject: document.getElementById('{subject_id}').value, "
            + f"message: document.getElementById('{message_id}').value, draft: true"
            + "};"
            + "window.sevdoAct('api:"
            + draft_method
            + " "
            + d_endpoint
            + "|' + JSON.stringify(data));"
            + "}}"
        )

    # Generate email composer with customized parts
    return f"""<div className="max-w-2xl mx-auto p-6 border rounded-lg bg-white">
  <h2 className="text-2xl font-bold mb-6">{title}</h2>
  <form className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-1">{to_label}</label>
      <input 
        id="{to_id}"
        name="to"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        placeholder="recipient@example.com"
        type="email"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">{subject_label}</label>
      <input 
        id="{subject_id}"
        name="subject"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        placeholder="Enter subject line"
        type="text"
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">{message_label}</label>
      <textarea 
        id="{message_id}"
        name="message"
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-vertical" 
        placeholder="Write your message here..."
      ></textarea>
    </div>
    <div className="flex gap-3 pt-4">
      <button 
        type="button"
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg"{send_handler}
      >
        {send_text}
      </button>
      <button 
        type="button"
        className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-2 rounded-lg"{draft_handler}
      >
        {draft_text}
      </button>
    </div>
  </form>
</div>"""


# Register with token "em"
COMPONENT_TOKEN = "em"
