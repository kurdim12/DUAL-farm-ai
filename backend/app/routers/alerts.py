from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import Alert
from app.schemas.schemas import AlertResponse
from app.services.alert_service import AlertService

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("/latest", response_model=List[AlertResponse])
def get_latest_alerts(
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Get the most recent alerts (both active and resolved)"""
    alerts = db.query(Alert).order_by(
        Alert.timestamp.desc()
    ).limit(limit).all()

    return alerts

@router.get("/active", response_model=List[AlertResponse])
def get_active_alerts(
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db)
):
    """Get only unresolved alerts"""
    return AlertService.get_active_alerts(db, limit)

@router.get("/history", response_model=List[AlertResponse])
def get_alert_history(
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """Get all alerts (for historical analysis)"""
    return AlertService.get_alert_history(db, limit)

@router.post("/{alert_id}/resolve", response_model=AlertResponse)
def resolve_alert(
    alert_id: int,
    db: Session = Depends(get_db)
):
    """Mark an alert as resolved"""
    alert = AlertService.resolve_alert(db, alert_id)

    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")

    return alert

@router.get("/stats", response_model=dict)
def get_alert_stats(db: Session = Depends(get_db)):
    """Get alert statistics"""

    total_alerts = db.query(Alert).count()
    active_alerts = db.query(Alert).filter(Alert.resolved == False).count()
    resolved_alerts = db.query(Alert).filter(Alert.resolved == True).count()

    # Count by severity
    critical_count = db.query(Alert).filter(Alert.severity == "CRITICAL").count()
    warning_count = db.query(Alert).filter(Alert.severity == "WARNING").count()
    info_count = db.query(Alert).filter(Alert.severity == "INFO").count()

    # Count by type
    tds_low = db.query(Alert).filter(Alert.alert_type == "TDS_LOW").count()
    tds_high = db.query(Alert).filter(Alert.alert_type == "TDS_HIGH").count()
    water_low = db.query(Alert).filter(Alert.alert_type == "WATER_LOW").count()
    temp_low = db.query(Alert).filter(Alert.alert_type == "TEMP_LOW").count()
    temp_high = db.query(Alert).filter(Alert.alert_type == "TEMP_HIGH").count()

    return {
        "total_alerts": total_alerts,
        "active": active_alerts,
        "resolved": resolved_alerts,
        "by_severity": {
            "CRITICAL": critical_count,
            "WARNING": warning_count,
            "INFO": info_count
        },
        "by_type": {
            "TDS_LOW": tds_low,
            "TDS_HIGH": tds_high,
            "WATER_LOW": water_low,
            "TEMP_LOW": temp_low,
            "TEMP_HIGH": temp_high
        }
    }
