#!/bin/bash

cd "$(dirname "$0")"

if [ -d "venv" ]; then
  source venv/bin/activate
else
  python3 -m venv venv
  source venv/bin/activate
fi

pip install -r requirements.txt
python3 app.py
