from fastapi import APIRouter
from app.schema.github_url_schema import GithubRag
from app.tools.github_rag.github_rag_pipeline import github_rag_tool

router = APIRouter()

# @router.post("/api/ai-service/github-rag-tool/query")
# async def query_rag(data:GithubRag):
    
#     user_query = data.query
#     url = data.url
    
#     print(user_query,url)
    
#     result = await github_rag_tool(url,user_query)
    
#     return {
#         "response":result
#     }