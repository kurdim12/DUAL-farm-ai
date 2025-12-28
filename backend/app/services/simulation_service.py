import random
import time
import threading
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.models import SensorReading
from app.services.alert_service import AlertService
from app.core.database import SessionLocal
from app.core.config import settings

class SimulationService:
    """Background service for simulating sensor data"""

    def __init__(self):
        self.running = False
        self.thread = None
        # Simulation state
        self.current_tds = 800.0
        self.current_temp = 25.0
        self.current_water_level = 50.0
        self.current_ph = 6.0
        self.pump_state = "OFF"
        self.last_pump_change = None

    def start(self):
        """Start the simulation in a background thread"""
        if self.running:
            return {"status": "already_running"}

        self.running = True
        self.thread = threading.Thread(target=self._simulate_loop, daemon=True)
        self.thread.start()
        return {"status": "started", "interval_seconds": settings.SIMULATION_INTERVAL}

    def stop(self):
        """Stop the simulation"""
        if not self.running:
            return {"status": "not_running"}

        self.running = False
        if self.thread:
            self.thread.join(timeout=2)
        return {"status": "stopped"}

    def get_status(self):
        """Get simulation status"""
        return {
            "running": self.running,
            "current_tds": self.current_tds,
            "current_temp": self.current_temp,
            "current_water_level": self.current_water_level,
            "pump_state": self.pump_state
        }

    def _simulate_loop(self):
        """Main simulation loop"""
        while self.running:
            try:
                # Create database session
                db = SessionLocal()

                # Simulate sensor readings with realistic drift
                self._update_simulated_values()

                # Create sensor reading
                reading = SensorReading(
                    tds_ppm=self.current_tds,
                    temperature_c=self.current_temp,
                    ph_value=self.current_ph,
                    water_level_cm=self.current_water_level,
                    pump_state=self.pump_state,
                    source="simulated",
                    note="Auto-generated simulation data"
                )

                db.add(reading)
                db.commit()
                db.refresh(reading)

                # Check for alerts
                AlertService.check_and_create_alerts(db, reading)

                db.close()

                # Sleep for the interval
                time.sleep(settings.SIMULATION_INTERVAL)

            except Exception as e:
                print(f"Simulation error: {e}")
                time.sleep(settings.SIMULATION_INTERVAL)

    def _update_simulated_values(self):
        """Update simulated sensor values with realistic variations"""

        # TDS: slowly drifts down (nutrient consumption) with some noise
        self.current_tds += random.uniform(-15, 5)
        self.current_tds = max(300, min(1200, self.current_tds))

        # Temperature: varies with daily cycle + noise
        hour = datetime.now().hour
        base_temp = 22 + 5 * abs(12 - hour) / 12  # Warmer in middle of day
        self.current_temp = base_temp + random.uniform(-2, 2)
        self.current_temp = max(10, min(40, self.current_temp))

        # Water level: slowly decreases (evaporation/consumption)
        self.current_water_level += random.uniform(-1, 0.2)
        self.current_water_level = max(5, min(100, self.current_water_level))

        # pH: small variations
        self.current_ph += random.uniform(-0.1, 0.1)
        self.current_ph = max(4.0, min(8.0, self.current_ph))

        # Pump: randomly toggle occasionally
        if random.random() < 0.05:  # 5% chance to toggle
            self.pump_state = "ON" if self.pump_state == "OFF" else "OFF"
            self.last_pump_change = datetime.now()

    def dose_nutrient(self, amount_ml: float):
        """Simulate nutrient dosing effect on TDS"""
        # Rough approximation: 10ml increases TDS by ~50 ppm
        tds_increase = (amount_ml / 10) * 50
        self.current_tds += tds_increase
        self.current_tds = min(1500, self.current_tds)

    def dilute_water(self, amount_ml: float):
        """Simulate water dilution effect on TDS"""
        # Dilution decreases TDS
        dilution_factor = amount_ml / 1000  # Rough approximation
        self.current_tds *= (1 - dilution_factor * 0.1)
        self.current_tds = max(100, self.current_tds)


# Global simulation instance
simulation = SimulationService()
