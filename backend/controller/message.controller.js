import asynchandler from "express-async-handler";
import Message from "../model/message.model.js";
import { Chat } from "../model/chat.model.js";
import { User } from "../model/user.model.js";

const sendMessage = asynchandler(async(req ,res) => {
    const {content , chatId}  = req.body;
    
    if(!content || !chatId){
        return res.status(400).send("enter the message")
    }

    let newMessage ={
        sender: req.user._id,
        content: content,
        chat: chatId,
    }

    try {
        let message = await Message.create(newMessage)
        
        
    let updatedMessage = await Message.findById(message._id).populate("sender", "name pic").populate({
    path: "chat",
    populate: {
      path: "users",
      select: "name pic email",
    },
  });
        await Chat.findByIdAndUpdate(chatId , {
            latestMessage: updatedMessage
        });

        res.json(updatedMessage);
        return;
    } catch (error) {
       throw new Error("error in sending msg " + error.message); 
    }

})

const allMessages = asynchandler(async(req , res)=>{
    try {
        const messages = await Message.find({ chat: req.params.chatId}).populate("sender" , "name pic email").populate("chat");
res.json(messages);
    } catch (error) {
        throw new Error("error fetching this chat")
    }
})

export  {
    sendMessage,allMessages
}