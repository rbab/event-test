from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

engine = create_engine("sqlite:///platform.db")
Base.metadata.create_all(bind=engine)
