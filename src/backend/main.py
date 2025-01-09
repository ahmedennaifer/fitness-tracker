import logging
import os

import requests
from dotenv import load_dotenv
from fastapi import Depends, FastAPI
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from opentelemetry._logs import get_logger_provider, set_logger_provider
from opentelemetry.sdk._logs import LoggerProvider, LoggingHandler
from opentelemetry.sdk._logs.export import BatchLogRecordProcessor
from sqlalchemy.orm import Session

from azure.monitor.opentelemetry.exporter import AzureMonitorLogExporter
from backend.database.handler.db import get_db
from backend.database.models.models import Metric, User
from backend.models.metrics import Metrics
from backend.models.user import User as UserModel

load_dotenv()

APP_INSIGHTS_KEY = os.environ["APP_INSIGHTS_KEY"]
CONNECTION_STRING = os.environ["CONNECTION_STRING"]
AZURE_ML_ENDPOINT = os.environ["AZURE_ML_ENDPOINT"]
AZURE_ML_KEY = os.environ["AZURE_ML_KEY"]


set_logger_provider(LoggerProvider())
exporter = AzureMonitorLogExporter(connection_string=CONNECTION_STRING)
get_logger_provider().add_log_record_processor(BatchLogRecordProcessor(exporter))

handler = LoggingHandler()
logger = logging.getLogger(__name__)
logger.addHandler(handler)
logger.setLevel(logging.INFO)


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/predict-wellness/{metric_id}")
async def predict_wellness(email: str, metric_id: int, db: Session = Depends(get_db)):
    logger.info(
        "Starting ML endpoint prediction",
        extra={"email": email, "metric_id": metric_id},
    )

    user = db.query(User).filter(User.email == email).first()
    if user:
        try:
            metrics = db.query(Metric).filter(Metric.user_id == user.id).first()

            data = {
                "steps": metrics.steps,
                "calories": metrics.calories,
                "sleep_hours": metrics.sleep_hours,
            }

            logger.info(
                "Calling ML endpoint", extra={"user_id": user.id, "features": data}
            )

            headers = {
                "Authorization": f"Bearer {AZURE_ML_KEY}",
                "Content-Type": "application/json",
            }

            response = requests.post(AZURE_ML_ENDPOINT, json=data, headers=headers)
            prediction = response.json()

            if "error" in prediction:
                logger.error(
                    "ML endpoint returned error",
                    extra={"error": prediction["error"], "user_id": user.id},
                )
                raise HTTPException(status_code=500, detail=prediction["error"])

            pred = prediction["prediction"]

            logger.info(
                "ML prediction successful",
                extra={"user_id": user.id, "prediction": pred, "features": data},
            )

            metrics.wellness_score = pred
            db.commit()

            return {"pred": pred}

        except Exception as e:
            logger.error(
                "Prediction failed",
                extra={
                    "error": str(e),
                    "user_id": user.id if user else None,
                    "email": email,
                },
            )
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))
    else:
        logger.error("User not found", extra={"email": email})
        raise HTTPException(status_code=404, detail="User not found")


@app.get("/health_metrics/{email}")
async def get_health_metrics(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    logger.info(f"Got health info for user {email}")
    if user:
        try:
            metrics = db.query(Metric).filter(Metric.user_id == user.id).first()
            if not metrics:
                logger.error(f"No metrics found for user {email}")
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
    logger.info(f"Sending metrics for user {email}")
    if not email:
        logger.error(f"Error: no user with email {email} found")
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
        logger.info(f"Info added for user {email}")
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
                logger.error(f"No health metrics found for the user with {steps} steps")
                raise HTTPException(
                    status_code=404,
                    detail=f"No health metrics found for the user with {steps} steps",
                )
            db.delete(metrics)
            db.commit()
            logger.error("Info deleted!")
            return {"message": f"Metrics for user {email} deleted! "}
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
            logger.info("Deleted all metrics!")
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
        logger.info(f"User {usr.name} created !")
        return {"message": f"User {usr.name} added successfully", "user": user.id}
    except Exception as e:
        db.rollback()
        return {"error": f"An error occurred: {e!s}"}
