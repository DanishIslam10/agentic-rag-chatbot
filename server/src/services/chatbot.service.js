import axios from "axios"

export const chatbotService = async (data) => {

    const payload = {
        message: data.content,
        thread_id: data.sessionId,
        user_id: String(data.userId)
    };

    if (!payload.message || !payload.thread_id || !payload.user_id) {
        
        const error = new Error("message info for ai-chatbot-service is incomplete.");

        error.statusCode = 400;

        throw error;
    }

    try {

        const response = await fetch(`${process.env.AI_SERVICE_URL}/chat-message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        return response;

    } catch (error) {

        console.error("chatbot service error:\n",error);

        throw error;
    }
};