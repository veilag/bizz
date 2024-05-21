from pydantic import BaseModel, Field


class AssistantSchema(BaseModel):
    name: str
    username: str
    isDataAccessible: bool
    description: str
    code: str


class AssistantResponse(BaseModel):
    id: int
    name: str
    description: str
    code: str
    username: str
    is_data_accessible: bool = Field(validation_alias="is_data_accessible", serialization_alias="isDataAccessible")
    created_by: int = Field(validation_alias="created_by", serialization_alias="createdBy")
