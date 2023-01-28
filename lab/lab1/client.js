//Step 5:skip to the right page
let loggedinusers=localStorage.getItem("loggedinusers");
// console.log(Object.keys(loggedinusers).length);
// console.log(JSON.stringify(loggedinusers));

if((loggedinusers==null)||(Object.keys(loggedinusers).length===2)){
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
    let homePage=document.querySelector("section.homepage");
    let browsePage=document.querySelector("section.browsepage");
    let accountPage=document.querySelector("section.accountpage");

    browsePage.style.display="none";
    accountPage.style.display="none";
    homePage.style.display="block";
    sessionStorage.setItem("tabLiNum","home");
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
        // sessionStorage.setItem(JSON.stringify(loginData.username),signinData.data);
        alert(signinData.message);
        if(signinData.success){
            setTimeout(()=>{
                location.reload();
          },500);
        }else{
            null;
        }

    });
}catch(error){
    console.log(error);
}

let Token=Object.keys(JSON.parse(localStorage.getItem("loggedinusers")))[0];

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


// Step 7
let changepswButton=document.querySelector("div.changepsw");
try{
    window.addEventListener("load",()=>{
        // Step 7:display your account information
        // let Token=Object.keys(JSON.parse(localStorage.getItem("loggedinusers")))[0];
        let userdata=serverstub.getUserDataByToken(Token).data;
        console.log(userdata);
        //email
        let usernameinfo=document.querySelectorAll("div.infobox div.usernameinfo")[1];
        usernameinfo.innerHTML=userdata.email;
        //name
        let nameinfo=document.querySelectorAll("div.infobox div.nameinfo")[1];
        nameinfo.innerHTML=userdata.firstname+" "+userdata.familyname;
        //gender
        let genderinfo=document.querySelectorAll("div.infobox div.genderinfo")[1];
        genderinfo.innerHTML=userdata.gender;
        //city
        let cityinfo=document.querySelectorAll("div.infobox div.cityinfo")[1];
        cityinfo.innerHTML=userdata.city;
        //country
        let countryinfo=document.querySelectorAll("div.infobox div.countryinfo")[1];
        countryinfo.innerHTML=userdata.country;
});
}catch(e){
}

// Step 7:Signout
try{
    signoutButton=document.querySelector("div.logout");
    signoutButton.addEventListener("click",()=>{
        alert(serverstub.signOut(Token).message);
        // localStorage.removeItem("loggedinusers");
        location.reload();
    })
}catch(e){

}

// Step 7:Change password

function confirm_change_psw(repsw){
    let changepswform=document.querySelector("#changeform");
    let newpsw=changepswform[1];
    if(newpsw.value!==repsw.value){
        newpsw.setCustomValidity("Password Must be Match.");
    }else{
        newpsw.setCustomValidity(""); 
    }
}

var i=1;
try{
    changepswButton.addEventListener("click",()=>{
        let Token=Object.keys(JSON.parse(localStorage.getItem("loggedinusers")))[0];
        let changepswView=document.querySelector("div.change");
        if(i%2==1){
            changepswView.style.display="block";
            i++;
            let changepswform=document.querySelector("#changeform");
            changepswform.addEventListener("submit",()=>{
                let oldpsw=changepswform[0];
                let newpsw=changepswform[1];
                let newpswconfirm=changepswform[2];
                let changepswfun=serverstub.changePassword(Token,oldpsw.value,newpsw.value);
                let wwww=changepswfun.success
                if(wwww){
                    alert("Password changed.Now you should log in again.");
                    serverstub.signOut(Token);
                    location.reload();
                }else{
                    alert("Wrong password.");
                }
            })
        }else{
            changepswView.style.display="none";
            i++;
        }
    })
}catch(e){}

