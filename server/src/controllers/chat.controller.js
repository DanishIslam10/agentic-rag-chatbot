import { createChatService } from "../services/chat.service.js"
import { getPreviousChatsService,deleteChatService } from "../services/chat.service.js"
import { getChatTitleService } from "../services/chatTitle.service.js"

export const createChat = async (req, res) => {

    const human_message = req?.body?.content;

    if(!human_message || human_message.trim() === "") {

        return res.status(400).json({
            success: false,
            message: "Human message is required to create a chat"
        })  
    }

    try {

        const id = req.user.id;

        const chatTitle = await getChatTitleService(human_message);

        const chatDoc = await createChatService(id,chatTitle);

        return res.status(201).json({
            success: true,
            chat:chatDoc
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


export const getPreviousChats = async (req, res) => {

    try {

        const result = await getPreviousChatsService(
            req.user.id
        )   

        return res.status(200).json({
            success: true,
            chats: result
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


export const deleteChat = async (req, res) => {

    const { chatId } = req.body;

    if (!chatId) {
        return res.status(400).json({
            success: false,
            message: "Chat id is required"
        })
    }

    try {
        await deleteChatService(req.user.id,chatId);
        return res.status(200).json({   
            success: true,
            message: "Chat deleted successfully"
        })

    } catch (error) {
        console.error("Error deleting chat:", error);
        return res.status(
            error.statusCode || 500
        ).json({
            success: false,
            message: error.message
        })
    }
}
