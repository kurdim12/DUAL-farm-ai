from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.core.database import get_db
from app.models.models import ActionLog, SensorReading
from app.schemas.schemas import (
    PumpControlRequest,
    DoseControlRequest,
    ActionLogResponse
)
from app.services.simulation_service import simulation

router = APIRouter(prefix="/control", tags=["Control"])

@router.post("/pump", response_model=ActionLogResponse)
def control_pump(
    request: PumpControlRequest,
    db: Session = Depends(get_db)
):
    """
    Control the pump (ON/OFF)
    This logs the action and updates the system state
    """

    # Get latest reading to capture current TDS
    latest_reading = db.query(SensorReading).order_by(
        SensorReading.timestamp.desc()
    ).first()

    current_tds = latest_reading.tds_ppm if latest_reading else None

    # Determine action type
    action_type = "PUMP_ON" if request.state == "ON" else "PUMP_OFF"

    # Create action log
    action = ActionLog(
        action_type=action_type,
        reason=request.reason or f"Manual pump control: {request.state}",
        automated=False,
        tds_before=current_tds
    )

    db.add(action)
    db.commit()
    db.refresh(action)

    # Update simulation state if running
    if simulation.running:
        simulation.pump_state = request.state

    return action

@router.post("/dose", response_model=ActionLogResponse)
def dose_nutrients(
    request: DoseControlRequest,
    db: Session = Depends(get_db)
):
    """
    Dose nutrients into the system
    This logs the action and updates TDS levels
    """

    # Get latest reading to capture TDS before dosing
    latest_reading = db.query(SensorReading).order_by(
        SensorReading.timestamp.desc()
    ).first()

    tds_before = latest_reading.tds_ppm if latest_reading else None

    # Simulate TDS increase (rough approximation)
    # 10ml of nutrients increases TDS by ~50 ppm
    estimated_tds_increase = (request.amount_ml / 10) * 50
    tds_after = (tds_before + estimated_tds_increase) if tds_before else None

    # Create action log
    action = ActionLog(
        action_type="DOSE",
        amount_ml=request.amount_ml,
        reason=request.reason or f"Manual nutrient dosing: {request.amount_ml} ml",
        automated=False,
        tds_before=tds_before,
        tds_after=tds_after
    )

    db.add(action)
    db.commit()
    db.refresh(action)

    # Update simulation state if running
    if simulation.running:
        simulation.dose_nutrient(request.amount_ml)

    return action

@router.post("/dilute", response_model=ActionLogResponse)
def dilute_solution(
    amount_ml: float,
    db: Session = Depends(get_db)
):
    """
    Add water to dilute the solution (reduces TDS)
    """

    # Get latest reading
    latest_reading = db.query(SensorReading).order_by(
        SensorReading.timestamp.desc()
    ).first()

    tds_before = latest_reading.tds_ppm if latest_reading else None

    # Simulate TDS decrease from dilution
    dilution_factor = amount_ml / 1000  # Rough approximation
    tds_after = (tds_before * (1 - dilution_factor * 0.1)) if tds_before else None

    # Create action log
    action = ActionLog(
        action_type="DILUTE",
        amount_ml=amount_ml,
        reason=f"Water dilution: {amount_ml} ml to reduce TDS",
        automated=False,
        tds_before=tds_before,
        tds_after=tds_after
    )

    db.add(action)
    db.commit()
    db.refresh(action)

    # Update simulation state if running
    if simulation.running:
        simulation.dilute_water(amount_ml)

    return action
