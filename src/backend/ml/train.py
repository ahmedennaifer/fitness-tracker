import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

num_samples = 1000
np.random.seed(42)

data = pd.read_csv(
    "/Users/data1/Desktop/work/kraya/devops/fitness-tracker/src/backend/ml/data/data.csv"
)


X = data[["steps", "calories", "sleep_hours"]]
y = data["wellness_score"]

# Step 3: Split Data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Step 4: Train the Model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Step 5: Evaluate the Model
y_pred = model.predict(X_test)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f"Mean Squared Error (MSE): {mse}")
print(f"R² Score: {r2}")

# Step 6: Save the Trained Model
model_path = "random_forest_wellness_model.pkl"
joblib.dump(model, model_path)
print(f"Model saved to {model_path}")
