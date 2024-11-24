# Stage 1: Build React frontend
FROM node:16 as frontend-build

WORKDIR /app/frontend

# Kopieer package.json en package-lock.json
COPY frontend/package.json frontend/package-lock.json ./

# Installeer frontend dependencies
RUN npm install

# Kopieer frontend broncode
COPY frontend/ ./

# Bouw de frontend
RUN npm run build

# Stage 2: Setup Flask backend
FROM python:3.9-slim as backend

WORKDIR /app/backend

# Installeer systeemafhankelijkheden
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Kopieer backend requirements en installeer
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Kopieer backend broncode
COPY backend/ ./

# Kopieer frontend build naar backend directory
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Expose poort
EXPOSE 5001

# Installeren van gunicorn
RUN pip install gunicorn

# Start de applicatie met gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5001", "app:app"]
