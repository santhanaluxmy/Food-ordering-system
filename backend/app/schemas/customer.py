from pydantic import BaseModel, ConfigDict, EmailStr, Field


class CustomerCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=1, max_length=20)
    address: str = Field(min_length=1, max_length=255)


class CustomerUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=100
    )
    email: EmailStr | None = None
    phone: str | None = Field(
        default=None,
        min_length=1,
        max_length=20
    )
    address: str | None = Field(
        default=None,
        min_length=1,
        max_length=255
    )


class CustomerResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str
    address: str

    model_config = ConfigDict(from_attributes=True)