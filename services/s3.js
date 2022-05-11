require("dotenv").config();
const fs = require("fs");
const aws = require("aws-sdk");

const bucketName = process.env.AWS_S3_BUCKET;
const accessKeyId = process.env.AWS_S3_KEY;
const secretAccessKey = process.env.AWS_S3_SECRET;
const region = process.env.AWS_S3_REGION;

aws.config.update({
  region,
  accessKeyId,
  secretAccessKey,
});

const s3 = new aws.S3();

const uploadFile = (file, next) => {
  const fileStream = fs.createReadStream(file.tempFilePath);
  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.name,
  };
  s3.upload(uploadParams, (error, data) => {
    console.log(data, error);
    next(error, data);
  });
};

const downloadFile = (key) => {
  const downloadParams = {
    Key: key,
    Bucket: bucketName,
  };
  return s3.getObject(downloadParams).createReadStream();
};

const deleteFile = (key, next) => {
  const deleteParams = {
    Key: key,
    Bucket: bucketName,
  };
  s3.deleteObject(deleteParams, (error, data) => {
    next(error, data);
  });
};

const updatedFile = (oldKey, newKey, next) => {
  s3.copyObject(
    {
      Bucket: bucketName,
      CopySource: `${bucketName}${oldKey}`,
      Key: newKey,
    },
    (error, data) => {
      next(error, data);
    }
  );
};

const getUrlFile = (key) => {
  const signedUrl = s3.getSignedUrl("getObject", {
    Key: key,
    Bucket: bucketName,
    Expires: 900,
  });
  return signedUrl;
};

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile,
  updatedFile,
  getUrlFile,
};
