from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from app.models.models import SensorReading, ActionLog, Alert
from app.schemas.schemas import DashboardStats, AIInsight
from typing import List
import statistics

class AnalyticsService:
    """Service for analytics and AI insights"""

    @staticmethod
    def get_dashboard_stats(db: Session) -> DashboardStats:
        """Get statistics for the dashboard"""

        # Latest reading
        latest_reading = db.query(SensorReading).order_by(SensorReading.timestamp.desc()).first()

        # 24h cutoff
        cutoff_24h = datetime.utcnow() - timedelta(hours=24)

        # Active alerts count
        active_alerts = db.query(Alert).filter(Alert.resolved == False).count()

        # Total readings in 24h
        total_readings_24h = db.query(SensorReading).filter(
            SensorReading.timestamp >= cutoff_24h
        ).count()

        # Average values in 24h
        readings_24h = db.query(SensorReading).filter(
            SensorReading.timestamp >= cutoff_24h
        ).all()

        avg_tds = None
        avg_temp = None
        avg_water_level = None

        if readings_24h:
            avg_tds = statistics.mean([r.tds_ppm for r in readings_24h])
            avg_temp = statistics.mean([r.temperature_c for r in readings_24h])
            avg_water_level = statistics.mean([r.water_level_cm for r in readings_24h])

        # Pump runtime calculation
        pump_runtime_minutes = 0.0
        if readings_24h:
            on_readings = [r for r in readings_24h if r.pump_state == "ON"]
            # Estimate: each reading with pump ON represents ~interval minutes
            pump_runtime_minutes = len(on_readings) * (5 / 60)  # Assuming 5-second intervals

        # Total doses in 24h
        total_doses = db.query(ActionLog).filter(
            and_(
                ActionLog.timestamp >= cutoff_24h,
                ActionLog.action_type == "DOSE"
            )
        ).count()

        return DashboardStats(
            latest_reading=latest_reading,
            active_alerts_count=active_alerts,
            total_readings_24h=total_readings_24h,
            avg_tds_24h=avg_tds,
            avg_temp_24h=avg_temp,
            avg_water_level_24h=avg_water_level,
            pump_runtime_minutes_24h=pump_runtime_minutes,
            total_doses_24h=total_doses
        )

    @staticmethod
    def get_ai_insights(db: Session) -> List[AIInsight]:
        """
        Generate AI insights based on sensor data patterns
        (Heuristic-based for MVP; can be replaced with ML models later)
        """
        insights = []

        # Get recent data
        cutoff_24h = datetime.utcnow() - timedelta(hours=24)
        readings_24h = db.query(SensorReading).filter(
            SensorReading.timestamp >= cutoff_24h
        ).order_by(SensorReading.timestamp.asc()).all()

        if len(readings_24h) < 10:
            insights.append(AIInsight(
                insight_type="INFO",
                title="Insufficient Data",
                description="Not enough data collected yet for meaningful insights. Keep monitoring!",
                confidence=1.0,
                timestamp=datetime.utcnow()
            ))
            return insights

        # Insight 1: TDS Trend
        tds_values = [r.tds_ppm for r in readings_24h]
        tds_trend = AnalyticsService._calculate_trend(tds_values)

        if tds_trend < -20:
            insights.append(AIInsight(
                insight_type="TREND",
                title="Declining TDS Detected",
                description=f"TDS levels are decreasing at approximately {abs(tds_trend):.1f} ppm per hour. This indicates nutrient consumption by plants. Consider dosing nutrients soon to maintain optimal levels.",
                confidence=0.85,
                timestamp=datetime.utcnow()
            ))
        elif tds_trend > 20:
            insights.append(AIInsight(
                insight_type="TREND",
                title="Increasing TDS Detected",
                description=f"TDS levels are increasing at approximately {tds_trend:.1f} ppm per hour. This may indicate water evaporation or over-dosing. Monitor closely to avoid salt buildup.",
                confidence=0.82,
                timestamp=datetime.utcnow()
            ))

        # Insight 2: Temperature Stability
        temp_values = [r.temperature_c for r in readings_24h]
        temp_std = statistics.stdev(temp_values) if len(temp_values) > 1 else 0

        if temp_std > 5:
            insights.append(AIInsight(
                insight_type="ANOMALY",
                title="Temperature Fluctuations",
                description=f"Temperature is fluctuating significantly (std dev: {temp_std:.1f}°C). Consider improving environmental control for better plant health.",
                confidence=0.78,
                timestamp=datetime.utcnow()
            ))

        # Insight 3: Water Level Alert
        water_levels = [r.water_level_cm for r in readings_24h]
        avg_water_level = statistics.mean(water_levels)

        if avg_water_level < 20:
            insights.append(AIInsight(
                insight_type="RECOMMENDATION",
                title="Low Water Level Warning",
                description=f"Average water level is {avg_water_level:.1f} cm. Refill the reservoir soon to prevent pump damage and ensure adequate nutrient delivery.",
                confidence=0.92,
                timestamp=datetime.utcnow()
            ))

        # Insight 4: Optimal Range Check
        optimal_tds_count = sum(1 for v in tds_values if 600 <= v <= 900)
        optimal_percentage = (optimal_tds_count / len(tds_values)) * 100

        if optimal_percentage > 80:
            insights.append(AIInsight(
                insight_type="RECOMMENDATION",
                title="Excellent TDS Management",
                description=f"Your TDS levels have been in the optimal range (600-900 ppm) {optimal_percentage:.0f}% of the time. Great work maintaining nutrient balance!",
                confidence=0.95,
                timestamp=datetime.utcnow()
            ))

        # Insight 5: Pump Usage Pattern
        pump_on_count = sum(1 for r in readings_24h if r.pump_state == "ON")
        pump_on_percentage = (pump_on_count / len(readings_24h)) * 100

        if pump_on_percentage > 80:
            insights.append(AIInsight(
                insight_type="ANOMALY",
                title="High Pump Runtime",
                description=f"Pump has been running {pump_on_percentage:.0f}% of the time. This is higher than normal. Check for leaks or system issues.",
                confidence=0.88,
                timestamp=datetime.utcnow()
            ))

        # If no insights generated, add a positive message
        if not insights:
            insights.append(AIInsight(
                insight_type="INFO",
                title="System Running Smoothly",
                description="All parameters are within normal ranges. No anomalies detected. Continue current management practices.",
                confidence=0.90,
                timestamp=datetime.utcnow()
            ))

        return insights

    @staticmethod
    def _calculate_trend(values: List[float]) -> float:
        """
        Calculate simple linear trend
        Returns slope (change per reading interval)
        """
        if len(values) < 2:
            return 0.0

        n = len(values)
        x = list(range(n))
        x_mean = statistics.mean(x)
        y_mean = statistics.mean(values)

        numerator = sum((x[i] - x_mean) * (values[i] - y_mean) for i in range(n))
        denominator = sum((x[i] - x_mean) ** 2 for i in range(n))

        if denominator == 0:
            return 0.0

        slope = numerator / denominator
        return slope * 12  # Scale to hourly rate (assuming 5-second intervals)
