import axios from "axios"

export const chatbotService = async (data) => {

    const payload = {
        "message":data.content,
        "thread_id":data.sessionId,
        "user_id":String(data.user_id)
    }

    // console.log("payload:\n",payload)

    if (!payload.message || !payload.thread_id || !payload.user_id) {
       const error = new Error("message info for ai-chatbot-service is incomplete.")
       error.statusCode = 400;
       throw error;
    }

    try {

        const response = await axios.post(`${process.env.AI_SERVICE_URL}/chat-message`,payload);

        return response.data

    } catch (error) {
        console.error("chatbot service error:\n",error);
        return {
            success:false,
            message:error.message
        }
    }
} 