const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
        minLength:1
    },
    family_name:{
        type:String,
        required:true,
        minLength:1
    },
    gender:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:false,
        default : "offline"
    },
    visual:{
        type:Number,
        required:false,
        default : 0
    },
    location:{
        type:String,
        required:false,
        default : "none"
    },
});

const User=mongoose.model("User",userSchema);

module.exports=User;