from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langsmith import traceable
from pathlib import Path

@traceable(name="create_vector_store")
def create_vector_store(docs):
    
    persist_directory = Path("app/tools/github_rag/vectorstore/chroma_db")
    persist_directory.mkdir(parents=True, exist_ok=True)

    embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")

    db = Chroma.from_documents(
        documents=docs,
        embedding=embedding_model,
        persist_directory=str(persist_directory)    
    )

    # print(f"Embedding saved to db:\n{db}")

    return db