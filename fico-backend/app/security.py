from datetime import datetime, timedelta, timezone
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
import os

SECRET_KEY = os.getenv("JWT_SECRET", "fico-ai-super-secret-key")
ALGORITHM = "HS256"
ACCESS_TTL_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))
REFRESH_TTL_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "30"))

security = HTTPBearer()

def create_access_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TTL_MINUTES)
    return jwt.encode({"sub": subject, "exp": expire, "type": "access"}, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(subject: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TTL_DAYS)
    return jwt.encode({"sub": subject, "exp": expire, "type": "refresh"}, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Gecersiz token.")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Token dogrulanamadi.")
