from langchain_community.document_loaders import TextLoader
from langchain_core.documents import Document
from langsmith import traceable
from pathlib import Path


ALLOWED_EXTENSIONS = {
    ".py",
    ".js",
    ".ts",
    ".tsx",
    ".jsx",
    ".java",
    ".go",
    ".md",
    ".json",
    ".yaml",
    ".yml"
}

@traceable(name="load_repository")
def load_repository(repo_path: str,repo_hash:str,repo_name:str):

    repo_path = Path(repo_path)

    documents = []

    for file_path in repo_path.rglob("*"):

        if (file_path.is_file() and file_path.suffix in ALLOWED_EXTENSIONS):

            try:

                loader = TextLoader(str(file_path),encoding="utf-8")

                docs = loader.load()

                for doc in docs:

                    doc.metadata["repo_path"] = str(file_path)
                    doc.metadata["repo_hash"] = str(repo_hash)
                    doc.metadata["repo_name"] = str(repo_name)

                documents.extend(docs)

            except Exception as e:

                print(f"Error loading {file_path}: {e}")

    return documents