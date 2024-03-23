from aiogram import Router

from src.bot.routers.start import router

root_router = Router()
root_router.include_routers(
    router,
)
