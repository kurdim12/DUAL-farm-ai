# 🌱 DualFarm Smart Farming System

A comprehensive IoT-based smart farming platform with real-time monitoring, intelligent alerts, and AI-powered insights. Built for the RoboCraft competition.

![Version](https://img.shields.io/badge/version-1.0.0-green)
![Python](https://img.shields.io/badge/python-3.8+-blue)
![React](https://img.shields.io/badge/react-18.2-blue)
![FastAPI](https://img.shields.io/badge/fastapi-0.104-green)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Screenshots Guide](#screenshots-guide)
- [Project Structure](#project-structure)
- [Limitations & Future Work](#limitations--future-work)
- [Contributing](#contributing)

---

## 🎯 Overview

DualFarm is an intelligent farming system designed for hydroponic and aquaponic environments. It provides:

- **Real-time Monitoring**: Track TDS, temperature, pH, water level, and pump status
- **Intelligent Alerts**: Rule-based system that notifies when parameters exceed safe thresholds
- **Remote Control**: Web-based interface for pump control and nutrient dosing
- **AI Insights**: Heuristic-based analysis with trend detection and recommendations
- **Data Visualization**: Interactive charts and historical analysis
- **Demo Mode**: Built-in simulation for demonstrations without physical sensors

This MVP demonstrates the complete system architecture and can be easily extended with real hardware sensors (ESP32, LoRa modules, etc.).

---

## ✨ Features

### Monitoring & Sensors
- ✅ Real-time TDS (Total Dissolved Solids) monitoring
- ✅ Temperature tracking with safe range alerts
- ✅ pH level monitoring (optional)
- ✅ Water level measurement with low-water protection
- ✅ Pump status tracking and runtime monitoring

### Control & Automation
- ✅ Remote pump ON/OFF control with safety confirmations
- ✅ Manual nutrient dosing with TDS impact estimation
- ✅ Action logging (complete audit trail)
- ✅ Automated alert generation based on thresholds

### Analytics & Insights
- ✅ AI-powered trend detection
- ✅ Anomaly identification
- ✅ Actionable recommendations
- ✅ 24-hour statistics and aggregations
- ✅ Historical data visualization

### Data & Reporting
- ✅ CSV export for sensors, actions, and alerts
- ✅ RoboCraft competition report summary
- ✅ Interactive charts (Recharts library)
- ✅ Configurable time ranges (1h, 24h, 7d)

---

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python 3.8+)
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT tokens (python-jose)
- **API Style**: RESTful JSON
- **Background Tasks**: Threading for simulation

### Frontend
- **Framework**: React 18.2
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 3
- **Charts**: Recharts 2.10
- **HTTP Client**: Axios
- **Routing**: React Router DOM 6

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │Dashboard │  │  Charts  │  │ Control  │  │  Alerts  │    │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘    │
│       └─────────────┴──────────────┴─────────────┘          │
│                        │                                      │
│                   API Client (Axios)                         │
└────────────────────────┼──────────────────────────────────────┘
                         │ HTTP/JSON (Port 3000 → 8000)
┌────────────────────────┼──────────────────────────────────────┐
│                        ▼                                       │
│                 FastAPI Backend (Port 8000)                    │
│  ┌───────────────────────────────────────────────────────┐   │
│  │  API Routers                                          │   │
│  │  /sensors | /control | /alerts | /actions | /analytics│   │
│  └─────┬─────────────────────────────────────────────────┘   │
│        │                                                      │
│  ┌─────▼──────────────────────────────────────────────────┐  │
│  │  Services Layer                                        │  │
│  │  • Alert Service (Rules Engine)                       │  │
│  │  • Simulation Service (Demo Data Generator)           │  │
│  │  • Analytics Service (AI Insights)                    │  │
│  └─────┬──────────────────────────────────────────────────┘  │
│        │                                                      │
│  ┌─────▼──────────────────────────────────────────────────┐  │
│  │  Database Layer (SQLAlchemy ORM)                      │  │
│  │  • SensorReading • ActionLog • Alert • User          │  │
│  └─────┬──────────────────────────────────────────────────┘  │
│        │                                                      │
│  ┌─────▼──────────────────────────────────────────────────┐  │
│  │  SQLite Database (dualfarm.db)                        │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

**Required Software:**
- Python 3.8 or higher ([Download](https://www.python.org/downloads/))
- Node.js 16+ and npm ([Download](https://nodejs.org/))
- Git (optional, for cloning)

**Check Installations:**
```bash
python --version  # Should be 3.8+
node --version    # Should be 16+
npm --version     # Should be 8+
```

---

### Installation

#### 1. Clone or Download the Repository

```bash
git clone <repository-url>
cd DUAL-farm-ai
```

Or download and extract the ZIP file.

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database (automatic on first run)
# Run the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will start on `http://localhost:8000`

**API Documentation:** Visit `http://localhost:8000/docs` for interactive API docs (Swagger UI)

#### 3. Frontend Setup

Open a **new terminal window** (keep backend running):

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

#### 4. Access the Application

1. Open your browser and go to: `http://localhost:3000`
2. Login with demo credentials:
   - **Username**: `demo`
   - **Password**: `demo123`

---

## 📖 Usage Guide

### Starting the Simulation

1. Login to the dashboard
2. Click **"Start Simulation"** button (top right)
3. The system will generate sensor readings every 5 seconds
4. Watch the dashboard update in real-time

### Monitoring

- **Dashboard**: Overview of current system status and 24h statistics
- **Live Charts**: Real-time graphs of TDS, temperature, water level, and pH
- **Alerts**: Active alerts and historical alert log

### Control

- **Pump Control**: Turn pump ON/OFF with optional reason logging
- **Nutrient Dosing**: Add nutrients (specify amount in ml) with TDS impact estimation
- All actions require confirmation for safety

### Reports & Insights

- **AI Insights**: View automated analysis of trends and anomalies
- **Data Export**: Download CSV files for sensors, actions, and alerts
- **RoboCraft Summary**: Pre-formatted report content for competition documentation

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | User login (returns JWT token) |
| POST | `/auth/register` | Register new user |

### Sensor Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/sensors/ingest` | Store new sensor reading |
| GET | `/sensors/latest` | Get most recent reading |
| GET | `/sensors/history?range=1h&limit=1000` | Get historical readings |
| GET | `/sensors/stats` | Get sensor statistics |

**Example Request (Ingest):**
```json
POST /api/sensors/ingest
{
  "tds_ppm": 750.5,
  "temperature_c": 24.3,
  "ph_value": 6.1,
  "water_level_cm": 45.2,
  "pump_state": "ON",
  "source": "manual",
  "note": "Manual reading"
}
```

### Control Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/control/pump` | Control pump (ON/OFF) |
| POST | `/control/dose` | Dose nutrients (specify amount_ml) |
| POST | `/control/dilute` | Add water to dilute solution |

**Example Request (Pump Control):**
```json
POST /api/control/pump
{
  "state": "ON",
  "reason": "Routine circulation"
}
```

**Example Request (Nutrient Dosing):**
```json
POST /api/control/dose
{
  "amount_ml": 50,
  "reason": "TDS below threshold"
}
```

### Alert Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/alerts/latest?limit=50` | Get recent alerts |
| GET | `/alerts/active?limit=50` | Get unresolved alerts |
| GET | `/alerts/history?limit=100` | Get all alerts |
| POST | `/alerts/{alert_id}/resolve` | Mark alert as resolved |
| GET | `/alerts/stats` | Get alert statistics |

### Action Log Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/actions/history?limit=100` | Get action history |
| GET | `/actions/recent?hours=24` | Get recent actions |
| GET | `/actions/stats` | Get action statistics |

### Simulation Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/simulate/start` | Start background simulation |
| POST | `/simulate/stop` | Stop simulation |
| GET | `/simulate/status` | Get simulation status |

### Analytics Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/analytics/dashboard` | Get dashboard statistics |
| GET | `/analytics/insights` | Get AI-powered insights |

---

## 📸 Screenshots Guide for RoboCraft Report

### Required Screenshots

1. **Login Page**
   - Shows professional branding and demo credentials
   - File: `login_page.png`

2. **Dashboard Overview**
   - Active simulation banner
   - Key metrics (TDS, Temperature, Water Level, Pump Status)
   - 24-hour statistics
   - System health indicators
   - File: `dashboard_overview.png`

3. **Live Charts**
   - TDS chart showing trend over time
   - Temperature chart
   - Water level chart
   - Time range selector (1h/24h/7d)
   - File: `live_charts.png`

4. **Control Panel**
   - Current system status
   - Pump control with confirmation
   - Nutrient dosing interface
   - Safety warnings
   - File: `control_panel.png`

5. **Active Alerts**
   - Alert statistics
   - Active alert cards with severity levels
   - Resolve button demonstration
   - File: `alerts_active.png`

6. **AI Insights**
   - Multiple insight cards (trends, anomalies, recommendations)
   - Confidence scores
   - RoboCraft report summary
   - File: `ai_insights.png`

7. **Data Export**
   - Export buttons for CSV downloads
   - RoboCraft report content
   - File: `data_export.png`

8. **System Architecture**
   - Architecture diagram from About page
   - Technology stack details
   - API endpoints table
   - File: `architecture.png`

### How to Capture Screenshots

1. Start both backend and frontend
2. Login and start the simulation
3. Wait 2-3 minutes to collect data
4. Navigate through each page
5. Use browser full-screen mode (F11)
6. Capture using:
   - Windows: `Win + Shift + S`
   - Mac: `Cmd + Shift + 4`
   - Browser DevTools: `Ctrl/Cmd + Shift + P` → "Capture screenshot"

---

## 📁 Project Structure

```
DUAL-farm-ai/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py          # Configuration settings
│   │   │   ├── database.py        # Database setup
│   │   │   └── auth.py            # Authentication utilities
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── models.py          # SQLAlchemy models
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py         # Pydantic schemas
│   │   ├── routers/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py            # Auth endpoints
│   │   │   ├── sensors.py         # Sensor endpoints
│   │   │   ├── control.py         # Control endpoints
│   │   │   ├── actions.py         # Action log endpoints
│   │   │   ├── alerts.py          # Alert endpoints
│   │   │   ├── simulation.py      # Simulation endpoints
│   │   │   └── analytics.py       # Analytics endpoints
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── alert_service.py   # Alert rules engine
│   │   │   ├── simulation_service.py  # Data simulator
│   │   │   └── analytics_service.py   # AI insights
│   │   └── main.py                # FastAPI application
│   ├── requirements.txt           # Python dependencies
│   └── dualfarm.db               # SQLite database (auto-created)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Card.jsx           # Reusable card components
│   │   │   ├── Navbar.jsx         # Navigation bar
│   │   │   └── LoadingSpinner.jsx # Loading indicator
│   │   ├── pages/
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Dashboard.jsx      # Main dashboard
│   │   │   ├── Charts.jsx         # Live charts
│   │   │   ├── Control.jsx        # Control panel
│   │   │   ├── Alerts.jsx         # Alert management
│   │   │   ├── Reports.jsx        # Reports & insights
│   │   │   └── About.jsx          # About & architecture
│   │   ├── services/
│   │   │   └── api.js             # API client (Axios)
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── index.html                 # HTML template
│   ├── package.json               # Node dependencies
│   ├── vite.config.js             # Vite configuration
│   ├── tailwind.config.js         # Tailwind configuration
│   └── postcss.config.js          # PostCSS configuration
│
└── README.md                      # This file
```

---

## ⚙️ Configuration

### Backend Configuration

Edit `backend/app/core/config.py`:

```python
# Alert thresholds
TDS_MIN: float = 500.0  # ppm
TDS_MAX: float = 1100.0  # ppm
TEMP_MIN: float = 15.0  # Celsius
TEMP_MAX: float = 35.0  # Celsius
WATER_LEVEL_MIN: float = 10.0  # cm

# Simulation interval
SIMULATION_INTERVAL: int = 5  # seconds

# Demo credentials
DEMO_USERNAME: str = "demo"
DEMO_PASSWORD: str = "demo123"
```

### Frontend Configuration

Edit `frontend/vite.config.js` to change ports or proxy settings.

---

## 🔧 Troubleshooting

### Common Issues

**1. Backend won't start**
```bash
# Check if port 8000 is in use
# Windows:
netstat -ano | findstr :8000
# Mac/Linux:
lsof -i :8000

# Use different port:
uvicorn app.main:app --reload --port 8001
```

**2. Frontend won't start**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

**3. Database errors**
```bash
# Delete database and restart (will lose data)
cd backend
rm dualfarm.db
# Restart backend - database will be recreated
```

**4. CORS errors**
- Make sure backend is running on port 8000
- Check `vite.config.js` proxy configuration
- Verify backend CORS middleware in `main.py`

**5. Module not found errors (Python)**
```bash
# Make sure virtual environment is activated
# Install requirements again
pip install -r requirements.txt --force-reinstall
```

---

## 🚧 Limitations & Future Work

### Current Limitations

1. **Demo Data Only**: Uses simulated sensor data (no physical hardware integration)
2. **Polling Updates**: Uses HTTP polling instead of WebSockets for real-time updates
3. **Single User**: No multi-user support or role-based access control
4. **Local Database**: SQLite is suitable for demo but not production-scale
5. **No Automated Dosing**: Nutrient dosing is manual (not automated based on rules)
6. **Heuristic AI**: Insights are rule-based, not machine learning models

### Future Enhancements

#### Hardware Integration
- [ ] ESP32 microcontroller integration for real sensor data
- [ ] LoRa wireless communication for remote farms
- [ ] TDS sensor calibration module
- [ ] Automated dosing pump control
- [ ] Relay modules for actuator control

#### Software Features
- [ ] **Machine Learning**: Predictive analytics for yield optimization
- [ ] **WebSocket Support**: True real-time updates without polling
- [ ] **Mobile App**: React Native mobile application
- [ ] **Multi-User**: Role-based access control (admin/operator/viewer)
- [ ] **Automated Control**: Rule-based and ML-based automated dosing
- [ ] **Weather Integration**: Combine with weather API data
- [ ] **Camera Integration**: Plant health monitoring via computer vision
- [ ] **Notification System**: Email/SMS alerts for critical issues

#### Deployment & Scalability
- [ ] **Docker**: Containerization for easy deployment
- [ ] **PostgreSQL**: Production-grade database
- [ ] **Cloud Deployment**: AWS/Azure/GCP hosting
- [ ] **HTTPS/SSL**: Secure encrypted communication
- [ ] **Load Balancing**: Support for multiple farms
- [ ] **Data Warehouse**: Historical data archiving
- [ ] **Grafana Integration**: Advanced monitoring dashboards

#### Advanced Analytics
- [ ] **Crop Lifecycle Tracking**: From seed to harvest
- [ ] **Yield Prediction**: ML models for harvest forecasting
- [ ] **Resource Optimization**: Water and nutrient efficiency analysis
- [ ] **Cost Tracking**: ROI and profitability analytics
- [ ] **Comparative Analysis**: Multi-farm benchmarking

---

## 🏆 RoboCraft Competition Notes

### Key Demonstration Points

1. **End-to-End Solution**: Complete system from sensors to web interface
2. **Real-Time Monitoring**: Live updates every 3-5 seconds
3. **Intelligent Automation**: Rule-based alerts and insights
4. **User Experience**: Professional, intuitive interface
5. **Scalability**: Architecture ready for production deployment
6. **Data-Driven**: Export and analysis capabilities

### Report Talking Points

- **Problem**: Manual monitoring is time-consuming and error-prone
- **Solution**: Automated IoT system with intelligent alerts
- **Impact**: Reduces labor, prevents crop loss, optimizes resources
- **Technology**: Modern web stack (React + FastAPI) + IoT ready
- **Scalability**: Designed for expansion to multiple farms
- **Cost**: Low-cost components (ESP32, common sensors)

---

## 🤝 Contributing

This is a competition MVP. For improvements:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is created for the RoboCraft competition. For educational and demonstration purposes.

---

## 👥 Authors

DualFarm Team - RoboCraft Competition 2024

---

## 🙏 Acknowledgments

- FastAPI for excellent Python web framework
- React and Vite for modern frontend development
- Recharts for beautiful chart components
- Tailwind CSS for utility-first styling
- RoboCraft competition organizers

---

## 📞 Support

For issues or questions:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review API documentation at `http://localhost:8000/docs`
3. Inspect browser console for frontend errors
4. Check backend logs in terminal

---

**Happy Farming! 🌱**
