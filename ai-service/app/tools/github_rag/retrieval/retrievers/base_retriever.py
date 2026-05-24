from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from langsmith import traceable

@traceable(name="get_base_retriever")
def get_base_retriever(repo_hash:str):

    embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")

    db = Chroma(
        embedding_function=embedding_model,
        persist_directory="app/tools/github_rag/vectorstore/chroma_db",
    )

    return db.as_retriever(
        search_kwargs={
            'k':10,
            "filter": {
                "repo_hash": repo_hash
            }
        }
    )