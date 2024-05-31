from typing import Sequence

from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import Message, Assistant


def save_message(session: AsyncSession, content: str, query_id: int, user_id: int, assistant_id: int, from_telegram=False) -> Message:
    new_message = Message(
        content=content,
        query_id=query_id,

        assistant_id=assistant_id,
        user_id=user_id,
        from_telegram=from_telegram
    )

    session.add(new_message)
    return new_message


async def get_query_messages(session: AsyncSession, query_id: int) -> Sequence[Message]:
    return (
        await session.execute(
            select(Message)
            .order_by(Message.id)
            .where(Message.query_id == query_id)
        )
    ).scalars().all()


async def get_assistant_by_id(session: AsyncSession, assistant_id: int) -> Assistant:
    return (
        await session.execute(
            select(Assistant)
            .where(Assistant.id == assistant_id)
        )
    ).scalars().one()


async def clear_query_messages(session: AsyncSession, assistant_id: int, query_id: int) -> None:
    await session.execute(
        delete(Message)
        .where(Message.query_id == query_id, Message.assistant_id == assistant_id)
    )
