from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, func
from src.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)

    email = Column(String, nullable=False)
    telegram_id = Column(String, nullable=True, index=True)


class BusinessQueries(Base):
    __tablename__ = "business_queries"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String, nullable=False)
    query = Column(String, nullable=False)
    description = Column(String, nullable=True)
    city = Column(String, nullable=False)

    is_generating = Column(Boolean, default=False)
    is_generated = Column(Boolean, default=False)
    is_queued = Column(Boolean, default=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
