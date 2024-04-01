from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import BusinessQuery


async def get_all_user_business(session: AsyncSession, user_id: int) -> Sequence[BusinessQuery]:
    result = await session.execute(
        select(BusinessQuery)
        .where(BusinessQuery.user_id == user_id)
    )

    return result.scalars().all()


def add_business_query(session: AsyncSession, user_id: int, name: str, query: str, description: str, city: str) -> BusinessQuery:
    new_business_query = BusinessQuery(
        name=name,
        query=query,
        description=description,
        city=city,
        user_id=user_id
    )

    session.add(new_business_query)
    return new_business_query
