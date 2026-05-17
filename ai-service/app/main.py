from dotenv import load_dotenv
load_dotenv()


from app.routes import chat
from app.graph.chatbot import build_graph
from contextlib import asynccontextmanager
from fastapi import FastAPI

    
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

@app.get("/")
async def root():

    return {
        "message": "AI service running"
    }