from pydantic import BaseModel


class GenerationRequest(BaseModel):
    name: str
    query: str
    description: str
    city: str
