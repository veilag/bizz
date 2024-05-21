from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import User


async def get_user(session: AsyncSession, telegram_id: str) -> User:
    result = await session.execute(
        select(User)
        .where(User.telegram_id == telegram_id)
    )

    return result.scalars().one_or_none()
