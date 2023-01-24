//Step 5:skip to the right page

let loggedinusers=localStorage.getItem("loggedinusers");
if(loggedinusers==null){
    let pageload=document.querySelector("#welcomeview");
    let body=document.querySelector("body");
    body.innerHTML=pageload.innerHTML;
    // console.log(pageload.innerHTML);
}else{
    let pageload=document.querySelector("#profileview");
    let body=document.querySelector("body");
    body.innerHTML=pageload.innerHTML;
    let newdiv1=document.createElement("div");
    let welcome_information=document.createElement("h1");
    // console.log(JSON.parse(loggedinusers));
    welcome_information.innerHTML="Welcome, "+Object.values(JSON.parse(loggedinusers))[0];
    newdiv1.appendChild(welcome_information);
    body.appendChild(newdiv1);
}

// Step 3:Confirm password
function confirm_psw(repsw){
    // console.log(input);
    let psw=document.getElementById("psw");
    if(psw.value!==repsw.value){
        psw.setCustomValidity("Password Must be Match.");
       
    }else{
        psw.setCustomValidity("");
        
    }
}


// Step 4:Signup Mechanism
let signup=document.querySelector("#signupform");
// console.log(signup);
// console.log(localStorage.getItem("customerData"));
// let signupbutton=signup[8];

signup.addEventListener("submit",()=>{

    let personalData={
        firstname:signup[0].value,
        familyname:signup[1].value,
        gender:signup[2].value,
        city:signup[3].value,
        country:signup[4].value,
        email:signup[5].value,
        password:signup[6].value
    };

    // local storage
    var myList=localStorage.getItem("customerData");
    if(myList==null){
        localStorage.setItem("customerData",JSON.stringify([personalData]));
    }else{
        let customArray=JSON.parse(myList);
        customArray.push(personalData);
        localStorage.setItem("customerData",JSON.stringify(customArray));
    }

    alert(serverstub.signUp(personalData)["message"]);

});


// Step 5:Signin Mechanism
let signin=document.querySelector("#signinform");
console.log(signin);

signin.addEventListener("submit",()=>{

    let loginData={
        username:signin[0].value,
        password:signin[1].value
    };
    let signinData=serverstub.signIn(loginData.username,loginData.password);

    //session storage
    sessionStorage.setItem(JSON.stringify(loginData.username),signinData.data);
    alert(signinData.message);
});
