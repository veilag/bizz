from typing import Callable, Dict, Any, Awaitable

from aiogram import BaseMiddleware
from aiogram.types import Message
from fastapi import FastAPI


class Data(BaseMiddleware):
    def __init__(self, url: str, app: FastAPI):
        self.url = url
        self.app = app

    async def __call__(
        self,
        handler: Callable[[Message, Dict[str, Any]], Awaitable[Any]],
        event: Message,
        data: Dict[str, Any]
    ) -> Any:
        data['external_url'] = self.url
        data["app"] = self.app

        return await handler(event, data)
