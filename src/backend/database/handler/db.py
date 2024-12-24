from sqlalchemy import create_engine  # noqa: I001
from sqlalchemy.orm import sessionmaker
from backend.database.models.models import (
    User,
    Metric,
    Base,
)

print(Metric.__base__)

DATABASE_URL = "sqlite:///fitness_tracker.db"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = User.__bases__[0]


def create_tables():
    Base.metadata.create_all(engine)
    print("Database and tables created successfully.")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
