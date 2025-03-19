#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install
pip install -r requirements.txt
pip install gunicorn

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Create necessary directories
echo "📁 Creating directories..."
sudo mkdir -p /var/www/soundmatch/uploads
sudo chown -R $USER:$USER /var/www/soundmatch

# Copy frontend build to nginx directory
echo "📋 Copying frontend files..."
sudo cp -r dist/* /var/www/soundmatch/

# Copy backend files
echo "📋 Copying backend files..."
sudo cp -r app /var/www/soundmatch/
sudo cp requirements.txt /var/www/soundmatch/
sudo cp gunicorn.conf.py /var/www/soundmatch/
sudo cp .env.production /var/www/soundmatch/.env

# Set up systemd service
echo "⚙️ Setting up systemd service..."
sudo tee /etc/systemd/system/soundmatch.service << EOF
[Unit]
Description=SoundMatch Backend Service
After=network.target

[Service]
User=$USER
Group=$USER
WorkingDirectory=/var/www/soundmatch
Environment="PATH=/var/www/soundmatch/.venv/bin"
ExecStart=/var/www/soundmatch/.venv/bin/gunicorn -c gunicorn.conf.py app.main:app

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and start service
echo "🔄 Reloading systemd and starting service..."
sudo systemctl daemon-reload
sudo systemctl enable soundmatch
sudo systemctl restart soundmatch

echo "✅ Deployment complete!"
echo "📝 Check the service status with: sudo systemctl status soundmatch" 