from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import User, BusinessQuery


async def get_user(session: AsyncSession, telegram_id: str) -> User:
    return (
        await session.execute(
            select(User)
            .where(User.telegram_id == telegram_id)
        )
    ).scalars().one()


async def get_business_list_by_telegram_id(session: AsyncSession, telegram_id: str) -> Sequence[BusinessQuery]:
    user = await get_user(session, telegram_id)
    return (
        await session.execute(
            select(BusinessQuery)
            .where(BusinessQuery.user_id == user.id)
        )
    ).scalars().all()


async def get_business_by_id(session: AsyncSession, business_id: int) -> BusinessQuery:
    return (
        await session.execute(
            select(BusinessQuery)
            .where(BusinessQuery.id == business_id)
        )
    ).scalars().one()
