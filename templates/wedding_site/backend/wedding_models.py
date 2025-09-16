from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Numeric, Date, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, date
from .auth import Base
import enum

class EventType(enum.Enum):
    WEDDING = "wedding"
    ENGAGEMENT = "engagement"
    ANNIVERSARY = "anniversary"
    CORPORATE = "corporate"
    BIRTHDAY = "birthday"
    OTHER = "other"

class EventStatus(enum.Enum):
    INQUIRY = "inquiry"
    CONSULTATION = "consultation"
    PLANNING = "planning"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class PackageType(enum.Enum):
    BASIC = "basic"
    PREMIUM = "premium"
    LUXURY = "luxury"
    CUSTOM = "custom"

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20))
    partner_first_name = Column(String(100))
    partner_last_name = Column(String(100))
    partner_email = Column(String(100))
    partner_phone = Column(String(20))
    address = Column(String(200))
    city = Column(String(100))
    country = Column(String(100))
    preferred_language = Column(String(20), default="sv")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    events = relationship("Event", back_populates="client")
    consultations = relationship("Consultation", back_populates="client")

class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    event_type = Column(Enum(EventType), nullable=False)
    event_date = Column(Date, nullable=False)
    event_time = Column(String(20))
    guest_count = Column(Integer)
    budget_min = Column(Numeric(10, 2))
    budget_max = Column(Numeric(10, 2))
    venue_name = Column(String(200))
    venue_address = Column(String(300))
    venue_city = Column(String(100))
    theme = Column(String(100))
    color_scheme = Column(String(100))
    special_requirements = Column(Text)
    status = Column(Enum(EventStatus), default=EventStatus.INQUIRY)
    package_id = Column(Integer, ForeignKey("wedding_packages.id"))
    total_cost = Column(Numeric(12, 2))
    deposit_paid = Column(Numeric(10, 2), default=0)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    client = relationship("Client", back_populates="events")
    package = relationship("WeddingPackage", back_populates="events")
    services = relationship("EventService", back_populates="event")
    gallery_items = relationship("GalleryItem", back_populates="event")

class WeddingPackage(Base):
    __tablename__ = "wedding_packages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    name_sv = Column(String(200))  # Swedish name
    name_en = Column(String(200))  # English name
    description = Column(Text)
    description_sv = Column(Text)
    description_en = Column(Text)
    package_type = Column(Enum(PackageType), nullable=False)
    base_price = Column(Numeric(10, 2), nullable=False)
    max_guests = Column(Integer)
    duration_hours = Column(Integer)
    included_services = Column(Text)  # JSON string for services list
    additional_services = Column(Text)  # JSON string for optional services
    is_active = Column(Boolean, default=True)
    is_popular = Column(Boolean, default=False)
    image_url = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    events = relationship("Event", back_populates="package")

class Service(Base):
    __tablename__ = "services"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    name_sv = Column(String(200))
    name_en = Column(String(200))
    category = Column(String(100))  # planning, decoration, photography, catering, etc.
    description = Column(Text)
    description_sv = Column(Text)
    description_en = Column(Text)
    base_price = Column(Numeric(10, 2))
    price_unit = Column(String(50))  # per hour, per event, per person, etc.
    is_included_in_packages = Column(Boolean, default=False)
    image_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    event_services = relationship("EventService", back_populates="service")

class EventService(Base):
    __tablename__ = "event_services"
    
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    service_id = Column(Integer, ForeignKey("services.id"))
    quantity = Column(Integer, default=1)
    custom_price = Column(Numeric(10, 2))  # Override default price if needed
    notes = Column(Text)
    is_confirmed = Column(Boolean, default=False)
    
    # Relationships
    event = relationship("Event", back_populates="services")
    service = relationship("Service", back_populates="event_services")

class Vendor(Base):
    __tablename__ = "vendors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    category = Column(String(100))  # photographer, florist, caterer, musician, etc.
    contact_person = Column(String(100))
    email = Column(String(100))
    phone = Column(String(20))
    website = Column(String(200))
    address = Column(String(200))
    city = Column(String(100))
    rating = Column(Numeric(3, 2))  # 1.00 to 5.00
    price_range = Column(String(20))  # $, $$, $$$, $$$$
    specialties = Column(Text)  # JSON string for specialties
    portfolio_url = Column(String(500))
    notes = Column(Text)
    is_preferred = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class GalleryItem(Base):
    __tablename__ = "gallery_items"
    
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    title = Column(String(200))
    title_sv = Column(String(200))
    title_en = Column(String(200))
    description = Column(Text)
    image_before_url = Column(String(500))
    image_after_url = Column(String(500))
    image_gallery_urls = Column(Text)  # JSON string for multiple images
    category = Column(String(100))  # ceremony, reception, decoration, etc.
    is_featured = Column(Boolean, default=False)
    is_public = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    event = relationship("Event", back_populates="gallery_items")

class Consultation(Base):
    __tablename__ = "consultations"
    
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    consultation_date = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, default=60)
    consultation_type = Column(String(50))  # initial, planning, final, etc.
    location = Column(String(200))  # office, venue, video call
    agenda = Column(Text)
    notes = Column(Text)
    follow_up_required = Column(Boolean, default=False)
    status = Column(String(20), default="scheduled")  # scheduled, completed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    client = relationship("Client", back_populates="consultations")

class Testimonial(Base):
    __tablename__ = "testimonials"
    
    id = Column(Integer, primary_key=True, index=True)
    client_first_name = Column(String(100), nullable=False)
    client_last_name = Column(String(100))
    partner_first_name = Column(String(100))
    partner_last_name = Column(String(100))
    event_date = Column(Date)
    testimonial_text = Column(Text, nullable=False)
    testimonial_text_sv = Column(Text)
    testimonial_text_en = Column(Text)
    rating = Column(Integer)  # 1-5 stars
    photo_url = Column(String(500))
    is_featured = Column(Boolean, default=False)
    is_approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20))
    event_date = Column(Date)
    event_type = Column(String(50))
    guest_count = Column(Integer)
    budget_range = Column(String(50))
    message = Column(Text, nullable=False)
    preferred_language = Column(String(20), default="sv")
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)
    response_sent = Column(Boolean, default=False)
