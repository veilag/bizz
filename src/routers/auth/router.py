from aiogram.utils.web_app import safe_parse_webapp_init_data
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.deps import get_session
from src.routers.auth import service
from src.routers.auth.deps import get_user_from_refresh_token
from src.routers.auth.schemas import TokenSchema, UserOut, UserAuth, TelegramAuth, TelegramUnsafeAuth, RefreshSchema
from src.routers.auth.service import get_user_by_name, add_user, update_user_telegram, get_user_by_telegram_id
from src.service.socket import WebSocketManager
from src.utils import verify_password, create_access_token, create_refresh_token
from src.bot import bot

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"]
)


@router.post("/signup", response_model=UserOut, summary="Create new user")
async def handle_user_signup(
        data: UserAuth,
        session: AsyncSession = Depends(get_session)):

    user = await get_user_by_name(session, data.username)

    if user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Пользователь с таким именем уже существует"
        )

    new_user = add_user(
        session=session,
        username=data.username,
        raw_password=data.password,
        email=data.email
    )

    await session.commit()
    await service.add_system_assistants_to_user(session, new_user.id)

    return new_user


@router.post("/login", response_model=TokenSchema, summary="Login user")
async def handle_user_login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        session: AsyncSession = Depends(get_session)):

    user = await get_user_by_name(session, form_data.username)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    if not verify_password(form_data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )

    return {
        "accessToken": create_access_token({
            "user_id": user.id
        }),

        "refreshToken": create_refresh_token({
            "user_id": user.id
        })
    }


@router.post("/refresh")
async def refresh_access_token(
        data: RefreshSchema,
):
    token_data = get_user_from_refresh_token(
        refresh_token=data.refreshToken
    )

    user_id = token_data.get("payload").get("user_id")
    return user_id


@router.post("/login/telegram", summary="Login user via linked Telegram account")
async def handle_user_login_via_telegram(
        request: Request,
        auth_data: TelegramAuth,
        session: AsyncSession = Depends(get_session)):

    socket_manager: WebSocketManager = request.app.socket_manager
    connection_is_valid = socket_manager.validate_connection(auth_data.connectionId)

    if not connection_is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Идентификатор соединения невалидно"
        )

    try:
        telegram_data = safe_parse_webapp_init_data(
            token=bot.token,
            init_data=auth_data.telegramAuth
        )

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Данные Telegram невалидны"
        )

    user = await get_user_by_telegram_id(
        session=session,
        telegram_id=str(telegram_data.user.id)
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Telegram аккаунт не привязан к сервису"
        )

    socket_manager.authorize_connection(
        user_id=user.id,
        connection_id=auth_data.connectionId
    )

    await socket_manager.send_to_user_connection(
        user_id=user.id,
        connection_id=auth_data.connectionId,
        event="ACCESS_TOKEN_ACCEPT",
        payload={
            "data": {
                "accessToken": create_access_token({
                    "user_id": user.id
                }),

                "refreshToken": create_refresh_token({
                    "user_id": user.id
                })
            }
        }
    )

    return {
        "message": "Клиент авторизован"
    }


@router.post("/telegram", include_in_schema=False, summary="Integrate user Telegram account")
async def handle_telegram_integration(
        request: Request,
        auth_data: TelegramAuth,
        session: AsyncSession = Depends(get_session)):

    try:
        telegram_data = safe_parse_webapp_init_data(
            token=bot.token,
            init_data=auth_data.telegramAuth
        )

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Данные Telegram невалидны"
        )

    socket_manager: WebSocketManager = request.app.socket_manager
    connection_user_id: int | None = socket_manager.get_user_id_by_connection_id(auth_data.connectionId)

    if connection_user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Идентификатор соединения невалидно"
        )

    await update_user_telegram(
        session=session,
        user_id=connection_user_id,
        telegram_id=str(telegram_data.user.id)
    )

    await session.commit()
    await socket_manager.send_to_user_connection(
        user_id=connection_user_id,
        connection_id=auth_data.connectionId,
        event="SUCCESSFUL_TELEGRAM_LINK"
    )

    return {
        "message": "Telegram аккаунт успешно привязан"
    }


@router.post("/telegram/me", response_model=UserOut)
async def handle_telegram_credential_send(
        auth_data: TelegramUnsafeAuth,
        session: AsyncSession = Depends(get_session)):

    try:
        telegram_data = safe_parse_webapp_init_data(
            token=bot.token,
            init_data=auth_data.telegramAuth
        )

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Данные Telegram невалидны"
        )

    user = await get_user_by_telegram_id(
        session=session,
        telegram_id=str(telegram_data.user.id)
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Telegram аккаунт не привязан к сервису"
        )

    return user
