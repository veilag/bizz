from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from src.routers.auth.router import router as auth_router

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(auth_router)


@app.get("/")
async def send_client():
    return FileResponse(path="static/client/index.html")


@app.get("/webapp")
async def send_webapp():
    return FileResponse(path="static/webapp/index.html")
