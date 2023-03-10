const mongoose=require("mongoose");

const loggedSchema=new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    visual : {
        type : Number,
        required : true
    },
    status : {
        type : String,
        required : true
    }
});


const Logged=mongoose.model("loggedUser",loggedSchema)

module.exports=Logged;