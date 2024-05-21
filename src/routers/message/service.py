from typing import Sequence

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import Message, Assistant


def save_message(session: AsyncSession, content: str, query_id: int, user_id: int, assistant_id: int) -> Message:
    new_message = Message(
        content=content,
        query_id=query_id,

        assistant_id=assistant_id,
        user_id=user_id,
    )

    session.add(new_message)
    return new_message


async def get_query_messages(session: AsyncSession, query_id: int) -> Sequence[Message]:
    result = await session.execute(
        select(Message)
        .order_by(Message.id)
        .where(Message.query_id == query_id)
    )

    return result.scalars().all()


async def get_assistant_by_id(session: AsyncSession, assistant_id: int) -> Assistant:
    result = await session.execute(
        select(Assistant)
        .where(Assistant.id == assistant_id)
    )

    return result.scalars().one()


async def clear_query_messages(session: AsyncSession, assistant_id: int, query_id: int):
    await session.execute(
        delete(Message)
        .where(Message.query_id == query_id, Message.assistant_id == assistant_id)
    )
