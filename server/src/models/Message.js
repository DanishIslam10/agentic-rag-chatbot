import mongoose from "mongoose";

const { Schema } = mongoose

const schema = Schema({
    messageId: {
        type: String,
        required: true,
        unique: true,
    },
    chat: {
        type: mongoose.Types.ObjectId,
        ref: "Chat",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["ai", "human", "system"],
        required: true
    },
},
    {
        timestamps: true
    }
)

const Message = mongoose.model("Message", schema)

export default Message