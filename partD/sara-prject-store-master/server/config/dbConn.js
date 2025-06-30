
const mongoose=require("mongoose")
const connectDB=async()=>{
    try{mongodb:
    await mongoose.connect(process.env.DATABASE_URI)
    //    await mongoose.connect('mongodb://127.0.0.1:27017')

    }catch(ex)
    {console.log("connect to db fail "+ex.message);}
}
module.exports=connectDB