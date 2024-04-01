from pydantic import BaseModel


class MessageRequest(BaseModel):
    messageGroupID: int
    content: str
