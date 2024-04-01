from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.deps import get_session
from src.models import User
from src.routers.assistant.schemas import AssistantSchema
from src.routers.auth.deps import current_user
from src.routers.assistant import service

router = APIRouter(
    prefix="/assistants",
    tags=["assistants"]
)


@router.get("")
async def get_all_assistants(
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    all_assistants = await service.get_all_assistants(session)
    return all_assistants


@router.post("/add")
async def add_new_assistant(
        assistant: AssistantSchema,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    new_assistant = service.add_new_assistant(
        session=session,
        name=assistant.name,
        description=assistant.description,
        created_by=user.id,
        system_prompt=assistant.systemPrompt
    )

    await session.commit()
    return new_assistant


@router.delete("/remove/{assistant_id}")
async def delete_assistant_from_user(
        assistant_id: int,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    assistant = await service.get_assistant_by_id(
        session=session,
        assistant_id=assistant_id
    )

    if assistant.created_by == user.id:
        await session.delete(assistant)
        await session.commit()
        return {
            "message": "Ассистент успешно удален"
        }

    return {
        "message": "Вы не можете удалить этого ассистента"
    }


@router.get("/user")
async def get_user_assistants(
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    user_assistants = await service.get_user_assistants(
        session=session,
        user_id=user.id
    )

    return user_assistants
