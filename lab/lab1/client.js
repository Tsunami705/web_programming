function confirm_psw(repsw){
    // console.log(input);
    let psw=document.getElementById("psw");
    if(psw.value!==repsw.value){
        psw.setCustomValidity("Password Must be Match.");
       
    }else{
        psw.setCustomValidity("");
        
    }
}

let signup=document.querySelector("#signupform");
// console.log(signup);
// console.log(localStorage.getItem("customerData"));

let signupbutton=signup[8];

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