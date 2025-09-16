from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Numeric, Date, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, date
from .auth import Base
import enum

class PropertyType(enum.Enum):
    APARTMENT = "apartment"  # Bostadsrätt
    HOUSE = "house"  # Villa
    TOWNHOUSE = "townhouse"  # Radhus
    CONDO = "condo"  # Lägenhet
    COMMERCIAL = "commercial"  # Kommersiell
    LAND = "land"  # Tomt

class PropertyStatus(enum.Enum):
    FOR_SALE = "for_sale"
    SOLD = "sold"
    PENDING = "pending"
    WITHDRAWN = "withdrawn"
    RESERVED = "reserved"

class ListingStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    DRAFT = "draft"

class Agent(Base):
    __tablename__ = "agents"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20))
    license_number = Column(String(50), unique=True)
    bio = Column(Text)
    specialties = Column(Text)  # JSON string for specialties
    experience_years = Column(Integer)
    profile_image_url = Column(String(500))
    languages = Column(Text)  # JSON string for languages
    areas_served = Column(Text)  # JSON string for service areas
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    properties = relationship("Property", back_populates="agent")
    valuations = relationship("Valuation", back_populates="agent")
    client_meetings = relationship("ClientMeeting", back_populates="agent")

class Property(Base):
    __tablename__ = "properties"
    
    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"))
    title = Column(String(200), nullable=False)
    description = Column(Text)
    property_type = Column(Enum(PropertyType), nullable=False)
    status = Column(Enum(PropertyStatus), default=PropertyStatus.FOR_SALE)
    listing_status = Column(Enum(ListingStatus), default=ListingStatus.ACTIVE)
    
    # Location
    address = Column(String(200), nullable=False)
    city = Column(String(100), nullable=False)
    postal_code = Column(String(20))
    neighborhood = Column(String(100))
    county = Column(String(100))  # Län
    municipality = Column(String(100))  # Kommun
    
    # Property details
    price = Column(Numeric(12, 2), nullable=False)
    monthly_fee = Column(Numeric(10, 2))  # Månadsavgift
    operating_cost = Column(Numeric(10, 2))  # Driftskostnad
    property_tax = Column(Numeric(10, 2))  # Fastighetsskatt
    
    # Physical characteristics
    living_area = Column(Numeric(8, 2))  # Boarea (sqm)
    total_area = Column(Numeric(8, 2))  # Totalarea
    plot_area = Column(Numeric(10, 2))  # Tomtarea
    rooms = Column(Integer)  # Antal rum
    bedrooms = Column(Integer)  # Sovrum
    bathrooms = Column(Integer)  # Badrum
    floor = Column(Integer)  # Våning
    total_floors = Column(Integer)  # Antal våningar
    
    # Building information
    construction_year = Column(Integer)  # Byggnadsår
    renovation_year = Column(Integer)  # Renoveringsår
    energy_rating = Column(String(10))  # Energiklass
    heating_type = Column(String(100))  # Uppvärmning
    
    # Features
    balcony = Column(Boolean, default=False)
    elevator = Column(Boolean, default=False)
    parking = Column(Boolean, default=False)
    garden = Column(Boolean, default=False)
    fireplace = Column(Boolean, default=False)
    
    # Media
    main_image_url = Column(String(500))
    image_urls = Column(Text)  # JSON string for multiple images
    virtual_tour_url = Column(String(500))
    floor_plan_url = Column(String(500))
    
    # Listing information
    list_date = Column(Date, default=date.today)
    sold_date = Column(Date)
    sold_price = Column(Numeric(12, 2))
    days_on_market = Column(Integer)
    views_count = Column(Integer, default=0)
    
    # SEO and search
    seo_title = Column(String(200))
    seo_description = Column(Text)
    keywords = Column(Text)  # JSON string for search keywords
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    agent = relationship("Agent", back_populates="properties")
    viewings = relationship("PropertyViewing", back_populates="property")
    inquiries = relationship("PropertyInquiry", back_populates="property")

class Valuation(Base):
    __tablename__ = "valuations"
    
    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"))
    
    # Client information
    client_name = Column(String(100), nullable=False)
    client_email = Column(String(100), nullable=False)
    client_phone = Column(String(20))
    
    # Property information
    property_address = Column(String(200), nullable=False)
    property_type = Column(Enum(PropertyType), nullable=False)
    living_area = Column(Numeric(8, 2))
    rooms = Column(Integer)
    construction_year = Column(Integer)
    condition = Column(String(100))  # Skick
    
    # Valuation details
    estimated_value_min = Column(Numeric(12, 2))
    estimated_value_max = Column(Numeric(12, 2))
    market_analysis = Column(Text)
    comparable_sales = Column(Text)  # JSON string for similar properties
    valuation_notes = Column(Text)
    
    # Request information
    reason_for_valuation = Column(String(100))  # Selling, curiosity, refinancing, etc.
    timeline = Column(String(50))  # When planning to sell
    preferred_contact_method = Column(String(50))
    preferred_contact_time = Column(String(50))
    
    # Status
    status = Column(String(50), default="pending")  # pending, completed, scheduled
    valuation_date = Column(Date)
    report_sent_date = Column(Date)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    agent = relationship("Agent", back_populates="valuations")

class Client(Base):
    __tablename__ = "clients"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20))
    address = Column(String(200))
    city = Column(String(100))
    postal_code = Column(String(20))
    
    # Preferences
    property_types = Column(Text)  # JSON string for preferred property types
    price_range_min = Column(Numeric(12, 2))
    price_range_max = Column(Numeric(12, 2))
    preferred_areas = Column(Text)  # JSON string for preferred locations
    
    # Communication preferences
    preferred_language = Column(String(20), default="sv")
    newsletter_subscription = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    inquiries = relationship("PropertyInquiry", back_populates="client")
    viewings = relationship("PropertyViewing", back_populates="client")
    meetings = relationship("ClientMeeting", back_populates="client")

class PropertyInquiry(Base):
    __tablename__ = "property_inquiries"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"))
    client_id = Column(Integer, ForeignKey("clients.id"))
    
    inquiry_type = Column(String(50))  # viewing, information, offer, etc.
    message = Column(Text)
    phone_number = Column(String(20))
    preferred_contact_time = Column(String(100))
    is_pre_approved = Column(Boolean, default=False)
    
    status = Column(String(50), default="new")  # new, contacted, scheduled, closed
    response_sent = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    property = relationship("Property", back_populates="inquiries")
    client = relationship("Client", back_populates="inquiries")

class PropertyViewing(Base):
    __tablename__ = "property_viewings"
    
    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id"))
    client_id = Column(Integer, ForeignKey("clients.id"))
    
    viewing_date = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, default=30)
    viewing_type = Column(String(50))  # private, open_house, virtual
    
    # Attendance
    attendees_count = Column(Integer, default=1)
    client_feedback = Column(Text)
    agent_notes = Column(Text)
    interest_level = Column(Integer)  # 1-5 scale
    
    status = Column(String(50), default="scheduled")  # scheduled, completed, cancelled, no_show
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    property = relationship("Property", back_populates="viewings")
    client = relationship("Client", back_populates="viewings")

class ClientMeeting(Base):
    __tablename__ = "client_meetings"
    
    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, ForeignKey("agents.id"))
    client_id = Column(Integer, ForeignKey("clients.id"))
    
    meeting_date = Column(DateTime, nullable=False)
    meeting_type = Column(String(50))  # consultation, signing, valuation, etc.
    location = Column(String(200))  # office, property, client_home, online
    
    agenda = Column(Text)
    notes = Column(Text)
    follow_up_required = Column(Boolean, default=False)
    next_steps = Column(Text)
    
    status = Column(String(50), default="scheduled")  # scheduled, completed, cancelled
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    agent = relationship("Agent", back_populates="client_meetings")
    client = relationship("Client", back_populates="meetings")

class MarketStatistics(Base):
    __tablename__ = "market_statistics"
    
    id = Column(Integer, primary_key=True, index=True)
    area = Column(String(100), nullable=False)  # Stockholm, Södermalm, etc.
    property_type = Column(Enum(PropertyType), nullable=False)
    
    # Time period
    year = Column(Integer, nullable=False)
    month = Column(Integer, nullable=False)
    
    # Statistics
    average_price = Column(Numeric(12, 2))
    median_price = Column(Numeric(12, 2))
    price_per_sqm = Column(Numeric(8, 2))
    properties_sold = Column(Integer)
    average_days_on_market = Column(Integer)
    price_change_percent = Column(Numeric(5, 2))  # Month over month change
    
    created_at = Column(DateTime, default=datetime.utcnow)

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20))
    subject = Column(String(200))
    message = Column(Text, nullable=False)
    inquiry_type = Column(String(50))  # buying, selling, valuation, general
    property_type_interest = Column(String(100))
    budget_range = Column(String(50))
    preferred_areas = Column(String(200))
    
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)
    response_sent = Column(Boolean, default=False)
