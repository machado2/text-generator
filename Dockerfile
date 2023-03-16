# Build stage for the frontend
FROM node AS build-frontend
WORKDIR /app
COPY frontend/ .
RUN npm install && npm run build

# Final stage for the backend
FROM python:3
WORKDIR /app
COPY backend/requirements.txt /app/
RUN pip install -r requirements.txt
COPY backend /app
COPY --from=build-frontend /app/build /app/ui/
CMD ["python", "app.py"]
