import uuid
from aiogram.types import Update
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy import select

from src.bot.middleware import Data
from src.database import init_models
from src.database.deps import get_session
from src.models import Assistant, User, UserAssistant
from src.service.queue import AssistantManager
from src.bot import bot, dispatcher
from pyngrok import ngrok
from src.config import cfg
from src.service.socket import WebSocketManager, ConnectionMessage

from src.routers.auth.router import router as auth_router
from src.routers.business.router import router as business_router
from src.routers.message.router import router as message_router
from src.routers.user.router import router as user_router
from src.routers.assistant.router import router as assistant_router
from src.utils import get_hashed_password

app = FastAPI(
    title="BizzAI App",
    version="0.0.1",
)


async def init_assistants():
    async for session in get_session():
        try:
            admin_user_in_db = await session.execute(
                select(User)
                .where(User.id == 1)
            )

            if (admin_user_in_db.scalars().one_or_none()):
                return

            admin_user = User(
                username="bizz",
                password=get_hashed_password(cfg.admin_password),
                email="bizz@mail.ru",
                is_developer=True
            )

            session.add(admin_user)
            await session.commit()

            bizz_generation_assistant = Assistant(
                id=1,
                username="bizz_generation",
                created_by=admin_user.id,
                description="",
                name="✨ Генератор бизнес-плана",
                code="",
                is_data_accessible=True
            )

            bizz_assistant = Assistant(
                id=2,
                username="bizz_assistant",
                description="",
                created_by=admin_user.id,
                name="🚀 Bizzy Ассистент",
                code="",
                is_data_accessible=False
            )

            session.add(bizz_assistant)
            session.add(bizz_generation_assistant)
            await session.commit()

            session.add(UserAssistant(
                user_id=admin_user.id,
                assistant_id=bizz_generation_assistant.id
            ))

            session.add(UserAssistant(
                user_id=admin_user.id,
                assistant_id=bizz_assistant.id
            ))

            await session.commit()

        except Exception as ignored:
            await session.rollback()

origins = [
    "https://bizz-ai",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.socket_manager = WebSocketManager()
app.queue_manager = AssistantManager(app.socket_manager)

app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(auth_router)
app.include_router(business_router)
app.include_router(message_router)
app.include_router(user_router)
app.include_router(assistant_router)

# ngrok.set_auth_token("2SCxRNVNlPsTokorZlP2G49LXEy_4yN55MY1VtGf8tYGazeH2")
# tunnel = ngrok.connect(addr=cfg.base_url, name="Dev API")
WEBHOOK_PATH = f"/bot/{cfg.telegram_bot_token}"
WEBHOOK_URL = f"https://bizz-ai{WEBHOOK_PATH}"


@app.on_event("startup")
async def on_startup():
    await init_models()
    await init_assistants()

    # dispatcher.message.middleware(Data(
    #     url="https://bizz-ai",
    #     app=app
    # ))
    #
    # webhook_info = await bot.get_webhook_info()
    #
    # if webhook_info != WEBHOOK_URL:
    #     await bot.set_webhook(
    #         url=WEBHOOK_URL
    #     )


@app.post(WEBHOOK_PATH, include_in_schema=False)
async def process_bot_update(update: dict):
    update = Update.model_validate(update, context={
        "bot": bot
    })

    await dispatcher.feed_update(update=update, bot=bot)


@app.websocket("/")
async def handle_websocket(websocket: WebSocket):
    connection_id: str = str(uuid.uuid4())

    await app.socket_manager.connect(
        connection_id=connection_id,
        websocket=websocket
    )

    try:
        while True:
            event = await websocket.receive_json()
            await app.socket_manager.process_event(connection_id, ConnectionMessage(**event))

    except WebSocketDisconnect:
        await app.socket_manager.disconnect(
            connection_id=connection_id
        )


@app.get("/", description="Send root client")
async def send_client():
    return FileResponse(path="static/client/index.html")


@app.get("/webapp", description="Send webapp")
async def send_webapp():
    return FileResponse(path="static/webapp/index.html")


@app.on_event("shutdown")
async def on_shutdown():
    await bot.session.close()
