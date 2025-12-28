from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import init_db
from app.core.config import settings
from app.routers import auth, sensors, control, actions, alerts, simulation, analytics

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Smart farming system with real-time monitoring, alerts, and AI insights"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For demo; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(sensors.router, prefix=settings.API_PREFIX)
app.include_router(control.router, prefix=settings.API_PREFIX)
app.include_router(actions.router, prefix=settings.API_PREFIX)
app.include_router(alerts.router, prefix=settings.API_PREFIX)
app.include_router(simulation.router, prefix=settings.API_PREFIX)
app.include_router(analytics.router, prefix=settings.API_PREFIX)

@app.on_event("startup")
def startup_event():
    """Initialize database on startup"""
    init_db()
    print(f"✅ {settings.APP_NAME} v{settings.VERSION} started successfully")
    print(f"📊 Database initialized")
    print(f"🌐 API available at: http://localhost:8000{settings.API_PREFIX}")
    print(f"📖 API docs at: http://localhost:8000/docs")

@app.get("/")
def root():
    """Root endpoint"""
    return {
        "name": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "running",
        "docs": "/docs",
        "api": settings.API_PREFIX
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": settings.APP_NAME}
