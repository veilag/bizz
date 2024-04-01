from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.deps import get_session
from src.models import User
from src.routers.auth.deps import current_user
from src.routers.message.schemas import MessageRequest
from src.routers.message import service
from src.service.queue import QueueManager

router = APIRouter(
    prefix="/message",
    tags=["messages"]
)


@router.post("")
async def handle_message(
        message: MessageRequest,
        request: Request,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    new_message = service.save_message(
        session=session,
        content=message.content,
        message_group_id=message.messageGroupID,
        user_id=user.id
    )

    await session.commit()
    queue_manager: QueueManager = request.app.queue_manager

    await queue_manager.add_to_queue({
        "event": "MESSAGE_GENERATION",
        "payload": {
            "user_id": user.id,
            "content": message.content,
            "message_group_id": message.messageGroupID,
            "forwarded_id": new_message.id
        }
    })

    return {
        "id": new_message.id,
        "content": new_message.content,
        "messageGroupID": new_message.message_group_id,
        "userID": new_message.user_id,
        "forwardedID": new_message.forwarded_id,
        "createdAt": new_message.created_at.isoformat(),
        "fromTelegram": False
    }


@router.get("/get/{message_group_id}")
async def get_message_group_messages(
        message_group_id: int,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    db_message_list = await service.get_message_group_messages(
        session=session,
        message_group_id=message_group_id
    )

    message_list = []

    for message in db_message_list:
        message_list.append({
            "id": message.id,
            "content": message.content,
            "messageGroupID": message.message_group_id,
            "userID": message.user_id,
            "forwardedID": message.forwarded_id,
            "createdAt": message.created_at.isoformat(),
            "fromTelegram": False
        })

    return message_list
