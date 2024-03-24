from sqlalchemy import Column, Integer, String

from src.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)

    email = Column(String, nullable=False)
