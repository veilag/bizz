from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import User, UserAssistant
from src.utils import get_hashed_password


async def get_user_by_name(session: AsyncSession, username: str) -> User | None:
    return (
        await session.execute(
            select(User)
            .where(User.username == username)
        )
    ).scalars().one_or_none()


async def get_user_by_id(session: AsyncSession, id: int) -> User | None:
    return (
        await session.execute(
            select(User)
            .where(User.id == id)
        )
    ).scalars().one_or_none()


async def get_user_by_telegram_id(session: AsyncSession, telegram_id: str) -> User | None:
    return (
        await session.execute(
            select(User)
            .where(User.telegram_id == telegram_id)
        )
    ).scalars().one_or_none()


async def add_system_assistants_to_user(session:AsyncSession, user_id: int) -> None:
    session.add(UserAssistant(
        user_id=user_id,
        assistant_id=1
    ))

    session.add(UserAssistant(
        user_id=user_id,
        assistant_id=2
    ))

    await session.commit()


async def update_user_telegram(session: AsyncSession, user_id: int, telegram_id: str) -> None:
    await session.execute(
        update(User)
        .where(User.id == user_id)
        .values(telegram_id=telegram_id)
    )


def add_user(session: AsyncSession, username: str, raw_password: str, email: str) -> User:
    new_user = User(
        username=username,
        password=get_hashed_password(raw_password),
        email=email
    )

    session.add(new_user)
    return new_user
