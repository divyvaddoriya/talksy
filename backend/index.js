import express from "express"
import { configDotenv } from "dotenv";
import { connectDb } from "./config/db.js";
import cors from "cors";

configDotenv();

const app = express();
app.use(express.json());
app.use(cors({origin :process.env.CORS_ORIGIN , credentials: true} ));

import userRoutes from "./routes/userRoute.js";
import chatRoutes from "./routes/chatRoute.js"
import messageRoutes from "./routes/messageRoute.js"
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { Server, Socket } from "socket.io";
app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)

app.use(notFound)
app.use(errorHandler);

await connectDb().then(()=>{
    const server = app.listen(5000 , ()=>{
        console.log("hi this is backend runnig");
    })

    const io =new Server( server , {
        pingTimeout: 6000,
        cors:{
            origin: process.env.CORS_ORIGIN,
        }
    })

    io.on("connection" , (socket)=>{
        console.log("connect to socket io");     
        
        socket.on("setup" , (userData)=>{
            socket.join(userData._id);
            console.log(userData._id);          
            socket.emit("connected");
        })

        socket.on('join room' , (room) =>{
            socket.join(room);
            console.log("user joined room " , room);            
        })

        socket.on("typing" , (room)=>{
            socket.in(room).emit("typing");           
        })

        socket.on("stop typing" , (room)=>{
            socket.in(room).emit("stop typing");           
        })

        socket.on('new message' , (newMessageRecieved) =>{
            let chat = newMessageRecieved.chat
           
            if(!chat.users) return console.log("chat. users not defined");

            chat.users.forEach(user => {
                if(user._id == newMessageRecieved.sender._id) return ;

                socket.in(user._id).emit("message recieved" , newMessageRecieved);
            })
                    
        })

        socket.off("setup" , ()=>{
            console.log("user disconnected");
            socket.leave(userData._id)
        })

    })
})