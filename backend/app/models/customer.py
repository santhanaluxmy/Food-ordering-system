from sqlalchemy import Column, Integer, String

from app.database import Base


class Customer(Base):
    __tablename__ = "customers"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    email = Column(
        String(150),
        unique=True,
        nullable=False,
        index=True
    )

    phone = Column(
        String(20),
        nullable=False
    )

    address = Column(
        String(255),
        nullable=False
    )

    password_hash = Column(
        String(255),
        nullable=True
    )

    role = Column(
        String(20),
        nullable=False,
        default="customer"
    )