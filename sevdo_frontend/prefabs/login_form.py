# sevdo_frontend/prefabs/login_form.py
def render_prefab(args, props):
    # Default values
    title = "Login to Your Account"
    email_label = props.get("emailLabel", "Email")
    password_label = props.get("passwordLabel", "Password")
    signin_text = props.get("buttonText", "Sign In")
    forgot_text = props.get("forgotText", "Forgot Password?")
    # Action-related props
    sign_in_path = props.get("signInPath")  # e.g., /api/echo
    sign_in_method = (props.get("signInMethod") or "POST").upper()
    signin_action = props.get("signinAction")  # fallback: direct action string
    forgot_action = props.get("forgotAction")

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
                    # Replace button text if b() token is found
                    if node.token == "b" and node.args:
                        signin_text = node.args
                    # Replace title if h() token is found
                    elif node.token == "h" and node.args:
                        title = node.args
        except Exception:
            # If parsing fails, just use args as the title
            title = args

    # Build handlers
    # Inputs will have stable ids to collect values
    email_id = "lf-email"
    password_id = "lf-password"

    # Sign-in handler: prefer signInPath/method to auto-JSON body; else use signinAction
    if sign_in_path:
        # Build an inline function generating JSON from inputs at click time
        signin_handler = (
            " onClick={() => window.sevdoAct('api:"
            + sign_in_method
            + " "
            + sign_in_path
            + "|' + JSON.stringify({email: document.getElementById('"
            + email_id
            + "').value, password: document.getElementById('"
            + password_id
            + "').value}))}"
        )
    elif signin_action:
        safe = signin_action.replace("\\", "\\\\").replace("'", "\\'")
        signin_handler = f" onClick={{() => window.sevdoAct('{safe}')}}"
    else:
        signin_handler = ""

    if forgot_action:
        safe_f = forgot_action.replace("\\", "\\\\").replace("'", "\\'")
        forgot_handler = f" onClick={{() => window.sevdoAct('{safe_f}')}}"
    else:
        forgot_handler = ""

    # Style customization with optional extra classes
    form_class = "max-w-md mx-auto p-6"
    if props.get("formClass"):
        form_class = f"{form_class} {props.get('formClass')}"
    title_class = "text-xl font-bold mb-4"
    if props.get("titleClass"):
        title_class = f"{title_class} {props.get('titleClass')}"
    container_class = "flex flex-col gap-4"
    if props.get("containerClass"):
        container_class = f"{container_class} {props.get('containerClass')}"
    label_class = "block"
    if props.get("labelClass"):
        label_class = f"{label_class} {props.get('labelClass')}"
    input_class = "border rounded px-3 py-2 w-full"
    if props.get("inputClass"):
        input_class = f"{input_class} {props.get('inputClass')}"
    actions_class = "flex flex-row gap-2 mt-4"
    if props.get("actionsClass"):
        actions_class = f"{actions_class} {props.get('actionsClass')}"
    signin_class = "bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
    if props.get("signinClass"):
        signin_class = f"{signin_class} {props.get('signinClass')}"
    forgot_class = "bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded"
    if props.get("forgotClass"):
        forgot_class = f"{forgot_class} {props.get('forgotClass')}"

    # Generate full form with customized parts
    return f"""<form className=\"{form_class}\">\n  <h1 className=\"{title_class}\">{title}</h1>\n  <div className=\"{container_class}\">\n    <label className=\"{label_class}\">\n      <span className=\"mb-1 block\">{email_label}</span>\n      <input id=\"{email_id}\" name=\"email\" className=\"{input_class}\" placeholder=\"Enter your email\" />\n    </label>\n    <label className=\"{label_class}\">\n      <span className=\"mb-1 block\">{password_label}</span>\n      <input id=\"{password_id}\" name=\"password\" className=\"{input_class}\" type=\"password\" placeholder=\"Enter your password\" />\n    </label>\n    <div className=\"{actions_class}\">\n      <button className=\"{signin_class}\"{signin_handler}>{signin_text}</button>\n      <button className=\"{forgot_class}\"{forgot_handler}>{forgot_text}</button>\n    </div>\n  </div>\n</form>"""


# Register with token "lf"
COMPONENT_TOKEN = "lf"
