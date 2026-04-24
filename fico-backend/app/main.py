from fastapi import FastAPI, HTTPException, status

from app.schemas import AuthResponse, GoogleOAuthRequest, RegisterRequest, UserResponse
from app.security import create_access_token, create_refresh_token
from app.services.auth_service import AuthService, DuplicateEmailError, InvalidGoogleTokenError
from app.services.google_verifier import verify_google_id_token


app = FastAPI(title="FiCo Backend", version="0.1.0")
auth_service = AuthService(google_verifier=verify_google_id_token)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/v1")
def api_root() -> dict[str, str]:
    return {"message": "FiCo API v1", "docs": "/docs"}


@app.post("/api/v1/auth/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest) -> AuthResponse:
    try:
        user = auth_service.register(email=payload.email, password=payload.password, full_name=payload.full_name)
    except DuplicateEmailError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={"field": "email", "message": "This email is already registered."},
        )

    return AuthResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
        user=UserResponse.model_validate(user),
        next_route="/onboarding",
    )


@app.post("/api/v1/auth/oauth/google", response_model=AuthResponse)
def oauth_google(payload: GoogleOAuthRequest) -> AuthResponse:
    try:
        user, is_new = auth_service.login_with_google(id_token=payload.id_token)
    except InvalidGoogleTokenError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"field": "id_token", "message": str(exc)},
        ) from exc

    return AuthResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
        user=UserResponse.model_validate(user),
        next_route="/onboarding" if is_new else "/dashboard",
    )
