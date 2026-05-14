from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime


class RepositorySchema(BaseModel):

    # Original GitHub repository URL
    repo_url: str = Field(...,description="Original GitHub repository URL")

    # Normalized URL used internally
    normalized_repo_url: str = Field(...,description="Normalized repository URL")

    # Unique repository hash
    repo_hash: str = Field(...,description="Unique hash generated from normalized repo URL")

    # Repository name
    repo_name: str = Field(...,description="Repository name")

    # Local filesystem path where repo is cloned
    repo_path: str = Field(...,description="Local filesystem path of cloned repository")

    # # Path where vector DB is stored
    # vectorstore_path: str = Field(...,description="Filesystem path of vector database")
    
    user_id: str = Field(...,description="This is the unique id of the user who is chatting.")

    # Repository indexing lifecycle status
    status: Literal["indexing","indexed","failed","pending"] = Field(default="pending",description="Repository indexing lifecycle status")