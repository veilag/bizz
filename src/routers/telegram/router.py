from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.deps import get_session
from src.models import User
from src.routers.business.schemas import SelectionUpdateRequest
from src.routers.business.service import get_all_user_business, update_user_selection
from src.routers.telegram.deps import telegram_user

router = APIRouter(
    prefix="/api/telegram",
    tags=["telegram"]
)


@router.get("/list")
async def get_user_business_list(
    session: AsyncSession = Depends(get_session),
    user: User = Depends(telegram_user)
):
    business_queries = await get_all_user_business(
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


@router.get("/selection")
async def get_user_selection(
    user: User = Depends(telegram_user)
):
    return {
        "queryID": user.selected_query_id,
        "assistantID": user.selected_assistant_id
    }


@router.post("/update/selection")
async def update_telegram_user_selection(
        selections: SelectionUpdateRequest,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(telegram_user)
):
    await update_user_selection(
        session=session,
        user_id=user.id,
        query_id=selections.query_id,
        assistant_id=selections.assistant_id
    )

    await session.commit()
    return {
        "message": "Данные обновлены "
    }
