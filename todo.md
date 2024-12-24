# To-Do List for ML Health Tracker Project

## 1 - Backend  
**Goal:** Implement CRUD operations, health tracking logic, and integration with the ML model.

- [X] Set up a FastAPI/Flask project structure.  
- [ ] Implement user authentication (optional for a toy project).  
- [ ] Create endpoints for CRUD operations on health metrics:  
  - POST `/health-metrics`: Add daily health logs.  
  - GET `/health-metrics`: Fetch all user logs.  
  - PUT `/health-metrics/{id}`: Update a specific log.  
  - DELETE `/health-metrics/{id}`: Delete a specific log.  
- [ ] Add an endpoint to fetch ML predictions for uploaded health data:  
  - POST `/predict-wellness`: Sends data to the ML model for predictions.  
- [ ] Set up a connection to the database (Azure SQL or SQLite for simplicity).  
- [ ] Add basic logging for API requests and errors.  

## 2 - Frontend  
**Goal:** Create a simple dashboard for users to log and view their health metrics, predictions, and cost monitoring.

- [X] Set up a React project.  
- [ ] Create a form to submit health data (steps, calories, sleep hours).  
- [ ] Create a table or card layout to display submitted health metrics.  
- [ ] Add a section to display wellness score predictions.  
- [ ] Create a section to show ML run history (mocked initially).  
- [ ] Add a basic cost monitoring display.  

## 3 - Machine Learning (ML)  
**Goal:** Train a simple model to predict wellness scores and deploy it to Azure ML.

- [X] Set up a Python project with dependencies (use `requirements.txt` or Poetry).  
- [ ] Prepare a synthetic dataset with fields: `steps`, `calories`, `sleep_hours`, and `wellness_score`.  
- [ ] Train a regression model (e.g., Random Forest or Linear Regression) to predict `wellness_score`.  
- [ ] Save the trained model and test predictions locally.  
- [ ] Deploy the model to Azure ML as a REST endpoint.  
- [ ] Test the deployed endpoint using sample data.  

## 4 - Terraform Code  
**Goal:** Automate infrastructure setup for the project.

- [X] Initialize a Terraform project.  
- [ ] Write Terraform scripts to provision the following resources:  
  - Azure App Service for the backend.  
  - Azure SQL Database for storing user data.  
  - Azure ML Workspace for ML deployment.  
  - Azure Monitor for logging and alerting.  
- [ ] Test and apply the Terraform scripts.  

## 5 - CI/CD Pipeline with Azure DevOps  
**Goal:** Automate deployment of backend, frontend, and ML updates.

- [X] Create an Azure DevOps project.  
- [ ] Set up a pipeline for backend deployment:  
  - Linting and testing with pytest.  
  - Build and deploy the FastAPI/Flask app to Azure App Service.  
- [ ] Set up a pipeline for frontend deployment:  
  - Build and deploy the React app to Azure Static Web Apps.  
- [ ] Set up a pipeline for ML model deployment:  
  - Train the model on new data.  
  - Deploy updated models to Azure ML.  

## 6 - Monitoring and Alerting  
**Goal:** Monitor key metrics and set up alerts for issues.

- [ ] Monitor costs using Azure Cost Management.  
  - Alert Trigger: Daily cost exceeds a predefined threshold (e.g., $5/day).  
- [ ] Monitor database performance (query times and CPU usage).  
  - Alert Trigger: Query execution time exceeds 500ms or CPU usage >80% for 5 minutes.  
- [ ] Monitor ML endpoint health (availability and latency).  
  - Alert Trigger: Latency >500ms or downtime >1 minute.  
- [ ] Monitor app uptime (availability checks).  
  - Alert Trigger: App is unresponsive for >1 minute.  

---

This to-do list balances simplicity with essential features, ensuring the project covers all aspects while being achievable for a toy project.
