const router = require("express").Router()
const {getSplashImages,externalImageToS3} = require("../controllers/imageControllers")
const auth = require("../middlewares/auth")


router.get("/",auth,getSplashImages)

router.post("/",auth,externalImageToS3)


module.exports = router