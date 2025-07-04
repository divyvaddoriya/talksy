import mongoose from "mongoose";

 export const connectDb = async()=>{
    try {
        const conn = await mongoose.connect("mongodb+srv://vaddoriyadivy12:A8PxArLN3OcBnrsy@cluster0.gosfom9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
        console.log("connectiion to database successffully" + conn.connection.host);
        
    } catch (error) {
        console.log("error in connecting database" + error.message);
        process.exit(1);
    }
}