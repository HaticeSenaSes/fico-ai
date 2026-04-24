import os
from typing import Any

from google.auth.transport import requests
from google.oauth2 import id_token

from app.services.auth_service import InvalidGoogleTokenError


def verify_google_id_token(raw_id_token: str) -> dict[str, Any]:
    client_id = os.getenv("GOOGLE_OAUTH_CLIENT_ID")
    request = requests.Request()
    try:
        claims = id_token.verify_oauth2_token(raw_id_token, request, audience=client_id)
    except Exception as exc:
        raise InvalidGoogleTokenError("invalid or expired google token") from exc

    if claims.get("iss") not in {"accounts.google.com", "https://accounts.google.com"}:
        raise InvalidGoogleTokenError("invalid issuer")
    if not claims.get("email"):
        raise InvalidGoogleTokenError("email claim missing")
    return claims
