import mongoose from "mongoose"

const messageSceama = new mongoose.Schema({
    sender : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        // trim: true,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    }
} , {timestamps: true})

const Message = mongoose.model("Message" , messageSceama);

export default Message;