from typing import TypedDict, Dict, Any
from fastapi import WebSocket
from pydantic import BaseModel

from src.database.deps import get_session
from src.models import User
from src.routers.auth.deps import check_user


class Connection(TypedDict):
    connection_id: str
    connection_session: WebSocket


class ConnectionMessage(BaseModel):
    event: str
    payload: Dict[str, Any] | None


class WebSocketManager:
    def __init__(self):
        self.active_connections: Dict[int, list[Connection]] = {}
        self.unauthorized_connections: Dict[str, WebSocket] = {}

    def get_user_id_by_connection_id(self, connection_id: str) -> int | None:
        for user_id in self.active_connections:
            connections = self.active_connections.get(user_id)
            for connection in connections:
                if connection.get("connection_id") == connection_id:
                    return user_id

        return None

    async def connect(self, connection_id: str, websocket: WebSocket):
        await websocket.accept()
        self.unauthorized_connections[connection_id] = websocket

    async def send_to_user(self, user_id: int, event: str, payload: Dict[str, Any] = None):
        user_connections = self.active_connections.get(user_id)

        for connection in user_connections:
            connection_session = connection.get("connection_session")
            await connection_session.send_json({
                "event": event,
                "payload": {
                    "data": payload
                }
            })

    def authorize_connection(self, user_id: int, connection_id: str):
        unauthorized_connection = self.unauthorized_connections.get(connection_id)
        self.unauthorized_connections.pop(connection_id)

        user_active_connections = self.active_connections.get(user_id, None)
        if not user_active_connections:
            self.active_connections[user_id] = [{
                "connection_id": connection_id,
                "connection_session": unauthorized_connection
            }]

        else:
            self.active_connections.get(user_id).append({
                "connection_id": connection_id,
                "connection_session": unauthorized_connection
            })

    async def send_to_user_connection(self, user_id: int, connection_id: str, event: str, payload: Dict[str, Any] = None):
        user_connections = self.active_connections.get(user_id)
        for user_connection in user_connections:
            if user_connection.get("connection_id") == connection_id:
                await user_connection.get("connection_session").send_json({
                    "event": event,
                    "payload": payload
                })

    def validate_connection(self, connection_id: str):
        return not (self.unauthorized_connections.get(connection_id, None) is None)

    async def disconnect(self, connection_id: str):
        unauthorized_connection = self.unauthorized_connections.get(connection_id, None)
        if unauthorized_connection:
            self.unauthorized_connections.pop(connection_id)
            return

        for user_id in self.active_connections:
            user_connections = self.active_connections.get(user_id)
            for user_connection in user_connections:
                if user_connection.get("connection_id") == connection_id:
                    user_connections.remove(user_connection)

    async def process_unauthorized_connection_event(self, connection_id: str, message: ConnectionMessage):
        unauthorized_connection = self.unauthorized_connections.get(connection_id, None)

        match message.event:
            case "AUTH_VIA_TELEGRAM":
                await unauthorized_connection.send_json({
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

                    self.authorize_connection(
                        user_id=user.id,
                        connection_id=connection_id
                    )

    async def process_authorized_connection_event(self, connection_id: str, message: ConnectionMessage):
        match message.event:
            case "LINK_TELEGRAM_ACCOUNT":
                for user_id in self.active_connections:
                    user_connections = self.active_connections.get(user_id)

                    for user_connection in user_connections:
                        if user_connection.get("connection_id") == connection_id:
                            await user_connection.get("connection_session").send_json({
                                "event": "TELEGRAM_QR_CODE_ACCESS",
                                "payload": {
                                    "data": connection_id
                                }
                            })

    async def process_event(self, connection_id: str, message: ConnectionMessage):
        unauthorized_connection = self.unauthorized_connections.get(connection_id, None)

        if unauthorized_connection:
            await self.process_unauthorized_connection_event(
                connection_id=connection_id,
                message=message
            )
            return

        for user_id in self.active_connections:
            user_connections = self.active_connections.get(user_id)

            for user_connection in user_connections:
                if user_connection.get("connection_id") == connection_id:
                    await self.process_authorized_connection_event(
                        connection_id=connection_id,
                        message=message
                    )
                    return
