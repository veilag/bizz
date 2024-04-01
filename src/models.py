from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, func, Identity
from src.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)

    email = Column(String, nullable=False)
    telegram_id = Column(String, nullable=True, index=True)


class BusinessQuery(Base):
    __tablename__ = "business_queries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    query = Column(String, nullable=False)
    description = Column(String, nullable=True)
    city = Column(String, nullable=False)

    status = Column(String, nullable=False, default="QUEUED")

    user_id = Column(Integer, ForeignKey("users.id"))
    message_group_id = Column(Integer, Identity(start=1, cycle=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=True)

    message_group_id = Column(Integer, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    forwarded_id = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    from_telegram = Column(Boolean, nullable=False, default=False)


class Assistant(Base):
    __tablename__ = "assistants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    created_by = Column(Integer, ForeignKey("users.id"))
    system = Column(Boolean, default=False)
    system_prompt = Column(String, nullable=False)


class UserAssistant(Base):
    __tablename__ = "users_assistants"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    assistant_id = Column(Integer, ForeignKey("assistants.id"))
