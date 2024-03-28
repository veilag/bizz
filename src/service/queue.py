import asyncio
from asyncio import Queue
from typing import Dict, Any

from src.service.socket import WebSocketManager


class QueueManager:
    def __init__(self, socket_manager: WebSocketManager):
        self.socket_manager = socket_manager
        self.queue = Queue()

    async def add_to_queue(self, task_payload: Dict[str, Any]):
        await self.queue.put(task_payload)

    async def process_queue(self):
        while True:
            payload: Dict = await self.queue.get()
            await asyncio.sleep(10)

            await self.socket_manager.send_to_user(
                user_id=int(payload.get("payload").get("user_id")),
                event="PLAN_GENERATION_UPDATE",
                payload={
                    "id": payload.get("payload").get("query").id,
                }
            )
