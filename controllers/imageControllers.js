const axios = require("axios")
const httpCodes = require("../constants/httpCodes")
const getSplashImages = async (req,res,next)=>{
    const {imageName,pageNumber} = req.query
    try{
        const link = imageName ? `https://api.unsplash.com/search/photos?page=${pageNumber || 1}&query=${imageName}&client_id=${process.env.UNSPLASH_ACCESS_KEY}` :  `https://api.unsplash.com/search/photos?page=${pageNumber || 1}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
        const {data} = await axios.get(link)
        res.status(httpCodes.OK).json({...data})
    }catch(err){
        next(err)
    }
}

module.exports = {getSplashImages}