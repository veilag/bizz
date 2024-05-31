from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message, InlineKeyboardButton, WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder
from fastapi import FastAPI

from src.bot.service import get_user
from src.database.deps import get_session
from src.routers.message.service import save_message
from src.service.assistant import AssistantManager
from src.service.socket import WebSocketManager
from asyncio import get_event_loop

router = Router()


@router.message(Command("start"))
async def handle_start_message(message: Message, external_url: str):
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(
            text="Открыть мини-приложение",
            web_app=WebAppInfo(url=f"{external_url}/webapp")
        )
    )

    await message.answer(
        text="Добро пожаловать!",
        reply_markup=builder.as_markup()
    )


@router.message()
async def handle_user_message(message: Message, app: FastAPI, external_url: str):
    async for session in get_session():
        user = await get_user(
            session=session,
            telegram_id=str(message.from_user.id)
        )

        if not user:
            builder = InlineKeyboardBuilder()
            builder.row(
                InlineKeyboardButton(
                    text="Открыть мини-приложение",
                    web_app=WebAppInfo(url=f"{external_url}/webapp")
                )
            )

            await message.answer(
                text="Кажется, вы еще не привязали свой аккаунт",
                reply_markup=builder.as_markup()
            )

            return

        assistant_manager: AssistantManager = app.queue_manager
        socket_manager: WebSocketManager = app.socket_manager

        new_message = save_message(
            session=session,
            content=message.text,
            query_id=user.selected_query_id,

            assistant_id=user.selected_assistant_id,
            user_id=user.id,
            from_telegram=True
        )

        await session.commit()

        task_payload = {
            "event": "ASSISTANT_MESSAGE_TRIGGER",
            "payload": {
                "user_id": user.id,
                "from_telegram": True,
                "query_id": user.selected_query_id,
                "assistant_id": user.selected_assistant_id,
                "content": message.text,
                "forwarded_id": new_message.id
            }
        }

        await socket_manager.send_to_user(
            user_id=user.id,
            event="USER_MESSAGE",
            payload={
                "id": new_message.id,
                "content": message.text,
                "queryID": user.selected_query_id,
                "assistantID": user.selected_assistant_id,
                "isWidget": new_message.is_widget,
                "isWidgetClosed": new_message.is_widget_closed,
                "userID": new_message.user_id,
                "forwardedID": new_message.forwarded_id,
                "createdAt": new_message.created_at.isoformat(),
                "fromTelegram": True
            }
        )

        loop = get_event_loop()
        loop.create_task(assistant_manager.process_assistant(task_payload))
