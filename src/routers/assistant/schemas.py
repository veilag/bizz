from pydantic import BaseModel


class AssistantSchema(BaseModel):
    name: str
    description: str
    systemPrompt: str
