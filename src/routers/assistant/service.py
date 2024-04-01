from typing import Sequence
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models import UserAssistant, Assistant


async def get_assistant_by_id(session: AsyncSession, assistant_id: int) -> Assistant:
    result = await session.execute(
        select(Assistant)
        .where(Assistant.id == assistant_id)
    )

    return result.scalars().one()


async def get_all_assistants(session: AsyncSession) -> Sequence[Assistant]:
    result = await session.execute(
        select(Assistant)
    )

    return result.scalars().all()


async def get_user_assistants(session: AsyncSession, user_id: int) -> Sequence[UserAssistant]:
    result = await session.execute(
        select(UserAssistant)
        .where(UserAssistant.user_id == user_id)
    )

    return result.scalars().all()


def add_new_assistant(session: AsyncSession, name: str, description: str, created_by: int, system_prompt: str) -> Assistant:
    new_assistant = Assistant(
        name=name,
        description=description,
        created_by=created_by,
        system_promp=system_prompt
    )

    session.add(new_assistant)
    return new_assistant

