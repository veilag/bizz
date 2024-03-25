from typing import Dict, Any
from pydantic import BaseModel


class UserOut(BaseModel):
    username: str
    email: str


class UserAuth(BaseModel):
    username: str
    email: str
    password: str


class TokenSchema(BaseModel):
    accessToken: str
    refreshToken: str


class TokenPayload(BaseModel):
    exp: float
    payload: Dict[str, int]


class TelegramUnsafeAuth(BaseModel):
    telegramAuth: str


class TelegramAuth(BaseModel):
    connectionId: str
    telegramAuth: str
