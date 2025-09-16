# sevdo_backend/endpoints/login_form_handler.py
"""
Login form handler endpoint - processes login form submissions from frontend.
"""


def render_endpoint(args=None, props=None):
    """
    Render login form handler endpoint code.

    Args:
        args: String arguments from DSL (optional path parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Default values
    endpoint_path = props.get("path", "/login-form") if props else "/login-form"
    method = props.get("method", "POST").upper() if props else "POST"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        pass

    # Generate the login form handler endpoint code
    endpoint_code = f'''
# Login form data model (more flexible than core User model)
class LoginFormData(BaseModel):
    username: str
    password: str
    remember_me: Optional[bool] = False

@app.{method.lower()}("{endpoint_path}")
def login_form_handler(form_data: LoginFormData, db: Session = Depends(get_db)):
    """
    Handle login form submissions from frontend.
    
    More user-friendly version of core login endpoint with better error messages.
    """
    # Basic validation
    if not form_data.username.strip():
        raise HTTPException(status_code=400, detail="Username is required")
    if not form_data.password:
        raise HTTPException(status_code=400, detail="Password is required")
    
    # Clean username (remove whitespace, convert to lowercase)
    username = form_data.username.strip().lower()
    
    # Find user
    db_user = db.query(UserDB).filter(UserDB.username == username).first()
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Check if user is active
    if not db_user.is_active:
        raise HTTPException(status_code=403, detail="Account is disabled")
    
    # Verify password
    if not pwd_context.verify(form_data.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    # Create session with extended expiry if remember_me is checked
    session_id = str(uuid.uuid4())
    expiry_hours = 24 * 7 if form_data.remember_me else 1  # 7 days vs 1 hour
    expiry = datetime.utcnow() + timedelta(hours=expiry_hours)
    
    db.add(SessionDB(id=session_id, user_id=db_user.id, expiry=expiry))
    db.commit()
    
    # Log successful login
    logging.info(f"User {{db_user.username}} logged in successfully - Session: {{session_id}}")
    
    return {{
        "msg": "Login successful",
        "session_token": session_id,
        "user": {{
            "id": db_user.id,
            "username": db_user.username,
            "email": db_user.email
        }},
        "expires_in_hours": expiry_hours
    }}'''

    return endpoint_code.strip()


# Register with token "lfh"
ENDPOINT_TOKEN = "lfh"
