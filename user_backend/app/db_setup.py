from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from user_backend.app.settings import settings

# echo = True to see the SQL queries
engine = create_engine(f"{settings.DB_URL}", echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def create_default_user_types():
    """Create default user types if they don't exist"""
    # Import inside function to avoid circular imports
    from user_backend.app.models import UserType

    with Session(engine) as session:
        # Check if user types already exist
        existing_types = session.query(UserType).count()

        if existing_types == 0:
            # Create default user types
            default_types = [
                UserType(id=1, name="regular"),
                UserType(id=2, name="admin"),
                UserType(id=3, name="guest"),
            ]

            session.add_all(default_types)
            session.commit()
            print("✅ Default user types created")
        else:
            print(f"✅ User types already exist ({existing_types} found)")


def init_db():
    """Initialize database tables and default data"""
    # Import inside function to avoid circular imports
    from user_backend.app.models import Base

    # Create all tables
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created")

    # Create default user types
    create_default_user_types()


def get_db():
    with Session(engine, expire_on_commit=False) as session:
        yield session
