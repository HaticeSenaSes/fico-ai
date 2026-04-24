from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
import re


PASSWORD_PATTERN = re.compile(r"^(?=.*[A-Z])(?=.*\d).{8,}$")


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: EmailStr
    full_name: str
    avatar_url: str | None = None
    onboarding_required: bool


class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: UserResponse
    next_route: str = Field(pattern=r"^/(onboarding|dashboard)$")


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str = Field(min_length=2, max_length=120)
    kvkk_accepted: bool

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not PASSWORD_PATTERN.match(value):
            raise ValueError("Password must be min 8 chars with 1 uppercase and 1 number.")
        return value

    @field_validator("kvkk_accepted")
    @classmethod
    def validate_kvkk_accepted(cls, value: bool) -> bool:
        if not value:
            raise ValueError("KVKK must be accepted.")
        return value


class GoogleOAuthRequest(BaseModel):
    id_token: str = Field(min_length=10)
