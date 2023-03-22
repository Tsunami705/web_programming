/**
 * Serverstub.js
 *
 * Simple dummy server for TDDD97
 *
 * If you're a student, you shouldn't need to look through this file,
 *  the description of how it works is in the lab instructions.
 **/
var serverstub = (function() {
  'use strict';

  var users;
  var loggedInUsers;

  var serverstub = {
    signIn: async function(email, password) {

      let logindata=await fetch('/login',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email:email,psw:password}),
      }).then(res=>{
        return res.json();
      }).then(res=>{
        console.log(res);
        return res;
      }
      );
      return logindata;
    },

    postMessage: async function(token, email,content, toEmail, position){
      let postData=await fetch('/post',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
          'Authorization':token,
          'email':email,
        },
        body: JSON.stringify({receiver:toEmail,poster:email,text:content, position:position}),
      }).then(res=>{
        return res.json();
      }).then(res=>{
        console.log(res);
        return res;
      }
      );
      return postData;
    },

    getUserDataByToken: async function(token,email){
      let userData=await fetch('/getdatabytoken',{
        method:'GET',
        headers:{
          'Content-Type': 'application/json',
          'Authorization':token,
          'email':email,
        },
      }).then(res=>{
        return res.json();
      }).then(res=>{
        console.log(res);
        return res;
      }
      );
      return userData;
    },

    getUserDataByEmail: async function(token, userEmail,email){
      let userData=await fetch('/getdatabyemail?email='+email,{
        method:'GET',
        headers:{
          'Content-Type': 'application/json',
          'Authorization':token,
          'email':userEmail,
        },
      }).then(res=>{
        return res.json();
      }).then(res=>{
        return res;
      }
      );
      return userData;
    },

    getUserMessagesByToken: async function(token,email){
      let message=await fetch('/getmessagebytoken',{
        method:'GET',
        headers:{
          'Content-Type': 'application/json',
          'Authorization':token,
          'email':email,
        },
      }).then(res=>{
        return res.json();
      }).then(res=>{
        console.log(res);
        return res;
      }
      );
      return message;
    },

    getUserMessagesByEmail: async function(token, userEmail,email){
      let userMessage=await fetch('/getmessagebyemail?email='+email,{
        method:'GET',
        headers:{
          'Content-Type': 'application/json',
          'Authorization':token,
          'email':userEmail,
        },
      }).then(res=>{
        return res.json();
      }).then(res=>{
        return res;
      }
      );
      return userMessage;
    },

    signOut: async function(token,userEmail){
      let signoutData=await fetch('/signout',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
          'Authorization':token,
          'email':userEmail,
        },
      }).then(res=>{
        return res.json();
      }).then(res=>{
        console.log(res);
        return res;
      }
      );
      return signoutData;
    },

    signUp: async function(inputObject){ // {email, password, firstname, familyname, gender, city, country}
      console.log(inputObject);
      let signinData=await fetch('/signup',{
        method:'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email:inputObject.email,psw:inputObject.password,
          first_name:inputObject.firstname,fam_name:inputObject.familyname,
          gender:inputObject.gender,city:inputObject.city,
          country:inputObject.country}),
      }).then(res=>{
        return res.json();
      }).then(res=>{
        console.log(res);
        return res;
      }
      );
      return signinData;
    },

    changePassword:async function(token,userEmail,oldPassword, newPassword){
      let changePswData=await fetch('/changepsw',{
        method:'PUT',
        headers:{
          'Content-Type': 'application/json',
          'Authorization':token,
          'email':userEmail,
        },
        body: JSON.stringify({oldpsw:oldPassword,newpsw:newPassword}),
      }).then(res=>{
        return res.json();
      }).then(res=>{
        console.log(res);
        return res;
      }
      );
      return changePswData;
    }
  };

  return serverstub;
})();