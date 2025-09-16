# sevdo_backend/endpoints/register_form_handler.py
"""
Register form handler endpoint - processes registration form submissions from frontend.
"""


def render_endpoint(args=None, props=None):
    """
    Render register form handler endpoint code.

    Args:
        args: String arguments from DSL (optional path parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Email and username patterns (outside f-string to avoid escape issues)
    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

    username_pattern = r"^[a-zA-Z0-9_]{3,20}$"

    # Default values
    endpoint_path = props.get("path", "/register-form") if props else "/register-form"
    method = props.get("method", "POST").upper() if props else "POST"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        pass

    # Generate the register form handler endpoint code
    endpoint_code = f'''
# Register form data model
class RegisterFormData(BaseModel):
    username: str
    email: str
    password: str
    confirm_password: str
    accept_terms: Optional[bool] = False

@app.{method.lower()}("{endpoint_path}")
def register_form_handler(form_data: RegisterFormData, db: Session = Depends(get_db)):
    """
    Handle registration form submissions from frontend.
    
    Enhanced validation and user-friendly error messages for web forms.
    """
    # Basic validation
    if not form_data.username.strip():
        raise HTTPException(status_code=400, detail="Username is required")
    if not form_data.email.strip():
        raise HTTPException(status_code=400, detail="Email is required")
    if not form_data.password:
        raise HTTPException(status_code=400, detail="Password is required")
    if not form_data.confirm_password:
        raise HTTPException(status_code=400, detail="Please confirm your password")
    
    # Password confirmation check
    if form_data.password != form_data.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    # Password strength validation
    if len(form_data.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
    
    # Email format validation
    import re
    if not re.match(r"{email_pattern}", form_data.email):
        raise HTTPException(status_code=400, detail="Please enter a valid email address")
    
    # Username validation (alphanumeric and underscore only)
    if not re.match(r"{username_pattern}", form_data.username):
        raise HTTPException(status_code=400, detail="Username must be 3-20 characters, letters, numbers and underscore only")
    
    # Terms acceptance (optional but recommended)
    if not form_data.accept_terms:
        raise HTTPException(status_code=400, detail="Please accept the terms and conditions")
    
    # Clean input
    username = form_data.username.strip().lower()
    email = form_data.email.strip().lower()
    
    # Check if username already exists
    existing_username = db.query(UserDB).filter(UserDB.username == username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username is already taken")
    
    # Check if email already exists
    existing_email = db.query(UserDB).filter(UserDB.email == email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email is already registered")
    
    # Create user
    hashed_password = pwd_context.hash(form_data.password)
    db_user = UserDB(
        username=username,
        email=email,
        password=hashed_password,
        is_active=True
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Log successful registration
    logging.info(f"New user registered: {{username}} ({{email}}) - ID: {{db_user.id}}")
    
    return {{
        "msg": "Account created successfully! You can now log in.",
        "user_id": db_user.id,
        "username": db_user.username,
        "email": db_user.email,
        "status": "active"
    }}'''

    return endpoint_code.strip()


# Register with token "rfh"
ENDPOINT_TOKEN = "rfh"
