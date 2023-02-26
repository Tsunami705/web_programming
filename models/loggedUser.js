const mongoose=require("mongoose");

const loggedUserSchema=new mongoose.Schema({
    email : {
        type : String,
        required : true
    },
    socketId : {
        type : String,
        required : true
    },
    token : {
        type : String,
        required : true
    },
});


const loggedUser=mongoose.model("loggedUser",loggedUserSchema)

module.exports=loggedUser;