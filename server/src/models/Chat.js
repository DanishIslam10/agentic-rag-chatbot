import mongoose from "mongoose";

const { Schema } = mongoose

const schema = Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required:true
    },
    title: {
        type: String,
        required: true
    },
    messages: [{
        type: mongoose.Types.ObjectId,
        ref: "Message"
    }],
    isActive: Boolean,
},
    {
        timestamps: true
    }
)

const Chat = mongoose.model("Chat", schema)

export default Chat