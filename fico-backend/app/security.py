from datetime import UTC, datetime, timedelta
import base64
import json
import hmac
import hashlib


JWT_SECRET = "dev-secret-change-me"
ACCESS_TTL_MINUTES = 30
REFRESH_TTL_DAYS = 30


def _b64(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).decode("utf-8").rstrip("=")


def _sign(payload: str) -> str:
    return _b64(hmac.new(JWT_SECRET.encode("utf-8"), payload.encode("utf-8"), hashlib.sha256).digest())


def create_token(subject: str, expires_in_seconds: int, token_type: str) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": subject,
        "type": token_type,
        "exp": int((datetime.now(UTC) + timedelta(seconds=expires_in_seconds)).timestamp()),
    }
    encoded_header = _b64(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    encoded_payload = _b64(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    signing_input = f"{encoded_header}.{encoded_payload}"
    return f"{signing_input}.{_sign(signing_input)}"


def create_access_token(subject: str) -> str:
    return create_token(subject=subject, expires_in_seconds=ACCESS_TTL_MINUTES * 60, token_type="access")


def create_refresh_token(subject: str) -> str:
    return create_token(subject=subject, expires_in_seconds=REFRESH_TTL_DAYS * 24 * 3600, token_type="refresh")
