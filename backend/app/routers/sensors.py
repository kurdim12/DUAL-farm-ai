from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models.models import SensorReading
from app.schemas.schemas import SensorReadingCreate, SensorReadingResponse
from app.services.alert_service import AlertService

router = APIRouter(prefix="/sensors", tags=["Sensors"])

@router.post("/ingest", response_model=SensorReadingResponse, status_code=201)
def ingest_sensor_data(
    reading: SensorReadingCreate,
    db: Session = Depends(get_db)
):
    """
    Ingest a new sensor reading
    This endpoint stores the reading and checks for alerts
    """
    # Create sensor reading
    db_reading = SensorReading(**reading.model_dump())
    db.add(db_reading)
    db.commit()
    db.refresh(db_reading)

    # Check and create alerts based on this reading
    AlertService.check_and_create_alerts(db, db_reading)

    return db_reading

@router.get("/latest", response_model=SensorReadingResponse)
def get_latest_reading(db: Session = Depends(get_db)):
    """Get the most recent sensor reading"""
    reading = db.query(SensorReading).order_by(
        SensorReading.timestamp.desc()
    ).first()

    if not reading:
        raise HTTPException(status_code=404, detail="No sensor readings found")

    return reading

@router.get("/history", response_model=List[SensorReadingResponse])
def get_sensor_history(
    range: str = Query("1h", regex="^(1h|24h|7d)$"),
    limit: int = Query(1000, ge=1, le=10000),
    db: Session = Depends(get_db)
):
    """
    Get sensor reading history
    Range options: 1h (1 hour), 24h (24 hours), 7d (7 days)
    """
    # Calculate cutoff time
    range_map = {
        "1h": timedelta(hours=1),
        "24h": timedelta(hours=24),
        "7d": timedelta(days=7)
    }

    cutoff = datetime.utcnow() - range_map[range]

    # Query readings
    readings = db.query(SensorReading).filter(
        SensorReading.timestamp >= cutoff
    ).order_by(
        SensorReading.timestamp.desc()
    ).limit(limit).all()

    return readings

@router.get("/stats", response_model=dict)
def get_sensor_stats(db: Session = Depends(get_db)):
    """Get basic statistics about sensor readings"""
    total_readings = db.query(SensorReading).count()

    latest_reading = db.query(SensorReading).order_by(
        SensorReading.timestamp.desc()
    ).first()

    return {
        "total_readings": total_readings,
        "latest_timestamp": latest_reading.timestamp if latest_reading else None,
        "database_size_mb": 0.0  # Placeholder
    }
