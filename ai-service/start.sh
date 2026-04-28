#!/bin/bash

# CivicSense AI Service Startup Script

set -e

echo "=========================================="
echo "CivicSense AI Service - Startup Script"
echo "=========================================="

# Check Python version
echo "Checking Python version..."
python --version

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install/update dependencies
echo "Installing dependencies..."
pip install -q -r requirements.txt

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file with defaults..."
    cat > .env << 'EOF'
# CivicSense AI Service Configuration
HOST=0.0.0.0
PORT=8000
LOG_LEVEL=info
CORS_ORIGINS=http://localhost:8080,http://localhost:5173,http://127.0.0.1:8080
EOF
    echo ".env created with default settings"
fi

# Run the application
echo ""
echo "=========================================="
echo "Starting CivicSense AI Service..."
echo "=========================================="
echo "Service will be available at: http://localhost:8000"
echo "API Documentation: http://localhost:8000/docs"
echo ""
echo "Models will download on first startup (~1GB)"
echo "This may take a few minutes..."
echo ""

python app.py

