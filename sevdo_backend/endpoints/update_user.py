# sevdo_backend/endpoints/update_user.py
"""
Update user endpoint - allows user to update their password.
"""


def render_endpoint(args=None, props=None):
    """
    Render update user endpoint code.

    Args:
        args: String arguments from DSL (optional path parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Default values
    endpoint_path = props.get("path", "/update") if props else "/update"
    method = props.get("method", "POST").upper() if props else "POST"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        pass

    # Generate the update user endpoint code
    endpoint_code = f'''
@app.{method.lower()}("{endpoint_path}")
def update_endpoint(user: User, current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Update current user's password.
    
    Requires valid session token in Authorization header.
    Updates password with proper hashing.
    """
    current_user.password = pwd_context.hash(user.password)
    db.commit()
    return {{"msg": "Password updated successfully"}}'''

    return endpoint_code.strip()


# Register with token "u"
ENDPOINT_TOKEN = "u"
