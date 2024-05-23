from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.deps import get_session
from src.models import User
from src.routers.auth.deps import current_user
from src.routers.message.schemas import MessageRequest, CallbackRequest
from src.routers.message import service
from src.service.queue import AssistantManager
from src.service.socket import WebSocketManager

router = APIRouter(
    prefix="/api/message",
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
        query_id=message.queryID,

        assistant_id=message.assistantID,
        user_id=user.id
    )

    await session.commit()
    assistant_manager: AssistantManager = request.app.queue_manager
    socket_manager: WebSocketManager = request.app.socket_manager

    task_payload = {
        "event": "ASSISTANT_MESSAGE_TRIGGER",
        "payload": {
            "user_id": user.id,
            "query_id": message.queryID,
            "assistant_id": message.assistantID,
            "content": message.content,
            "forwarded_id": new_message.id
        }
    }

    await socket_manager.send_to_user(
        session=session,
        user_id=user.id,
        event="USER_MESSAGE",
        payload={
            "id": new_message.id,
            "content": message.content,
            "queryID": message.queryID,
            "assistantID": message.assistantID,
            "isWidget": new_message.is_widget,
            "isWidgetClosed": new_message.is_widget_closed,
            "userID": new_message.user_id,
            "forwardedID": new_message.forwarded_id,
            "createdAt": new_message.created_at.isoformat(),
            "fromTelegram": False
        }
    )

    await assistant_manager.process_assistant(task_payload)
    return {
        "message": "Сообщение пользователя сохранено"
    }


@router.post("/callback")
async def handle_message_callback(
        callback: CallbackRequest,
        request: Request,
        user: User = Depends(current_user)
):
    queue_manager: AssistantManager = request.app.queue_manager

    await queue_manager.process_assistant({
        "event": "ASSISTANT_CALLBACK_TRIGGER",
        "payload": {
            "user_id": user.id,
            "query_id": callback.queryID,
            "message_id": callback.messageID,
            "assistant_id": callback.assistantID,
            "callback_data": callback.callbackData,
            "fetchers_data": callback.fetchersData
        }
    })

    return {
        "message": "Callback handled"
    }


@router.get("/get/{query_id}")
async def get_message_group_messages(
        query_id: int,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    db_message_list = await service.get_query_messages(
        session=session,
        query_id=query_id
    )

    message_list = []

    for message in db_message_list:
        message_list.append({
            "id": message.id,
            "content": message.content,
            "queryID": message.query_id,
            "assistantID": message.assistant_id,
            "isWidget": message.is_widget,
            "isWidgetClosed": message.is_widget_closed,
            "userID": message.user_id,
            "forwardedID": message.forwarded_id,
            "createdAt": message.created_at.isoformat(),
            "fromTelegram": False
        })

    return message_list


@router.get("/clear/{query_id}/{assistant_id}")
async def clear_query_messages(
        query_id: int,
        assistant_id: int,
        session: AsyncSession = Depends(get_session),
        user: User = Depends(current_user)
):
    try:
        await service.clear_query_messages(
            session=session,
            assistant_id=assistant_id,
            query_id=query_id
        )

        await session.commit()

        return {
            "message": "Сообщения удалены"
        }

    except:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="При удалении сообщений произошла ошибка"
        )
