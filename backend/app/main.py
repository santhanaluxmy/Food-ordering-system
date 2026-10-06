from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.models.category import Category
from app.models.food import Food
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem


from app.routers.categories import router as category_router
from app.routers.foods import router as food_router
from app.routers.customers import router as customer_router
from app.routers.orders import router as order_router
from app.routers.dashboard import router as dashboard_router
from app.routers import auth




Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Mandhi Food Ordering API"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(category_router)
app.include_router(food_router)
app.include_router(customer_router)
app.include_router(order_router)
app.include_router(dashboard_router)
app.include_router(auth.router)


@app.get("/")
def root():
    return {
        "message": "Mandhi API is running"
    }