from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.food import Food
from app.models.category import Category
from app.models.customer import Customer
from app.models.order import Order


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db)
):
    total_foods = db.query(Food).count()

    total_categories = db.query(Category).count()

    total_customers = db.query(Customer).count()

    total_orders = db.query(Order).count()

    total_revenue = (
        db.query(
            func.sum(Order.total_amount)
        )
        .filter(
            Order.status != "Cancelled"
        )
        .scalar()
    )

    return {
        "total_foods": total_foods,
        "total_categories": total_categories,
        "total_customers": total_customers,
        "total_orders": total_orders,
        "total_revenue": total_revenue or 0
    }