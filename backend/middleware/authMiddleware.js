import jwt from "jsonwebtoken"
import { User } from "../model/user.model.js"
import asynchandler from "express-async-handler"

const protect = asynchandler(async(req, res, next) =>{
    let token ; 
    
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            // console.log("token" + token);
            
            // decode token
            const decoded = jwt.verify(token , process.env.JWT_SECRET);
            // console.log(decoded);
            
            req.user = await User.findById(decoded.id).select("-password");
            
            next();

        } catch (error) {
            res.status(401);
            throw new Error("Not athorized , token failed");           
        }
    }

    if(!token){
        res.status(401);
        throw new Error("not authorized , not token");
    }
})

export {protect};