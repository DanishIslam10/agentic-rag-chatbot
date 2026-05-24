from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage,SystemMessage,AIMessage
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda
from dotenv import load_dotenv
from langsmith import traceable

load_dotenv()

llm = ChatOpenAI(model='gpt-4o-nano')



template = ChatPromptTemplate.from_messages([

    (
        "system",
"""
You are an helpful github repository assistant which helps the user to understand the provided github repository.

Rules:
- Use ONLY the information from the provided context.
- DO NOT mention the word "context".
- DO NOT say "from the provided context".
- DO NOT explain how you derived the answer.
- Give only the final helpful answer.

If the answer is not found, reply exactly:
I don't know.

Context:
{context}

"""
    ),

    ("human","{query}"),

    ])

parser = StrOutputParser()

def format_docs(x):
    return "\n\n".join([d.page_content for d in x])

@traceable(name="generate_answer")
def generate_answer(query, docs):

    chain = (
        {
            "context":RunnableLambda(lambda x: format_docs(x['docs'])),
            "query":RunnableLambda(lambda x: x['query'])
        }
        | template
        | llm
        | parser
    )

    response = chain.invoke({
        "docs": docs,
        "query": query
    })
    
    return response