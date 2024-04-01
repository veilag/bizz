import asyncio
from asyncio import Queue
from typing import Dict, Any, Optional, Union, List
from uuid import UUID

from langchain.chat_models.gigachat import GigaChat
from langchain_core.callbacks import AsyncCallbackHandler
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.outputs import LLMResult, GenerationChunk, ChatGenerationChunk
from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.deps import get_session
from src.models import BusinessQuery, Message
from src.service.socket import WebSocketManager


class MyCustomAsyncHandler(AsyncCallbackHandler):
    def __init__(self, socket_manager: WebSocketManager, payload: Dict[str, Any], new_assistant_message: Message):
        self.socket_manager = socket_manager
        self.payload = payload
        self.new_assistant_message = new_assistant_message

    async def on_llm_new_token(
        self,
        token: str,
        *,
        chunk: Optional[Union[GenerationChunk, ChatGenerationChunk]] = None,
        run_id: UUID,
        parent_run_id: Optional[UUID] = None,
        tags: Optional[List[str]] = None,
        **kwargs: Any,
    ) -> None:
        await self.socket_manager.send_to_user(
            user_id=self.payload.get("payload").get("user_id"),
            event="MESSAGE_UPDATE",
            payload={
                "messageGroupID": self.new_assistant_message.message_group_id,
                "messageID": self.new_assistant_message.id,
                "content_update": token
            }
        )

    async def on_llm_end(
        self,
        response: LLMResult,
        *,
        run_id: UUID,
        parent_run_id: Optional[UUID] = None,
        tags: Optional[List[str]] = None,
        **kwargs: Any,
    ) -> None:
        async for session in get_session():
            await session.execute(
                update(Message)
                .where(Message.id == self.new_assistant_message.id)
                .values(content=response.generations[0][0].text)
            )

            await session.commit()


class QueueManager:
    def __init__(self, socket_manager: WebSocketManager):
        self.socket_manager = socket_manager
        self.queue = Queue()

    async def add_to_queue(self, task_payload: Dict[str, Any]):
        await self.queue.put(task_payload)

    async def process_queue(self):
        while True:
            payload: Dict = await self.queue.get()

            match payload.get("event"):
                case "GENERATION":
                    async for session in get_session():
                        await session.execute(
                            update(BusinessQuery)
                            .where(BusinessQuery.id == payload.get("payload").get("query").id)
                            .values(status="GENERATION")
                        )

                        await session.commit()

                        await self.socket_manager.send_to_user(
                            user_id=int(payload.get("payload").get("user_id")),
                            event="PLAN_GENERATION_UPDATE",
                            payload={
                                "id": payload.get("payload").get("query").id,
                                "status": "GENERATION"
                            }
                        )

                    await asyncio.sleep(5)

                    async for session in get_session():
                        await session.execute(
                            update(BusinessQuery)
                            .where(BusinessQuery.id == payload.get("payload").get("query").id)
                            .values(status="GENERATED")
                        )

                        await session.commit()

                        await self.socket_manager.send_to_user(
                            user_id=int(payload.get("payload").get("user_id")),
                            event="PLAN_GENERATION_UPDATE",
                            payload={
                                "id": payload.get("payload").get("query").id,
                                "status": "GENERATED"
                            }
                        )

                case "MESSAGE_GENERATION":
                    new_assistant_message = Message(
                        content="",
                        message_group_id=payload.get("payload").get("message_group_id"),
                        forwarded_id=payload.get("payload").get("forwarded_id"),
                        from_telegram=False
                    )

                    async for session in get_session():
                        session.add(new_assistant_message)
                        await session.commit()

                        await self.socket_manager.send_to_user(
                            user_id=payload.get("payload").get("user_id"),
                            event="NEW_MESSAGE",
                            payload={
                                "id": new_assistant_message.id,
                                "content": new_assistant_message.content,
                                "messageGroupID": new_assistant_message.message_group_id,
                                "userID": new_assistant_message.user_id,
                                "forwardedID": new_assistant_message.forwarded_id,
                                "createdAt": new_assistant_message.created_at.isoformat(),
                                "fromTelegram": False
                            }
                        )

                        messages = [
                            SystemMessage(
                                content="Ты, бот, который помогает людям открывать бизнес"
                            ),
                            HumanMessage(
                                content=payload.get("payload").get("content")
                            )
                        ]

                        chat = GigaChat(
                            credentials="MGEzY2I3YTktYzRkMy00M2U5LThmMjEtZTg5ZWNiNWNlNjYyOmNiNzRmNTdjLWE4MTAtNDU0ZS1iYzY1LTdhYzQxM2MyZGY0Mw==",
                            verify_ssl_certs=False,
                            streaming=True,
                            callbacks=[MyCustomAsyncHandler(self.socket_manager, payload, new_assistant_message)]
                        )

                        await chat.agenerate([messages])
