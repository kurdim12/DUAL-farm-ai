from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth import create_access_token, get_password_hash, verify_password
from app.core.config import settings
from app.schemas.schemas import LoginRequest, TokenResponse
from app.models.models import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Demo login endpoint
    Default credentials: demo / demo123
    """

    # Check demo credentials
    if request.username == settings.DEMO_USERNAME and request.password == settings.DEMO_PASSWORD:
        # Create access token
        access_token = create_access_token(data={"sub": request.username})
        return TokenResponse(
            access_token=access_token,
            username=request.username
        )

    # Check database users (if any)
    user = db.query(User).filter(User.username == request.username).first()
    if user and verify_password(request.password, user.hashed_password):
        access_token = create_access_token(data={"sub": user.username})
        return TokenResponse(
            access_token=access_token,
            username=user.username
        )

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials"
    )

@router.post("/register", response_model=dict)
def register(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Register a new user (demo purposes)
    """
    # Check if user exists
    existing_user = db.query(User).filter(User.username == request.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    # Create new user
    hashed_password = get_password_hash(request.password)
    new_user = User(
        username=request.username,
        hashed_password=hashed_password,
        full_name=request.username.capitalize()
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User created successfully", "username": new_user.username}
