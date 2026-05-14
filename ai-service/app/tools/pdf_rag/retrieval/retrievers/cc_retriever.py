from langchain_classic.retrievers import ContextualCompressionRetriever
from langchain_classic.retrievers.document_compressors import LLMChainExtractor
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langsmith import traceable


load_dotenv()

@traceable(name="get_compression_retriever")
def get_compression_retriever(retriever):
    llm = ChatOpenAI(model='gpt-4o-mini')
    compressor = LLMChainExtractor.from_llm(llm)

    return ContextualCompressionRetriever(
        base_retriever=retriever,
        base_compressor=compressor
    )