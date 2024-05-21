from fastapi import APIRouter, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.deps import get_session
from src.models import User
from src.routers.auth.deps import current_user
from src.routers.business.schemas import GenerationRequest, SelectionQueryRequest, SelectionAssistantRequest
from src.routers.business import service
from src.service.socket import WebSocketManager

router = APIRouter(
    prefix="/business",
    tags=["generations", "business"]
)


@router.post("/create")
async def handle_business_generation(
        data: GenerationRequest,
        request: Request,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    socket_manager: WebSocketManager = request.app.socket_manager

    new_business_query = service.add_business_query(
        session=session,
        name=data.name,
        description=data.description,
        user_id=user.id
    )

    await session.commit()

    await socket_manager.send_to_user(
        session=session,
        user_id=user.id,
        event="BUSINESS_CREATED",
        payload={
            "id": new_business_query.id,
            "name": new_business_query.name,
            "description": new_business_query.description,
            "createdAt": new_business_query.created_at.isoformat()
        }
    )

    return {
        "message": "Бизнес план создан"
    }


@router.get("/delete/{query_id}")
async def delete_business_query(
        query_id: int,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    await service.delete_business_query(
        session=session,
        user_id=user.id,
        query_id=query_id
    )

    await session.commit()
    return {
        "message": "Бизнес план удален"
    }


@router.get("/list")
async def get_user_business_list(
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    business_queries = await service.get_all_user_business(
        session=session,
        user_id=user.id
    )

    query_list = []

    for query in business_queries:
        query_list.append({
            "id": query.id,
            "name": query.name,
            "description": query.description,
            "createdAt": query.created_at.isoformat(),
        })

    return query_list


@router.get("/{query_id}")
async def get_query_by_id(
        query_id: int,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    query = await service.get_query_by_id(
        session=session,
        query_id=query_id,
        user_id=user.id
    )

    return {
        "id": query.id,
        "name": query.name,
        "description": query.description,
        "createdAt": query.created_at.isoformat()
    }


@router.post("/selection/update/query")
async def update_user_selection(
        selections: SelectionQueryRequest,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    await service.update_selected_query(
        session=session,
        user_id=user.id,
        query_id=selections.queryID,
    )

    await session.commit()
    return {
        "message": "Данные обновлены "
    }


@router.post("/selection/update/assistant")
async def update_user_selection(
        selections: SelectionAssistantRequest,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    await service.update_selected_assistant(
        session=session,
        user_id=user.id,
        assistant_id=selections.assistantID,
    )

    await session.commit()
    return {
        "message": "Данные обновлены "
    }
