from __future__ import annotations
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User
from app.security import create_access_token, create_refresh_token, verify_token
from pydantic import BaseModel, EmailStr, Field, field_validator
from datetime import datetime, timezone
import hashlib
import re
import uuid

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])

PASSWORD_PATTERN = re.compile(r"^(?=.*[A-Z])(?=.*\d).{8,}$")

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str = Field(min_length=2, max_length=120)
    kvkk_accepted: bool

    @field_validator("password")
    @classmethod
    def validate_password(cls, v):
        if not PASSWORD_PATTERN.match(v):
            raise ValueError("Min 8 karakter, 1 buyuk harf, 1 rakam gerekli.")
        return v

    @field_validator("kvkk_accepted")
    @classmethod
    def validate_kvkk(cls, v):
        if not v:
            raise ValueError("KVKK kabul edilmeli.")
        return v

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    avatar_url: Optional[str] = None
    onboarding_completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: UserResponse
    next_route: str

@router.post("/register", response_model=AuthResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email.lower()).first()
    if existing:
        raise HTTPException(status_code=409, detail={"field": "email", "message": "Bu email zaten kayitli."})
    user = User(
        id=str(uuid.uuid4()),
        email=payload.email.lower(),
        full_name=payload.full_name.strip(),
        password_hash=hash_password(payload.password),
        kvkk_accepted_at=datetime.now(timezone.utc),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return AuthResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
        user=UserResponse.model_validate(user),
        next_route="/onboarding",
    )

@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not user.password_hash:
        raise HTTPException(status_code=401, detail={"message": "Email veya sifre hatali."})
    if user.password_hash != hash_password(payload.password):
        raise HTTPException(status_code=401, detail={"message": "Email veya sifre hatali."})
    next_route = "/dashboard" if user.onboarding_completed_at else "/onboarding"
    return AuthResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
        user=UserResponse.model_validate(user),
        next_route=next_route,
    )
from fastapi import Header


from fastapi import Header

@router.get("/me")
def get_me(authorization: str = Header(...), db: Session = Depends(get_db)):
    token = authorization.replace("Bearer ", "")
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Gecersiz token")
    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=404, detail="Kullanici bulunamadi")
    return {"id": user.id, "email": user.email, "full_name": user.full_name}
