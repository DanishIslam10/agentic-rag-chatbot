from pathlib import Path
from git import Repo
import shutil
from fastapi import HTTPException
from langsmith import traceable

IGNORE_DIRS = {
    ".git",
    "node_modules",
    "dist",
    "build",
    ".next",
    "coverage",
    "__pycache__",
    ".venv",
    "venv",
    "target",
    "bin",
    "obj",
    ".idea",
    ".vscode",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".mp4",
    ".zip",
    ".pdf",
    ".lock",
    ".exe"
}

def remove_unnecessary_dirs(repo_path: Path):

    for path in repo_path.rglob("*"):

        if path.is_dir() and path.name in IGNORE_DIRS:

            shutil.rmtree(path, ignore_errors=True)


@traceable(name="clone_repo")
async def clone_repo(normalized_repo_url:str,repo_path:str,repo_hash:str):

    try:
        
        # Shallow clone
        Repo.clone_from(normalized_repo_url,repo_path,depth=1)

        # Remove unnecessary directories
        remove_unnecessary_dirs(repo_path)
        

        return {
            "success": True,
            "message": "Repository cloned successfully",
            "repo_hash": repo_hash,
            "repo_path": str(repo_path),
            "already_cloned": False
        }
    
    except Exception as e:
        
        raise HTTPException(
            status_code=500,
            detail=f"Repository Cloning Failed: {str(e)}"
        )
        
        