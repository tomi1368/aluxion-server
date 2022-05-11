const {uploadFile,downloadFile,deleteFile,updatedFile} = require("../services/s3")
const ErrorResponse = require("../utils/errorResponse")
const httpCodes = require("../constants/httpCodes")

const uploadS3 = async (req,res,next)=>{
    const file = req.files.file
    uploadFile(file,(error,data)=>{
        if(error){
            return next(new ErrorResponse("Something went wrong.",httpCodes.BAD_REQUEST))
        }
        return res.status(httpCodes.OK).json({error:false,message:"File uploaded successfully"});
    })
}

const downloadS3 = async (req,res,next)=>{
    try {
        const fileToSend = await downloadFile(req.query.filename)
        console.log(fileToSend)
        fileToSend.pipe(res.download)
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

const updateS3 = (req,res,next)=>{
    const {newKey,oldKey} = req.body
    updatedFile(newKey,oldKey,(error,data)=>{
        if(error){
            return next(new ErrorResponse("Can not modify the file, Please try again later",httpCodes.BAD_REQUEST))
        }
        req.body.filename = oldKey
        deleteS3(req.body.filename,(error,data)=>{
            if(error){
                return next(new ErrorResponse("Can not modify the file, Please try again later",httpCodes.BAD_REQUEST))
            }
            return res.status(httpCodes.OK).json({error:false,message:"File has been changed successfully"});
        })
    })
}


module.exports = {deleteS3,downloadS3,uploadS3,updateS3}