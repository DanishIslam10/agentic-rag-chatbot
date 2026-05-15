import crypto from "crypto"
import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

export const createMessageService = async (data) => {

    const { chat,sessionId, content, role } = data;

    console.log("message service data:\n", data)

    if (!chat || !sessionId || !content || !role) {
        const error = new Error("Message Information is incomplete");
        error.statusCode = 400;
        throw error;
    }

    const messageId = crypto.randomUUID();

    const message = await Message.create({
        messageId,
        chat,
        content,
        role
    })

    await Chat.findOneAndUpdate(
        {sessionId},
        { $push: { messages: message._id } },
        { new: true }
    )

    return {
        success: true,
        message,
    }

}