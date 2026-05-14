from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from langsmith import traceable

@traceable(name="create_vector_store")
def create_vector_store(docs):

    embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")

    db = Chroma.from_documents(
        documents=docs,
        embedding=embedding_model,
        persist_directory="app/tools/github_rag/vectorstore/chroma_db"
    )

    # print(f"Embedding saved to db:\n{db}")

    return db