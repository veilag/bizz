from typing import TypedDict, Dict, Any
from fastapi import WebSocket
from pydantic import BaseModel

from src.database.deps import get_session
from src.models import User
from src.routers.auth.deps import check_user


class ConnectedUser(TypedDict):
    connection: WebSocket
    user: User | None


class ConnectionMessage(BaseModel):
    event: str
    payload: Dict[str, Any] | None


class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[str, ConnectedUser] = {}

    def get_connection_user(self, connection_id: str):
        connection = self.active_connections.get(connection_id, None)

        if connection is None:
            return None

        user: User = connection.get("user")
        return user

    async def connect(self, connection_id: str, websocket: WebSocket):
        await websocket.accept()

        self.active_connections[connection_id] = {
            "connection": websocket,
            "user": None
        }

    async def send(self, connection_id: str, event: str, payload: Dict[str, Any] = None):
        connection: ConnectedUser = self.active_connections.get(connection_id, None)

        if connection is not None:
            await connection.get("connection").send_json({
                "event": event,
                "payload": payload
            })

    def validate_connection(self, connection_id: str):
        return not (self.active_connections.get(connection_id, None) is None)

    async def disconnect(self, connection_id: str):
        self.active_connections.pop(connection_id)

    async def process_event(self, connection_id: str, message: ConnectionMessage):
        connection: ConnectedUser = self.active_connections.get(connection_id)
        connection_instance: WebSocket = connection.get("connection")

        match message.event:
            case "LINK_TELEGRAM_ACCOUNT":
                if connection.get("user") is not None:
                    await connection_instance.send_json({
                        "event": "TELEGRAM_QR_CODE_ACCESS",
                        "payload": {
                            "data": connection_id
                        }
                    })

                else:
                    await connection_instance.send_json({
                        "event": "INVALID_ACCOUNT_SESSION",
                        "payload": None
                    })

            case "AUTH_VIA_TELEGRAM":
                await connection.get("connection").send_json({
                    "event": "TELEGRAM_QR_CODE_ACCESS",
                    "payload": {
                        "data": connection_id
                    }
                })

            case "SUBSCRIBE_USER":
                session_generator = get_session()
                async for session in session_generator:
                    user: User = await check_user(
                        session=session,
                        token=message.payload.get("data")
                    )

                    connection.update({
                        "user": user
                    })
