from langsmith import traceable

from app.schema.repository_schema import (
    RepositorySchema
)

from app.database.repo_registory_db import db


@traceable(name="add_repo_doc")
async def add_repo_doc(
    original_url: str,
    normalized_repo_url: str,
    repo_hash: str,
    repo_name: str,
    repo_path: str,
    user_id: str,
    thread_id: str
):

    try:

        repo_doc = {
            "repo_url": original_url,
            "normalized_repo_url": normalized_repo_url,
            "repo_hash": repo_hash,
            "repo_name": repo_name,
            "repo_path": str(repo_path),

            "user_id": user_id,

            "thread_id": thread_id,

            "status": "pending"
        }

        validated_repo_doc = RepositorySchema(
            **repo_doc
        )

        await db["repositories"].insert_one(
            validated_repo_doc.model_dump()
        )

        return {
            "success": True,
            "message": (
                "Repository document inserted "
                "successfully."
            )
        }

    except Exception as e:

        raise Exception(
            f"Repository document insertion failed: "
            f"{str(e)}"
        )


@traceable(name="update_doc")
async def update_doc(
    repo_hash: str,
    user_id: str
):

    try:

        result = await db["repositories"].update_one(
            {
                "repo_hash": repo_hash,
                "user_id": user_id
            },

            {
                "$set": {
                    "status": "indexed"
                }
            }
        )

        if result.matched_count == 0:

            raise Exception(
                "Repository document not found"
            )

        return {
            "success": True,
            "message": (
                "Repository status updated "
                "successfully."
            )
        }

    except Exception as e:

        raise Exception(
            f"Repository document status update failed: "
            f"{str(e)}"
        )