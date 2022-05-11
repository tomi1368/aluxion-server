const mongoose = require("mongoose")

const connectDB = async()=>{
    await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(res=>console.log(`Conneted to Mongo`))
    .catch(err=>console.log(err))
}

module.exports = connectDB