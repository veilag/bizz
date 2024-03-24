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
    access_token: str
    refresh_token: str


class TokenPayload(BaseModel):
    exp: float
    payload: Dict[str, int]
