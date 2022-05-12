const {
  uploadFile,
  downloadFile,
  deleteFile,
  updatedFile,
  getUrlFile,
} = require("../services/s3");
const ErrorResponse = require("../utils/errorResponse");
const httpCodes = require("../constants/httpCodes");

const uploadS3 = async (req, res, next) => {
  const file = req.files.file;
  uploadFile(file, (error, data) => {
    if (error) {
      return next(
        new ErrorResponse("Something went wrong.", httpCodes.BAD_REQUEST)
      );
    }
    return res
      .status(httpCodes.OK)
      .json({ error: false, message: "File uploaded successfully" });
  });
};

const downloadS3 = async (req, res, next) => {
  try {
    const fileToSend = await downloadFile(req.query.filename);
    fileToSend.pipe(res);
  } catch (error) {
    next(error);
  }
};

const deleteS3 = (req, res, next) => {
  deleteFile(req.body.filename, (error, data) => {
    if (error) {
      return next(
        new ErrorResponse(
          "Can not delete file, Please try again later",
          httpCodes.BAD_REQUEST
        )
      );
    }
    return res
      .status(httpCodes.OK)
      .json({ error: false, message: "File has been deleted successfully" });
  });
};

const updateS3 = (req, res, next) => {
  const { newKey, oldKey } = req.body;
  updatedFile(oldKey, newKey, (error, data) => {
    if (error) {
      return next(
        new ErrorResponse(
          "Can not modify the file, Please try again later",
          httpCodes.BAD_REQUEST
        )
      );
    }
    deleteFile(oldKey, (error, data) => {
      if (error) {
        return next(
          new ErrorResponse(
            "Can not modify the file, Please try again later",
            httpCodes.BAD_REQUEST
          )
        );
      }
      const downloadURL = getUrlFile(newKey);
      const newURL = downloadURL.split("?")[0]
      return res.status(httpCodes.OK).json({ error: false, newURL,downloadURL });
    });
  });
};

module.exports = { deleteS3, downloadS3, uploadS3, updateS3 };
