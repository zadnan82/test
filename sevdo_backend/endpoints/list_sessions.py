# sevdo_backend/endpoints/list_sessions.py
"""
List sessions endpoint - returns all active sessions for current user.
"""


def render_endpoint(args=None, props=None):
    """
    Render list sessions endpoint code.

    Args:
        args: String arguments from DSL (optional path parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Default values
    endpoint_path = props.get("path", "/sessions") if props else "/sessions"
    method = props.get("method", "GET").upper() if props else "GET"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        pass

    # Generate the list sessions endpoint code
    endpoint_code = f'''
@app.{method.lower()}("{endpoint_path}")
def list_sessions_endpoint(current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    List all active sessions for current user.
    
    Returns session details including ID, expiry time, and creation time.
    Requires valid session token in Authorization header.
    """
    sessions = db.query(SessionDB).filter(SessionDB.user_id == current_user.id).all()
    return [{{"id": s.id, "expiry": s.expiry.isoformat(), "created_at": s.created_at.isoformat()}} for s in sessions]'''

    return endpoint_code.strip()


# Register with token "s"
ENDPOINT_TOKEN = "s"
