# sevdo_backend/endpoints/me.py
"""
Me endpoint - returns current authenticated user information.
"""


def render_endpoint(args=None, props=None):
    """
    Render me endpoint code.

    Args:
        args: String arguments from DSL (optional path parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Default values
    endpoint_path = props.get("path", "/me") if props else "/me"
    method = props.get("method", "GET").upper() if props else "GET"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        pass

    # Generate the me endpoint code
    endpoint_code = f'''
@app.{method.lower()}("{endpoint_path}", response_model=UserResponse)
def me_endpoint(current_user: UserDB = Depends(get_current_user)):
    """
    Get current authenticated user information.
    
    Requires valid session token in Authorization header.
    """
    return current_user'''

    return endpoint_code.strip()


# Register with token "m"
ENDPOINT_TOKEN = "m"
