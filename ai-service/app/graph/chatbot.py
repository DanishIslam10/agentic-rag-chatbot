from pydantic import BaseModel,Field
from typing import Annotated,List,Optional
from langchain_core.messages import BaseMessage,SystemMessage
from langgraph.graph.message import add_messages
from langgraph.graph import StateGraph,START,END
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from app.tools.websearch_tool import search_tool
from app.tools.github_rag.github_rag_pipeline import github_rag_tool
from langgraph.prebuilt import ToolNode, tools_condition
from dotenv import load_dotenv
from app.prompts.system_prompt import SYSTEM_PROMPT
import os

load_dotenv()

DB_URI = os.getenv("DB_URI")

class ChatState(BaseModel):
    messages : Annotated[List[BaseMessage],add_messages]

llm = ChatOpenAI(
    model="gpt-5-mini",
    streaming=True,
    temperature=0.7 
) 


tools = [search_tool,github_rag_tool]

llm_with_tools = llm.bind_tools(tools)


async def chat_node(state:ChatState):
    
    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
        *state.messages,
    ]
    
    # print("User's query: \n",user_messages)
    response = await llm_with_tools.ainvoke(messages)
    # print("llm response: \n",response)
    return {"messages":[response]}

async def build_graph():

    graph = StateGraph(ChatState)

    tools_node = ToolNode(tools)

    graph.add_node("chat_node", chat_node)

    graph.add_node("tools", tools_node)

    graph.add_edge(START, "chat_node")

    graph.add_conditional_edges(
        "chat_node",
        tools_condition
    )

    graph.add_edge("tools", "chat_node")

    # Async checkpointer
    checkpointer_cm = (
        AsyncPostgresSaver.from_conn_string(
            DB_URI
        )
    )

    checkpointer = (
        await checkpointer_cm.__aenter__()
    )

    await checkpointer.setup()

    workflow = graph.compile(
        checkpointer=checkpointer
    )

    return workflow, checkpointer_cm