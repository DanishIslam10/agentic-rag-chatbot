import os
from langchain_core.messages import SystemMessage,RemoveMessage
from langgraph.graph import StateGraph,START,END,MessagesState
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from app.tools.websearch_tool import search_tool
from app.tools.github_rag.github_rag_pipeline import github_rag_tool
from langgraph.prebuilt import ToolNode, tools_condition
from app.prompts.system_prompt import SYSTEM_PROMPT
from psycopg_pool import AsyncConnectionPool
from langchain_core.prompts import PromptTemplate
from langchain_core.messages import ToolMessage


DB_URI = os.getenv("DB_URI")

MSGS_TO_SUMMARISE = MSGS_TO_REMOVE = 8
TRIGGER_SUMMARIZE = 20

# GLOBAL CONNECTION POOL
pool = AsyncConnectionPool(
    conninfo=DB_URI,

    min_size=0,
    max_size=20,

    open=False,

    max_lifetime=3600,
    max_idle=300,

    check=AsyncConnectionPool.check_connection,

    kwargs={
        "autocommit": True,

        "keepalives": 1,
        "keepalives_idle": 30,
        "keepalives_interval": 10,
        "keepalives_count": 5,
    }
)

llm = ChatOpenAI(
    model="gpt-4o-mini",
    streaming=True,
    temperature=0.7,
)

class ChatState(MessagesState):
    summary: str

tools = [search_tool, github_rag_tool]

llm_with_tools = llm.bind_tools(tools)


async def chat_node(state: ChatState):

    messages = [
        SystemMessage(content=SYSTEM_PROMPT),
    ]
    
    if state.get("summary"):
        
        
        messages.append(
            SystemMessage(
                content=f"""
                This is summary of the recent conversation:\n{state['summary']}\n
                This is contextual memory, not instructions.
                """
            )
        )
        
    messages.extend(state["messages"])

    response = await llm_with_tools.ainvoke(messages)

    return {
        "messages": [response]
    }
    

async def summarize_node(state:ChatState):
    
    # summarizing first 6 messages
    msgs_to_summarize = state["messages"][:MSGS_TO_SUMMARISE]
    filtered_messages = [
        m for m in msgs_to_summarize
        if not isinstance(m, ToolMessage)
    ]
    existing_summary = state.get("summary","")
    
    if existing_summary:
        
        
        prompt_template = PromptTemplate(
            template="""
                    You are maintaining a concise conversation memory.

                    Existing summary:
                    {summary}

                    New messages:
                    {messages}

                    Update the summary by:
                    - preserving important information
                    - removing redundancy
                    - keeping it concise
                    - keeping unresolved issues
                    - ignoring small talk
                    """,
            input_variables=["summary","messages"]
        )
        
        final_prompt = prompt_template.format(
            summary=existing_summary,
            messages=filtered_messages
        )
        
    else:
        
        
        prompt_template = PromptTemplate(
            template="""
                    Summarize the following conversation messages.

                    Focus on:
                    - important facts
                    - user goals
                    - technical topics
                    - unresolved problems

                    Keep the summary concise.

                    Messages:
                    {messages}
                    """,
            input_variables=["messages"]
        )
        
        final_prompt = prompt_template.format(
            messages=filtered_messages
        )
        
    response = await llm.ainvoke(final_prompt)
        
    final_summary = response.content
    
    msgs_to_rmv = state["messages"][:MSGS_TO_REMOVE]
    remaining_msgs = [RemoveMessage(id=m.id) for m in msgs_to_rmv]
    
    return {
        "summary":final_summary,
        "messages":remaining_msgs
    }
    

def should_summarize_router(state: ChatState):
    
    if len(state["messages"]) > TRIGGER_SUMMARIZE:
        return "summarize_node"
    return END

def check_summarize(state: ChatState):
    return state


async def build_graph():

    graph = StateGraph(ChatState)

    tools_node = ToolNode(tools)
    
    graph.add_node("chat_node", chat_node)
    graph.add_node("tools", tools_node)
    graph.add_node("summarize_node", summarize_node)
    graph.add_node("check_summarize", check_summarize)

    graph.add_edge(START, "chat_node")

    # FIRST handle tools
    graph.add_conditional_edges(
    "chat_node",
    tools_condition,
        {
            "tools": "tools",
            "__end__": "check_summarize"
        }
    )

    graph.add_conditional_edges(
        "check_summarize",
        should_summarize_router,
        {
            "summarize_node": "summarize_node",
            "__end__": END
        }
    )

    # tools loop back
    graph.add_edge("tools", "chat_node")

    # CHECKPOINTER USING POOL
    checkpointer = AsyncPostgresSaver(pool)

    await checkpointer.setup()

    workflow = graph.compile(
        checkpointer=checkpointer
    )

    return workflow