require("dotenv").config();
const express=require("express");
const app=express();
const ejs=require("ejs");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const cookieParser=require("cookie-parser");
const User=require("./models/user");
const Post=require("./models/post");
const bcrypt=require("bcrypt");//encrypt the password
const saltRounds=10;    //cost factor，数字越大，加密所花时间越久
const jwt = require('jsonwebtoken');
const methodOverride=require("method-override"); //PUT/PATCH request
var loggedInUsers;


//middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(cookieParser("thisismysecret."));//内部的str会被用于制作signed cookie


//connect to mongoDB
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Successfully connected to mongoDB.");
}).catch((e)=>{
    console.log("Connection failed.");
    console.log(e);
});


// 
app.get("/",(req,res)=>{
    res.render("client.ejs");
});

//signup function
app.post("/signup",async (req,res)=>{
    try{
        let{first_name,fam_name,gender,city,country,email,psw}=req.body;
        if(await User.findOne({email:email})){
            res.status(409).send({"success": false, "message": "User already exists."});
        }else{
            let salt=await bcrypt.genSalt(saltRounds);
            let hashpassword=await bcrypt.hash(psw,salt);

            let newUser=new User({
                first_name:first_name,
                family_name:fam_name,
                gender:gender,
                city:city,
                country:country,
                email:email,
                password:hashpassword,
            });

            if(newUser.password.length<8){
                res.status(400).send({"success": false, "message": "The min length of the password should be 8."});
            }
            else{
                await newUser.save().then(meg=>{
                    res.status(200).send({"success": true, "message": "Successfully created a new user."});
                }).catch(err=>{
                    res.status(400).send({"success": false, "message": "Form data missing or incorrect type."});
                });
            }
        }
    }catch(err){
        res.status(400);
        console.log(err);
    }
});


//login function
app.post("/login",async (req,res)=>{
    try{
        let {email,psw}=req.body;
        let foundUser=await User.findOne({email:email});
        if(!foundUser){
            res.status(400).send({"success": false, "message": "Wrong username or password."});
        }else{
            bcrypt.compare(psw,foundUser.password,(err,result)=>{
                if(err){
                    res.status(400);
                    console.log(err);
                }
                if(result==true){

                    // Create token(Storing in the localStorage)
                    const token=jwt.sign(
                        {user_id:foundUser._id,email},
                        process.env.SECRET_KEY,{
                            expiresIn:process.env.JWT_EXPIRE,
                        }
                    );
                    res.cookie("token",token,{signed:false});
                    res.header('Authorization',[token]);


                    // after response,the front-end should add the token to the localStorage
                    res.status(200).send({"success": true, "message": "Successfully signed in.", "data": token});
                }else{
                    res.status(400).send({"success": false, "message": "Wrong username or password."});
                }
            });
        }
    }catch(err){
        res.status(400);
        console.log(err);
    }
    
});


//signout function
app.post("/signout",(req,res)=>{
    //Always use the header to deliver the token, use cookie or localStorage in the front end to pass the token to the ajax header,
     //When logging out, remove the token in localStorage or cookies
    let token=req.headers.authorization;
    if(token!==null){
        // after response,the front-end should remove the token from the localStorage
        res.clearCookie('token');
        res.status(200).send({"success": true, "message": "Successfully signed out."});
    }else{
        res.status(403).send({"success": false, "message": "You are not signed in."});
    }
})


//change password
app.put("/changepsw",async (req,res)=>{
    let token=req.headers.authorization;
    if(token!==null){
        let data=await get_user_data_by_token(req.headers.authorization);
        let {first_name,family_name,gender,city,country,email,password,token}=data.data;
        if(data.success==true){
            let{oldpsw,newpsw}=req.body;
            bcrypt.compare(oldpsw,data.data.password,async (err,result)=>{
                if(err){
                    res.status(400);
                    console.log(err);
                }
                if(result==true){
                    try{
                        let salt=await bcrypt.genSalt(saltRounds);
                        let hashnewpassword=await bcrypt.hash(newpsw,salt);
                        let foundUser=await User.findOneAndUpdate({email:email},{first_name,family_name,gender,city,country,email,password:hashnewpassword},
                            {
                                new:true,
                                runValidators:true,
                                overwrite:true
                            });
                        res.clearCookie('token');
                        res.status(200).send({"success": true, "message": "Password changed."});
                    }catch(err){
                        res.status(400);
                        console.log(err);
                    }
                }else{
                    res.status(403).send({"success": false, "message": "Wrong password."});
                }})
        }else{
            res.status(403).send({"success": false, "message": "You are not logged in."});
        }
    }else{
        res.status(403).send({"success": false, "message": "You are not logged in."});
    }
});


//get user data by email
async function get_user_data_by_email(token,email){
    if(token===undefined){
        return {"success": false, "message": "You are not signed in."};
    }else{
        let foundUser=await User.findOne({email:email});
        if(!foundUser){
            return {"success": false, "message": "No such user."};
        }else{
            return {"success": true, "message": "User data retrieved.", "data": foundUser};
        }
    }
}

app.get("/sdsdf",(req,res)=>[
    
])


//get user data by token
async function get_user_data_by_token(token){
    if(token===null){
        return {"success": false, "message": "You are not signed in."};
    }else{
        try{
            let decoded=jwt.verify(token,process.env.SECRET_KEY);
            // console.log(decoded);
            foundUser =await User.findOne({email:decoded.email});
            // console.log(foundUser);
        }catch(err){
            console.log(err);
        }
        if(!foundUser){
            return {"success": false, "message": "You are not signed in."};
        }else{
            return get_user_data_by_email(token,foundUser.email);
        }
    }
}


// get user data by email



// validate the received token
async function validate_token(token){

    
}


app.get("/*",(req,res)=>{
    res.status(300).redirect("/");
})

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});


