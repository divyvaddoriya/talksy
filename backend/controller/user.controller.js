import asynchandler from "express-async-handler";
import { User } from "../model/user.model.js";
import { generateToken } from "../config/generateToken.js";
const login =asynchandler (async(req , res)=>{
    const {email , password} = req.body;
  
    const user = await User.findOne({email});

    if(user && (user.comparePassword(password))){
   res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
    }else{
         res.status(401).json({
            message: "invalid passwird or eamil",
        })
    }
    return;
})

const register = asynchandler(async(req , res)=>{
    const {name , email , password , pic} = req.body;

    if(!name || !email || !password){
      return  res.status(404).json({message: "enter all the requird field"});
    }

    const userExist =await User.findOne({email})

    if(userExist){
        res.status(400)
        throw new Error("user allready exist");
    }

    const user = await User.create({
        name , email , password , pic
    });
    // user.save();
    if(user){
      return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
    });
    }else{
        res.status(400)
        throw new Error("server error");
        }
})

const logout = async(req , res)=>{

}

const allUsers = asynchandler(async(req, res)=>{
    const keywords = req.query.search ? {
        $or: [
            { name: {$regex : req.query.search ,$options: "i"  }  },
            { email: {$regex : req.query.search ,$options: "i"  }  }
        ]
    } : {};

    const users = await User.find(keywords).find({_id: {$ne: req.user._id}});

    res.send(users);

})  

export {
    login  , 
    register ,
    logout,
    allUsers
}