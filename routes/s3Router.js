const router = require("express").Router()
const {deleteS3,downloadS3,uploadS3,updateS3} = require("../controllers/s3Controllers")
const auth = require("../middlewares/auth")

router.post("/",auth,uploadS3)

router.delete("/",auth,deleteS3)

router.get("/",downloadS3)

router.put("/",auth,updateS3)



module.exports = router