from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.database import get_db
from app.models.customer import Customer
from app.schemas.auth import (
    RegisterRequest,
    RegisterResponse,
    TokenResponse,
    CurrentUserResponse
)

from app.security.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================
# REGISTER
# =========================

@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED
)
def register(
    user: RegisterRequest,
    db: Session = Depends(get_db)
):
    existing_customer = (
        db.query(Customer)
        .filter(Customer.email == user.email)
        .first()
    )

    if existing_customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    new_customer = Customer(
        name=user.name,
        email=user.email,
        phone=user.phone,
        address=user.address,
        password_hash=hash_password(user.password),
        role="customer"
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


# =========================
# LOGIN
# =========================

@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    customer = (
        db.query(Customer)
        .filter(Customer.email == form_data.username)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not customer.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="This account does not have a login password"
        )

    if not verify_password(
        form_data.password,
        customer.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        {
            "sub": str(customer.id),
            "role": customer.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": customer.role,
        "customer_id": customer.id,
        "name": customer.name
    }
# =========================
# CURRENT USER
# =========================

@router.get(
    "/me",
    response_model=CurrentUserResponse
)
def get_me(
    current_user: Customer = Depends(get_current_user)
):
    return current_user