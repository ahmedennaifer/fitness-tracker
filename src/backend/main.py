from fastapi import Depends, FastAPI
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session
from backend.database.handler.db import get_db
from backend.models.metrics import Metrics
from backend.models.user import User as UserModel
from backend.database.models.models import User, Metric

app = FastAPI()


@app.get("/health_metrics/{email}")
async def get_health_metrics(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user:
        try:
            metrics = db.query(Metric).filter(Metric.user_id == user.id).first()
            if not metrics:
                raise HTTPException(
                    status_code=404, detail="No health metrics found for the user"
                )

            return {"metrics": metrics.__dict__}
        except HTTPException as e:
            return {"Error": e}
    else:
        raise HTTPException(status_code=404, detail="User not found")


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


@app.delete("/health_metrics/{email}/{steps}")
async def delete_health_metrics_by_n_steps(
    steps: int, email: str, db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()
    if user:
        try:
            metrics = db.query(Metric).filter(Metric.steps == steps).first()

            if not metrics:
                raise HTTPException(
                    status_code=404,
                    detail=f"No health metrics found for the user with {steps} steps",
                )
            db.delete(metrics)
            db.commit()
            return {"message": f"Metrics with id {metrics.id} deleted! "}
        except HTTPException as e:
            return {"Error": e}
    else:
        raise HTTPException(status_code=404, detail="User not found")


@app.delete("/health_metrics/{email}")
async def delete_health_metrics(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user:
        try:
            metrics = db.query(Metric).filter(Metric.user_id == user.id).all()

            if not metrics:
                raise HTTPException(
                    status_code=404, detail="No health metrics found for the user"
                )
            for metric in metrics:
                db.delete(metric)
            db.commit()
            return {"message": f"Metrics with id {metrics.id} deleted! "}
        except HTTPException as e:
            return {"Error": e}
    else:
        raise HTTPException(status_code=404, detail="User not found")


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
