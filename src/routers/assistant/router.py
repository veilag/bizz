from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.deps import get_session
from src.models import User
from src.routers.assistant.schemas import AssistantSchema, AssistantResponse
from src.routers.auth.deps import current_user
from src.routers.assistant import service

router = APIRouter(
    prefix="/assistants",
    tags=["assistants"]
)


@router.get("", response_model=list[AssistantResponse])
async def get_all_assistants(
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    all_assistants = await service.get_all_assistants(session)
    return all_assistants


@router.get("/user", response_model=list[AssistantResponse])
async def get_user_assistants(
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    user_assistants = await service.get_user_assistants(
        session=session,
        user_id=user.id
    )

    return user_assistants


@router.get("/{assistant_id}", response_model=AssistantResponse)
async def get_assistant_by_id(
        assistant_id: int,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    assistant = await service.get_assistant_by_id(
        session=session,
        assistant_id=assistant_id
    )

    return assistant


@router.post("/add", response_model=AssistantResponse)
async def add_new_assistant(
        assistant: AssistantSchema,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    if not user.is_developer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Вы не являетесь разработчиком"
        )

    assistant_in_db = await service.get_assistant_by_name(
        session=session,
        name=assistant.name
    )

    if assistant_in_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ассистент с таким коротким именем уже существует"
        )

    new_assistant = service.add_new_assistant(
        session=session,
        name=assistant.name,
        username=assistant.username,
        is_data_accessible=assistant.isDataAccessible,
        description=assistant.description,
        created_by=user.id,
        code=assistant.code
    )

    await session.commit()
    return new_assistant


@router.delete("/remove/{assistant_id}")
async def delete_assistant(
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


@router.patch("/edit/{assistant_id}", response_model=AssistantResponse)
async def update_assistant_credentials(
        assistant_id: int,
        data: AssistantSchema,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    if not user.is_developer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Вы не являетесь разработчиком"
        )

    assistant = await service.get_assistant_by_id(
        session=session,
        assistant_id=assistant_id
    )

    assistant.name = data.name
    assistant.description = data.description
    assistant.is_data_accessible = data.isDataAccessible
    assistant.code = data.code

    await session.commit()

    return assistant


@router.post("/user/add/{assistant_id}")
async def add_assistant_to_user_list(
        assistant_id: int,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    service.add_assistant_to_user(
        session=session,
        user_id=user.id,
        assistant_id=assistant_id
    )

    await session.commit()

    return {
        "message": "Ассистент добавлен в список пользователя"
    }


@router.delete("/user/remove/{assistant_id}")
async def remove_assistant_from_user_list(
        assistant_id: int,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    if assistant_id == 1 or assistant_id == 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Вы не можете убрать системного ассистента"
        )

    await service.remove_assistant_from_user(
        session=session,
        user_id=user.id,
        assistant_id=assistant_id
    )

    await session.commit()
    return {
        "message": "Ассистент успешно удален из списка пользователя"
    }
