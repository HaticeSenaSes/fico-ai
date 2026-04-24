from fastapi.testclient import TestClient

from app.main import app, auth_service
from app.services.auth_service import InvalidGoogleTokenError


client = TestClient(app)


def setup_function() -> None:
    auth_service._users_by_email.clear()


def test_register_success_returns_tokens_and_onboarding_route() -> None:
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "new-user@example.com",
            "password": "Strong123",
            "full_name": "New User",
            "kvkk_accepted": True,
        },
    )
    assert response.status_code == 201
    payload = response.json()
    assert payload["access_token"]
    assert payload["refresh_token"]
    assert payload["next_route"] == "/onboarding"


def test_register_duplicate_email_returns_409() -> None:
    register_body = {
        "email": "duplicate@example.com",
        "password": "Strong123",
        "full_name": "Duplicate User",
        "kvkk_accepted": True,
    }
    client.post("/api/v1/auth/register", json=register_body)
    second = client.post("/api/v1/auth/register", json=register_body)
    assert second.status_code == 409
    assert second.json()["detail"]["field"] == "email"


def test_google_oauth_new_user_goes_onboarding() -> None:
    def fake_verifier(_: str) -> dict[str, str]:
        return {
            "iss": "accounts.google.com",
            "email": "oauth-new@example.com",
            "name": "OAuth New",
            "picture": "https://example.com/avatar.png",
        }

    auth_service._google_verifier = fake_verifier
    response = client.post("/api/v1/auth/oauth/google", json={"id_token": "mock-token"})
    assert response.status_code == 200
    assert response.json()["next_route"] == "/onboarding"


def test_google_oauth_existing_user_goes_dashboard() -> None:
    def fake_verifier(_: str) -> dict[str, str]:
        return {
            "iss": "accounts.google.com",
            "email": "oauth-existing@example.com",
            "name": "OAuth Existing",
            "picture": "https://example.com/avatar.png",
        }

    auth_service._google_verifier = fake_verifier
    first = client.post("/api/v1/auth/oauth/google", json={"id_token": "mock-token"})
    second = client.post("/api/v1/auth/oauth/google", json={"id_token": "mock-token"})
    assert first.status_code == 200
    assert second.status_code == 200
    assert second.json()["next_route"] == "/dashboard"


def test_google_oauth_invalid_token_returns_401() -> None:
    def invalid_verifier(_: str) -> dict[str, str]:
        raise InvalidGoogleTokenError("invalid or expired google token")

    auth_service._google_verifier = invalid_verifier
    response = client.post("/api/v1/auth/oauth/google", json={"id_token": "bad-token-1"})
    assert response.status_code == 401
    assert response.json()["detail"]["field"] == "id_token"
