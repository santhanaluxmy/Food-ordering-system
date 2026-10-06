from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.category import Category
from app.models.food import Food
from app.models.order_item import OrderItem
from app.schemas.food import (
    FoodCreate,
    FoodUpdate,
    FoodResponse,
)


router = APIRouter(
    prefix="/foods",
    tags=["Foods"]
)


# CREATE FOOD
@router.post(
    "/",
    response_model=FoodResponse,
    status_code=201
)
def create_food(
    food: FoodCreate,
    db: Session = Depends(get_db)
):
    category = db.query(Category).filter(
        Category.id == food.category_id
    ).first()

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found"
        )

    new_food = Food(
        name=food.name,
        description=food.description,
        price=food.price,
        image=food.image,
        is_available=food.is_available,
        category_id=food.category_id
    )

    db.add(new_food)
    db.commit()
    db.refresh(new_food)

    return new_food


@router.get("/", response_model=list[FoodResponse])
def get_foods(
    search: str | None = None,
    category_id: int | None = None,
    sort: str | None = None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    query = db.query(Food)

    # Search
    if search:
        query = query.filter(
            Food.name.ilike(f"%{search}%")
        )

    # Category filter
    if category_id:
        query = query.filter(
            Food.category_id == category_id
        )

    # Sorting
    if sort == "price-asc":
        query = query.order_by(
            Food.price.asc()
        )

    elif sort == "price-desc":
        query = query.order_by(
            Food.price.desc()
        )

    elif sort == "name-az":
        query = query.order_by(
            Food.name.asc()
        )

    # Pagination
    if page < 1:
        page = 1

    if limit < 1:
        limit = 10

    offset = (page - 1) * limit

    foods = (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )

    return foods
# GET POPULAR FOODS
# IMPORTANT:
# This route must come before /{food_id}
@router.get("/popular")
def get_popular_foods(
    db: Session = Depends(get_db)
):
    popular_foods = (
        db.query(
            Food.id,
            Food.name,
            Food.price,
            func.sum(
                OrderItem.quantity
            ).label("total_ordered")
        )
        .join(
            OrderItem,
            Food.id == OrderItem.food_id
        )
        .group_by(
            Food.id,
            Food.name,
            Food.price
        )
        .order_by(
            func.sum(
                OrderItem.quantity
            ).desc()
        )
        .limit(5)
        .all()
    )

    return [
        {
            "id": food.id,
            "name": food.name,
            "price": food.price,
            "total_ordered": int(
                food.total_ordered
            ),
        }
        for food in popular_foods
    ]


# GET ONE FOOD BY ID
@router.get(
    "/{food_id}",
    response_model=FoodResponse
)
def get_food(
    food_id: int,
    db: Session = Depends(get_db)
):
    food = db.query(Food).filter(
        Food.id == food_id
    ).first()

    if not food:
        raise HTTPException(
            status_code=404,
            detail="Food not found"
        )

    return food


# UPDATE FOOD
@router.put(
    "/{food_id}",
    response_model=FoodResponse
)
def update_food(
    food_id: int,
    food_data: FoodUpdate,
    db: Session = Depends(get_db)
):
    food = db.query(Food).filter(
        Food.id == food_id
    ).first()

    if not food:
        raise HTTPException(
            status_code=404,
            detail="Food not found"
        )

    update_data = food_data.model_dump(
        exclude_unset=True
    )

    # If category is changed,
    # check whether category exists
    if "category_id" in update_data:
        category = db.query(Category).filter(
            Category.id ==
            update_data["category_id"]
        ).first()

        if not category:
            raise HTTPException(
                status_code=404,
                detail="Category not found"
            )

    for key, value in update_data.items():
        setattr(food, key, value)

    db.commit()
    db.refresh(food)

    return food


# DELETE FOOD
@router.delete("/{food_id}")
def delete_food(
    food_id: int,
    db: Session = Depends(get_db)
):
    food = db.query(Food).filter(
        Food.id == food_id
    ).first()

    if not food:
        raise HTTPException(
            status_code=404,
            detail="Food not found"
        )

    db.delete(food)
    db.commit()

    return {
        "message": "Food deleted successfully"
    }