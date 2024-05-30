from typing import Sequence, cast
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from src.models import UserAssistant, Assistant


async def get_assistant_by_id(session: AsyncSession, assistant_id: int) -> Assistant | None:
    return (
        await session.execute(
            select(Assistant)
            .where(Assistant.id == assistant_id)
        )
    ).scalars().one_or_none()


async def get_assistant_by_name(session: AsyncSession, name: str) -> Assistant | None:
    return (
        await session.execute(
            select(Assistant)
            .where(cast("ColumnElement[bool]", Assistant.name == name))
        )
    ).scalars().one_or_none()


async def get_all_assistants(session: AsyncSession) -> Sequence[Assistant]:
    return (
        await session.execute(
            select(Assistant)
        )
    ).scalars().all()


async def get_user_assistants(session: AsyncSession, user_id: int) -> Sequence[Assistant]:
    return (
        await session.execute(
            select(Assistant)
            .join(UserAssistant)
            .filter(cast("ColumnElement[bool]", UserAssistant.user_id == user_id))
        )
    ).scalars().all()


def add_new_assistant(session: AsyncSession, username: str, is_data_accessible: bool, name: str, description: str, created_by: int, code: str) -> Assistant:
    new_assistant = Assistant(
        name=name,
        username=username,
        is_data_accessible=is_data_accessible,
        description=description,
        created_by=created_by,
        code=code
    )

    session.add(new_assistant)
    return new_assistant


def add_assistant_to_user(session: AsyncSession, user_id: int, assistant_id: int) -> UserAssistant:
    new_user_assistant = UserAssistant(
        user_id=user_id,
        assistant_id=assistant_id
    )

    session.add(new_user_assistant)
    return new_user_assistant


async def update_assistant(session: AsyncSession, assistant_id: int, name: str, description: str, code: str) -> None:
    await session.execute(
        update(Assistant)
        .values({
            "name": name,
            "description": description,
            "code": code
        })
        .where(Assistant.id == assistant_id)
    )


async def remove_assistant_from_user(session: AsyncSession, user_id: int, assistant_id: int) -> None:
    user_assistant = await session.execute(
        select(UserAssistant)
        .where(UserAssistant.user_id == user_id, UserAssistant.assistant_id == assistant_id)
    )

    await session.delete(user_assistant.scalars().one())
