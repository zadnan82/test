# sevdo_backend/endpoints/login.py
"""
Login endpoint - authenticates user and creates session.
"""


def render_endpoint(args=None, props=None):
    """
    Render login endpoint code.

    Args:
        args: String arguments from DSL (optional path parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Default values
    endpoint_path = props.get("path", "/login") if props else "/login"
    method = props.get("method", "POST").upper() if props else "POST"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        # Example: args = "path=/api/login" -> endpoint_path = "/api/login"
        pass

    # Generate the login endpoint code
    endpoint_code = f'''
@app.{method.lower()}("{endpoint_path}")
def login_endpoint(user: User, db: Session = Depends(get_db)):
    """
    Authenticate user and create session.
    
    Returns session token on successful login.
    """
    db_user = db.query(UserDB).filter(UserDB.username == user.username).first()
    if not db_user or not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    session_id = str(uuid.uuid4())
    expiry = datetime.utcnow() + timedelta(hours=1)
    db.add(SessionDB(id=session_id, user_id=db_user.id, expiry=expiry))
    db.commit()
    return {{"session_token": session_id}}'''

    return endpoint_code.strip()


# Register with token "l"
ENDPOINT_TOKEN = "l"
