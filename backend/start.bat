cd %~dp0

dir venv\Scripts\Python.exe > NUL
if %ERRORLEVEL% == 0 goto :activate_venv
python -m venv venv
pip install -r requirements.txt

:activate_venv

call venv\Scripts\activate.bat

python app.py

