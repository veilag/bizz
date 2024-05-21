from datetime import  datetime
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from jose.jwt import JWTError
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from src.config import cfg
from src.database.deps import get_session
from src.models import User
from src.routers.auth.schemas import TokenPayload
from src.routers.auth.service import get_user_by_id

oauth_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login",
    scheme_name="JWT"
)


async def current_user(
        token: str = Depends(oauth_scheme),
        session: AsyncSession = Depends(get_session)) -> User:

    try:
        payload = jwt.decode(
            token=token,
            key=cfg.jwt_secret_key,
            algorithms=[cfg.hashing_algorithm]
        )

        token_data = TokenPayload(**payload)

        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
                headers={
                    "WWW-Authenticate": "Bearer"
                }
            )

    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    user: User = await get_user_by_id(
        session=session,
        id=token_data.payload["user_id"]
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not find user"
        )

    return user


async def check_user(
        token: str,
        session: AsyncSession) -> User | None:

    try:
        payload = jwt.decode(
            token=token,
            key=cfg.jwt_secret_key,
            algorithms=[cfg.hashing_algorithm]
        )

        token_data = TokenPayload(**payload)

        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            return None

    except (JWTError, ValidationError):
        return None

    user: User = await get_user_by_id(
        session=session,
        id=token_data.payload["user_id"]
    )

    if user is None:
        return None

    return user


async def get_user_from_refresh_token(
        session: AsyncSession,
        refresh_token: str
):
    try:
        payload = jwt.decode(
            token=refresh_token,
            key=cfg.jwt_secret_key,
            algorithms=[cfg.hashing_algorithm]
        )

        token_data = TokenPayload(**payload)

        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            return None

        print(token_data)

    except (JWTError, ValidationError):
        return None
