# Build stage for the frontend
FROM node AS build-frontend
WORKDIR /app
COPY frontend/ .
RUN npm install && npm run build

# Final stage for the backend
FROM python:3
RUN pip3 install torch --index-url https://download.pytorch.org/whl/cu117
RUN pip3 install gunicorn
WORKDIR /app
COPY backend/requirements.txt /app/
RUN pip install -r requirements.txt
COPY backend /app
RUN python app.py --justdownload
COPY --from=build-frontend /app/build /app/ui/
CMD ["gunicorn", "--bind", "0.0.0.0:80", "app:app"]