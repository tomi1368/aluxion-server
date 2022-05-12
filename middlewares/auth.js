const ErrorResponse = require("../utils/errorResponse")
const httpCodes = require("../constants/httpCodes")
const jwt = require("jsonwebtoken")
const User = require("../db/models/User")
const auth = async (req,res,next)=>{
    let token
    let auth = req.get("Authorization")
    if(auth && auth.startWith("Bearer")) token= auth.split(" ")[1]
    if(!token || token == "") return next(new ErrorResponse("Not authorizated",httpCodes.UNAUTHORIZED))
    try{
        let decodifed = jwt.verify(token,process.env.JWT_SECRET)
        const user = await User.findById(decodifed.id)
        if(!user) next(new ErrorResponse("Not authorizated",httpCodes.UNAUTHORIZED))
        req.user = user
        next()
    }catch(err){
       next(err)
    }
}

module.exports = auth