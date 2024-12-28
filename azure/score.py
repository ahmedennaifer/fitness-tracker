import os
import joblib
import json
import numpy as np


def init():
    global model
    model_path = os.path.join(
        os.getenv("AZUREML_MODEL_DIR"), "random_forest_wellness_model.pkl"
    )
    model = joblib.load(model_path)


def run(raw_data):
    try:
        data = json.loads(raw_data)
        input_data = np.array([[data["steps"], data["calories"], data["sleep_hours"]]])
        result = model.predict(input_data)
        return {"prediction": float(result[0])}
    except Exception as e:
        return {"error": str(e)}
