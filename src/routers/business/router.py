from fastapi import APIRouter, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.deps import get_session
from src.models import User
from src.routers.auth.deps import current_user
from src.routers.business.schemas import GenerationRequest
from src.routers.business import service
from src.service.queue import QueueManager
from src.service.socket import WebSocketManager

router = APIRouter(
    prefix="/business",
    tags=["generations", "business"]
)


@router.post("/generate")
async def handle_business_generation(
        data: GenerationRequest,
        request: Request,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    queue_manager: QueueManager = request.app.queue_manager
    socket_manager: WebSocketManager = request.app.socket_manager

    new_business_query = service.add_business_query(
        session=session,
        name=data.name,
        description=data.description,
        query=data.query,
        city=data.city,
        user_id=user.id
    )

    await session.commit()

    await socket_manager.send_to_user(
        user_id=user.id,
        event="QUERY_CREATED",
        payload={
            "id": new_business_query.id,
            "status": new_business_query.status,

            "name": new_business_query.name,
            "query": new_business_query.query,
            "description": new_business_query.description,
            "city": new_business_query.city,
            "messageGroupID": new_business_query.message_group_id,
            "createdAt": new_business_query.created_at.isoformat()
        }
    )

    await queue_manager.add_to_queue({
        "event": "GENERATION",
        "payload": {
            "query": new_business_query,
            "user_id": user.id
        }
    })

    return {
        "message": "Business query is created"
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
            "status": query.status,

            "name": query.name,
            "query": query.query,
            "description": query.description,
            "city": query.city,
            "createdAt": query.created_at.isoformat(),
            "messageGroupID": query.message_group_id
        })

    return query_list
