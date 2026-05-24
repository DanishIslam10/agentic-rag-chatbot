from pydantic import BaseModel,Field

class MessageSchema(BaseModel):
    message: str = Field(...,description="Text content of the user message")
    thread_id: str = Field(...,description="Session id of active chat")