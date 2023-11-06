const mongoose = require("mongoose");
const connect = mongoose.connect("mongodb://127.0.0.1:27017/BTCK");

//check connect
connect.then(()=>{
    console.log("Database connect successfully");
})
.catch(()=>{
    console.log("Database can't connect");
})

//create Schema
const LoginChema = new mongoose.Schema({
    name:{
        type:String,
        require : true
    },
    password:{
        type:String,
        require : true
    }
});

//collection Part
const collection = new mongoose.model("User",LoginChema);

module.exports =collection;