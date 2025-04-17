FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install older setuptools for compatibility with older packages like python-musixmatch
RUN pip install --no-cache-dir "setuptools<58"

# Now install the rest of the requirements
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create upload directory
RUN mkdir -p uploads

# Expose the port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"] 