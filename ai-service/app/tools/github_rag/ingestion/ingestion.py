from pathlib import Path
import shutil
from fastapi import HTTPException
from langsmith import traceable
from app.database.repo_registory_db import db
from app.tools.github_rag.ingestion.loader import load_repository
from app.services.clone_repo import clone_repo
from app.services.url import normalize_repo_url, generate_repo_hash, extract_repo_name
from app.tools.github_rag.ingestion.splitter import split_documents
from app.tools.github_rag.ingestion.embedder import create_vector_store
from app.services.mongo_ops import add_repo_doc, update_doc


# Base folder for uploaded PDFs
GITHUB_REPO_FOLDER = Path("app/tools/github_rag/repos")


@traceable(name="github_ingestion_pipeline")
async def ingestion_pipeline(original_url: str,user_id: str,thread_id: str):

    try:

        # create repos directory
        GITHUB_REPO_FOLDER.mkdir(
            parents=True,
            exist_ok=True
        )

        # normalize url
        normalized_repo_url = normalize_repo_url(original_url)

        # generate repo hash
        repo_hash = generate_repo_hash(normalized_repo_url)

        # extract repo name
        repo_name = extract_repo_name(normalized_repo_url)

        # local repo path
        repo_path = (GITHUB_REPO_FOLDER / repo_name)

        repo_collection = db["repositories"]

        # check existing repo
        repo = await repo_collection.find_one({
            "repo_hash": repo_hash,
            "user_id": user_id
        })

        # already ingested
        if repo_path.exists() and repo:

            return {
                "success": True,
                "message": "Repository already exists",
                "repo_hash": repo_hash,
                "repo_path": str(repo_path),
            }

        # clone repository
        try:

            await clone_repo(normalized_repo_url,repo_path,repo_hash)

        except Exception as e:

            print("repo clone failed error is:\n",str(e))
            
            raise Exception(
                f"Repository cloning failed: {str(e)}"
            )   

        # save repository document
        try:

            await add_repo_doc(
                original_url=original_url,
                normalized_repo_url=normalized_repo_url,
                repo_hash=repo_hash,
                repo_name=repo_name,
                repo_path=str(repo_path),
                user_id=user_id,
                thread_id=thread_id
            )

        except Exception as e:

            # cleanup cloned repo
            if repo_path.exists():

                shutil.rmtree(repo_path)

            raise Exception(
                f"Repository document creation failed: {str(e)}"
            )

        # load repository files
        try:

            docs = load_repository(repo_path=repo_path,repo_hash=repo_hash,repo_name=repo_name,user_id=user_id,thread_id=thread_id)

            if not docs:

                raise Exception(
                    "No valid files found in repository"
                )

        except Exception as e:

           raise Exception(
                f"Repository loading failed: {str(e)}"      
            )

        # split documents
        try:

            splitted_docs = split_documents(docs)

        except Exception as e:

            raise Exception(
                f"Document splitting failed: {str(e)}"      
            )     

        # create vector store
        try:

            create_vector_store(splitted_docs)

        except Exception as e:

            raise Exception(
                f"Vector store creation failed: {str(e)}"
            )

        # update repository status
        try:

            await update_doc(repo_hash=repo_hash,user_id=user_id)

        except Exception as e:

           raise Exception(
                f"Repository status update failed: {str(e)}"
            )

        return {
            "success": True,
            "message": "Repository ingestion successful",
            "repo_hash": repo_hash,
            "repo_path": str(repo_path),
        }

    except Exception as e:

       raise Exception(
            f"Ingestion pipeline failed: {str(e)}"
        )