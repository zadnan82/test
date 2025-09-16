# sevdo_frontend/prefabs/chat_component.py
def render_prefab(args, props):
    # Default values
    title = props.get("title", "Chat")
    placeholder = props.get("placeholder", "Type your message...")
    send_text = props.get("sendText", "Send")
    chat_height = props.get("height", "400px")

    # Support for nested components
    # If the args is a nested structure like "b(Custom Button Text)"
    # we can extract and use those values
    if args:
        # Import parser when needed to avoid circular imports
        import sys
        import os
        # Get the parent directory path
        parent_dir = os.path.dirname(
            os.path.dirname(os.path.abspath(__file__)))
        if parent_dir not in sys.path:
            sys.path.append(parent_dir)
        # Import directly from the file
        from frontend_compiler import parse_dsl
        try:
            # Try to parse args as DSL
            nodes = parse_dsl(args)
            if nodes:
                for node in nodes:
                    # Replace send button text if b() token is found
                    if node.token == "b" and node.args:
                        send_text = node.args
                    # Replace title if h() token is found
                    elif node.token == "h" and node.args:
                        title = node.args
                    # Replace placeholder if p() token is found
                    elif node.token == "p" and node.args:
                        placeholder = node.args
        except Exception:
            # If parsing fails, just use args as the title
            title = args

    # Action support for sending messages
    send_path = props.get("sendPath")
    send_method = (props.get("sendMethod") or "POST").upper()
    send_action = props.get("sendAction")

    input_id = "ch-input"
    messages_id = "ch-messages"

    handler = ""
    if send_path:
        # Simpler handler using sevdoAct to avoid JSX template literal parsing issues
        handler = (
            " onClick={() => {"
            f"const inp=document.getElementById('{input_id}'); if(!inp) return;"
            "const v=(inp.value||'').trim(); if(!v) return;"
            f"const list=document.getElementById('{messages_id}');"
            "const d=document.createElement('div'); d.className='message mb-2 flex justify-end'; const b=document.createElement('div'); b.className='bg-gray-300 text-black p-2 rounded-lg max-w-xs'; b.textContent=v; d.appendChild(b); if(list){list.appendChild(d); list.scrollTop=list.scrollHeight;}"
            f"window.sevdoAct('api:{send_method} {send_path}|' + JSON.stringify({{message: v}}));"
            "inp.value='';}}"
        )
    elif send_action:
        safe = send_action.replace("\\", "\\\\").replace("'", "\\'")
        handler = f" onClick={{() => window.sevdoAct('{safe}')}}"

    # Generate chat component with customized parts
    return f"""<div className=\"max-w-2xl mx-auto p-4 border rounded-lg\">\n  <h2 className=\"text-xl font-bold mb-4\">{title}</h2>\n  <div className=\"chat-container\" style={{{{height: '{chat_height}'}}}}>\n    <div id=\"{messages_id}\" className=\"chat-messages bg-gray-50 p-4 rounded-lg mb-4 overflow-y-auto\" style={{{{height: 'calc({chat_height} - 100px)'}}}}>\n      <div className=\"message mb-2\">\n        <div className=\"bg-blue-500 text-white p-2 rounded-lg max-w-xs\">\n          Hello! How can I help you today?\n        </div>\n      </div>\n      <div className=\"message mb-2 flex justify-end\">\n        <div className=\"bg-gray-300 text-black p-2 rounded-lg max-w-xs\">\n          Hi there! I'm looking for some information.\n        </div>\n      </div>\n    </div>\n    <div className=\"chat-input flex gap-2\">\n      <input id=\"{input_id}\" className=\"flex-1 border rounded-lg px-3 py-2\" placeholder=\"{placeholder}\" type=\"text\" />\n      <button className=\"bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg\"{handler}>\n        {send_text}\n      </button>\n    </div>\n  </div>\n</div>"""


# Register with token "ch"
COMPONENT_TOKEN = "ch"
