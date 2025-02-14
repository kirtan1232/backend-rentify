const mongoose = require("mongoose");

const connectDb = async ()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/db_rentify")
        console.log("MongoDb Connected")
    }catch (e){
        console.log("MongoDb not connected");
    }
}

module.exports=connectDb;