# sevdo_frontend/prefabs/qa.py
def render_prefab(args, props):
    # Default values
    title = props.get("title", "Frequently Asked Questions")
    refresh_text = props.get("refreshText", "Refresh FAQs")
    qa_data = [
        {
            "question": "How do I get started?",
            "answer": "Simply sign up for an account and follow our getting started guide.",
        },
        {
            "question": "What payment methods do you accept?",
            "answer": "We accept all major credit cards, PayPal, and bank transfers.",
        },
        {
            "question": "Is there a free trial?",
            "answer": "Yes, we offer a 14-day free trial with full access to all features.",
        },
        {
            "question": "How can I contact support?",
            "answer": "You can reach our support team via email, chat, or contact form.",
        },
    ]

    # Optional backend props for refresh
    refresh_path = props.get("refreshPath")
    refresh_method = (props.get("refreshMethod") or "GET").upper()
    refresh_action = props.get("refreshAction")

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
            + "|' + JSON.stringify({event:'qa_refresh', ts: Date.now()}));"
            + "}}"
        )

    # Generate Q&A items
    qa_items = ""
    for i, qa in enumerate(qa_data):
        qa_items += f"""
    <div className="border-b border-gray-200">
      <button className="w-full text-left py-4 px-6 hover:bg-gray-50 focus:outline-none focus:bg-gray-50" 
              onClick={{() => {{
                const content = document.getElementById('qa-{i}');
                const icon = document.getElementById('icon-{i}');
                if (content.classList.contains('hidden')) {{
                  content.classList.remove('hidden');
                  icon.textContent = '-';
                }} else {{
                  content.classList.add('hidden');
                  icon.textContent = '+';
                }}
              }}}}>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">{qa["question"]}</h3>
          <span id="icon-{i}" className="text-2xl text-gray-500">+</span>
        </div>
      </button>
      <div id="qa-{i}" className="hidden px-6 pb-4">
        <p className="text-gray-600">{qa["answer"]}</p>
      </div>
    </div>"""

    return f"""<section className="py-12 bg-white">
  <div className="max-w-3xl mx-auto px-4">
    <div className="flex items-center justify-between mb-8">
      <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded text-sm"{refresh_handler}>
        {refresh_text}
      </button>
    </div>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">{qa_items}
    </div>
  </div>
</section>"""


# Register with token "qa"
COMPONENT_TOKEN = "qa"
