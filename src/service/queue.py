from asyncio import Queue
from typing import Dict, Any


class QueueManager:
    def __init__(self):
        self.queue = Queue()

    async def add_to_queue(self, task_payload: Dict[str, Any]):
        await self.queue.put(task_payload)

    async def process_queue(self):
        while True:
            payload = await self.queue.get()
            print(payload)
