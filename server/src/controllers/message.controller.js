import { createChatService } from "../services/chat.service.js";
import { chatbotService } from "../services/chatbot.service.js";
import { getChatTitleService } from "../services/chatTitle.service.js";
import { createMessageService,getChatSessionHistoryService } from "../services/message.service.js";

export const sendMessage = async (req, res) => {

    const humanMessage = req.body;

    try {

        const aiResponse =
            await chatbotService(humanMessage);

        if (!aiResponse.body) {
            throw new Error(
                "No response body from AI service"
            );
        }

        res.setHeader(
            "Content-Type",
            "text/plain"
        );

        res.setHeader(
            "Transfer-Encoding",
            "chunked"
        );

        const reader =
            aiResponse.body.getReader();

        const decoder = new TextDecoder();

        while (true) {

            const { done, value } =
                await reader.read();

            if (done) break;

            const chunk =
                decoder.decode(value, {
                    stream: true
                });

            res.write(chunk);
        }

        res.end();

    } catch (error) {

        console.error(
            "Streaming error:",
            error
        );

        // IMPORTANT:
        // don't send json after stream starts

        if (!res.headersSent) {

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        // if streaming already started
        // just terminate safely

        res.end();
    }
};

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

    // console.log("Data received in saveMessageDoc controller:", data);

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
