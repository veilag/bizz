from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import User
from src.utils import get_hashed_password


async def get_user(session: AsyncSession, username: str) -> User | None:
    result = await session.execute(select(User).where(User.username == username))
    return result.scalars().one_or_none()


async def get_user_by_id(session: AsyncSession, id: int) -> User:
    result = await session.execute(select(User).where(User.id == id))
    return result.scalars().one()


def add_user(session: AsyncSession, username: str, raw_password: str, email: str) -> User:
    new_user = User(
        username=username,
        password=get_hashed_password(raw_password),
        email=email
    )

    session.add(new_user)
    return new_user
