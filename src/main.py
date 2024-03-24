from aiogram.types import Update
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from src.bot.middleware import ExternalURL
from src.database import init_models
from src.routers.auth.router import router as auth_router
from src.bot import bot, dispatcher
from pyngrok import ngrok
from src.config import cfg

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(auth_router)

tunnel = ngrok.connect(addr=cfg.base_url)
WEBHOOK_PATH = f"/bot/{cfg.telegram_bot_token}"
WEBHOOK_URL = f"{tunnel.public_url}{WEBHOOK_PATH}"


@app.on_event("startup")
async def on_startup():
    await init_models()

    dispatcher.message.middleware(ExternalURL(tunnel.public_url))
    webhook_info = await bot.get_webhook_info()

    if webhook_info != WEBHOOK_URL:
        await bot.set_webhook(
            url=WEBHOOK_URL
        )


@app.post(WEBHOOK_PATH)
async def process_bot_update(update: dict):
    update = Update.model_validate(update, context={
        "bot": bot
    })

    await dispatcher.feed_update(update=update, bot=bot)


@app.get("/")
async def send_client():
    return FileResponse(path="static/client/index.html")


@app.get("/webapp")
async def send_webapp():
    return FileResponse(path="static/webapp/index.html")


@app.on_event("shutdown")
async def on_shutdown():
    await bot.session.close()
