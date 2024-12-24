from pydantic import BaseModel


class Metrics(BaseModel):
    sleep_hrs: int
    steps: int
    calories_burnt_per_day: int
