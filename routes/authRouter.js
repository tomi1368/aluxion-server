const router = require("express").Router()
const {login,register,forgotPassword,resetPassword} = require("../controllers/authControllers")



router.post("/register",register)

router.post("/login",login)

router.post("/forgotpassword",forgotPassword)

router.put("/passwordreset/:resetToken",resetPassword)


module.exports = router