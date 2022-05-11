const router = require("express").Router()
const {getSplashImages} = require("../controllers/imageControllers")


router.get("/",getSplashImages)

module.exports = router