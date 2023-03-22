//
//import {post_message} from './public/server_function';
//const post_message = require("./public/server_function");

require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const ejs = require("ejs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const Post = require("./models/post");
const bcrypt = require("bcrypt"); //encrypt the password
const saltRounds = 10; //cost factor，数字越大，加密所花时间越久
const jwt = require("jsonwebtoken");
const methodOverride = require("method-override"); //PUT/PATCH request
const { off } = require("./models/user");

//middleware
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(cookieParser("thisismysecret.")); //内部的str会被用于制作signed cookie

//connect to mongoDB,We use Cloud platform to store data,so don't need to store data in the file
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connected to mongoDB.");
  })
  .catch((e) => {
    console.log("Connection failed.");
    console.log(e);
  });

server.listen(3000, () => {
  console.log("Server is running on port: 3000");
});

io.on("connection", (socket) => {
  console.log("New user connected");

  //console.log(socket.request._query['token']);
  //socket.emit('setClient', { client: socket.id });
  //io.emit('prova1',"prova1");
  socket.on("login", (data) => {
    try {
      let decode = jwt.verify(data.token, process.env.SECRET_KEY);
      email = decode.email;
      console.log("login received by ", email);

      // if not find logged save once new else call remove other
      io.to(email).emit("restoreHomepage");
      io.in(email).socketsLeave(email);
      socket.join(email);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("userBrowsed", (data) => {
    User.findOneAndUpdate({ email: data }, { $inc: { visual: 1 } }).exec();
    updateChart(data);
  });
});

// let onlineUsers = 0;
async function changeStatus(email, status) {
  /* if(status == "online"){
        onlineUsers++;
    }else{
        onlineUsers--;  
    }
    */
  User.findOne({ email: email }).then((user) => {
    if (user) {
      user.status = status;
      user.save();
    }
  });
  updateChart(email);
}

async function updateChart(email) {
  console.log(email);
  let wallPosts = (await Post.find({ receiver: email })).length;
  let pageViews = (await User.findOne({ email: email })).visual;
  let onlineUsers = (await User.find({ status: "online" })).length;
  console.log("wallPosts: ", wallPosts);
  console.log("pageViews: ", pageViews);
  console.log("onlineUsers: ", onlineUsers);
  io.to(email).emit("chart", { wallPosts: wallPosts, pageViews: pageViews });
  io.emit("onlineUsers", { onlineUsers: onlineUsers });
}

//Welcome page
app.get("/", (req, res) => {
  res.render("client.ejs");
});

//signup function
//params:{ first_name, fam_name, gender, city, country, email, psw } -> req.body
app.post("/signup", async (req, res) => {
  let keys = Object.keys(req.body);

  if (keys.length != 7) {
    res.status(404).send({ success: false, message: "Unexpected arguments" });
    return;
  }

  keys.forEach((key) => {
    if (
      key != "email" &&
      key != "psw" &&
      key != "first_name" &&
      key != "fam_name" &&
      key != "gender" &&
      key != "city" &&
      key != "country"
    ) {
      console.log(key);
      res.status(404).send({ success: false, message: "Wrong arguments" });
      return;
    }
  });

  try {
    let { first_name, fam_name, gender, city, country, email, psw } = req.body;
    if (await User.findOne({ email: email })) {
      res.status(409).send({ success: false, message: "User already exists." });
    } else {
      let salt = await bcrypt.genSalt(saltRounds);
      let hashpassword = await bcrypt.hash(psw, salt);

      let newUser = new User({
        first_name: first_name,
        family_name: fam_name,
        gender: gender,
        city: city,
        country: country,
        email: email,
        password: hashpassword,
      });

      if (!validateEmail(email)) {
        res.status(400).send({ success: false, message: "Wrong email format" });
      }

      if (psw.length < 8) {
        res.status(400).send({
          success: false,
          message: "The min length of the password should be 8.",
        });
      } else {
        await newUser
          .save()
          .then((meg) => {
            res.status(200).send({
              success: true,
              message: "Successfully created a new user.",
            });
          })
          .catch((err) => {
            res.status(400).send({
              success: false,
              message: "Form data missing or incorrect type.",
            });
          });
      }
    }
  } catch (err) {
    res.status(400);
    console.log(err);
  }
});

const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

//login function
////params : { email,psw } -> req.body
app.post("/login", async (req, res) => {
  try {
    //Object.keys(req.body).length;
    //console.log(Object.keys(req.body).length);
    let keys = Object.keys(req.body);
    console.log(req.body);
    if (keys.length != 2) {
      res.status(404).send({ success: false, message: "Unexpected arguments" });
      return;
    }

    keys.forEach((key) => {
      if (key != "email" && key != "psw") {
        console.log(key);
        res.status(404).send({ success: false, message: "Wrong arguments" });
        return;
      }
    });

    let { email, psw} = req.body;
    let foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      res
        .status(400)
        .send({ success: false, message: "Wrong username or password." });
    } else {
      bcrypt.compare(psw, foundUser.password, async (err, result) => {
        if (err) {
          res.status(400);
          console.log(err);
        }
        if (result == true) {
          // Create token(Storing in the localStorage)
          const token = jwt.sign(
            { user_id: foundUser._id, email },
            process.env.SECRET_KEY,
            {
              expiresIn: process.env.JWT_EXPIRE,
            }
          );
          // res.cookie("token", token, { signed: false });
          // res.header('Authorization', [token]);
          changeStatus(email, "online");

          // FOR WEB SERVER
          //var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
          //console.log("POSITION:", position);
          // FOR DEBUGGING
          //ip = "193.11.200.152";
          //console.log("login ip: ", ip);

          ///////////////////////let pos = await getLocation(lat, lon);
          //User.findOneAndUpdate(
            //{ email: email },
            //{ $set: { location: position } }
          //).exec();
          // after response,the front-end should add the token to the localStorage
          res.status(201).send({
            success: true,
            message: "Successfully signed in.",
            data: token,
          });
        } else {
          res
            .status(400)
            .send({ success: false, message: "Wrong username or password." });
        }
      });
    }
  } catch (err) {
    res.status(400);
    console.log(err);
  }
});

//new user post
//params : { text, receiver, poster} -> req.body
//params : { token,email } -> header
app.post("/post", async (req, res) => {
  let keys = Object.keys(req.body);

  if (keys.length != 4) {
    res
      .status(404)
      .send({ success: false, message: "Wrong number of arguments" });
    return;
  }

  keys.forEach((key) => {
    if (key != "text" && key != "receiver" && key != "poster" && key != "position") {
      res.status(404).send({ success: false, message: "Wrong arguments" });
      return;
    }
  });

  let token = req.headers.authorization;
  let email = req.headers.email;
  if (token !== undefined) {
    try {
      if (!(await validate_token(token, email))) {
        res.status(400).send({
          success: false,
          message: "You are not signed in,or the token expired.",
        });
        return;
      }
      let { text, receiver, poster, position } = req.body;
      if (text.length == 0) {
        console.log(text);
        console.log(text.length);
        res.status(400).send({ success: false, message: "Empty Message" });
      } else if (!(await User.findOne({ email: receiver }))) {
        res
          .status(400)
          .send({ success: false, message: "No receiver for message" });
      } else if (!(await User.findOne({ email: poster }))) {
        res
          .status(400)
          .send({ success: false, message: "No poster specified" });
      } else {
        // FOR WEB SERVER
        //var ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        //var ip = req.ip;
        console.log("POSITION:", position);
        // FOR DEBUGGING
        //ip = '8.8.8.8';
        //////////////////let pos = await getLocation(lat, lon);
        post_message(text, receiver, poster, position);
        res.status(200).send({ success: true, message: "Post successfully." });
      }
    } catch (e) {
      console.log(e);
      res.status(400).send({ success: false, message: "post message error" });
    }
  } else {
    res.status(400).send({ success: false, message: "You are not signed in." });
  }
});
// Put post in database
async function post_message(text, receiver, poster, pos) {
  
  let newPost = new Post({
    text: text,
    receiver: receiver,
    poster: poster,
    location: pos,
  });
  await newPost.save();
  updateChart(receiver);
}

//signout function
//params : { token,email } -> header
app.post("/signout", async (req, res) => {
  let keys = Object.keys(req.body);

  if (keys.length != 0) {
    res.status(404).send({ success: false, message: "Unexpected arguments" });
    return;
  }

  //Always use the header to deliver the token, use cookie or localStorage in the front end to pass the token to the ajax header,
  //When logging out, remove the token in localStorage or cookies
  let token = req.headers.authorization;
  let email = req.headers.email;
  if (token !== undefined) {
    if (!(await validate_token(token, email))) {
      res.status(400).send({
        success: false,
        message: "You are not signed in,or the token expired.",
      });
      return;
    }
    // after response,the front-end should remove the token from the localStorage
    // res.clearCookie('token');

    //Remove from socket room
    io.in(email).socketsLeave(email);
    //Change status to offline
    changeStatus(email, "offline");

    res.status(200).send({ success: true, message: "Signout successfully." });
  } else {
    res.status(403).send({ success: false, message: "You are not signed in." });
  }
});

//change password
// params:{oldpsw, newpsw}->req.body
//params : { token,email } -> header
app.put("/changepsw", async (req, res) => {
  let keys = Object.keys(req.body);

  if (keys.length != 2) {
    res
      .status(404)
      .send({ success: false, message: "Wrong number of arguments" });
    return;
  }

  keys.forEach((key) => {
    if (key != "oldpsw" && key != "newpsw") {
      res.status(404).send({ success: false, message: "Wrong arguments" });
      return;
    }
  });

  let token = req.headers.authorization;
  if (token !== undefined) {
    let ver_email = req.headers.email;
    if (!(await validate_token(req.headers.authorization, ver_email))) {
      res.status(400).send({
        success: false,
        message: "You are not signed in,or the token expired.",
      });
      return;
    }
    let data = await get_user_data_by_token(req.headers.authorization);
    let {
      first_name,
      family_name,
      gender,
      city,
      country,
      email,
      password,
      token,
    } = data.data;
    if (data.success == true) {
      let { oldpsw, newpsw } = req.body;
      if (newpsw.length < 8) {
        res
          .status(400)
          .send({ success: false, message: "New password is shorter than 8." });
        // res.end();
      }
      bcrypt.compare(oldpsw, data.data.password, async (err, result) => {
        if (err) {
          res.status(400);
          console.log(err);
        }
        if (result == true) {
          try {
            let salt = await bcrypt.genSalt(saltRounds);
            let hashnewpassword = await bcrypt.hash(newpsw, salt);
            let foundUser = await User.findOneAndUpdate(
              { email: email },
              {
                first_name,
                family_name,
                gender,
                city,
                country,
                email,
                password: hashnewpassword,
              },
              {
                new: true,
                runValidators: true,
                overwrite: true,
              }
            );
            res.clearCookie("token");
            res
              .status(200)
              .send({ success: true, message: "Password changed." });
          } catch (err) {
            res.status(400);
            console.log(err);
          }
        } else {
          res.status(403).send({ success: false, message: "Wrong password." });
        }
      });
    } else {
      res
        .status(403)
        .send({ success: false, message: "You are not logged in." });
    }
  } else {
    res.status(403).send({ success: false, message: "You are not logged in." });
  }
});

//get user data by email
//Retrieves the stored data for the user specified by the passed email address
async function get_user_data_by_email(token, email) {
  if (token === undefined) {
    return { success: false, message: "You are not signed in." };
  } else {
    let foundUser = await User.findOne({ email: email });
    if (!foundUser) {
      return { success: false, message: "No such user." };
    } else {
      updateChart(email);
      return {
        success: true,
        message: "User data retrieved.",
        data: foundUser,
      };
    }
  }
}
// API
//params : { email } -> req.query
//params : { token,email } -> header
app.get("/getdatabyemail", async (req, res) => {
  let key = Object.keys(req.query);

  if (key.length != 1) {
    res
      .status(404)
      .send({ success: false, message: "Wrong number of arguments" });
    return;
  }

  if (key != "email") {
    res.status(404).send({ success: false, message: "Wrong arguments" });
    return;
  }

  let token = req.headers.authorization;
  let ver_email = req.headers.email;
  if (token === undefined) {
    res.status(400).send({
      success: false,
      message: "You are not signed in,or the token expired1112.",
    });
  } else {
    if (!(await validate_token(token, ver_email))) {
      res.status(400).send({
        success: false,
        message: "You are not signed in,or the token expired.",
      });
      return;
    }
    let { email } = req.query;
    let result = await get_user_data_by_email(token, email);
    try {
      if (result.success == true) {
        res.status(200).send(result);
      } else {
        res.status(400).send(result);
      }
    } catch (e) {
      console.log(e);
    }
  }
});

//get user message by email
async function get_user_message_by_email(token, email) {
  if (token == undefined) {
    return { success: false, message: "Not signed in" };
  }

  let foundPost = await Post.find({ receiver: email });

  //Update the user messages
  //await User.findOneAndUpdate({ email: email }, {$inc: {'visual' : 1}}).exec();

  if (foundPost.length == 0) {
    return { success: false, message: "No such user." };
  }

  updateChart(email);
  return { success: true, message: "User data retrieved.", post: foundPost };
}
//API
//params : { email } -> req.query
//params : { token,email } -> header
app.get("/getmessagebyemail", async (req, res) => {
  let key = Object.keys(req.query);

  if (key.length != 1) {
    res
      .status(404)
      .send({ success: false, message: "Wrong number of arguments" });
    return;
  }

  if (key != "email") {
    res.status(404).send({ success: false, message: "Wrong arguments" });
    return;
  }

  let token = req.headers.authorization;
  let ver_email = req.headers.email;
  if (token === undefined) {
    res.status(400).send({
      success: false,
      message: "You are not signed in,or the token expired.",
    });
  } else {
    if (!(await validate_token(token, ver_email))) {
      res.status(400).send({
        success: false,
        message: "You are not signed in,or the token expired.",
      });
      return;
    }
    let { email } = req.query;
    let result = await get_user_message_by_email(token, email);
    try {
      if (result.success == true) {
        res.status(200).send(result);
      } else {
        res.status(400).send(result);
      }
    } catch (e) {
      console.log(e);
    }
  }
});

//get user data by token
//return the data for the user whom the passed token is issued for
async function get_user_data_by_token(token) {
  if (token === undefined) {
    return { success: false, message: "You are not signed in." };
  } else {
    try {
      let decoded = jwt.verify(token, process.env.SECRET_KEY);
      // console.log(decoded);
      foundUser = await User.findOne({ email: decoded.email });
      // console.log(foundUser);
    } catch (err) {
      console.log(err);
    }
    if (!foundUser) {
      return { success: false, message: "You are not signed in." };
    } else {
      return get_user_data_by_email(token, foundUser.email);
    }
  }
}
//API
//params : { token,email } -> header
app.get("/getdatabytoken", async (req, res) => {
  let key = Object.keys(req.query);

  if (key.length != 0) {
    res
      .status(404)
      .send({ success: false, message: "Wrong number of arguments" });
    return;
  }

  let token = req.headers.authorization;
  let ver_email = req.headers.email;
  if (token === undefined) {
    res.status(400).send({
      success: false,
      message: "You are not signed in,or the token expired.",
    });
  } else {
    if (!(await validate_token(token, ver_email))) {
      res.status(400).send({
        success: false,
        message: "You are not signed in,or the token expired.",
      });
      return;
    }
    let result = await get_user_data_by_token(token);
    try {
      if (result.success == true) {
        res.status(200).send(result);
      } else {
        res.status(400).send(result);
      }
    } catch (e) {
      console.log(e);
    }
  }
});

//get user message by token
async function get_user_message_by_token(token) {
  if (token == undefined) {
    return { success: false, message: "You are not signed in." };
  }

  try {
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    return get_user_message_by_email(token, decoded.email);
  } catch (e) {
    return { success: false, message: "Wrong token or expired" };
  }
}
//API
//params : { token,email } -> header
app.get("/getmessagebytoken", async (req, res) => {
  let key = Object.keys(req.query);

  if (key.length != 0) {
    res
      .status(404)
      .send({ success: false, message: "Wrong number of arguments" });
    return;
  }

  let token = req.headers.authorization;
  let ver_email = req.headers.email;
  if (token === undefined) {
    res.status(400).send({
      success: false,
      message: "You are not signed in,or the token expired.",
    });
  } else {
    if (!(await validate_token(token, ver_email))) {
      res.status(400).send({
        success: false,
        message: "You are not signed in,or the token expired.",
      });
      return;
    }
    let result = await get_user_message_by_token(token);
    try {
      if (result.success == true) {
        res.status(200).send(result);
      } else {
        res.status(400).send(result);
      }
    } catch (e) {
      console.log(e);
    }
  }
});

// validate the received token
//every time we send a http requests needed token,we should send the email inside the header too,and compare them
//If verify failed ,it should return false.
//email should also store in the localStorage when successfully signed in.
async function validate_token(token, email) {
  // if (token === undefined) {
  //     return false;
  // }
  try {
    let decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    if (decoded.email == email) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
}

app.get("/*", (req, res) => {
  res.status(300).redirect("/");
});
