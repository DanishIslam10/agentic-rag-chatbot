from app.tools.github_rag.ingestion.ingestion import ingestion_pipeline
from app.tools.github_rag.retrieval.retrieval import retrieval_pipeline
from langchain_core.tools import tool
from langchain_core.runnables import RunnableConfig

@tool
async def github_rag_tool(original_url,query):
    
    """This is a RAG tool for GitHub which contains Ingestion Pipeline and Retrieval Pipeline"""
    
    await ingestion_pipeline(original_url)
    
    return retrieval_pipeline(query,original_url)