# sevdo_backend/endpoints/register.py
"""
Register endpoint - creates new user account.
"""


def render_endpoint(args=None, props=None):
    """
    Render register endpoint code.

    Args:
        args: String arguments from DSL (optional path parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Default values
    endpoint_path = props.get("path", "/register") if props else "/register"
    method = props.get("method", "POST").upper() if props else "POST"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        pass

    # Generate the register endpoint code
    endpoint_code = f'''
@app.{method.lower()}("{endpoint_path}")
def register_endpoint(user: User, db: Session = Depends(get_db)):
    """
    Create new user account.
    
    Checks if username is available and creates user with hashed password.
    """
    # Check if user already exists
    existing_user = db.query(UserDB).filter(UserDB.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed = pwd_context.hash(user.password)
    db_user = UserDB(username=user.username, password=hashed)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {{"msg": "User registered successfully", "user_id": db_user.id}}'''

    return endpoint_code.strip()


# Register with token "r"
ENDPOINT_TOKEN = "r"
