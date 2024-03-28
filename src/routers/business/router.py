from fastapi import APIRouter, Request, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.deps import get_session
from src.models import User
from src.routers.auth.deps import current_user
from src.routers.business.schemas import GenerationRequest
from src.routers.business import service
from src.service.queue import QueueManager

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

    new_business_query = service.add_business_query(
        session=session,
        name=data.name,
        description=data.description,
        query=data.query,
        city=data.city,
        user_id=user.id
    )

    await session.commit()

    await queue_manager.add_to_queue({
        "event": "GENERATION",
        "payload": {
            "query": new_business_query,
            "user_id": user.id
        }
    })

    return {
        "id": new_business_query.id,
        "isQueued": new_business_query.is_queued,
        "isGenerating": new_business_query.is_generating,
        "isGenerated": new_business_query.is_generated,

        "name": new_business_query.name,
        "query": new_business_query.query,
        "description": new_business_query.description,
        "city": new_business_query.city,
        "createdAt": new_business_query.created_at.isoformat()
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
    print(business_queries)

    for query in business_queries:
        query_list.append({
            "id": query.id,
            "isQueued": query.is_queued,
            "isGenerating": query.is_generating,
            "isGenerated": query.is_generated,

            "name": query.name,
            "query": query.query,
            "description": query.description,
            "city": query.city,
            "createdAt": query.created_at.isoformat()
        })

    print(query_list)

    return query_list
