const {uploadFile,downloadFile,deleteFile} = require("../services/s3")
const ErrorResponse = require("../utils/errorResponse")
const httpCodes = require("../constants/httpCodes")
const {getBuckets} = require("../services/s3")
const uploadS3 = async (req,res,next)=>{
    const file = req.files.file
    const buckets = await getBuckets()
    console.log(buckets)
    uploadFile(file,(error,data)=>{
        if(error){
            return next(new ErrorResponse("Something went wrong.",httpCodes.BAD_REQUEST))
        }
        return res.status(httpCodes.OK).json({error:false,message:"File uploaded successfully"});
    })
}

const downloadS3 = async (req,res,next)=>{
    try {
        const fileToSend = await downloadFile(req.body.filename)
        fileToSend.pipe(res)
    } catch (error) {
        next(error)
    }
}

const deleteS3 = (req,res,next)=>{
    deleteFile(req.body.filename,(error,data)=>{
        if(error){
            return next(new ErrorResponse("Can not delete file, Please try again later",httpCodes.BAD_REQUEST))
        }
        return res.status(httpCodes.OK).json({error:false,message:"File has been deleted successfully"});
    })
}


module.exports = {deleteS3,downloadS3,uploadS3}