from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Numeric, Time
from sqlalchemy.orm import relationship
from datetime import datetime, time
from .auth import Base

class MenuItem(Base):
    __tablename__ = "menu_items"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    price = Column(Numeric(10, 2), nullable=False)
    category_id = Column(Integer, ForeignKey("menu_categories.id"))
    image_url = Column(String(500))
    is_available = Column(Boolean, default=True)
    is_popular = Column(Boolean, default=False)
    dietary_info = Column(String(200))  # JSON string for dietary flags
    created_at = Column(DateTime, default=datetime.utcnow)
    
    category = relationship("MenuCategory", back_populates="items")

class MenuCategory(Base):
    __tablename__ = "menu_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    display_order = Column(Integer, default=0)
    image_url = Column(String(500))
    
    items = relationship("MenuItem", back_populates="category")

class Reservation(Base):
    __tablename__ = "reservations"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_email = Column(String(100), nullable=False)
    customer_phone = Column(String(20))
    party_size = Column(Integer, nullable=False)
    reservation_date = Column(DateTime, nullable=False)
    special_requests = Column(Text)
    status = Column(String(20), default="confirmed")  # confirmed, cancelled, completed
    created_at = Column(DateTime, default=datetime.utcnow)

class OperatingHours(Base):
    __tablename__ = "operating_hours"
    
    id = Column(Integer, primary_key=True, index=True)
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    open_time = Column(Time)
    close_time = Column(Time)
    is_closed = Column(Boolean, default=False)
    special_note = Column(String(200))

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    subject = Column(String(200))
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)