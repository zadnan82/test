# sevdo_backend/endpoints/logout.py
"""
Logout endpoint - destroys current user session.
"""


def render_endpoint(args=None, props=None):
    """
    Render logout endpoint code.

    Args:
        args: String arguments from DSL (optional path parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Default values
    endpoint_path = props.get("path", "/logout") if props else "/logout"
    method = props.get("method", "POST").upper() if props else "POST"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        pass

    # Generate the logout endpoint code
    endpoint_code = f'''
@app.{method.lower()}("{endpoint_path}")
def logout_endpoint(session: SessionDB = Depends(get_current_session), db: Session = Depends(get_db)):
    """
    Logout current user by destroying their session.
    
    Requires valid session token in Authorization header.
    """
    db.delete(session)
    db.commit()
    return {{"msg": "Logged out successfully"}}'''

    return endpoint_code.strip()


# Register with token "o"
ENDPOINT_TOKEN = "o"
