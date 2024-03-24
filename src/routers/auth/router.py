import uuid

from aiogram.utils.web_app import safe_parse_webapp_init_data
from fastapi import APIRouter, Depends, HTTPException, status, WebSocket
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession

from src.database.deps import get_session
from src.models import User
from src.routers.auth.deps import current_user, check_user
from src.routers.auth.schemas import TokenSchema, UserOut, UserAuth, TelegramAuth
from src.routers.auth.service import get_user, add_user, update_user_telegram, AuthSocketManager
from src.utils import verify_password, create_access_token, create_refresh_token
from src.bot import bot

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

socket_manager = AuthSocketManager()


@router.post("/signup", response_model=UserOut, summary="Create new user")
async def handle_user_signup(
        data: UserAuth,
        session: AsyncSession = Depends(get_session)):

    user = await get_user(session, data.username)

    if user is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this name already exists"
        )

    new_user = add_user(
        session=session,
        username=data.username,
        raw_password=data.password,
        email=data.email
    )

    await session.commit()
    return new_user


@router.post("/login", response_model=TokenSchema, summary="Login user")
async def handle_user_login(
        form_data: OAuth2PasswordRequestForm = Depends(),
        session: AsyncSession = Depends(get_session)):

    user = await get_user(session, form_data.username)

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
        "access_token": create_access_token({
            "user_id": user.id
        }),

        "refresh_token": create_refresh_token({
            "user_id": user.id
        })
    }


@router.post("/telegram", include_in_schema=False, summary="Integrate user Telegram account")
async def handle_telegram_integration(
        auth_data: TelegramAuth,
        session: AsyncSession = Depends(get_session)):

    try:
        telegram_data = safe_parse_webapp_init_data(
            token=bot.token,
            init_data=auth_data.telegram_auth
        )

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not parse telegram credentials"
        )

    connection = socket_manager.get_connection(auth_data.auth_id)

    await update_user_telegram(
        session=session,
        user_id=connection["user_id"],
        telegram_id=telegram_data.user.id
    )

    await session.commit()
    await socket_manager.commit(auth_data.auth_id)
    return {
        "message": "Telegram account authorized"
    }


@router.post("/me", response_model=UserOut, summary="Get user credentials")
async def handle_user_credential_send(user: User = Depends(current_user)):
    return user


@router.websocket("/ws/{token}")
async def handle_telegram_socket(
        websocket: WebSocket,
        token: str,
        session: AsyncSession = Depends(get_session)):

    await websocket.accept()

    user = await check_user(
        token=token,
        session=session
    )

    if not user:
        await websocket.send_text("Unauthorized connection")
        await websocket.close()

    auth_id = str(uuid.uuid4())
    await socket_manager.connect(auth_id, user.id, websocket)

    while True:
        await websocket.receive_json()
