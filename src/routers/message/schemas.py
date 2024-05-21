from pydantic import BaseModel


class MessageRequest(BaseModel):
    queryID: int
    assistantID: int
    content: str


class CallbackRequest(BaseModel):
    queryID: int
    messageID: int
    assistantID: int

    callbackData: str
    fetchersData: str
