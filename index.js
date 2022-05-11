//env config
require("dotenv").config()
const express = require("express")
const cors = require("cors")
const connectDB = require("./db/config/db")
const app = express()
const PORT = process.env.PORT || 6003
const errorHandler = require("./middlewares/error")
const ImagesRouter = require("./routes/imagesRouter")
//Connect DB
connectDB()


app.use(cors())
app.use(express.json())


app.use("/images",ImagesRouter)

app.use(errorHandler)

const server = app.listen(PORT,()=> console.log(`Server running on port ${PORT}`))


process.on("unhandledRejection",(err,promise)=>{
    console.log(`Connection error ${err}`)
    server.close(()=> process.exit(1))
})

