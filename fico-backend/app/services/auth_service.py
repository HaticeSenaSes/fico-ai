from dataclasses import dataclass
from typing import Any, Callable
from uuid import uuid4
import hashlib


@dataclass
class User:
    id: str
    email: str
    full_name: str
    password_hash: str | None = None
    avatar_url: str | None = None
    onboarding_required: bool = True
    auth_provider: str = "email"


class DuplicateEmailError(ValueError):
    pass


class InvalidGoogleTokenError(ValueError):
    pass


class AuthService:
    def __init__(self, google_verifier: Callable[[str], dict[str, Any]]) -> None:
        self._users_by_email: dict[str, User] = {}
        self._google_verifier = google_verifier

    def register(self, *, email: str, password: str, full_name: str) -> User:
        normalized_email = email.lower().strip()
        if normalized_email in self._users_by_email:
            raise DuplicateEmailError("email already exists")
        user = User(
            id=str(uuid4()),
            email=normalized_email,
            full_name=full_name.strip(),
            password_hash=self._hash_password(password),
            onboarding_required=True,
            auth_provider="email",
        )
        self._users_by_email[normalized_email] = user
        return user

    def login_with_google(self, *, id_token: str) -> tuple[User, bool]:
        claims = self._google_verifier(id_token)
        email = claims["email"].lower().strip()
        existing = self._users_by_email.get(email)
        if existing:
            return existing, False

        full_name = claims.get("name") or email.split("@")[0]
        avatar = claims.get("picture")
        user = User(
            id=str(uuid4()),
            email=email,
            full_name=full_name,
            avatar_url=avatar,
            onboarding_required=True,
            auth_provider="google",
        )
        self._users_by_email[email] = user
        return user, True

    @staticmethod
    def _hash_password(password: str) -> str:
        return hashlib.sha256(password.encode("utf-8")).hexdigest()
