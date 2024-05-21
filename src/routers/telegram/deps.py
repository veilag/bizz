from aiogram.utils.web_app import safe_parse_webapp_init_data
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.bot import bot
from src.database.deps import get_session
from src.models import User
from src.routers.auth.schemas import TelegramUnsafeAuth
from src.routers.auth.service import get_user_by_telegram_id


async def telegram_user(
    auth_data: TelegramUnsafeAuth,
    session: AsyncSession = Depends(get_session)
) -> User:
    try:
        telegram_data = safe_parse_webapp_init_data(
            token=bot.token,
            init_data=auth_data.telegramAuth
        )

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not parse telegram credentials"
        )

    user = await get_user_by_telegram_id(
        session=session,
        telegram_id=str(telegram_data.user.id)
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Telegram account is not linked to service"
        )

    return user
