from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from uuid import UUID


class RegisterRequest(BaseModel):
    phone: str = Field(..., min_length=10, max_length=15)
    password: str = Field(..., min_length=8)
    full_name: str
    email: Optional[EmailStr] = None


class VerifyOtpRequest(BaseModel):
    phone: str
    otp: str = Field(..., min_length=4, max_length=8)


class LoginRequest(BaseModel):
    phone: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshRequest(BaseModel):
    refresh_token: str


class UserOut(BaseModel):
    id: UUID
    phone: str
    email: Optional[str] = None
    full_name: str
    role: str
    is_verified: bool

    class Config:
        from_attributes = True
