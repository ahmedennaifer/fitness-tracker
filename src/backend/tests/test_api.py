"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.database.handler.db import get_db
from backend.database.models.models import Base, Metric, User
from backend.main import app

SQLALCHEMY_DATABASE_URL = "sqlite://"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def sample_user(test_db):
    db = TestingSessionLocal()
    user = User(name="Test User", email="test@example.com")
    db.add(user)
    db.commit()
    db.refresh(user)
    yield user
    db.close()


@pytest.fixture
def sample_metrics(test_db, sample_user):
    db = TestingSessionLocal()
    metrics = Metric(steps=10000, calories=2500, sleep_hours=8, user_id=sample_user.id)
    db.add(metrics)
    db.commit()
    db.refresh(metrics)
    yield metrics
    db.close()


def test_create_user():
    response = client.post(
        "/create_user", json={"name": "John Doe", "email": "john@example.com"}
    )
    assert response.status_code == 200
    assert "User John Doe added successfully" in response.json()["message"]


def test_create_duplicate_user(sample_user):
    response = client.post(
        "/create_user", json={"name": "Test User", "email": "test@example.com"}
    )
    assert response.status_code == 200
    assert "error" in response.json()


def test_send_health_metrics(sample_user):
    metrics_data = {"steps": 8000, "calories_burnt_per_day": 2000, "sleep_hrs": 7}
    response = client.post("/health_metrics/test@example.com", json=metrics_data)
    assert response.status_code == 200
    assert "Metrics with id" in response.json()["message"]


def test_delete_health_metrics_by_steps(sample_metrics):
    response = client.delete("/health_metrics/test@example.com/10000")
    assert response.status_code == 200
    assert "deleted" in response.json()["message"]


def test_send_health_metrics_invalid_data(sample_user):
    invalid_metrics = {
        "steps": "invalid",
        "calories_burnt_per_day": 2000,
        "sleep_hrs": 7,
    }
    response = client.post("/health_metrics/test@example.com", json=invalid_metrics)
    assert response.status_code == 422


if __name__ == "__main__":
    pytest.main([__file__])
"""