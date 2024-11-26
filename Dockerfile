# Dockerfile

# Build stage for frontend
FROM node:16 as frontend-build
WORKDIR /app
COPY frontend/package.json frontend/
RUN npm install
COPY frontend ./frontend
RUN npm run build

# Build stage for backend
FROM python:3.9-slim
WORKDIR /app
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY backend ./backend

# Kopieer frontend build naar backend
COPY --from=frontend-build /app/frontend/build ./backend/frontend/build

# Expose port
EXPOSE 5001

# Start the application
CMD ["python", "backend/app.py"]
