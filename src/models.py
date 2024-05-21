from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime, func, Identity
from src.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    password = Column(String, nullable=False)

    email = Column(String, nullable=False)
    telegram_id = Column(String, nullable=True, index=True)

    selected_query_id = Column(Integer, nullable=True)
    selected_assistant_id = Column(Integer, nullable=True)
    is_developer = Column(Boolean, default=False)


class BusinessQuery(Base):
    __tablename__ = "business_queries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    deleted = Column(Boolean, default=False)


class BusinessAssistantData(Base):
    __tablename__ = "business_assistant_datas"

    id = Column(Integer, primary_key=True, index=True)
    assistant_id = Column(Integer, ForeignKey("assistants.id"))
    query_id = Column(Integer, ForeignKey("business_queries.id"))

    string_data = Column(String, default="{}")


class UserAssistantData(Base):
    __tablename__ = "user_assistant_datas"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    assistant_id = Column(Integer, ForeignKey("assistants.id"))
    string_data = Column(String, default="{}")


class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String, nullable=True)

    is_widget = Column(Boolean, default=False)
    is_widget_closed = Column(Boolean, default=False)

    query_id = Column(Integer, ForeignKey("business_queries.id"))
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    assistant_id = Column(Integer, ForeignKey("assistants.id"), nullable=True)
    forwarded_id = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    from_telegram = Column(Boolean, nullable=False, default=False)


class Assistant(Base):
    __tablename__ = "assistants"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(String, nullable=False, unique=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    created_by = Column(Integer, ForeignKey("users.id"))
    code = Column(String, nullable=False)
    is_data_accessible = Column(Boolean, default=False)


class UserAssistant(Base):
    __tablename__ = "users_assistants"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    assistant_id = Column(Integer, ForeignKey("assistants.id"))
