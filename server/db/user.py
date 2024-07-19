from sqlalchemy import Column, Integer, String

from db import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    subscription_id = Column(String)
    plan = Column(String)
