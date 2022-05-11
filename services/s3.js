require("dotenv").config()
const fs = require('fs');
const aws = require('aws-sdk');

const bucketName = process.env.AWS_S3_BUCKET
const accessKeyId = process.env.AWS_S3_KEY
const secretAccessKey = process.env.AWS_S3_SECRET
const region = process.env.AWS_S3_REGION

aws.config.update({
    region,
    accessKeyId,
    secretAccessKey
});

const s3 = new aws.S3()


const getBuckets = ()=> s3.listBuckets().promise()

const uploadFile = (file,next) => {
    const fileStream = fs.createReadStream(file.tempFilePath)
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.name

    }
    s3.upload(uploadParams,(error,data)=>{
        console.log(data,error)
        next(error,data)
    })
}

const downloadFile = key=>{
    const downloadParams = {
        Key:key,
        Bucket:bucketName
    }
    return s3.getObject(downloadParams).createReadStream();
}

const deleteFile = (key,next)=>{
    const deleteParams = {
        Key:key,
        ...constantParams
    };
    s3.deleteObject(deleteParams,(error,data)=>{
        next(error,data);
    });
}

module.exports = {getBuckets,uploadFile,downloadFile,deleteFile}