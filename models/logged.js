const mongoose=require("mongoose");

const loggedSchema=new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    token : {
        type : String,
        required : true
    },
});


const Logged=mongoose.model("loggedUser",loggedSchema)

module.exports=Logged;