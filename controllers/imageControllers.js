const axios = require("axios");
const fs = require("fs");
const path = require("path");
const httpCodes = require("../constants/httpCodes");
const { uploadFile } = require("../services/s3");
const ErrorResponse = require("../utils/errorResponse");

const baseUrl = `https://api.unsplash.com`;

const getSplashImages = async (req, res, next) => {
  const { imageName, pageNumber } = req.query;
  try {
    const link = imageName
      ? `${baseUrl}/search/photos?page=${
          pageNumber || 1
        }&query=${imageName}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
      : `${baseUrl}/search/photos?page=${pageNumber || 1}&client_id=${
          process.env.UNSPLASH_ACCESS_KEY
        }`;
    const { data } = await axios.get(link);
    res.status(httpCodes.OK).json({ ...data });
  } catch (err) {
    next(err);
  }
};

const externalImageToS3 = async (req, res, next) => {
  const { id } = req.query;
  const pathImages = path.resolve(__dirname, "../public/images", `${id}.jpg`);
  try {
    const response = await axios.get(
      `${baseUrl}/photos/${id}?client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    );
    if (!response.data)
      return next(new ErrorResponse("Image not found", httpCodes.NOT_FOUND));
    const downloadLink = response.data.links.download;
    const responseImg = await axios({
      url: downloadLink,
      method: "GET",
      responseType: "stream",
    });
    const imgFile = responseImg.data.pipe(fs.createWriteStream(pathImages));
    const file = {
      tempFilePath: imgFile.path,
      name: id,
    };
    uploadFile(file, (error, data) => {
      if (error)
        return next(
          new ErrorResponse("Cannot upload file", httpCodes.BAD_REQUEST)
        );
      return res
        .status(httpCodes.OK)
        .json({ error: false, message: "File uploaded successfully" });
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSplashImages, externalImageToS3 };
