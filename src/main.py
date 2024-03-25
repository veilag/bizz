import uuid
from asyncio import create_task
from aiogram.types import Update
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from src.bot.middleware import ExternalURL
from src.database import init_models
from src.database.deps import get_session
from src.service.queue import QueueManager
from src.routers.auth.router import router as auth_router
from src.bot import bot, dispatcher
from pyngrok import ngrok
from src.config import cfg
from src.service.socket import WebSocketManager, ConnectedUser, ConnectionMessage

app = FastAPI(
    title="BizzAI App",
    version="0.0.1",
)

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.queue_manager = QueueManager()
app.socket_manager = WebSocketManager()

app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(auth_router)

tunnel = ngrok.connect(addr=cfg.base_url)
WEBHOOK_PATH = f"/bot/{cfg.telegram_bot_token}"
WEBHOOK_URL = f"{tunnel.public_url}{WEBHOOK_PATH}"


@app.on_event("startup")
async def on_startup():
    await init_models()
    create_task(app.queue_manager.process_queue())

    dispatcher.message.middleware(ExternalURL(tunnel.public_url))
    webhook_info = await bot.get_webhook_info()

    if webhook_info != WEBHOOK_URL:
        await bot.set_webhook(
            url=WEBHOOK_URL
        )


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
    return FileResponse(path="static/webapp/index.html", headers={
        "ngrok-skip-browser-warning": "2024"
    })


@app.on_event("shutdown")
async def on_shutdown():
    await bot.session.close()
