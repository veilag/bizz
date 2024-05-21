from typing import Dict, Any
from pydantic import BaseModel, Field


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    is_developer: bool = Field(serialization_alias="isDeveloper", validation_alias="is_developer")
    selected_query_id: int | None = Field(serialization_alias="selectedQueryID", validation_alias="selected_query_id")
    selected_assistant_id: int | None = Field(serialization_alias="selectedAssistantID", validation_alias="selected_assistant_id")


class UserAuth(BaseModel):
    username: str
    email: str
    password: str


class TokenSchema(BaseModel):
    accessToken: str
    refreshToken: str


class RefreshSchema(BaseModel):
    refreshToken: str


class TokenPayload(BaseModel):
    exp: float
    payload: Dict[str, int]


class TelegramUnsafeAuth(BaseModel):
    telegramAuth: str


class TelegramAuth(BaseModel):
    connectionId: str
    telegramAuth: str
