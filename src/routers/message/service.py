from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import Message


def save_message(session: AsyncSession, content: str, message_group_id: int, user_id: int) -> Message:
    new_message = Message(
        content=content,
        message_group_id=message_group_id,
        user_id=user_id,
    )

    session.add(new_message)
    return new_message


async def get_message_group_messages(session: AsyncSession, message_group_id: int) -> Sequence[Message]:
    result = await session.execute(
        select(Message)
        .where(Message.message_group_id == message_group_id)
    )

    return result.scalars().all()
