from fastapi import FastAPI
from dotenv import load_dotenv
from app.routes import chat,github_rag
from app.graph.chatbot import build_graph
from contextlib import asynccontextmanager

load_dotenv()
    
@asynccontextmanager
async def lifespan(app: FastAPI):

    workflow, checkpointer_cm = await build_graph()

    app.state.chatbot_workflow = workflow

    app.state.checkpointer_cm = checkpointer_cm

    yield

    await checkpointer_cm.__aexit__(
        None,
        None,
        None
    )


app = FastAPI(
    lifespan=lifespan
)

app.include_router(chat.router)
app.include_router(github_rag.router)

@app.get("/")
async def root():

    return {
        "message": "AI service running"
    }