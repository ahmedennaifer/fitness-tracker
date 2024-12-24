import os
from sqlalchemy import create_engine  # noqa: I001
from sqlalchemy.orm import sessionmaker
from backend.database.models.models import User, Metric, Base


print(User, Metric)


BASE_DIR = os.path.dirname(os.path.abspath(__file__))  
DATABASE_PATH = os.path.join(BASE_DIR, "fitness_tracker.db")
DATABASE_URL = f"sqlite:///{DATABASE_PATH}"


engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def create_tables():
    Base.metadata.create_all(engine)
    print("Database and tables created successfully.")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


if __name__ == "__main__":
    from backend.database.models.models import User

    with next(get_db()) as db:  # Extract the session
        users = db.query(User).all()
        print("Users:", users)
