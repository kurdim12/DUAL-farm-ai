from sqlalchemy.orm import Session
from app.models.models import SensorReading, Alert
from app.schemas.schemas import AlertCreate
from app.core.config import settings
from datetime import datetime

class AlertService:
    """Service for checking sensor readings against alert rules"""

    @staticmethod
    def check_and_create_alerts(db: Session, reading: SensorReading) -> list[Alert]:
        """
        Check a sensor reading against all alert rules and create alerts if needed
        Returns list of created alerts
        """
        alerts = []

        # Rule 1: TDS too low
        if reading.tds_ppm < settings.TDS_MIN:
            alert = AlertService._create_alert(
                db=db,
                alert_type="TDS_LOW",
                severity="WARNING",
                message=f"TDS level is too low: {reading.tds_ppm:.1f} ppm (threshold: {settings.TDS_MIN} ppm). Nutrients may be needed.",
                sensor_reading_id=reading.id
            )
            alerts.append(alert)

        # Rule 2: TDS too high
        if reading.tds_ppm > settings.TDS_MAX:
            alert = AlertService._create_alert(
                db=db,
                alert_type="TDS_HIGH",
                severity="CRITICAL",
                message=f"TDS level is too high: {reading.tds_ppm:.1f} ppm (threshold: {settings.TDS_MAX} ppm). Over-concentration risk!",
                sensor_reading_id=reading.id
            )
            alerts.append(alert)

        # Rule 3: Water level too low
        if reading.water_level_cm < settings.WATER_LEVEL_MIN:
            alert = AlertService._create_alert(
                db=db,
                alert_type="WATER_LOW",
                severity="CRITICAL",
                message=f"Water level is critically low: {reading.water_level_cm:.1f} cm (threshold: {settings.WATER_LEVEL_MIN} cm).",
                sensor_reading_id=reading.id
            )
            alerts.append(alert)

        # Rule 4: Temperature out of range
        if reading.temperature_c < settings.TEMP_MIN:
            alert = AlertService._create_alert(
                db=db,
                alert_type="TEMP_LOW",
                severity="WARNING",
                message=f"Temperature is too low: {reading.temperature_c:.1f}°C (minimum: {settings.TEMP_MIN}°C).",
                sensor_reading_id=reading.id
            )
            alerts.append(alert)

        if reading.temperature_c > settings.TEMP_MAX:
            alert = AlertService._create_alert(
                db=db,
                alert_type="TEMP_HIGH",
                severity="WARNING",
                message=f"Temperature is too high: {reading.temperature_c:.1f}°C (maximum: {settings.TEMP_MAX}°C).",
                sensor_reading_id=reading.id
            )
            alerts.append(alert)

        # Rule 5: pH out of range (if available)
        if reading.ph_value is not None:
            if reading.ph_value < 5.5:
                alert = AlertService._create_alert(
                    db=db,
                    alert_type="PH_LOW",
                    severity="WARNING",
                    message=f"pH is too acidic: {reading.ph_value:.1f} (recommended: 5.5-6.5).",
                    sensor_reading_id=reading.id
                )
                alerts.append(alert)
            elif reading.ph_value > 6.5:
                alert = AlertService._create_alert(
                    db=db,
                    alert_type="PH_HIGH",
                    severity="WARNING",
                    message=f"pH is too alkaline: {reading.ph_value:.1f} (recommended: 5.5-6.5).",
                    sensor_reading_id=reading.id
                )
                alerts.append(alert)

        return alerts

    @staticmethod
    def _create_alert(db: Session, alert_type: str, severity: str, message: str, sensor_reading_id: int = None) -> Alert:
        """Internal method to create an alert"""
        alert = Alert(
            alert_type=alert_type,
            severity=severity,
            message=message,
            sensor_reading_id=sensor_reading_id
        )
        db.add(alert)
        db.commit()
        db.refresh(alert)
        return alert

    @staticmethod
    def get_active_alerts(db: Session, limit: int = 50) -> list[Alert]:
        """Get unresolved alerts"""
        return db.query(Alert).filter(Alert.resolved == False).order_by(Alert.timestamp.desc()).limit(limit).all()

    @staticmethod
    def get_alert_history(db: Session, limit: int = 100) -> list[Alert]:
        """Get all alerts"""
        return db.query(Alert).order_by(Alert.timestamp.desc()).limit(limit).all()

    @staticmethod
    def resolve_alert(db: Session, alert_id: int) -> Alert:
        """Mark an alert as resolved"""
        alert = db.query(Alert).filter(Alert.id == alert_id).first()
        if alert:
            alert.resolved = True
            alert.resolved_at = datetime.utcnow()
            db.commit()
            db.refresh(alert)
        return alert
