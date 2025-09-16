from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Numeric, Time, Date, Enum
from sqlalchemy.orm import relationship
from datetime import datetime, time, date
from .auth import Base
import enum

class MembershipType(enum.Enum):
    BASIC = "basic"
    PREMIUM = "premium"
    VIP = "vip"
    STUDENT = "student"

class ClassDifficulty(enum.Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    ALL_LEVELS = "all_levels"

class BookingStatus(enum.Enum):
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"
    NO_SHOW = "no_show"

class Member(Base):
    __tablename__ = "members"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20))
    date_of_birth = Column(Date)
    emergency_contact = Column(String(100))
    emergency_phone = Column(String(20))
    membership_type = Column(Enum(MembershipType), nullable=False)
    membership_start = Column(Date, nullable=False)
    membership_end = Column(Date, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    bookings = relationship("ClassBooking", back_populates="member")
    trainer_sessions = relationship("TrainerSession", back_populates="member")

class Trainer(Base):
    __tablename__ = "trainers"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20))
    bio = Column(Text)
    specializations = Column(Text)  # JSON string for multiple specializations
    certifications = Column(Text)  # JSON string for certifications
    experience_years = Column(Integer)
    hourly_rate = Column(Numeric(10, 2))
    profile_image_url = Column(String(500))
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    classes = relationship("FitnessClass", back_populates="trainer")
    sessions = relationship("TrainerSession", back_populates="trainer")

class FitnessClass(Base):
    __tablename__ = "fitness_classes"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    duration_minutes = Column(Integer, nullable=False)
    max_capacity = Column(Integer, nullable=False)
    difficulty = Column(Enum(ClassDifficulty), nullable=False)
    trainer_id = Column(Integer, ForeignKey("trainers.id"))
    class_type = Column(String(100))  # yoga, hiit, strength, cardio, etc.
    equipment_needed = Column(Text)  # JSON string for equipment list
    calories_burned_estimate = Column(Integer)
    image_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    trainer = relationship("Trainer", back_populates="classes")
    schedules = relationship("ClassSchedule", back_populates="fitness_class")

class ClassSchedule(Base):
    __tablename__ = "class_schedules"
    
    id = Column(Integer, primary_key=True, index=True)
    class_id = Column(Integer, ForeignKey("fitness_classes.id"))
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    room_name = Column(String(100))
    is_recurring = Column(Boolean, default=True)
    
    # Relationships
    fitness_class = relationship("FitnessClass", back_populates="schedules")
    bookings = relationship("ClassBooking", back_populates="schedule")

class ClassBooking(Base):
    __tablename__ = "class_bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"))
    schedule_id = Column(Integer, ForeignKey("class_schedules.id"))
    booking_date = Column(Date, nullable=False)
    status = Column(Enum(BookingStatus), default=BookingStatus.CONFIRMED)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    member = relationship("Member", back_populates="bookings")
    schedule = relationship("ClassSchedule", back_populates="bookings")

class TrainerSession(Base):
    __tablename__ = "trainer_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    trainer_id = Column(Integer, ForeignKey("trainers.id"))
    member_id = Column(Integer, ForeignKey("members.id"))
    session_date = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    session_type = Column(String(100))  # personal training, consultation, etc.
    notes = Column(Text)
    cost = Column(Numeric(10, 2))
    status = Column(Enum(BookingStatus), default=BookingStatus.CONFIRMED)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    trainer = relationship("Trainer", back_populates="sessions")
    member = relationship("Member", back_populates="trainer_sessions")

class WorkoutProgram(Base):
    __tablename__ = "workout_programs"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    duration_weeks = Column(Integer, nullable=False)
    difficulty = Column(Enum(ClassDifficulty), nullable=False)
    target_goals = Column(Text)  # JSON string for goals (weight loss, muscle gain, etc.)
    equipment_needed = Column(Text)  # JSON string for equipment
    created_by_trainer_id = Column(Integer, ForeignKey("trainers.id"))
    image_url = Column(String(500))
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Equipment(Base):
    __tablename__ = "equipment"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    category = Column(String(100))  # cardio, strength, functional, etc.
    brand = Column(String(100))
    model = Column(String(100))
    purchase_date = Column(Date)
    maintenance_due = Column(Date)
    is_operational = Column(Boolean, default=True)
    location = Column(String(100))  # which area of gym
    notes = Column(Text)

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
    phone = Column(String(20))
    subject = Column(String(200))
    message = Column(Text, nullable=False)
    inquiry_type = Column(String(50))  # trial_class, membership, personal_training, general
    created_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)
    response_sent = Column(Boolean, default=False)
