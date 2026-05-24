from fastapi import APIRouter,UploadFile,File,Form
from fastapi import Request
from langchain_core.messages import HumanMessage
from app.schema.message_schema import MessageSchema
from app.schema.title_schema import TitleSchema
from app.services.chat_title import chat_title_chain
from typing import List
from fastapi.responses import StreamingResponse
from collections.abc import AsyncIterable
from starlette.requests import ClientDisconnect

router = APIRouter()


@router.post("/api/ai-service/chat-message")
async def chat(request: Request, data: MessageSchema):

    chatbot_workflow = request.app.state.chatbot_workflow

    config = {
        "configurable": {
            "thread_id": data.thread_id,
        }
    }

    async def generate() -> AsyncIterable[str]:

        try:

            async for event in chatbot_workflow.astream_events(
                {
                    "messages": [
                        HumanMessage(content=data.message)
                    ]
                },
                config=config,
                version="v2"
            ):

                if event["event"] == "on_chat_model_stream":

                    chunk = event.get("data", {}).get("chunk")

                    if chunk and chunk.content:
                        yield chunk.content

        except ClientDisconnect:
            print("Client disconnected")

        except Exception as e:
            print("Streaming Error:", e)
            yield "\n[STREAM_ERROR]"

    return StreamingResponse(
        generate(),
        media_type="text/plain"
    )

    
@router.post("/api/ai-service/generate-title")
async def generate_title(data:TitleSchema):
    
    human_message = data.human_message
    
    chat_title = chat_title_chain.invoke({"human_message":human_message,})
    
    return {
        "response":chat_title
    }