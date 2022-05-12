const mongoose = require("mongoose")
const {NODE_ENV,MONGO_URI_PRODUCTION,MONGO_URI_TESTING} = process.env
const connectDB = async()=>{
    await mongoose.connect(NODE_ENV == "production" ? MONGO_URI_PRODUCTION : MONGO_URI_TESTING,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(res=>console.log(`Conneted to Mongo`))
    .catch(err=>console.log(err))
}

module.exports = connectDB