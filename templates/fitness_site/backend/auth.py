from fastapi import FastAPI
from passlib.context import CryptContext
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from typing import Generator
import os
from dotenv import load_dotenv

# FastAPI app
app = FastAPI()

# Load environment variables from a .env file if present
load_dotenv()

# PostgreSQL configuration via environment variables (with sensible defaults)
# Expected env vars: DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "fitness_db")

DATABASE_URL = (
    f"postgresql+psycopg2://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

# SQLAlchemy engine and session factory
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    future=True,
)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, expire_on_commit=False)
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that provides a transactional database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Optional: create tables at startup if models are defined in this module/package
@app.on_event("startup")
def on_startup_create_tables() -> None:
    Base.metadata.create_all(bind=engine)
