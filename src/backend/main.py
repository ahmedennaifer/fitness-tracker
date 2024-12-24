from fastapi import Depends, FastAPI
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session

from backend.database.handler.db import get_db
from backend.models.metrics import Metrics
from backend.models.user import User as UserModel
from backend.database.models.models import User, Metric

app = FastAPI()


@app.post("/health_metrics/{email}")
async def send_health_metrics(
    metrics: Metrics, email: str, db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    if not email:
        raise HTTPException(status_code=404, detail="Email not found")
    metric = Metric(
        calories=metrics.calories_burnt_per_day,
        steps=metrics.steps,
        sleep_hours=metrics.sleep_hrs,
        user_id=user.id,
    )
    try:
        db.add(metric)
        db.commit()
        db.refresh(metric)
        return {
            "message": f"Metrics with id {metric.id} created for user {metric.user_id}"
        }
    except Exception as e:
        db.rollback()
        return {"error" f"An error occured {e}"}


@app.post("/create_user")
async def create_user(usr: UserModel, db: Session = Depends(get_db)):
    user = User(name=usr.name, email=usr.email)
    try:
        db.add(user)
        db.commit()
        db.refresh(user)
        return {"message": f"User {usr.name} added successfully", "user": user.id}
    except Exception as e:
        db.rollback()
        return {"error": f"An error occurred: {e!s}"}


@app.get("/home")
async def root() -> dict:
    return {"message": "hello world"}
