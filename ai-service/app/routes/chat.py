from fastapi import APIRouter,UploadFile,File,Form
from app.graph.chatbot import build_graph
from langchain_core.messages import HumanMessage
from app.schema.message_schema import MessageSchema
from app.schema.title_schema import TitleSchema
from app.services.chat_title import chat_title_chain
from fastapi import Request
from typing import List


router = APIRouter()


@router.post("/api/ai-service/chat-message")
async def chat(data:MessageSchema):
    
    thread_id = data.thread_id
    message = data.message
    user_id = data.user_id

    config = {
        "configurable": {
            "thread_id": thread_id,
            "user_id": user_id
        }
    }

    pdf_paths = []

    # # save uploaded pdfs if present
    # if files:

    #     for file in files:

    #         file_path = f"app/tools/pdf_rag/uploads/{file.filename}"

    #         content = await file.read()

    #         with open(file_path, "wb") as f:
    #             f.write(content)

    #         pdf_paths.append(file_path)

    chatbot_workflow, checkpointer_cm = await build_graph()

    result = await chatbot_workflow.ainvoke(
        {
            "messages": [
                HumanMessage(content=message)
            ],

            "pdf_paths": pdf_paths
        },
        config=config
    )

    ai_message = result["messages"][-1].content

    return {
        "response": ai_message
    }
    
@router.post("/api/ai-service/generate-title")
async def generate_title(data:TitleSchema):
    
    human_message = data.human_message
    
    chat_title = chat_title_chain.invoke({"human_message":human_message,})
    
    return {
        "response":chat_title
    }