from aiogram import Bot, Dispatcher

from src.bot.routers import root_router
from src.config import cfg

bot = Bot(
    token=cfg.telegram_bot_token
)

dispatcher = Dispatcher()
dispatcher.include_router(root_router)