from dotenv import load_dotenv
load_dotenv()

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.routes import chat

from app.graph.chatbot import (
    build_graph,
    pool
)


@asynccontextmanager
async def lifespan(app: FastAPI):

    # OPEN CONNECTION POOL
    await pool.open()

    # BUILD WORKFLOW
    workflow = await build_graph()

    # STORE IN APP STATE
    app.state.chatbot_workflow = workflow

    yield

    # CLOSE CONNECTION POOL
    await pool.close()


app = FastAPI(
    lifespan=lifespan
)

app.include_router(chat.router)


@app.get("/")
async def root():

    return {
        "message": "AI service running"
    }