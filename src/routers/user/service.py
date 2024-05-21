from sqlalchemy import update, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import User


async def get_user_by_name(session: AsyncSession, username: str) -> User | None:
    result = await session.execute(
        select(User)
        .where(User.username == username)
    )

    return result.scalars().one_or_none()


async def share_access(session: AsyncSession, username: str):
    await session.execute(
        update(User)
        .where(User.username == username)
        .values({
            "is_developer": True
        })
    )
