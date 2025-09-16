# sevdo_backend/endpoints/refresh_token.py
"""
Refresh token endpoint - renews current session with new token.
"""


def render_endpoint(args=None, props=None):
    """
    Render refresh token endpoint code.

    Args:
        args: String arguments from DSL (optional path parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Default values
    endpoint_path = props.get("path", "/refresh") if props else "/refresh"
    method = props.get("method", "POST").upper() if props else "POST"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        pass

    # Generate the refresh token endpoint code
    endpoint_code = f'''
@app.{method.lower()}("{endpoint_path}")
def refresh_endpoint(session: SessionDB = Depends(get_current_session), db: Session = Depends(get_db)):
    """
    Refresh current session with new token.
    
    Generates new session ID and extends expiry time.
    Requires valid session token in Authorization header.
    """
    new_session_id = str(uuid.uuid4())
    session.id = new_session_id
    session.expiry = datetime.utcnow() + timedelta(hours=1)
    db.commit()
    return {{"session_token": new_session_id}}'''

    return endpoint_code.strip()


# Register with token "t"
ENDPOINT_TOKEN = "t"
