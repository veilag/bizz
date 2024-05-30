from typing import Sequence

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import BusinessQuery, User


async def get_all_user_business(session: AsyncSession, user_id: int) -> Sequence[BusinessQuery]:
    return (
        await session.execute(
            select(BusinessQuery)
            .where(BusinessQuery.user_id == user_id, BusinessQuery.deleted == False)
        )
    ).scalars().all()


async def get_query_by_id(session: AsyncSession, user_id: int, query_id: int) -> BusinessQuery:
    return (
        await session.execute(
            select(BusinessQuery)
            .where(BusinessQuery.user_id == user_id, BusinessQuery.id == query_id)
        )
    ).scalars().one()


def add_business_query(session: AsyncSession, user_id: int, name: str, description: str) -> BusinessQuery:
    new_business_query = BusinessQuery(
        name=name,
        description=description,
        user_id=user_id
    )

    session.add(new_business_query)
    return new_business_query


async def update_selected_assistant(session: AsyncSession, user_id: int, assistant_id: int | None) -> None:
    await session.execute(
        update(User)
        .values({ "selected_assistant_id": assistant_id })
        .where(User.id == user_id)
    )


async def update_selected_query(session: AsyncSession, user_id: int, query_id: int) -> None:
    await session.execute(
        update(User)
        .values({ "selected_query_id": query_id })
        .where(User.id == user_id)
    )


async def delete_business_query(session: AsyncSession, user_id: int, query_id: int) -> None:
    await session.execute(
        update(BusinessQuery)
        .values({ "deleted": True })
        .where(BusinessQuery.user_id == user_id, BusinessQuery.id == query_id)
    )
