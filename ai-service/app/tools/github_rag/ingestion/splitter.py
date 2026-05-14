from langchain_text_splitters import RecursiveCharacterTextSplitter
from langsmith import traceable

@traceable(name="split_documents")
def split_documents(documents):

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )

    split_docs = text_splitter.split_documents(
        documents
    )

    return split_docs