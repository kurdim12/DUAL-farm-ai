@echo off
echo ========================================
echo DualFarm Smart Farming System
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if Node is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 16+ from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Setting up Backend...
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment and install dependencies
echo Installing backend dependencies...
call venv\Scripts\activate
pip install -r requirements.txt --quiet

REM Start backend in new window
echo Starting backend server on http://localhost:8000
start "DualFarm Backend" cmd /k "cd /d %cd% && venv\Scripts\activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

cd ..

echo.
echo [2/4] Setting up Frontend...
cd frontend

REM Install frontend dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

REM Start frontend in new window
echo Starting frontend server on http://localhost:3000
start "DualFarm Frontend" cmd /k "cd /d %cd% && npm run dev"

cd ..

echo.
echo ========================================
echo DualFarm Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo Frontend: http://localhost:3000
echo.
echo Login credentials:
echo   Username: demo
echo   Password: demo123
echo.
echo Press any key to open the application in your browser...
pause >nul

REM Open browser
start http://localhost:3000

echo.
echo To stop the servers, close the terminal windows
echo or press Ctrl+C in each window.
echo.
pause
