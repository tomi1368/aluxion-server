const ErrorResponse = require("../utils/errorResponse")
const httpCodes = require("../constants/httpCodes")
const errorHandler = (err,req,res,next)=>{
    let error = {...err}
    error.message = err.message
    if(error.code === 11000){ //Mongo Duplicate Error
        const message = `Resource Already exists`
        error = new ErrorResponse(message,httpCodes.BAD_REQUEST)
    }
    if(err.name === "ValidationError"){
        const message = Object.values(err.errors).map(e => e.message)
        error = new ErrorResponse(message,httpCodes.BAD_REQUEST)
    }
    res.status(error.statusCode || httpCodes.INTERNAL_SERVER_ERROR).json({
        error:true,
        message:error.message || "Server Error"
    })
}

module.exports = errorHandler