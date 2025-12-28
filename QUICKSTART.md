# 🚀 Quick Start Guide

Get DualFarm up and running in 5 minutes!

## Prerequisites

- Python 3.8+ ([Download](https://www.python.org/downloads/))
- Node.js 16+ ([Download](https://nodejs.org/))

## Easy Start (Windows)

1. **Double-click** `start-windows.bat`
2. Wait for installation (first time only)
3. Browser opens automatically at `http://localhost:3000`
4. Login with `demo` / `demo123`

## Easy Start (Mac/Linux)

1. Open terminal in project folder
2. Run: `./start-unix.sh`
3. Open browser to `http://localhost:3000`
4. Login with `demo` / `demo123`

## Manual Start

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

## First Steps

1. **Start Simulation**: Click "Start Simulation" button on dashboard
2. **Watch Dashboard**: See real-time data updates every 3-5 seconds
3. **Explore Charts**: Navigate to "Live Charts" to see visualizations
4. **Try Controls**: Go to "Control Panel" to test pump/dosing controls
5. **Check Alerts**: View "Alerts" page for system notifications
6. **Export Data**: Visit "Reports" to export CSV and see AI insights

## Default Credentials

- **Username**: `demo`
- **Password**: `demo123`

## Ports

- **Backend**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Frontend**: http://localhost:3000

## Troubleshooting

**Port already in use?**
```bash
# Change backend port
uvicorn app.main:app --reload --port 8001

# Update frontend proxy in vite.config.js
```

**Dependencies fail to install?**
```bash
# Backend: Update pip
python -m pip install --upgrade pip

# Frontend: Clear cache
rm -rf node_modules package-lock.json
npm install
```

**Need help?** Check the full [README.md](README.md) for detailed documentation.

---

**Ready to go! 🌱**
