# sevdo_backend/endpoints/chat_handler.py
"""
Chat handler endpoint - processes chat messages from frontend.
"""


def render_endpoint(args=None, props=None):
    """
    Render chat handler endpoint code.

    Args:
        args: String arguments from DSL (optional path parameters)
        props: Dictionary of properties from DSL

    Returns:
        String containing FastAPI endpoint code
    """
    # Default values
    endpoint_path = props.get("path", "/chat") if props else "/chat"
    method = props.get("method", "POST").upper() if props else "POST"

    # Support for inline args parsing if needed
    if args:
        # Could parse custom path or options from args
        pass

    # Generate the chat handler endpoint code
    endpoint_code = f'''
# Chat message data model
class ChatMessageData(BaseModel):
    message: str
    chat_room: Optional[str] = "general"
    message_type: Optional[str] = "text"  # text, image, file
    reply_to: Optional[int] = None  # ID of message being replied to

# Chat room database model
class ChatRoomDB(Base):
    __tablename__ = "chat_rooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    description = Column(String, nullable=True)
    is_private = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

# Chat message database model
class ChatMessageDB(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    message = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    chat_room_id = Column(Integer, ForeignKey("chat_rooms.id"), nullable=False)
    message_type = Column(String, default="text")
    reply_to_id = Column(Integer, ForeignKey("chat_messages.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_deleted = Column(Boolean, default=False)

@app.{method.lower()}("{endpoint_path}")
def chat_handler(chat_data: ChatMessageData, current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Handle chat message submissions from frontend.
    
    Saves messages to database and supports chat rooms and replies.
    Requires authentication.
    """
    # Basic validation
    if not chat_data.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    if len(chat_data.message) > 2000:
        raise HTTPException(status_code=400, detail="Message too long (max 2000 characters)")
    
    # Clean input
    message_content = chat_data.message.strip()
    room_name = chat_data.chat_room.strip() if chat_data.chat_room else "general"
    
    # Find or create chat room
    chat_room = db.query(ChatRoomDB).filter(ChatRoomDB.name == room_name).first()
    if not chat_room:
        # Create default chat room
        chat_room = ChatRoomDB(
            name=room_name,
            description=f"Chat room: {{room_name}}",
            is_private=False,
            created_by=current_user.id
        )
        db.add(chat_room)
        db.commit()
        db.refresh(chat_room)
    
    # Validate reply_to message exists if specified
    reply_to_message = None
    if chat_data.reply_to:
        reply_to_message = db.query(ChatMessageDB).filter(
            ChatMessageDB.id == chat_data.reply_to,
            ChatMessageDB.chat_room_id == chat_room.id,
            ChatMessageDB.is_deleted == False
        ).first()
        if not reply_to_message:
            raise HTTPException(status_code=404, detail="Reply target message not found")
    
    # Create chat message
    chat_message = ChatMessageDB(
        message=message_content,
        user_id=current_user.id,
        chat_room_id=chat_room.id,
        message_type=chat_data.message_type or "text",
        reply_to_id=chat_data.reply_to if reply_to_message else None
    )
    db.add(chat_message)
    db.commit()
    db.refresh(chat_message)
    
    # Log chat message
    logging.info(f"Chat message sent - User: {{current_user.username}} Room: {{room_name}} Message ID: {{chat_message.id}}")
    
    # Prepare response with user info
    response_data = {{
        "msg": "Message sent successfully",
        "message_id": chat_message.id,
        "chat_room": room_name,
        "timestamp": chat_message.created_at.isoformat(),
        "user": {{
            "id": current_user.id,
            "username": current_user.username
        }}
    }}
    
    # Add reply context if this is a reply
    if reply_to_message:
        reply_user = db.query(UserDB).filter(UserDB.id == reply_to_message.user_id).first()
        response_data["reply_to"] = {{
            "message_id": reply_to_message.id,
            "preview": reply_to_message.message[:100] + "..." if len(reply_to_message.message) > 100 else reply_to_message.message,
            "user": reply_user.username if reply_user else "Unknown"
        }}
    
    return response_data

# Additional endpoint to get chat history
@app.get("{endpoint_path}/history")
def get_chat_history(
    chat_room: str = "general",
    limit: int = 50,
    offset: int = 0,
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get chat message history for a room.
    """
    # Find chat room
    room = db.query(ChatRoomDB).filter(ChatRoomDB.name == chat_room).first()
    if not room:
        raise HTTPException(status_code=404, detail="Chat room not found")
    
    # Get messages with user info
    messages = db.query(ChatMessageDB, UserDB).join(
        UserDB, ChatMessageDB.user_id == UserDB.id
    ).filter(
        ChatMessageDB.chat_room_id == room.id,
        ChatMessageDB.is_deleted == False
    ).order_by(ChatMessageDB.created_at.desc()).offset(offset).limit(limit).all()
    
    # Format response
    message_list = []
    for msg, user in messages:
        message_data = {{
            "id": msg.id,
            "message": msg.message,
            "user": {{
                "id": user.id,
                "username": user.username
            }},
            "timestamp": msg.created_at.isoformat(),
            "message_type": msg.message_type
        }}
        
        # Add reply info if this message is a reply
        if msg.reply_to_id:
            reply_msg = db.query(ChatMessageDB, UserDB).join(
                UserDB, ChatMessageDB.user_id == UserDB.id
            ).filter(ChatMessageDB.id == msg.reply_to_id).first()
            if reply_msg:
                reply_message, reply_user = reply_msg
                message_data["reply_to"] = {{
                    "message_id": reply_message.id,
                    "preview": reply_message.message[:100] + "..." if len(reply_message.message) > 100 else reply_message.message,
                    "user": reply_user.username
                }}
        
        message_list.append(message_data)
    
    return {{
        "messages": list(reversed(message_list)),  # Return in chronological order
        "chat_room": chat_room,
        "total_messages": len(message_list),
        "has_more": len(message_list) == limit
    }}'''

    return endpoint_code.strip()


# Register with token "cha"
ENDPOINT_TOKEN = "cha"
