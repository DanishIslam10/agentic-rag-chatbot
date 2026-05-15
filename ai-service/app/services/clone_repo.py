from pathlib import Path
from git import Repo
import shutil
import asyncio
import stat
from fastapi import HTTPException
from langsmith import traceable

# directories and file extensions to remove
IGNORE_NAMES = {
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
}

IGNORE_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".mp4",
    ".zip",
    ".pdf",
    ".lock",
    ".exe",
}


def handle_remove_readonly(func, path, exc):
    """
    Fix Windows permission issues while deleting files.
    """
    try:
        Path(path).chmod(stat.S_IWRITE)
        func(path)
    except Exception:
        pass


def safe_remove(path: Path):
    """
    Remove file or directory safely.
    """

    try:
        if path.is_dir():
            shutil.rmtree(path, onerror=handle_remove_readonly)
        elif path.is_file():
            path.unlink(missing_ok=True)

    except Exception:
        pass


def remove_unnecessary_files(repo_path: Path):
    """
    Remove heavy/unnecessary directories and files.
    """

    # IMPORTANT:
    # remove .git FIRST to avoid WinError 5 on Windows
    git_dir = repo_path / ".git"

    if git_dir.exists():
        safe_remove(git_dir)

    for path in repo_path.rglob("*"):

        try:

            # remove unwanted directories
            if path.is_dir() and path.name in IGNORE_NAMES:
                safe_remove(path)
                continue

            # remove unwanted files
            if path.is_file() and path.suffix.lower() in IGNORE_EXTENSIONS:
                safe_remove(path)

        except Exception:
            continue


@traceable(name="clone_repo")
async def clone_repo(
    normalized_repo_url: str,
    repo_path: str,
    repo_hash: str
):

    try:

        repo_path = Path(repo_path)

        # remove existing repo if already exists
        if repo_path.exists():
            shutil.rmtree(
                repo_path,
                onerror=handle_remove_readonly
            )

        # IMPORTANT:
        # run blocking git clone in separate thread
        await asyncio.to_thread(
            Repo.clone_from,
            normalized_repo_url,
            str(repo_path),
            depth=1,
            single_branch=True
        )

        # cleanup unnecessary files
        await asyncio.to_thread(
            remove_unnecessary_files,
            repo_path
        )

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
            detail=f"Repository cloning failed: {str(e)}"
        )