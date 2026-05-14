import hashlib
from app.schema.repository_schema import RepositorySchema
from app.database.repo_registory_db import db
from fastapi import HTTPException
from langsmith import traceable

@traceable(name="add_repo_doc")
async def add_repo_doc(original_url,normalized_repo_url,repo_hash,repo_name,repo_path,user_id,thread_id:str):
    
    try:
        repo_doc = {
            "repo_url": original_url,
            "normalized_repo_url": normalized_repo_url,
            "repo_hash": repo_hash,
            "repo_name": repo_name,
            "repo_path": str(repo_path),
            "user_id":user_id,
            "chat_session":thread_id
        }

        validated_repo_doc = RepositorySchema(
            **repo_doc
        )

        await db["repositories"].insert_one(
            validated_repo_doc.model_dump()
        )
        
        return {
            "success":"True",
            "message":"Repository Document inserted in repositories successfully."
        }
        
    except Exception as e:
        
        raise HTTPException(
            status_code=500,
            detail=f"Repository document insertion failed: {str(e)}"
        )
        
    
@traceable(name="update_doc")
async def update_doc(repo_hash:str):
    
    try:
            await db["repositories"].update_one(
            {"repo_hash":repo_hash},
            {
                "$set":{
                    "status":"indexed"
                }
            }
            )
        
    except Exception as e:
        
        raise HTTPException(
            status_code=500,
            detail=f"Repository document status updation failed: {str(e)}"
        )