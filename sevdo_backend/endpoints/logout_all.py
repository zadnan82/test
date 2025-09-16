# sevdo_backend/endpoints/logout_all.py
"""
Logout all endpoint - destroys all sessions for current user.
"""


def render_endpoint(args=None, props=None):
    """
    Render logout all sessions endpoint code.

    Args:
        args: String arguments from DSL (optional path parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Default values
    endpoint_path = props.get("path", "/logout-all") if props else "/logout-all"
    method = props.get("method", "POST").upper() if props else "POST"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        pass

    # Generate the logout all sessions endpoint code
    endpoint_code = f'''
@app.{method.lower()}("{endpoint_path}")
def logout_all_endpoint(current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Logout from all sessions for current user.
    
    Deletes all active sessions belonging to the authenticated user.
    Requires valid session token in Authorization header.
    """
    db.query(SessionDB).filter(SessionDB.user_id == current_user.id).delete()
    db.commit()
    return {{"msg": "Logged out of all sessions"}}'''

    return endpoint_code.strip()


# Register with token "a"
ENDPOINT_TOKEN = "a"
