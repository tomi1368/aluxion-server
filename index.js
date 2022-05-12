//env config
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./db/config/db")
const fileUpload = require("express-fileupload");
const app = express()
const PORT = process.env.PORT || 6003
const errorHandler = require("./middlewares/error")
const ImagesRouter = require("./routes/imagesRouter")
const S3Router = require("./routes/s3Router")
//Connect DB
connectDB()


app.use(cors())
app.use(express.json())
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp"
}));


app.use("/images",ImagesRouter)
app.use("/files",S3Router)


app.use(errorHandler)

const server = app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))


process.on("unhandledRejection",(err,promise)=>{
    console.log(`Connection error ${err}`)
    server.close(()=> process.exit(1))
})

