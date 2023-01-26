//Step 5:skip to the right page

let loggedinusers=localStorage.getItem("loggedinusers");
if(loggedinusers==null){
    let pageload=document.querySelector("#welcomeview");
    let body=document.querySelector("body");
    body.innerHTML=pageload.innerHTML;
    // console.log(pageload.innerHTML);
}else{
    // let pageload=document.querySelector("#profileview");
    // let body=document.querySelector("body");
    // body.innerHTML=pageload.innerHTML;
    // let newdiv1=document.createElement("div");
    // let welcome_information=document.createElement("h1");
    // // console.log(JSON.parse(loggedinusers));
    // welcome_information.innerHTML="Welcome, "+Object.values(JSON.parse(loggedinusers))[0];
    // newdiv1.appendChild(welcome_information);
    // body.appendChild(newdiv1);
    null;
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
try{
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
}catch(error){
    console.log(error);
}

// Step 5:Signin Mechanism
try{
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
}catch(error){
    console.log(error);
}


// Step 6:Implementing tabs
let logoButton=document.querySelector("header h1");
let homeButton=document.querySelector("header.tabcard nav ul li.homeButton");
let browseButton=document.querySelector("header.tabcard nav ul li.browseButton");
let accountButton=document.querySelector("header.tabcard nav ul li.accountButton");

console.log(browseButton);

let homePage=document.querySelector("section.homepage");
let browsePage=document.querySelector("section.browsepage");
let accountPage=document.querySelector("section.accountpage");

// Refresh the web page without changing tabs
let tabLiNum=sessionStorage.getItem("tabLiNum");
if(tabLiNum===null){}else if(tabLiNum==="home"){
}else if(tabLiNum==="browse"){
    browsePage.style.display="block";
    accountPage.style.display="none";
    homePage.style.display="none";
}else if(tabLiNum==="account"){
    browsePage.style.display="none";
    accountPage.style.display="block";
    homePage.style.display="none";
}

homeButton.addEventListener("click",()=>{
    browsePage.style.display="none";
    accountPage.style.display="none";
    homePage.style.display="block";
    sessionStorage.setItem("tabLiNum","home");
});

logoButton.addEventListener("click",()=>{
    browsePage.style.display="none";
    accountPage.style.display="none";
    homePage.style.display="block";
    sessionStorage.setItem("tabLiNum","home");
});

browseButton.addEventListener("click",()=>{
    browsePage.style.display="block";
    accountPage.style.display="none";
    homePage.style.display="none";
    sessionStorage.setItem("tabLiNum","browse");
});

accountButton.addEventListener("click",()=>{
    browsePage.style.display="none";
    accountPage.style.display="block";
    homePage.style.display="none";
    sessionStorage.setItem("tabLiNum","account");
});



