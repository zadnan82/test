# sevdo_backend/endpoints/contact_form_handler.py
"""
Contact form handler endpoint - processes contact form submissions.
"""


def render_endpoint(args=None, props=None):
    """
    Render contact form handler endpoint code.

    Args:
        args: String arguments from DSL (optional path parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Default values
    endpoint_path = props.get("path", "/contact") if props else "/contact"
    method = props.get("method", "POST").upper() if props else "POST"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        pass

    # Generate the contact form handler endpoint code
    endpoint_code = f'''
# Contact form data model
class ContactFormData(BaseModel):
    name: str
    email: str
    subject: Optional[str] = None
    message: str

# Contact form database model
class ContactFormDB(Base):
    __tablename__ = "contact_forms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    subject = Column(String, nullable=True)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)

@app.{method.lower()}("{endpoint_path}")
def contact_form_handler(form_data: ContactFormData, db: Session = Depends(get_db)):
    """
    Handle contact form submissions.
    
    Validates input, saves to database, and optionally sends notification email.
    """
    # Basic validation
    if not form_data.name.strip():
        raise HTTPException(status_code=400, detail="Name is required")
    if not form_data.email.strip():
        raise HTTPException(status_code=400, detail="Email is required")
    if not form_data.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")
    
    # Email format validation
    import re
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{{2,}}$'
    if not re.match(email_pattern, form_data.email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    # Save to database
    db_contact = ContactFormDB(
        name=form_data.name.strip(),
        email=form_data.email.strip().lower(),
        subject=form_data.subject.strip() if form_data.subject else None,
        message=form_data.message.strip()
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    
    # Log the submission
    logging.info(f"Contact form submitted by {{form_data.email}} - ID: {{db_contact.id}}")
    
    return {{
        "msg": "Contact form submitted successfully",
        "submission_id": db_contact.id,
        "status": "received"
    }}'''

    return endpoint_code.strip()


# Register with token "cfh"
ENDPOINT_TOKEN = "cfh"
