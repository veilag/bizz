from aiogram import Router
from aiogram.filters import Command
from aiogram.types import Message, InlineKeyboardButton, WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder

router = Router()


@router.message(Command("start"))
async def handle_start_message(message: Message, external_url: str):
    builder = InlineKeyboardBuilder()
    builder.row(
        InlineKeyboardButton(
            text="WebApp",
            web_app=WebAppInfo(url=f"{external_url}/webapp")
        )
    )

    await message.answer(
        text="Start message",
        reply_markup=builder.as_markup()
    )
