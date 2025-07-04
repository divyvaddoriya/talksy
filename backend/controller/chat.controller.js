import asynchandler from "express-async-handler";
import { Chat } from "../model/chat.model.js";
import { User } from "../model/user.model.js";

const accessChat = asynchandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("no userid found");
    return res.status(401);
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  }).populate([
    { path: "users", select: "-password" },
    { path: "latestMessage" },
    { path: "latestMessage.sender", select: "name pic email" },
  ]);

  if (isChat.length > 0) {
    return res.status(200).send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate([
        { path: "users", select: "-password" },
      ]);
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error("eror accessing chat");
    }
  }
});

const fetchChats = asynchandler(async(req, res)=>{
    try {
        await Chat.find({
            users:req.user._id}).
            populate([
                {path: 'users' ,select: '-password' },
                {path: "groupAdmin" , select: '-paswwrod'},
               { path: "latestMessage" },
    { path: "latestMessage.sender", select: "name pic email" }
            ]).sort({updatedAt: -1}).then(result => res.status(200).send(result));
    } catch (error) {
    res.status(404)
    throw new Error(error.message);   
    }
})

const createGroupChats = asynchandler(async(req, res)=>{

    if(!req.body.users || !req.body.name){
      return res.status(400).send({message: "fill all the required field"})
    }

    const users = JSON.parse(req.body.users);    

    if(users.length < 2){
      return res.status(400).send({
            message: "more than 2 user is required to build a group chat"
        })
    }

    users.push(req.user);

    const chatData = {
        chatName : req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user
    }

    try {
        const groupchat = await Chat.create(chatData);
       
       await Chat.find({_id: groupchat._id}).populate([
                {path: 'users' ,select: '-password' },
                {path: "groupAdmin" , select: '-paswwrod'},
            ]).then(result => res.status(200).send(result));
    } catch (error) {
       return res.status(400).send("error creating a group chat")
    }
})
const addToGroup = asynchandler(async(req, res)=>{
    
    if(!req.body.userId || !req.body.chatId){
      return res.status(400).send({message: "fill all the required field"})
    }

     const {userId , chatId} = req.body;

    const addedToChat = await Chat.findByIdAndUpdate(chatId , {
        $push : {users: userId}
    }, {new: true}).populate([
                {path: 'users' ,select: '-password' },
                {path: "groupAdmin" , select: '-paswwrod'},
            ])

            if(!updatedChat){
                res.status(404)
                throw new Error("chat not found")
            }else{
                res.status(200).send(addedToChat)
            }
    })

const removeFromGroup = asynchandler(async(req, res)=>{

    if(!req.body.userId || !req.body.chatId){
      return res.status(400).send({message: "fill all the required field"})
    }

    const {userId , chatId} = req.body;

    const deletedfromgroup = await Chat.findByIdAndUpdate(chatId , 
        {
        $pull : {users: userId}
        },
     {new: true}).populate([
                {path: 'users' ,select: '-password' },
                {path: "groupAdmin" , select: '-paswwrod'},
            ])

            if(!deletedfromgroup){
                res.status(404)
                throw new Error("chat not found")
            }else{
                res.status(200).send(deletedfromgroup)
            }

})
const renameGroupChats = asynchandler(async(req, res)=>{

    if(!req.body.rename || !req.body.chatId){
      return res.status(400).send({message: "fill all the required field"})
    }

     const {rename , chatId} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(chatId , {
        chatName: rename
    }, {new: true}).populate([
                {path: 'users' ,select: '-password' },
                {path: "groupAdmin" , select: '-paswwrod'},
            ])

            if(!updatedChat){
                res.status(404)
                throw new Error("chat not found")
            }else{
                res.status(200).send(updatedChat)
            }
})

export { accessChat , fetchChats , createGroupChats , addToGroup , removeFromGroup , renameGroupChats};
