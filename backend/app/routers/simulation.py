from fastapi import APIRouter
from app.services.simulation_service import simulation

router = APIRouter(prefix="/simulate", tags=["Simulation"])

@router.post("/start")
def start_simulation():
    """
    Start the background sensor simulation
    This will generate sensor readings every few seconds
    """
    result = simulation.start()
    return result

@router.post("/stop")
def stop_simulation():
    """Stop the background sensor simulation"""
    result = simulation.stop()
    return result

@router.get("/status")
def get_simulation_status():
    """Get the current status of the simulation"""
    return simulation.get_status()
