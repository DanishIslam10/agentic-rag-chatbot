import { createChatService } from "../services/chat.service.js";
import { chatbotService } from "../services/chatbot.service.js";
import { getChatTitleService } from "../services/chatTitle.service.js";
import { createMessageService,getChatSessionHistoryService } from "../services/message.service.js";

export const sendMessage = async (req, res) => {
    const { sessionId, chat, content, role } = req.body; // 'content' and 'role' is also provided by the client
    const { id } = req.user  //this "id" is user's mongo document id.

    if (!content) {
        return res.status(400).json({
            success: false,
            message: "Message content is required"
        })
    }

    try {
        let humanMessage = {
            ...req.body,
            user_id: id,
            role: role || "human"
        };
        //if this is the first message by the user then sessionId and chat (id of chat document) will not be present
        if (!sessionId || !chat) {

            const chatTitle = await getChatTitleService(content);

            const newChatSession = await createChatService(id,chatTitle);
            humanMessage = {
                ...req.body,
                user_id: id,
                role: role || "human",
                sessionId: newChatSession.chat.sessionId,
                chat: newChatSession.chat._id
            }
        }
        // console.log("human message:\n", humanMessage)

        const aiChatbotResponse = await chatbotService(humanMessage);

        // console.log("ai chatbot res: \n",aiChatbotResponse)
        
        // this "data" object contains entire ai response
        const latestAiMessage = aiChatbotResponse.response
        // console.log("latest ai message: \n",latestAiMessage)

        // extracting latest response message of ai chatbot to save it in db
        const aiMessage = {
            chat: chat || humanMessage.chat,
            sessionId: sessionId || humanMessage.sessionId,
            content: latestAiMessage,
            role: "ai"
        }

        // console.log("ai message",aiMessage);
        
        //save human message in db
        await createMessageService(humanMessage);
        
        //svae ai message in db
        const aiMessageDoc = await createMessageService(aiMessage);

        return res.status(201).json({
            success: true,
            message:aiMessageDoc
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
