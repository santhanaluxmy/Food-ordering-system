from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=5, max_length=20)
    address: str = Field(min_length=3, max_length=255)
    password: str = Field(min_length=6, max_length=100)


class RegisterResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    address: str
    role: str

    model_config = {
        "from_attributes": True
    }


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    customer_id: int
    name: str

class CurrentUserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    address: str
    role: str

    model_config = {
        "from_attributes": True
    }