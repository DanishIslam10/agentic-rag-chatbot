import { createChatService } from "../services/chat.service.js";
import { chatbotService } from "../services/chatbot.service.js";
import { getChatTitleService } from "../services/chatTitle.service.js";
import { createMessageService } from "../services/message.service.js";

export const sendMessage = async (req, res) => {
    const { sessionId, chat, content } = req.body; // 'content' and 'role' is also provided by the client
    const { id } = req.user  //this "id" is user's mongo document id.
    // console.log("userid:\n", id)
    try {
        let humanMessage = {
            ...req.body,
            user_id:id,
        };
        //if this is the first message by the user then sessionId and chat (id of chat document) will not be present
        if (!sessionId || !chat) {

            const chatTitle = await getChatTitleService(content);

            const newChatSession = await createChatService(id,chatTitle);
            humanMessage = {
                ...req.body,
                user_id:id,
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
        await createMessageService(aiMessage);

        return res.status(201).json({
            success: true,
            response:latestAiMessage
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