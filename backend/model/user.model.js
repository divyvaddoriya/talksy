import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name: {
        type: String , required: true,
    },
    email: {
        type: String , required: true,
        unique: true,
    },
    password: {
        type: String , required: true,
    },
    pic: {
        type: String ,
        default: "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?semt=ais_hybrid&w=740"
    },
} , {timestamps: true})

userSchema.pre("save", async function(next){
   if (!this.isModified("password")) {
  return next()
}


    const hashedPassword = await bcrypt.hash(this.password , 10);

    this.password = hashedPassword;
    
})

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password , this.password);
}


export const User = mongoose.model("User" , userSchema);
