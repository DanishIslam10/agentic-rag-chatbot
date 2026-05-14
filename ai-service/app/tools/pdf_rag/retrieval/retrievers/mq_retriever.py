from langchain_classic.retrievers import MultiQueryRetriever
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langsmith import traceable


load_dotenv()

@traceable(name="get_multiquery_retriever")
def get_multiquery_retriever(base_retriever):

    llm = ChatOpenAI(model='gpt-4o-mini')

    return MultiQueryRetriever.from_llm(
        llm= llm,
        retriever = base_retriever,
    )