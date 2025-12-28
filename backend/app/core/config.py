from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "DualFarm Smart Farming System"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Demo authentication
    DEMO_USERNAME: str = "demo"
    DEMO_PASSWORD: str = "demo123"
    SECRET_KEY: str = "dualfarm-secret-key-change-in-production"

    # Alert thresholds
    TDS_MIN: float = 500.0  # ppm
    TDS_MAX: float = 1100.0  # ppm
    TEMP_MIN: float = 15.0  # Celsius
    TEMP_MAX: float = 35.0  # Celsius
    WATER_LEVEL_MIN: float = 10.0  # cm
    PUMP_MAX_RUNTIME_MINUTES: int = 30

    # Simulation settings
    SIMULATION_INTERVAL: int = 5  # seconds

    class Config:
        case_sensitive = True

settings = Settings()
