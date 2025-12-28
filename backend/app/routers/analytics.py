from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.schemas import DashboardStats, AIInsight
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Get comprehensive dashboard statistics
    Includes latest readings, alerts, and aggregated metrics
    """
    return AnalyticsService.get_dashboard_stats(db)

@router.get("/insights", response_model=List[AIInsight])
def get_ai_insights(db: Session = Depends(get_db)):
    """
    Get AI-powered insights and recommendations
    (Heuristic-based for MVP; can be enhanced with ML models)
    """
    return AnalyticsService.get_ai_insights(db)
