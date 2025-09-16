# sevdo_backend/endpoints/revoke_session.py
"""
Revoke session endpoint - deletes specific session by ID.
"""


def render_endpoint(args=None, props=None):
    """
    Render revoke session endpoint code.

    Args:
        args: String arguments from DSL (optional path parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Default values
    endpoint_path = (
        props.get("path", "/sessions/{session_id}")
        if props
        else "/sessions/{session_id}"
    )
    method = props.get("method", "DELETE").upper() if props else "DELETE"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        pass

    # Generate the revoke session endpoint code
    endpoint_code = f'''
@app.{method.lower()}("{endpoint_path}")
def revoke_session_endpoint(session_id: str, current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Revoke (delete) specific session by ID.
    
    Only allows users to revoke their own sessions.
    Requires valid session token in Authorization header.
    """
    session = db.query(SessionDB).filter(SessionDB.id == session_id, SessionDB.user_id == current_user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    db.delete(session)
    db.commit()
    return {{"msg": "Session revoked successfully"}}'''

    return endpoint_code.strip()


# Register with token "k"
ENDPOINT_TOKEN = "k"
