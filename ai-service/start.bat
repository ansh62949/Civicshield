@echo off
REM CivicSense AI Service - Windows Startup Script

echo.
echo ==========================================
echo CivicSense AI Service - Startup Script
echo ==========================================
echo.

REM Check Python version
echo Checking Python version...
python --version

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install/update dependencies
echo Installing dependencies...
pip install -q -r requirements.txt

REM Create .env if it doesn't exist
if not exist ".env" (
    echo Creating .env file with defaults...
    (
        echo # CivicSense AI Service Configuration
        echo HOST=0.0.0.0
        echo PORT=8000
        echo LOG_LEVEL=info
        echo CORS_ORIGINS=http://localhost:8080,http://localhost:5173
    ) > .env
    echo .env created with default settings
)

REM Run the application
echo.
echo ==========================================
echo Starting CivicSense AI Service...
echo ==========================================
echo Service will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo.
echo Models will download on first startup (~1GB)...
echo This may take a few minutes...
echo.

python app.py

