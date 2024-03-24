from datetime import datetime, timedelta
from typing import Dict, Any
from jose import jwt
from passlib.context import CryptContext
from src.config import cfg

password_context = CryptContext(schemes=["bcrypt"])


def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_context.verify(password, hashed_password)


def create_access_token(payload: Dict[str, Any]) -> str:
    expires_delta = datetime.now() + timedelta(minutes=cfg.access_token_expire_minutes)

    to_encode = {
        "exp": expires_delta,
        "payload": payload
    }

    encoded_jwt_token = jwt.encode(
        claims=to_encode,
        algorithm=cfg.hashing_algorithm,
        key=cfg.jwt_secret_key
    )

    return encoded_jwt_token


def create_refresh_token(payload: Dict[str, Any]) -> str:
    expires_delta = datetime.now() + timedelta(minutes=cfg.refresh_token_expire_minutes)

    to_encode = {
        "exp": expires_delta,
        "payload": payload
    }

    encoded_jwt_token = jwt.encode(
        claims=to_encode,
        algorithm=cfg.hashing_algorithm,
        key=cfg.jwt_refresh_secret_key
    )

    return encoded_jwt_token
