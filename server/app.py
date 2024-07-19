import hashlib
import uuid

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from db.offer import Offer
from db.user import User
from db import engine
from utils.analytics import analytics  # use for analytics instrumentation

app = FastAPI()

# Define a Pydantic model for the input data
class SignupData(BaseModel):
    email: str
    password: str

class OfferCreate(BaseModel):
    user_id: str
    offer_name: str
    offer_description: str
    offer_email: str
    price: int

@app.get("/health")
async def version():
    return {"server_running": True}

@app.post("/api/signup", response_model=dict)
async def signup(data: SignupData):
    # Validate email and password
    if not is_valid_email(data.email) or not data.password:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Generate a unique user ID since user emails can change
    user_id = str(uuid.uuid4())

    # Generate a unique subscription ID (UUID)
    subscription_id = str(uuid.uuid4())

    with Session(engine) as session:  # type: ignore
        db_user = User(
            user_id=user_id, email=data.email, hashed_password=hash_password(data.password), subscription_id=subscription_id, plan="free"
        )
        session.add(db_user)
        session.commit()
        session.refresh(db_user)

    # After user signs up
    analytics.track(
        event_name="user-signed-up",
        event_properties={
            "email": data.email,
            "subscription_id": db_user.subscription_id,
            "plan": db_user.plan,
        },
    )

    return {"user_id": db_user.user_id, "subscription_id": db_user.subscription_id, "plan": db_user.plan}

@app.patch("/api/subscriptions/{subscription_id}", response_model=dict)
async def update_subscription(subscription_id: str, data: dict):
    # Find the user with the provided subscription_id
    user = next(find_user_by(subscription_id, "subscription_id"))
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    with Session(engine) as session:  # type: ignore
        # Update the user's plan with the new value from the request
        previous_plan = user.plan
        user.plan = data.get("plan", previous_plan)

        session.commit()

    # After user updates subscription
    analytics.track(
        event_name="subscription-upgraded",
        event_properties={
            "previous_plan": previous_plan,
            "plan": user.plan,
        },
    )

    return {"subscription_id": user.subscription_id, "previous_plan": previous_plan, "plan": user.plan }

@app.post("/api/login", response_model=dict)
async def login(data: SignupData):
    user = next(find_user_by(data.email, "email"))
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify the user's password
    if verify_password(data.password, user.hashed_password):
        # After user logs in successfully
        analytics.track(
            event_name="user-logged-in",
            event_properties={
                "email": data.email,
                "subscription_id": user.subscription_id,
                "plan": user.plan,
            },
        )
        return {"subscription_id": user.subscription_id, "plan": user.plan}
    else:
        raise HTTPException(status_code=401, detail="Invalid password")
    
@app.post("/api/offers", response_model=dict)
async def create_offer(offer_data: OfferCreate):
    # Create the offer in the database

    with Session(engine) as session:
        offer = Offer(
            user_id=offer_data.user_id,
            offer_name=offer_data.offer_name,
            offer_description=offer_data.offer_description,
            offer_email=offer_data.offer_email,
            price=offer_data.price
        )
        session.add(offer)
        session.commit()
        session.refresh(offer)


    analytics.track("offer-created", {
        "user_id": offer_data.user_id,
        "offer_name": offer_data.offer_name,
        "offer_description": offer_data.offer_description,
        "offer_email": offer_data.offer_email,
        "price": offer_data.price
    })

    return {
        "offer_name": offer_data.offer_name,
        "offer_description": offer_data.offer_description,
        "offer_email": offer_data.offer_email,
        "price": offer_data.price
    }


def is_valid_email(email: str):
    # crude email validator
    return "@" in email and "." in email

def hash_password(password):
    # Hash the password using SHA-256
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password, hashed_password):
    # Verify the user's password by hashing the input and comparing it to the stored hash
    return hash_password(plain_password) == hashed_password

def find_user_by(search_val, key="email"):
    with Session(engine) as session:  # type: ignore
        user = session.query(User).filter_by(**{key: search_val}).first()

        yield user or None
