import joblib
import json
import numpy as np
import os


def init():
    global model
    model_path = os.path.join(
        os.getenv("AZUREML_MODEL_DIR"), "random_forest_wellness_model.pkl"
    )
    print("Loading model from:", model_path)
    model = joblib.load(model_path)
    print("Model loaded successfully")


def run(raw_data):
    try:
        print("Received raw_data:", raw_data)
        data = json.loads(raw_data)
        print("Parsed data:", data)
        input_data = np.array([[data["steps"], data["calories"], data["sleep_hours"]]])
        result = model.predict(input_data)
        return {"prediction": float(result[0])}
    except Exception as e:
        print("Error occurred:", str(e))
        return {"error": str(e)}
