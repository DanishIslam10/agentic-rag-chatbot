import mongoose from "mongoose"

const { Schema } = mongoose

const schema = Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    chats:[{
        type:mongoose.Types.ObjectId,
        ref:"Chat"
    }]
},
    {
        timestamps: true,
    }
)

const User = mongoose.model("User", schema)

export default User