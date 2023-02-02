
//Step 5:skip to the right page
let loggedinusers=localStorage.getItem("loggedinusers");
let welcomepage=document.querySelector("#welcomepage");
let profilepage=document.querySelector("#profilepage");

if((loggedinusers==null)||(Object.keys(loggedinusers).length===2)){
    profilepage.style.display="none";
    welcomepage.style.display="block";
}else{
    profilepage.style.display="block";
    welcomepage.style.display="none";
    
    let homePage=document.querySelector("section.homepage");
    let browsePage=document.querySelector("section.browsepage");
    let accountPage=document.querySelector("section.accountpage");

    browsePage.style.display="none";
    accountPage.style.display="none";
    homePage.style.display="block";
    // sessionStorage.setItem("tabLiNum","home");
}

// Step 3:Confirm password
function confirm_psw(){
    var psw=document.getElementById("psw");
    var repsw=document.getElementById("repsw");
    if(psw.value!==repsw.value){
        psw.setCustomValidity("Password Must be Match.");
        return ;
    }else{
        psw.setCustomValidity("");
        return ;
    }
}


// Step 4:Signup Mechanism
try{
    let signup=document.querySelector("#signupform");
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
        let check_if_signup_message_appear=document.querySelector("h3.signup_message");
        if(!check_if_signup_message_appear){
            null;
        }else{
            check_if_signup_message_appear.remove();
        }
        let signup_data=serverstub.signUp(personalData);
        let signup_message=document.createElement("h3");
        signup_message.className="signup_message";
        signup_message.innerHTML=signup_data.message;
        signup_message.style.margin="1rem";
        document.querySelector("#signup").appendChild(signup_message);

    });
}catch(error){
    console.log(error);
}

let j=true;
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
        console.log(signinData.message);
        //session storage
        // sessionStorage.setItem(JSON.stringify(loginData.username),signinData.data);
        let check_if_signin_message_exist=document.querySelector("h3.signin_fail_message");
        if(signinData.success){
            if(!check_if_signin_message_exist){
                null;
            }else{
                check_if_signin_message_exist.remove();
            }

            var Token=Object.keys(JSON.parse(localStorage.getItem("loggedinusers")))[0];
            // console.log(Token);
            profilepage.style.display="block";
            welcomepage.style.display="none";
            browsePage.style.display="none";
            accountPage.style.display="none";
            homePage.style.display="block";
            sessionStorage.setItem("tabLiNum","home");

            load_profile_page();

        }else{
            if(!check_if_signin_message_exist){
                null;
            }else{
                check_if_signin_message_exist.remove();
            }
            let signin_fail_message=document.createElement("h3");
            signin_fail_message.innerHTML=signinData.message;
            signin_fail_message.className="signin_fail_message";
            signin_fail_message.style.fontSize="10px";
            document.querySelector("#signin").appendChild(signin_fail_message);

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
// let tabLiNum=sessionStorage.getItem("tabLiNum");
// if(tabLiNum===null){}else if(tabLiNum==="home"){
// }else if(tabLiNum==="browse"){
//     browsePage.style.display="block";
//     accountPage.style.display="none";
//     homePage.style.display="none";
// }else if(tabLiNum==="account"){
//     browsePage.style.display="none";
//     accountPage.style.display="block";
//     homePage.style.display="none";
// }

// homeButton.addEventListener("click",()=>{
//     browsePage.style.display="none";
//     accountPage.style.display="none";
//     homePage.style.display="block";
//     sessionStorage.setItem("tabLiNum","home");
// });

// logoButton.addEventListener("click",()=>{
//     browsePage.style.display="none";
//     accountPage.style.display="none";
//     homePage.style.display="block";
//     sessionStorage.setItem("tabLiNum","home");
// });

// browseButton.addEventListener("click",()=>{
//     browsePage.style.display="block";
//     accountPage.style.display="none";
//     homePage.style.display="none";
//     sessionStorage.setItem("tabLiNum","browse");
// });

// accountButton.addEventListener("click",()=>{
//     browsePage.style.display="none";
//     accountPage.style.display="block";
//     homePage.style.display="none";
//     sessionStorage.setItem("tabLiNum","account");
// });


// Step 7


let changepswButton=document.querySelector("div.changepsw");

try{
    window.addEventListener("load",()=>{
        var Token=Object.keys(JSON.parse(localStorage.getItem("loggedinusers")))[0];
        if(!Token){
            null;
        }else{
            load_profile_page();
        }
    });
}catch(e){
}

// Step 7:Signout
try{
    signoutButton=document.querySelector("div.logout");
    signoutButton.addEventListener("click",()=>{
        let Token=Object.keys(JSON.parse(localStorage.getItem("loggedinusers")))[0];
        signoutData=serverstub.signOut(Token);
        if(signoutData.success){
            sessionStorage.setItem("tabLiNum","home");
            profilepage.style.display="none";
            welcomepage.style.display="block";
        }else{
            let check_if_loggout_information_exist=document.querySelector("h3.fail_message_logout");
            if(!check_if_loggout_information_exist){
                null;
            }else{
                check_if_loggout_information_exist.remove();
            }
            let fail_message_logout=document.createElement("h3");
            fail_message_logout.innerText=signoutData.message;
            fail_message_logout.className="fail_message_logout";
            document.querySelector("section.accountpage").appendChild(fail_message_logout);
        }
        // localStorage.removeItem("loggedinusers");
    })
}catch(e){

}

// Step 7:Change password

function confirm_change_psw(){
    let changepswform=document.querySelector("#changeform");
    let newpsw=changepswform[1];
    let repsw=changepswform[2];
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
                let check_if_prompt_exist=document.querySelector("h3.prompt_information");
                if(!check_if_prompt_exist){
                    null;
                }else{
                    check_if_prompt_exist.remove();
                }
                if(wwww){
                    serverstub.signOut(Token);
                    document.querySelector("#oldpsw").value="";
                    document.querySelector("#newpsw").value="";
                    document.querySelector("#newpswconfirm").value="";
                    let prompt_information=document.createElement("h3");
                    prompt_information.innerHTML="Password changed.You will be logged out in three seconds, or refresh the page manually.";
                    prompt_information.className="prompt_information";
                    document.querySelector("div.change").appendChild(prompt_information);
                    setTimeout(()=>{
                        prompt_information.remove();
                        changepswView.style.display="none";
                        profilepage.style.display="none";
                        welcomepage.style.display="block";
                    },3000);
                    i++;
                }else{
                    let prompt_information=document.createElement("h3");
                    prompt_information.innerHTML="Wrong current password.";
                    prompt_information.className="prompt_information";
                    document.querySelector("div.change").appendChild(prompt_information);
                }
            })
        }else{
            changepswView.style.display="none";
            i++;
        }
    })
}catch(e){}





/*******************************/

function hashfunc(String){
    let result=0;
    for(k of String){
        result=result+k.charCodeAt();
    }
    result=result%10;
    return result;
} 
function load_profile_page(){
    // Step 7:display your account information

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


    let Token=Object.keys(JSON.parse(localStorage.getItem("loggedinusers")))[0];
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


    //HOMEPAGE        
    let nameHome=document.querySelectorAll("h1.nameHome")[0];
    nameHome.innerHTML=userdata.firstname+" "+userdata.familyname;

    let userHome=document.querySelectorAll("h3.userHome")[0];
    userHome.innerHTML=userdata.email;

    let infoHome=document.querySelectorAll("p.infoHome")[0];
    infoHome.innerHTML="Hello, I'm from "+userdata.city+" in "+userdata.country;

    let imagesrc = "https://randomuser.me/api/portraits/lego/"+hashfunc(userdata.email) +".jpg";
    document.getElementById("profileImage").src=imagesrc;

    const postBtn = document.querySelector("#postBtn");
    const messageText = document.querySelector("#messageText");
    const email = document.querySelector("#postemail");
    let messageWall = document.querySelector("#messageWall");
    const reloadWallBtn = document.querySelector("#reloadWallBtn");
    reloadWall();
  
    postBtn.addEventListener("click", function() {
      var Token=Object.keys(JSON.parse(localStorage.getItem("loggedinusers")))[0];
      const message = messageText.value;
      const recipientEmail = email.value;

        if(!message.length){
            document.getElementById("messageText").placeholder = "Write something here!";
        }else if(!serverstub.postMessage(Token, message, recipientEmail).success){
            document.getElementById("postemail").value = "";
            document.getElementById("postemail").placeholder = "Incorrect Email";
        } else{
            document.getElementById("messageText").placeholder = "Message...";
            document.getElementById("postemail").placeholder = "User Email";
            messageText.value = "";
            email.value = "";
            reloadWall();
        }
    });
    
    reloadWallBtn.addEventListener("click", reloadWall);
  
    function reloadWall() {
        var Token=Object.keys(JSON.parse(localStorage.getItem("loggedinusers")))[0];
        let messages = serverstub.getUserMessagesByToken(Token);
        

        messageWall.innerHTML = "";
        
        messages.data.forEach(function(message) {
            
          const messageDiv = document.createElement("div");
          messageDiv.classList.add("message");

          const avatarImg = document.createElement("img");
          avatarImg.src = "https://randomuser.me/api/portraits/lego/"+hashfunc(message.writer) +".jpg";
          avatarImg.alt = "User Avatar";
          messageDiv.appendChild(avatarImg);

          const textDiv = document.createElement("div");
          textDiv.classList.add("textMessage");
    
          const writerP = document.createElement("h3");
          writerP.textContent = message.writer;
          textDiv.appendChild(writerP);

          const messageP = document.createElement("p");
          messageP.textContent = message.content;
          textDiv.appendChild(messageP);


          messageDiv.appendChild(textDiv);
    
          messageWall.appendChild(messageDiv);
        });
      }
      try{
        let userSearched=null;
    
        browseBtn.addEventListener("click", function(){
            let input=document.querySelector("#browseInput");
            var Token=Object.keys(JSON.parse(localStorage.getItem("loggedinusers")))[0];
            let userData = serverstub.getUserDataByEmail(Token, input.value);
    
            if(userData.success == false){
                document.getElementById("browseInput").placeholder = "User not exist!";
                document.getElementById("browseInput").value = "";
                return;            
            }else{
                document.getElementById("browseInput").placeholder = "Who are you looking for?";
                // Show the div with user informmation
                browseTab.style.display="block";
    
                //profile info
                let userdata=serverstub.getUserDataByEmail(Token, input.value).data;
                console.log(userdata);     
                
                let nameBrowse=document.querySelectorAll("h1.nameBrowse")[0];
                nameBrowse.innerHTML=userdata.firstname+" "+userdata.familyname;
    
                let userBrowse=document.querySelectorAll("h3.userBrowse")[0];
                userBrowse.innerHTML=userdata.email;
                userSearched=userdata.email;
    
                let infoBrowse=document.querySelectorAll("p.infoBrowse")[0];
                infoBrowse.innerHTML="Hello, I'm from "+userdata.city+" in "+userdata.country;
    
                let browseImage=document.getElementById("browseImage");
                browseImage.src = "https://randomuser.me/api/portraits/lego/"+hashfunc(userSearched) +".jpg";
            
    
                //load user wall
                BreloadWall();
            }
        });
    
    
        BreloadWallBtn.addEventListener("click", BreloadWall);
        
        function BreloadWall(){
            console.log(userSearched);
            var Token=Object.keys(JSON.parse(localStorage.getItem("loggedinusers")))[0];
            let messages = serverstub.getUserMessagesByEmail(Token, userSearched);
        
            BmessageWall.innerHTML = "";
            
            messages.data.forEach(function(message) {
                
              const messageDiv = document.createElement("div");
              messageDiv.classList.add("message");
        
              const avatarImg = document.createElement("img");
              avatarImg.src = "https://randomuser.me/api/portraits/lego/"+hashfunc(message.writer) +".jpg";
              avatarImg.alt = "User Avatar";
              messageDiv.appendChild(avatarImg);
        
              const textDiv = document.createElement("div");
              textDiv.classList.add("textMessage");
        
              const writerP = document.createElement("h3");
              writerP.textContent = message.writer;
              textDiv.appendChild(writerP);
        
              const messageP = document.createElement("p");
              messageP.textContent = message.content;
              textDiv.appendChild(messageP);
        
        
              messageDiv.appendChild(textDiv);
        
              BmessageWall.appendChild(messageDiv);
    
            });
        };
    }catch(e){};
    if(!Token){

    }else{
        try{
            let userSearched=null;
        
            browseBtn.addEventListener("click", function(){
                let input=document.querySelector("#browseInput");
                var Token=Object.keys(JSON.parse(localStorage.getItem("loggedinusers")))[0];
                let userData = serverstub.getUserDataByEmail(Token, input.value);
        
                if(userData.success == false){
                    document.getElementById("browseInput").placeholder = "User not exist!";
                    document.getElementById("browseInput").value = "";
                    return;            
                }else{
                    document.getElementById("browseInput").placeholder = "Who are you looking for?";
                    // Show the div with user informmation
                    browseTab.style.display="block";
        
                    //profile info
                    let userdata=serverstub.getUserDataByEmail(Token, input.value).data;
                    console.log(userdata);     
                    
                    let nameBrowse=document.querySelectorAll("h1.nameBrowse")[0];
                    nameBrowse.innerHTML=userdata.firstname+" "+userdata.familyname;
        
                    let userBrowse=document.querySelectorAll("h3.userBrowse")[0];
                    userBrowse.innerHTML=userdata.email;
                    userSearched=userdata.email;
        
                    let infoBrowse=document.querySelectorAll("p.infoBrowse")[0];
                    infoBrowse.innerHTML="Hello, I'm from "+userdata.city+" in "+userdata.country;
        
                    let browseImage=document.getElementById("browseImage");
                    browseImage.src = "https://randomuser.me/api/portraits/lego/"+hashfunc(userSearched) +".jpg";
                
        
                    //load user wall
                    BreloadWall();
                }
            });
        
        
            BreloadWallBtn.addEventListener("click", BreloadWall);
            
            function BreloadWall(){
                console.log(userSearched);
                var Token=Object.keys(JSON.parse(localStorage.getItem("loggedinusers")))[0];
                let messages = serverstub.getUserMessagesByEmail(Token, userSearched);
            
                BmessageWall.innerHTML = "";
                
                messages.data.forEach(function(message) {
                    
                  const messageDiv = document.createElement("div");
                  messageDiv.classList.add("message");
            
                  const avatarImg = document.createElement("img");
                  avatarImg.src = "https://randomuser.me/api/portraits/lego/"+hashfunc(message.writer) +".jpg";
                  avatarImg.alt = "User Avatar";
                  messageDiv.appendChild(avatarImg);
            
                  const textDiv = document.createElement("div");
                  textDiv.classList.add("textMessage");
            
                  const writerP = document.createElement("h3");
                  writerP.textContent = message.writer;
                  textDiv.appendChild(writerP);
            
                  const messageP = document.createElement("p");
                  messageP.textContent = message.content;
                  textDiv.appendChild(messageP);
            
            
                  messageDiv.appendChild(textDiv);
            
                  BmessageWall.appendChild(messageDiv);
        
                });
            };
        }catch(e){};
            
    } 
}