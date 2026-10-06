from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer import Customer
from app.models.food import Food
from app.models.order import Order
from app.models.order_item import OrderItem
from app.schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderStatusUpdate,
)


router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


@router.post("/", response_model=OrderResponse, status_code=201)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(
        Customer.id == order_data.customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    if not order_data.items:
        raise HTTPException(
            status_code=400,
            detail="Order must contain at least one item"
        )

    new_order = Order(
        customer_id=order_data.customer_id,
        total_amount=0,
        status="Pending"
    )

    db.add(new_order)
    db.flush()

    total_amount = 0

    for item_data in order_data.items:

        food = db.query(Food).filter(
            Food.id == item_data.food_id
        ).first()

        if not food:
            db.rollback()

            raise HTTPException(
                status_code=404,
                detail=f"Food {item_data.food_id} not found"
            )

        if not food.is_available:
            db.rollback()

            raise HTTPException(
                status_code=400,
                detail=f"{food.name} is unavailable"
            )

        unit_price = food.price

        subtotal = unit_price * item_data.quantity

        total_amount += subtotal

        order_item = OrderItem(
            order_id=new_order.id,
            food_id=food.id,
            quantity=item_data.quantity,
            unit_price=unit_price,
            subtotal=subtotal
        )

        db.add(order_item)

    new_order.total_amount = total_amount

    db.commit()
    db.refresh(new_order)

    return new_order


@router.get("/", response_model=list[OrderResponse])
def get_orders(
    db: Session = Depends(get_db)
):
    return db.query(Order).all()


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    return order


@router.get(
    "/customer/{customer_id}",
    response_model=list[OrderResponse]
)
def get_customer_orders(
    customer_id: int,
    db: Session = Depends(get_db)
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    return db.query(Order).filter(
        Order.customer_id == customer_id
    ).all()


@router.patch(
    "/{order_id}/status",
    response_model=OrderResponse
)
def update_order_status(
    order_id: int,
    status_data: OrderStatusUpdate,
    db: Session = Depends(get_db)
):
    allowed_statuses = [
        "Pending",
        "Confirmed",
        "Preparing",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
    ]

    if status_data.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid order status"
        )

    order = db.query(Order).filter(
        Order.id == order_id
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    order.status = status_data.status

    db.commit()
    db.refresh(order)

    return order