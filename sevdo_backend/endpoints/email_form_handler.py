# sevdo_backend/endpoints/email_form_handler.py
"""
Email form handler endpoint - processes email form submissions from frontend.
"""


def render_endpoint(args=None, props=None):
    """
    Render email form handler endpoint code.

    Args:
        args: String arguments from DSL (optional path parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Email validation pattern (outside f-string)
    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

    # Default values
    endpoint_path = props.get("path", "/send-email") if props else "/send-email"
    method = props.get("method", "POST").upper() if props else "POST"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        pass

    # Generate the email form handler endpoint code
    endpoint_code = f'''
# Email form data model
class EmailFormData(BaseModel):
    to: str
    subject: str
    message: str
    from_name: Optional[str] = None

# Email log database model
class EmailLogDB(Base):
    __tablename__ = "email_logs"
    id = Column(Integer, primary_key=True, index=True)
    to_email = Column(String, nullable=False)
    from_email = Column(String, nullable=True)
    from_name = Column(String, nullable=True)
    subject = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    status = Column(String, default="pending")  # pending, sent, failed
    created_at = Column(DateTime, default=datetime.utcnow)
    sent_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)

@app.{method.lower()}("{endpoint_path}")
def email_form_handler(email_data: EmailFormData, current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Handle email form submissions from frontend.
    
    Validates email, sends via SMTP, and logs the transaction.
    Requires authentication to prevent spam.
    """
    # Basic validation
    if not email_data.to.strip():
        raise HTTPException(status_code=400, detail="Recipient email is required")
    if not email_data.subject.strip():
        raise HTTPException(status_code=400, detail="Subject is required")
    if not email_data.message.strip():
        raise HTTPException(status_code=400, detail="Message is required")
    
    # Email format validation
    import re
    if not re.match(r"{email_pattern}", email_data.to.strip()):
        raise HTTPException(status_code=400, detail="Invalid recipient email format")
    
    # Clean input
    to_email = email_data.to.strip().lower()
    subject = email_data.subject.strip()
    message = email_data.message.strip()
    from_name = email_data.from_name.strip() if email_data.from_name else current_user.username
    
    # Create email log entry
    email_log = EmailLogDB(
        to_email=to_email,
        from_email=current_user.email,
        from_name=from_name,
        subject=subject,
        message=message,
        status="pending"
    )
    db.add(email_log)
    db.commit()
    db.refresh(email_log)
    
    try:
        # Email sending configuration (environment variables)
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        smtp_server = os.getenv("SMTP_SERVER", "localhost")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_username = os.getenv("SMTP_USERNAME", "")
        smtp_password = os.getenv("SMTP_PASSWORD", "")
        smtp_use_tls = os.getenv("SMTP_USE_TLS", "true").lower() == "true"
        
        # Create message
        msg = MIMEMultipart()
        msg["From"] = f"{{from_name}} <{{smtp_username or current_user.email}}>"
        msg["To"] = to_email
        msg["Subject"] = subject
        
        # Add message body
        msg.attach(MIMEText(message, "plain"))
        
        # Send email
        if smtp_server != "localhost" and smtp_username:
            server = smtplib.SMTP(smtp_server, smtp_port)
            if smtp_use_tls:
                server.starttls()
            server.login(smtp_username, smtp_password)
            server.sendmail(smtp_username or current_user.email, to_email, msg.as_string())
            server.quit()
            
            # Update log as sent
            email_log.status = "sent"
            email_log.sent_at = datetime.utcnow()
            status_message = "Email sent successfully"
        else:
            # Development mode - just log
            email_log.status = "sent"
            email_log.sent_at = datetime.utcnow()
            status_message = "Email logged (development mode - no SMTP configured)"
            
    except Exception as e:
        # Update log with error
        email_log.status = "failed"
        email_log.error_message = str(e)
        status_message = f"Failed to send email: {{str(e)}}"
        logging.error(f"Email sending failed for log ID {{email_log.id}}: {{str(e)}}")
        
    finally:
        db.commit()
    
    # Log the email attempt
    logging.info(f"Email {{email_log.status}} - From: {{current_user.email}} To: {{to_email}} Subject: {{subject}} - Log ID: {{email_log.id}}")
    
    return {{
        "msg": status_message,
        "email_id": email_log.id,
        "status": email_log.status,
        "to": to_email,
        "subject": subject
    }}'''

    return endpoint_code.strip()


# Register with token "emh"
ENDPOINT_TOKEN = "emh"
