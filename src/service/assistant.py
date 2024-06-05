import json
from typing import Dict, Any
from langchain.chat_models.gigachat import GigaChat
from openai import OpenAI
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.config import cfg
from src.database.deps import get_session
from src.models import Message, Assistant, BusinessAssistantData
from src.service.socket import WebSocketManager
from jinja2 import Environment, BaseLoader
from src.service.response import Response
from src.service.registrator import Registrator

import src.service.shared as shared


def render(html_string: str, context: Dict[str, Any]):
    template = Environment(loader=BaseLoader()).from_string(html_string)
    render_string = template.render(**context)
    return render_string


def generate(ai_type: str, messages: list):
    if ai_type == "gigachat":
        chat = GigaChat(
            credentials=cfg.ai_key,
            verify_ssl_certs=False,
        )

        return chat(messages).content

    if ai_type == "gpt":
        client = OpenAI(
            api_key=cfg.gpt_ai_key,
            base_url="https://api.proxyapi.ru/openai/v1"
        )

        chat_completion = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=messages
        )

        return chat_completion.choices[0].message.content


async def get(session: AsyncSession, assistant_name: str, query_id: int):
    assistant = (
        await session.execute(
            select(Assistant).where(Assistant.username == assistant_name)
        )
    ).scalars().one_or_none()

    if not assistant or not assistant.is_data_accessible:
        return None

    data = (
        await session.execute(
            select(BusinessAssistantData)
            .where(BusinessAssistantData.assistant_id == assistant.id, BusinessAssistantData.query_id == query_id)
        )
    ).scalars().one_or_none()

    return json.loads(data.string_data) if data else None


class AssistantManager:
    def __init__(self, socket_manager: WebSocketManager):
        self.socket_manager = socket_manager

    async def process_assistant(self, message: Dict[str, Any]):
        if message.get("event") == "ASSISTANT_MESSAGE_TRIGGER":
            await self.handle_assistant(message.get("payload"), "MESSAGE")

        elif message.get("event") == "ASSISTANT_CALLBACK_TRIGGER":
            await self.handle_assistant(message.get("payload"), "CALLBACK")

    async def create_assistant_query_storage(self, session: AsyncSession, assistant_id: int, query_id: int):
        store = BusinessAssistantData(
            assistant_id=assistant_id,
            query_id=query_id
        )

        session.add(store)
        await session.commit()

    async def check_assistant_storage(self, session: AsyncSession, assistant_id: int, query_id: int):
        result = await session.execute(
            select(BusinessAssistantData)
            .where(BusinessAssistantData.assistant_id == assistant_id, BusinessAssistantData.query_id == query_id)
        )

        store = result.scalars().one_or_none()

        if not store:
            await self.create_assistant_query_storage(session, assistant_id, query_id)
            return {}

        return json.loads(store.string_data)

    async def handle_user_message(self, payload: Dict[str, Any]):
        new_assistant_message = Message(
            content="",
            assistant_id=payload.get("assistant_id"),
            query_id=payload.get("query_id"),
            forwarded_id=payload.get("forwarded_id"),
            from_telegram=False
        )

        async for session in get_session():
            assistant_store = await self.check_assistant_storage(session, payload.get("assistant_id"), payload.get("query_id"))
            session.add(new_assistant_message)
            await session.commit()

            assistant_query = await session.execute(
                select(Assistant)
                .where(Assistant.id == payload.get("assistant_id"))
            )

            assistant = assistant_query.scalars().one()
            assistant_business_data_query = await session.execute(
                select(BusinessAssistantData)
                .where(BusinessAssistantData.query_id == payload.get("query_id"), BusinessAssistantData.assistant_id == payload.get("assistant_id"))
            )
            assistant_business_data = assistant_business_data_query.scalars().one()

            await self.socket_manager.send_to_user(
                user_id=payload.get("user_id"),
                event="NEW_MESSAGE",
                payload={
                    "id": new_assistant_message.id,
                    "content": "Загрузка...",
                    "queryID": new_assistant_message.query_id,
                    "assistantID": payload.get("assistant_id"),
                    "is_widget": False,
                    "assistantName": assistant.name,
                    "userID": new_assistant_message.user_id,
                    "forwardedID": new_assistant_message.forwarded_id,
                    "createdAt": new_assistant_message.created_at.isoformat(),
                    "fromTelegram": False
                }
            )

            assistant_locals = {}

            data = {
                "message": {
                    "text": payload.get("content")
                },
                "user": {
                    "id": payload.get("user_id")
                },
                "query": {
                    "id": payload.get("query_id")
                },
                "store": assistant_store
            }

            widget_messages_query = await session.execute(
                select(Message)
                .where(
                    Message.assistant_id == payload.get("assistant_id"),
                    Message.query_id == new_assistant_message.query_id,
                    Message.is_widget == True,
                    Message.is_widget_closed == False
                ),
            )

            last_widget: Message = widget_messages_query.scalars().one_or_none()

            if last_widget:
                last_widget.is_widget_closed = True

                await session.commit()
                await self.socket_manager.send_to_user(
                    user_id=payload.get("user_id"),
                    event="ASSISTANT_WIDGET_CLOSE",
                    payload={
                        "id": last_widget.id,
                        "queryID": new_assistant_message.query_id,
                        "assistantID": payload.get("assistant_id"),
                    }
                )

            response: Response | None = None
            template: str = ""
            log_error = None

            try:
                exec(assistant.code, globals(), assistant_locals)
                register: Registrator | None = assistant_locals.get("register", None)

                if not register:
                    response = None
                    raise Exception("register is required to register messages and callbacks")

                message_handlers = register.message_handlers
                template_containers = register.template_containers
                templates = register.templates

                is_handler_found = False
                for register_key in message_handlers:
                    if register_key == payload.get("content"):
                        is_handler_found = True
                        handler = message_handlers[register_key]["handler"]

                        response = await handler(data, session, register, payload.get("content"))
                        handler_template_name = response.template_name
                        handler_template = templates[handler_template_name]

                        if not handler_template["container_name"]:
                            template = handler_template["handler"]()

                        else:
                            template_container_name = handler_template["container_name"]
                            container: str = template_containers[template_container_name]()
                            generated_template = handler_template["handler"]()
                            template = container.replace("{template}", generated_template)

                if not is_handler_found:
                    handler = message_handlers.get("*", None)
                    if not handler:
                        return

                    response = await handler["handler"](data, session, register, payload.get("content"))
                    handler_template_name = response.template_name
                    handler_template = templates[handler_template_name]

                    if not handler_template["container_name"]:
                        template = handler_template["handler"]()

                    else:
                        template_container_name = handler_template["container_name"]
                        container: str = template_containers[template_container_name]()
                        generated_template = handler_template["handler"]()
                        template = container.replace("{template}", generated_template)

            except Exception as error:
                log_error = error

            if not response:
                new_assistant_message.content = "error"
                new_assistant_message.is_widget = True
                await session.commit()

                await self.socket_manager.send_to_user(
                    user_id=payload.get("user_id"),
                    event="ASSISTANT_MESSAGE_UPDATE",
                    payload={
                        "queryID": new_assistant_message.query_id,
                        "messageID": new_assistant_message.id,
                        "isWidget": True,
                        "contentUpdate": "error",
                        "plainContentUpdate": "error",
                        "logs": repr(log_error)
                    }
                )

                return

            update_data = response.update_data

            is_widget = response.is_widget
            new_assistant_message.is_widget = is_widget

            try:
                if update_data:
                    assistant_business_data.string_data = json.dumps(update_data)
                    rendered_template = render(template, update_data)
                    new_assistant_message.content = rendered_template

                else:
                    rendered_template = render(template, assistant_store)

            except Exception as error:
                log_error = error

                new_assistant_message.content = "error"
                new_assistant_message.is_widget = True
                await session.commit()

                await self.socket_manager.send_to_user(
                    user_id=payload.get("user_id"),
                    event="ASSISTANT_MESSAGE_UPDATE",
                    payload={
                        "queryID": new_assistant_message.query_id,
                        "messageID": new_assistant_message.id,
                        "isWidget": True,
                        "contentUpdate": "error",
                        "plainContentUpdate": "error",
                        "logs": repr(log_error)
                    }
                )

                return

            message_update_payload = {
                "queryID": new_assistant_message.query_id,
                "messageID": new_assistant_message.id,
                "isWidget": is_widget,
                "contentUpdate": rendered_template,
                "plainContentUpdate": response.plain
            }

            if response.logs:
                message_update_payload["logs"] = response.logs

            await self.socket_manager.send_to_user(
                user_id=payload.get("user_id"),
                event="ASSISTANT_MESSAGE_UPDATE",
                payload=message_update_payload
            )

            await session.commit()
            del register

    async def handle_user_callback(self, payload: Dict[str, Any]):
        async for session in get_session():
            assistant_store = await self.check_assistant_storage(session, payload.get("assistant_id"), payload.get("query_id"))
            assistant_query = await session.execute(
                select(Assistant)
                .where(Assistant.id == payload.get("assistant_id"))
            )

            assistant_message_query = await session.execute(
                select(Message)
                .where(Message.id == payload.get("message_id"))
            )
            assistant_message = assistant_message_query.scalars().one()

            assistant = assistant_query.scalars().one()
            assistant_business_data_query = await session.execute(
                select(BusinessAssistantData)
                .where(BusinessAssistantData.query_id == payload.get("query_id"), BusinessAssistantData.assistant_id == payload.get("assistant_id"))
            )

            assistant_business_data = assistant_business_data_query.scalars().one()
            assistant_locals = {}

            data = {
                "callback": {
                    "data": payload.get("callback_data"),
                    "fetchers": json.loads(payload.get("fetchers_data"))
                },
                "user": {
                    "id": payload.get("user_id")
                },
                "store": assistant_store
            }

            response: Response | None = None
            log_error = None
            template = ""

            await self.socket_manager.send_to_user(
                user_id=payload.get("user_id"),
                event="ASSISTANT_MESSAGE_UPDATE",
                payload={
                    "queryID": assistant_message.query_id,
                    "messageID": assistant_message.id,
                    "status": "LOADING",
                }
            )

            try:
                exec(assistant.code, globals(), assistant_locals)
                register: Registrator | None = assistant_locals.get("register", None)

                if not register:
                    response = None
                    raise Exception("register is required to register messages and callbacks")

                callback_handlers = register.callback_handlers
                template_containers = register.template_containers
                templates = register.templates

                for register_key in callback_handlers:
                    if register_key in payload.get("callback_data"):
                        handler = callback_handlers[register_key]["handler"]

                        print(handler)
                        response = await handler(data, session, register, payload.get("callback_data"))
                        handler_template_name = response.template_name
                        handler_template = templates[handler_template_name]

                        if not handler_template["container_name"]:
                            template = handler_template["handler"]()

                        else:
                            template_container_name = handler_template["container_name"]
                            container: str = template_containers[template_container_name]()
                            generated_template = handler_template["handler"]()
                            template = container.replace("{template}", generated_template)

            except Exception as error:
                log_error = error

            if not response:
                assistant_message.content = "error"
                assistant_message.is_widget = True
                await session.commit()

                await self.socket_manager.send_to_user(
                    user_id=payload.get("user_id"),
                    event="ASSISTANT_MESSAGE_UPDATE",
                    payload={
                        "queryID": assistant_message.query_id,
                        "messageID": assistant_message.id,
                        "isWidget": True,
                        "status": "RESPONSE",
                        "contentUpdate": "error",
                        "plainContentUpdate": "error",
                        "logs": repr(log_error)
                    }
                )

                return

            update_data = response.update_data

            is_widget = response.is_widget
            assistant_message.is_widget = is_widget

            try:
                if update_data:
                    assistant_business_data.string_data = json.dumps(update_data)
                    rendered_template = render(template, update_data)
                    assistant.content = rendered_template

                else:
                    rendered_template = render(template, assistant_store)

            except Exception as error:
                log_error = error

                assistant_message.content = "error"
                assistant_message.is_widget = True
                await session.commit()

                await self.socket_manager.send_to_user(
                    user_id=payload.get("user_id"),
                    event="ASSISTANT_MESSAGE_UPDATE",
                    payload={
                        "queryID": assistant_message.query_id,
                        "messageID": assistant_message.id,
                        "isWidget": True,
                        "status": "RESPONSE",
                        "contentUpdate": "error",
                        "plainContentUpdate": "error",
                        "logs": repr(log_error)
                    }
                )

                return

            assistant_message.content = rendered_template

            is_widget = response.is_widget
            assistant_message.is_widget = is_widget

            message_update_payload = {
                "queryID": assistant_message.query_id,
                "messageID": assistant_message.id,
                "isWidget": is_widget,
                "contentUpdate": rendered_template
            }

            if response.logs:
                message_update_payload["logs"] = response.logs

            await self.socket_manager.send_to_user(
                user_id=payload.get("user_id"),
                event="ASSISTANT_MESSAGE_UPDATE",
                payload=message_update_payload
            )

            await session.commit()

    async def handle_assistant(self, payload: Dict[str, Any], type: str):
        if type == "MESSAGE":
            await self.handle_user_message(payload)
            return

        if type == "CALLBACK":
            await self.handle_user_callback(payload)
