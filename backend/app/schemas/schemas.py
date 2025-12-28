from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional, List

# Sensor Schemas
class SensorReadingCreate(BaseModel):
    tds_ppm: float = Field(..., ge=0)
    temperature_c: float = Field(..., ge=-50, le=100)
    ph_value: Optional[float] = Field(None, ge=0, le=14)
    water_level_cm: float = Field(..., ge=0)
    pump_state: str = Field(..., pattern="^(ON|OFF)$")
    note: Optional[str] = None
    source: str = "manual"

class SensorReadingResponse(BaseModel):
    id: int
    timestamp: datetime
    tds_ppm: float
    temperature_c: float
    ph_value: Optional[float]
    water_level_cm: float
    pump_state: str
    note: Optional[str]
    source: str

    class Config:
        from_attributes = True

# Action Log Schemas
class ActionLogCreate(BaseModel):
    action_type: str
    amount_ml: Optional[float] = None
    reason: Optional[str] = None
    automated: bool = False
    tds_before: Optional[float] = None
    tds_after: Optional[float] = None

class ActionLogResponse(BaseModel):
    id: int
    timestamp: datetime
    action_type: str
    amount_ml: Optional[float]
    reason: Optional[str]
    automated: bool
    tds_before: Optional[float]
    tds_after: Optional[float]

    class Config:
        from_attributes = True

# Alert Schemas
class AlertCreate(BaseModel):
    alert_type: str
    severity: str
    message: str
    sensor_reading_id: Optional[int] = None

class AlertResponse(BaseModel):
    id: int
    timestamp: datetime
    alert_type: str
    severity: str
    message: str
    resolved: bool
    resolved_at: Optional[datetime]
    sensor_reading_id: Optional[int]

    class Config:
        from_attributes = True

# Control Schemas
class PumpControlRequest(BaseModel):
    state: str = Field(..., pattern="^(ON|OFF)$")
    reason: Optional[str] = None

class DoseControlRequest(BaseModel):
    amount_ml: float = Field(..., gt=0, le=1000)
    reason: Optional[str] = None

# Auth Schemas
class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str

# Stats and Analytics
class DashboardStats(BaseModel):
    latest_reading: Optional[SensorReadingResponse]
    active_alerts_count: int
    total_readings_24h: int
    avg_tds_24h: Optional[float]
    avg_temp_24h: Optional[float]
    avg_water_level_24h: Optional[float]
    pump_runtime_minutes_24h: float
    total_doses_24h: int

class AIInsight(BaseModel):
    insight_type: str  # "TREND", "ANOMALY", "RECOMMENDATION"
    title: str
    description: str
    confidence: float  # 0.0 to 1.0
    timestamp: datetime
