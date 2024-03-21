from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def send_client():
    return FileResponse(path="static/client/index.html")


@app.get("/webapp")
async def send_webapp():
    return FileResponse(path="static/webapp/index.html")
