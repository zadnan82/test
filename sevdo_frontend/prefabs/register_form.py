# sevdo_frontend/prefabs/register_form.py

def render_prefab(args, props):
    # Default values
    title = "Create Your Account"
    name_label = props.get("nameLabel", "Full Name")
    email_label = props.get("emailLabel", "Email")
    password_label = props.get("passwordLabel", "Password")
    confirm_password_label = props.get(
        "confirmPasswordLabel", "Confirm Password")
    register_text = props.get("buttonText", "Register")
    login_text = props.get("loginText", "Already have an account? Login")

    # Action-related props
    register_path = props.get("registerPath")  # e.g., /api/echo
    register_method = (props.get("registerMethod") or "POST").upper()
    # direct action string alternative
    register_action = props.get("registerAction")
    login_action = props.get("loginAction")

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
                        register_text = node.args
                    # Replace title if h() token is found
                    elif node.token == "h" and node.args:
                        title = node.args
        except Exception:
            # If parsing fails, just use args as the title
            title = args

    # Build handlers and add stable ids to collect values
    name_id = "rf-name"
    email_id = "rf-email"
    password_id = "rf-password"
    confirm_id = "rf-confirm"

    if register_path:
        register_handler = (
            " onClick={() => window.sevdoAct('api:"
            f"{register_method} {register_path}"
            "|' + JSON.stringify({"
            f"name: document.getElementById('{name_id}').value, "
            f"email: document.getElementById('{email_id}').value, "
            f"password: document.getElementById('{password_id}').value, "
            f"confirmPassword: document.getElementById('{confirm_id}').value"
            "}))}"
        )
    elif register_action:
        safe = register_action.replace("\\", "\\\\").replace("'", "\\'")
        register_handler = f" onClick={{() => window.sevdoAct('{safe}')}}"
    else:
        register_handler = ""

    if login_action:
        safe_l = login_action.replace("\\", "\\\\").replace("'", "\\'")
        login_handler = f" onClick={{() => window.sevdoAct('{safe_l}')}}"
    else:
        login_handler = ""

    # Style customization
    form_class = "max-w-md mx-auto p-6"
    title_class = "text-xl font-bold mb-4"
    container_class = "flex flex-col gap-4"
    label_class = "block"
    input_class = "border rounded px-3 py-2 w-full"
    actions_class = "flex flex-col gap-2 mt-4"
    register_btn_class = "bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded"
    login_btn_class = "bg-gray-500 hover:bg-gray-600 text-white font-medium px-4 py-2 rounded text-sm"

    if props.get("formClass"):
        form_class += f" {props.get('formClass')}"
    if props.get("titleClass"):
        title_class += f" {props.get('titleClass')}"
    if props.get("containerClass"):
        container_class += f" {props.get('containerClass')}"
    if props.get("labelClass"):
        label_class += f" {props.get('labelClass')}"
    if props.get("inputClass"):
        input_class += f" {props.get('inputClass')}"
    if props.get("actionsClass"):
        actions_class += f" {props.get('actionsClass')}"
    if props.get("registerClass"):
        register_btn_class += f" {props.get('registerClass')}"
    if props.get("loginClass"):
        login_btn_class += f" {props.get('loginClass')}"

    # Generate full form with customized parts
    return f"""<form className=\"{form_class}\">\n  <h1 className=\"{title_class}\">{title}</h1>\n  <div className=\"{container_class}\">\n    <label className=\"{label_class}\">\n      <span className=\"mb-1 block\">{name_label}</span>\n      <input id=\"{name_id}\" name=\"name\" className=\"{input_class}\" placeholder=\"Enter your full name\" />\n    </label>\n    <label className=\"{label_class}\">\n      <span className=\"mb-1 block\">{email_label}</span>\n      <input id=\"{email_id}\" name=\"email\" className=\"{input_class}\" type=\"email\" placeholder=\"Enter your email\" />\n    </label>\n    <label className=\"{label_class}\">\n      <span className=\"mb-1 block\">{password_label}</span>\n      <input id=\"{password_id}\" name=\"password\" className=\"{input_class}\" type=\"password\" placeholder=\"Enter your password\" />\n    </label>\n    <label className=\"{label_class}\">\n      <span className=\"mb-1 block\">{confirm_password_label}</span>\n      <input id=\"{confirm_id}\" name=\"confirmPassword\" className=\"{input_class}\" type=\"password\" placeholder=\"Confirm your password\" />\n    </label>\n    <div className=\"{actions_class}\">\n      <button className=\"{register_btn_class}\"{register_handler}>{register_text}</button>\n      <button className=\"{login_btn_class}\"{login_handler}>{login_text}</button>\n    </div>\n  </div>\n</form>"""


# Register with token "rf"
COMPONENT_TOKEN = "rf"
