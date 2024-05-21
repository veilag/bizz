from pydantic import BaseModel


class GenerationRequest(BaseModel):
    name: str
    description: str


class SelectionQueryRequest(BaseModel):
    queryID: int


class SelectionAssistantRequest(BaseModel):
    assistantID: int