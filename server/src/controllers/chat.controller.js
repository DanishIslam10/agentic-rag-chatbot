import { createChatService } from "../services/chat.service.js"

export const createChat = async (req, res) => {

    try {

        const result = await createChatService(
            req.user.id
        )

        return res.status(201).json({
            success: true,
            ...result
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