from pydantic import BaseModel,Field

class GithubRag(BaseModel):
    url: str = Field(...,description="The URL of the Github Repo given by the user.")
    query: str = Field(...,description="The query asked by the user for the github repo.")
    