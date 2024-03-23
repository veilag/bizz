from typing import Callable, Dict, Any, Awaitable

from aiogram import BaseMiddleware
from aiogram.types import Message


class ExternalURL(BaseMiddleware):
    def __init__(self, url: str):
        self.url = url

    async def __call__(
        self,
        handler: Callable[[Message, Dict[str, Any]], Awaitable[Any]],
        event: Message,
        data: Dict[str, Any]
    ) -> Any:
        data['external_url'] = self.url
        return await handler(event, data)
