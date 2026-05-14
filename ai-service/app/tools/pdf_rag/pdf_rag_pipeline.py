from app.tools.github_rag.ingestion.ingestion import ingestion_pipeline
from app.tools.github_rag.retrieval.retrieval import retrieval_pipeline
from langchain_core.tools import tool
from langchain_core.runnables import RunnableConfig

@tool
async def pdf_rag_tool(pdf_files,query,config:RunnableConfig):
    
    """This is a RAG tool for PDFs which contains Ingestion Pipeline and Retrieval Pipeline"""
    
    thread_id = config["configurable"]["thread_id"]
    user_id = config["configurable"]["user_id"]
    
    await ingestion_pipeline(pdf_files,user_id,thread_id)
    
    return retrieval_pipeline(query,user_id,thread_id)