from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from pydantic import BaseModel

llm = ChatOpenAI(model="gpt-4o-mini")

class ChatTitle(BaseModel):
    chat_title: str

structured_llm = llm.with_structured_output(ChatTitle) 

prompt = PromptTemplate(
    template="Generate a short title for a chat based on the given following initial two messages:\nHuman:{human_message}",
    input_variables=["human_message"]
)


chat_title_chain = prompt | structured_llm 