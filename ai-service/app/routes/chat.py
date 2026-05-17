from fastapi import APIRouter,UploadFile,File,Form
from fastapi import Request
from langchain_core.messages import HumanMessage
from app.schema.message_schema import MessageSchema
from app.schema.title_schema import TitleSchema
from app.services.chat_title import chat_title_chain
from typing import List
from fastapi.responses import StreamingResponse

router = APIRouter()


@router.post("/api/ai-service/chat-message")
async def chat(request: Request, data:MessageSchema):
    
    thread_id = data.thread_id
    message = data.message
    user_id = data.user_id

    config = {
        "configurable": {
            "thread_id": thread_id,
            "user_id": user_id
        }
    }

    chatbot_workflow = request.app.state.chatbot_workflow
    
    async def generate():

        async for event in chatbot_workflow.astream_events(
            {
                "messages": [
                    HumanMessage(content=message)
                ],
            },
            config=config,
            version="v2"
        ):

             if event["event"] == "on_chat_model_stream":

                chunk = event["data"]["chunk"]

                if chunk.content:
                    yield chunk.content
            
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