from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class FoodCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    description: Optional[str] = None
    price: float = Field(gt=0)
    image: Optional[str] = None
    is_available: bool = True
    category_id: int


class FoodUpdate(BaseModel):
    name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=100
    )
    description: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    image: Optional[str] = None
    is_available: Optional[bool] = None
    category_id: Optional[int] = None


class FoodResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    image: Optional[str]
    is_available: bool
    category_id: int

    model_config = ConfigDict(from_attributes=True)