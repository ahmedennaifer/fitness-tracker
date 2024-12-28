#!/bin/bash
cd /home/site/wwwroot

python -m venv antenv
source antenv/bin/activate

pip install -r requirements.txt

uvicorn backend.main:app --host 0.0.0.0 --port 8000