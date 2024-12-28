from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship, declarative_base


Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    metrics = relationship("Metric", back_populates="user")


class Metric(Base):
    __tablename__ = "metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime, default=datetime.utcnow, nullable=False)
    steps = Column(Integer, nullable=False, comment="Number of steps taken")
    calories = Column(Integer, nullable=False, comment="Calories consumed")
    sleep_hours = Column(Float, nullable=False, comment="Hours of sleep")
    wellness_score = Column(Float, nullable=True, comment="Calculated wellness score")

    user = relationship("User", back_populates="metrics")
