const mongoose=require("mongoose");

const postSchema=new mongoose.Schema({
    text:{
        type:String,
        required:true,
        minLength:1
    },
    receiver:{
        type:String,
        required:true,
        minLength:1
    },
    poster:{
        type:String,
        required:true
    }
});

const Post=mongoose.model("Post",postSchema);

module.exports=Post;