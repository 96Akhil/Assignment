const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../config/config");

function authenticateToken(req,res,next){
    const header = req.headers?.authorization;
    const token = header && header.split(' ')[1];
    if(!token){
        return res.status(400).json({message:"User is unauthorised!"})
    }else{
        const decoded = jwt.verify(token,jwtSecret,(err,decoded)=>{
            if(err){
                return res.status(403).json({message:"Token is not valid!"})
            }
            else{
                req.userID = decoded.id;
                req.email = decoded.userEmail;
                next()
            }
        })
    }
    
}

module.exports = {
    authenticateToken
}