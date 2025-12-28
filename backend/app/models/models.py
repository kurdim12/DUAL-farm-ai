from sqlalchemy import Column, Integer, Float, String, DateTime, Boolean
from datetime import datetime
from app.core.database import Base

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    tds_ppm = Column(Float, nullable=False)  # Total Dissolved Solids
    temperature_c = Column(Float, nullable=False)  # Temperature in Celsius
    ph_value = Column(Float, nullable=True)  # pH (optional)
    water_level_cm = Column(Float, nullable=False)  # Water level in cm
    pump_state = Column(String(10), nullable=False)  # "ON" or "OFF"
    note = Column(String(255), nullable=True)  # Source: simulated/manual
    source = Column(String(50), default="manual")  # simulated, manual, sensor

class ActionLog(Base):
    __tablename__ = "action_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    action_type = Column(String(50), nullable=False)  # "DOSE", "DILUTE", "PUMP_ON", "PUMP_OFF"
    amount_ml = Column(Float, nullable=True)  # For dosing actions
    reason = Column(String(255), nullable=True)  # Why this action was taken
    automated = Column(Boolean, default=False)  # Was this automated or manual?
    tds_before = Column(Float, nullable=True)
    tds_after = Column(Float, nullable=True)

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    alert_type = Column(String(50), nullable=False)  # "TDS_LOW", "TDS_HIGH", "TEMP_RISK", etc.
    severity = Column(String(20), nullable=False)  # "INFO", "WARNING", "CRITICAL"
    message = Column(String(500), nullable=False)
    resolved = Column(Boolean, default=False)
    resolved_at = Column(DateTime, nullable=True)
    sensor_reading_id = Column(Integer, nullable=True)  # Reference to sensor reading

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    hashed_password = Column(String(255))
    full_name = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
