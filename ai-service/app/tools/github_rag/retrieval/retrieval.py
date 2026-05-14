from app.tools.github_rag.retrieval.retrievers.base_retriever import get_base_retriever
from app.tools.github_rag.retrieval.retrievers.cc_retriever import get_compression_retriever
from app.tools.github_rag.retrieval.generation import generate_answer
from app.services.url import generate_repo_hash,normalize_repo_url
from langsmith import traceable

@traceable(name="retrieval_pipeline")
def retrieval_pipeline(query:str,url:str,user_id:str,thread_id:str):
    
    normalized_repo_url = normalize_repo_url(url)
    
    repo_hash = generate_repo_hash(normalized_repo_url)

    base = get_base_retriever(repo_hash,user_id,thread_id)

    compressor = get_compression_retriever(base)

    docs = compressor.invoke(query)

    # print(f"user's query:\n{query}")
    print(f"retrieved documents metadata:\n{docs[0].metadata}")
        

    return generate_answer(query=query,docs=docs)
