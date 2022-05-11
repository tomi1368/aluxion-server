const router = require("express").Router()
const {deleteS3,downloadS3,uploadS3} = require("../controllers/s3Controllers")

router.post("/",uploadS3)

router.delete("/",deleteS3)

router.get("/",downloadS3)




module.exports = router