from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta
from app.core.database import get_db
from app.models.models import ActionLog
from app.schemas.schemas import ActionLogResponse

router = APIRouter(prefix="/actions", tags=["Actions"])

@router.get("/history", response_model=List[ActionLogResponse])
def get_action_history(
    limit: int = Query(100, ge=1, le=1000),
    action_type: str = Query(None),
    db: Session = Depends(get_db)
):
    """
    Get history of all actions (dosing, pump control, etc.)
    Optionally filter by action_type
    """
    query = db.query(ActionLog)

    if action_type:
        query = query.filter(ActionLog.action_type == action_type)

    actions = query.order_by(
        ActionLog.timestamp.desc()
    ).limit(limit).all()

    return actions

@router.get("/recent", response_model=List[ActionLogResponse])
def get_recent_actions(
    hours: int = Query(24, ge=1, le=168),
    db: Session = Depends(get_db)
):
    """Get actions from the last N hours"""
    cutoff = datetime.utcnow() - timedelta(hours=hours)

    actions = db.query(ActionLog).filter(
        ActionLog.timestamp >= cutoff
    ).order_by(
        ActionLog.timestamp.desc()
    ).all()

    return actions

@router.get("/stats", response_model=dict)
def get_action_stats(db: Session = Depends(get_db)):
    """Get statistics about actions"""

    total_actions = db.query(ActionLog).count()

    # Count by type
    dose_count = db.query(ActionLog).filter(ActionLog.action_type == "DOSE").count()
    pump_on_count = db.query(ActionLog).filter(ActionLog.action_type == "PUMP_ON").count()
    pump_off_count = db.query(ActionLog).filter(ActionLog.action_type == "PUMP_OFF").count()
    dilute_count = db.query(ActionLog).filter(ActionLog.action_type == "DILUTE").count()

    # Automated vs manual
    automated_count = db.query(ActionLog).filter(ActionLog.automated == True).count()
    manual_count = db.query(ActionLog).filter(ActionLog.automated == False).count()

    return {
        "total_actions": total_actions,
        "by_type": {
            "DOSE": dose_count,
            "PUMP_ON": pump_on_count,
            "PUMP_OFF": pump_off_count,
            "DILUTE": dilute_count
        },
        "automated": automated_count,
        "manual": manual_count
    }
