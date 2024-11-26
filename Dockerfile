# Dockerfile

# Build stage for frontend
FROM node:16 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json ./ 
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build stage for backend
FROM python:3.9-slim AS backend-build
WORKDIR /app
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt
COPY backend ./backend

# Combine frontend build with backend
COPY --from=frontend-build /app/frontend/build ./backend/frontend/build

# Expose port
EXPOSE 5001

# Start the application
CMD ["python", "backend/app.py"]
