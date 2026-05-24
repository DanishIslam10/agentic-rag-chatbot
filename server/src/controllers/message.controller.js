import { createChatService } from "../services/chat.service.js";
import { chatbotService } from "../services/chatbot.service.js";
import { getChatTitleService } from "../services/chatTitle.service.js";
import { createMessageService,getChatSessionHistoryService } from "../services/message.service.js";

export const sendMessage = async (req, res) => {

    const humanMessage = req.body;

    try {

        const aiResponse = await chatbotService(humanMessage);

        if (!aiResponse.body) {
            throw new Error("No response body from AI service");
        }

        //It Tell browser: Incoming data is plain text
        res.setHeader("Content-Type","text/plain");

        //It Tell browser: Response will arrive in chunks over time so Don't wait for the whole response, start processing as it comes
        res.setHeader("Transfer-Encoding","chunked");

        // getReader() method of ReadableStream interface returns a reader that can be used to read the stream. It provides a way to read the stream's data in chunks, allowing for efficient handling of large data or streaming responses.
        const reader = aiResponse.body.getReader();

        // TextDecoder interface is used to decode a stream of bytes into a string. It provides a way to convert binary data (like the chunks of data received from the AI service) into human-readable text.
        const decoder = new TextDecoder();

        while (true) {

            // The read() method of the reader returns a promise that resolves to an object containing two properties: done and value. The done property is a boolean that indicates whether the stream has been fully read (true) or if there are more chunks to read (false). The value property contains the actual chunk of data read from the stream, which is typically a Uint8Array.
            const { done, value } = await reader.read();

            if (done) break;

            // The decode() method of the TextDecoder interface takes a chunk of binary data (like the value received from the reader) and decodes it into a string. The { stream: true } option tells the decoder that this is part of a stream of data, allowing it to handle cases where a character might be split across chunks.
            const chunk = decoder.decode(value, {stream: true }); 

            // res.write() method is used to send a chunk of data to the client. In this case, it sends the decoded chunk of text from the AI response to the browser as it is received, allowing for real-time streaming of the response.
            res.write(chunk);
        }

        // res.end() method is used to signal that the response is complete and no more data will be sent. It tells the browser that the streaming of the AI response has finished.
        res.end();

    } catch (error) {

        console.error("Streaming error:",error);

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
