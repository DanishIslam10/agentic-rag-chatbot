import { createChatService } from "../services/chat.service.js";
import { chatbotService } from "../services/chatbot.service.js";
import { getChatTitleService } from "../services/chatTitle.service.js";
import { createMessageService,getChatSessionHistoryService } from "../services/message.service.js";

export const sendMessage = async (req, res) => {

    const humanMessage = req.body; 

    if (!humanMessage.content || !humanMessage.chat || !humanMessage.sessionId || humanMessage.role !== "human") {
        return res.status(400).json({
            success: false,
            message: "Invalid message format. 'content', 'chat', 'sessionId' and 'role' (should be 'human') are required."
        })
    }

    try {
       
        const aiChatbotResponse = await chatbotService(humanMessage);

        // console.log("ai chatbot res: \n",aiChatbotResponse)
        
        // this "data" object contains entire ai response
        const latestAiMessage = aiChatbotResponse.response
        // console.log("latest ai message: \n",latestAiMessage)

        // extracting latest response message of ai chatbot to save it in db
        const aiMessage = {
            chat: humanMessage.chat,
            sessionId: humanMessage.sessionId,
            content: latestAiMessage,
            role: "ai"
        }

        return res.status(201).json({
            success: true,
            message:aiMessage
        })

    } catch (error) {
        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message
        })
    }
}

export const getChatSessionHistory = async (req, res) => {

    const { chatId } = req.query;

    if (!chatId) {
        return res.status(400).json({
            success: false,
            message: "Chat id is required"
        })
    }

    try {
        const messages = await getChatSessionHistoryService(chatId);
        return res.status(200).json({
            success: true,
            messages
        })
    } catch (error) {
        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message
        })
    }
}   


export const saveMessageDoc = async (req, res) => {

    const data = req.body;

    console.log("Data received in saveMessageDoc controller:", data);

    try {
        const messageDoc = await createMessageService(data);
        return res.status(201).json({
            success: true,
            message: messageDoc
        })
    } catch (error) {
        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message
        })
    }
}
