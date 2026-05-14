from pydantic import BaseModel,Field

class TitleSchema(BaseModel):
    human_message: str = Field(...,description="Message sent by the user.")