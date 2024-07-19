from sqlalchemy import Column, Integer, String

from db import Base

class Offer(Base):
    __tablename__ = 'offers'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=False)
    offer_name = Column(String)
    offer_description = Column(String)
    offer_email = Column(String)
    price = Column(Integer) # smallest unit, US cent
