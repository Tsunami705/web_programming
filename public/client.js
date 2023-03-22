//var socket = io();
// ON LOGIN ACTION


// Step 1: Login

//

//  Diconnect user logged in
socket.on("restoreHomepage", function () {
  // alert("You have been disconnected");
  //alert("You have been disconnected");

  // remove from local storage
  localStorage.removeItem("loggedinusers");
  localStorage.removeItem("email");
  localStorage.removeItem("position");

  // restore homepage
  sessionStorage.setItem("tabLiNum", "home");
  profilepage.style.display = "none";
  welcomepage.style.display = "block";
  localStorage.removeItem("loggedinusers");
  localStorage.removeItem("email");
  window.location.reload();
});

// socket.on("prova1", function (data) {
//   alert("prova1");
//   //console.log(data);
// });

//Step 5:skip to the right page

let loggedinusers = localStorage.getItem("loggedinusers");
let welcomepage = document.querySelector("#welcomepage");
let profilepage = document.querySelector("#profilepage");

if (loggedinusers == null || Object.keys(loggedinusers).length === 2) {
  profilepage.style.display = "none";
  welcomepage.style.display = "block";
} else {
  profilepage.style.display = "block";
  welcomepage.style.display = "none";

  let homePage = document.querySelector("section.homepage");
  let browsePage = document.querySelector("section.browsepage");
  let accountPage = document.querySelector("section.accountpage");

  browsePage.style.display = "none";
  accountPage.style.display = "none";
  homePage.style.display = "block";
  // sessionStorage.setItem("tabLiNum","home");
}

// Step 3:Confirm password
async function confirm_psw() {
  var psw = document.getElementById("psw");
  var repsw = document.getElementById("repsw");
  if (psw.value !== repsw.value) {
    psw.setCustomValidity("Password Must be Match.");
    return;
  } else {
    psw.setCustomValidity("");
    let signup = document.querySelector("#signupform");
    let personalData = {
      firstname: signup[0].value,
      familyname: signup[1].value,
      gender: signup[2].value,
      city: signup[3].value,
      country: signup[4].value,
      email: signup[5].value,
      password: signup[6].value,
    };
    console.log(personalData);

    // local storage
    var myList = localStorage.getItem("customerData");
    if (myList == null) {
      localStorage.setItem("customerData", JSON.stringify([personalData]));
    } else {
      let customArray = JSON.parse(myList);
      customArray.push(personalData);
      localStorage.setItem("customerData", JSON.stringify(customArray));
    }
    let check_if_signup_message_appear =
      document.querySelector("h3.signup_message");
    if (!check_if_signup_message_appear) {
      null;
    } else {
      check_if_signup_message_appear.remove();
    }
    let signup_data = await serverstub
      .signUp(personalData)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });

    let signup_message = document.createElement("h3");
    signup_message.className = "signup_message";
    signup_message.innerHTML = signup_data.message;
    signup_message.style.margin = "1rem";
    document.querySelector("#signup").appendChild(signup_message);
  }
}

let j = true;
// Step 5:Signin Mechanism
try {
  let signin = document.querySelector("#signinform");
  console.log(signin);

  signin.addEventListener("submit", async () => {
    let loginData = {
      username: signin[0].value,
      password: signin[1].value,
    };

    
    let signinData = await serverstub
      .signIn(loginData.username, loginData.password)
      .then((res) => {
        localStorage.setItem("loggedinusers", res.data);
        localStorage.setItem("email", loginData.username);
        return res;
      });

    console.log(signinData);
    //session storage
    // sessionStorage.setItem(JSON.stringify(loginData.username),signinData.data);
    let check_if_signin_message_exist = document.querySelector(
      "h3.signin_fail_message"
    );
    if (signinData.success) {
      if (!check_if_signin_message_exist) {
        null;
      } else {
        check_if_signin_message_exist.remove();
      }

      //var Token = localStorage.getItem("loggedinusers");

      //// EMIT TO SERVER
      //alert("login success");

      socket.emit("login", {
        token: localStorage.getItem("loggedinusers"),
      });
      //alert(loginData.username);

      // console.log(Token);
      profilepage.style.display = "block";
      welcomepage.style.display = "none";
      browsePage.style.display = "none";
      accountPage.style.display = "none";
      homePage.style.display = "block";
      sessionStorage.setItem("tabLiNum", "home");

      window.location.reload();
      load_profile_page();

      //alert(getCurrentPosition());
    } else {
      if (!check_if_signin_message_exist) {
        null;
      } else {
        check_if_signin_message_exist.remove();
      }
      let signin_fail_message = document.createElement("h3");
      signin_fail_message.innerHTML = signinData.message;
      signin_fail_message.className = "signin_fail_message";
      signin_fail_message.style.fontSize = "10px";
      document.querySelector("#signin").appendChild(signin_fail_message);
    }
  });
} catch (error) {
  console.log(error);
}

// Step 6:Implementing tabs
let logoButton = document.querySelector("header h1");
let homeButton = document.querySelector("header.tabcard nav ul li.homeButton");
let browseButton = document.querySelector(
  "header.tabcard nav ul li.browseButton"
);
let accountButton = document.querySelector(
  "header.tabcard nav ul li.accountButton"
);

console.log(browseButton);

let homePage = document.querySelector("section.homepage");
let browsePage = document.querySelector("section.browsepage");
let accountPage = document.querySelector("section.accountpage");

// Step 7
let changepswButton = document.querySelector("div.changepsw");

try {
  window.addEventListener("load", () => {
    let Token = localStorage.getItem("loggedinusers");
    if (!Token) {
      //load_home_page();
      null;
    } else {
      load_profile_page();

      socket.emit("login", {
        token: localStorage.getItem("loggedinusers"),
      });
    }
  });
} catch (e) {}

// Step 7:Signout

try {
  signoutButton = document.querySelector("div.logout");
  signoutButton.addEventListener("click", async () => {
    let Token = localStorage.getItem("loggedinusers");
    let userEmail = localStorage.getItem("email");
    signoutData = await serverstub
      .signOut(Token, userEmail)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
    if (signoutData.success) {
      sessionStorage.setItem("tabLiNum", "home");
      profilepage.style.display = "none";
      welcomepage.style.display = "block";
      delete_event_listener();
      localStorage.removeItem("loggedinusers");
      localStorage.removeItem("email");
    } else {
      let check_if_loggout_information_exist = document.querySelector(
        "h3.fail_message_logout"
      );
      if (!check_if_loggout_information_exist) {
        null;
      } else {
        check_if_loggout_information_exist.remove();
      }
      let fail_message_logout = document.createElement("h3");
      fail_message_logout.innerText = signoutData.message;
      fail_message_logout.className = "fail_message_logout";
      document
        .querySelector("section.accountpage")
        .appendChild(fail_message_logout);
    }
    // localStorage.removeItem("loggedinusers");
  });
} catch (e) {}

// Step 7:Change password

function confirm_change_psw() {
  let changepswform = document.querySelector("#changeform");
  let newpsw = changepswform[1];
  let repsw = changepswform[2];
  if (newpsw.value !== repsw.value) {
    newpsw.setCustomValidity("Password Must be Match.");
  } else {
    newpsw.setCustomValidity("");
  }
}

var i = 1;
try {
  changepswButton.addEventListener("click", () => {
    let Token = localStorage.getItem("loggedinusers");
    let changepswView = document.querySelector("div.change");
    if (i % 2 == 1) {
      changepswView.style.display = "block";
      i++;
      let changepswform = document.querySelector("#changeform");
      changepswform.addEventListener("submit", async () => {
        let oldpsw = changepswform[0];
        let newpsw = changepswform[1];
        let newpswconfirm = changepswform[2];
        let userEmail = localStorage.getItem("email");
        let changepswfun = await serverstub
          .changePassword(Token, userEmail, oldpsw.value, newpsw.value)
          .then((res) => {
            return res;
          })
          .catch((err) => {
            console.log(err);
          });
        let wwww = changepswfun.success;
        let check_if_prompt_exist = document.querySelector(
          "h3.prompt_information"
        );
        if (!check_if_prompt_exist) {
          null;
        } else {
          check_if_prompt_exist.remove();
        }
        if (wwww) {
          serverstub.signOut(Token);
          document.querySelector("#oldpsw").value = "";
          document.querySelector("#newpsw").value = "";
          document.querySelector("#newpswconfirm").value = "";
          let prompt_information = document.createElement("h3");
          prompt_information.innerHTML =
            "Password changed.You will be logged out in three seconds, or refresh the page manually.";
          prompt_information.className = "prompt_information";
          document.querySelector("div.change").appendChild(prompt_information);
          setTimeout(() => {
            prompt_information.remove();
            localStorage.removeItem("email");
            localStorage.removeItem("loggedinusers");
            changepswView.style.display = "none";
            profilepage.style.display = "none";
            welcomepage.style.display = "block";
          }, 3000);
          i++;
        } else {
          let prompt_information = document.createElement("h3");
          prompt_information.innerHTML = "Wrong current password.";
          prompt_information.className = "prompt_information";
          document.querySelector("div.change").appendChild(prompt_information);
        }
      });
    } else {
      changepswView.style.display = "none";
      i++;
    }
  });
} catch (e) {}

/*******************************/

function hashfunc(String) {
  let result = 0;
  for (k of String) {
    result = result + k.charCodeAt();
  }
  result = result % 10;
  return result;
}

async function load_profile_page() {
  // Step 7:display your account information

  // Refresh the web page without changing tabs
  let tabLiNum = sessionStorage.getItem("tabLiNum");
  if (tabLiNum === null) {
  } else if (tabLiNum === "home") {
  } else if (tabLiNum === "browse") {
    browsePage.style.display = "block";
    accountPage.style.display = "none";
    homePage.style.display = "none";
  } else if (tabLiNum === "account") {
    browsePage.style.display = "none";
    accountPage.style.display = "block";
    homePage.style.display = "none";
  }

  homeButton.addEventListener(
    "click",
    (func1 = () => {
      browsePage.style.display = "none";
      accountPage.style.display = "none";
      homePage.style.display = "block";
      sessionStorage.setItem("tabLiNum", "home");
    })
  );

  logoButton.addEventListener(
    "click",
    (func2 = () => {
      browsePage.style.display = "none";
      accountPage.style.display = "none";
      homePage.style.display = "block";
      sessionStorage.setItem("tabLiNum", "home");
    })
  );

  browseButton.addEventListener(
    "click",
    (func3 = () => {
      browsePage.style.display = "block";
      accountPage.style.display = "none";
      homePage.style.display = "none";
      sessionStorage.setItem("tabLiNum", "browse");
    })
  );

  accountButton.addEventListener(
    "click",
    (func4 = () => {
      browsePage.style.display = "none";
      accountPage.style.display = "block";
      homePage.style.display = "none";
      sessionStorage.setItem("tabLiNum", "account");
    })
  );

  let Token = localStorage.getItem("loggedinusers");
  let userEmail = localStorage.getItem("email");
  let userdata = await serverstub
    .getUserDataByToken(Token, userEmail)
    .then((res) => {
      console.log(res);
      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });

  //ACCOUNT

  //email
  let usernameinfo = document.querySelectorAll(
    "div.infobox div.usernameinfo"
  )[1];
  usernameinfo.innerHTML = userdata.email;
  //name
  let nameinfo = document.querySelectorAll("div.infobox div.nameinfo")[1];
  nameinfo.innerHTML = userdata.first_name + " " + userdata.family_name;
  //gender
  let genderinfo = document.querySelectorAll("div.infobox div.genderinfo")[1];
  genderinfo.innerHTML = userdata.gender;
  //city
  let cityinfo = document.querySelectorAll("div.infobox div.cityinfo")[1];
  cityinfo.innerHTML = userdata.city;
  //country
  let countryinfo = document.querySelectorAll("div.infobox div.countryinfo")[1];
  countryinfo.innerHTML = userdata.country;

  //HOMEPAGE
  //Location
  let locationHome = document.querySelectorAll("h3.locationHome")[0];
  locationHome.innerHTML = localStorage.getItem("position");

  let nameHome = document.querySelectorAll("h1.nameHome")[0];
  nameHome.innerHTML = userdata.first_name + " " + userdata.family_name;

  let userHome = document.querySelectorAll("h3.userHome")[0];
  userHome.innerHTML = userdata.email;

  let infoHome = document.querySelectorAll("p.infoHome")[0];
  infoHome.innerHTML =
    "Hello, I'm from " + userdata.city + " in " + userdata.country;

  let imagesrc =
    "https://randomuser.me/api/portraits/lego/" +
    hashfunc(userdata.email) +
    ".jpg";
  document.getElementById("profileImage").src = imagesrc;

  const postBtn = document.querySelector("#postBtn");
  const messageText = document.querySelector("#messageText");
  const email = document.querySelector("#postemail");
  let messageWall = document.querySelector("#messageWall");
  const reloadWallBtn = document.querySelector("#reloadWallBtn");
  reloadWall();

  postBtn.addEventListener(
    "click",
    (func5 = async () => {
      let Token = localStorage.getItem("loggedinusers");
      let userEmail = localStorage.getItem("email");
      let position = localStorage.getItem("position");
      const message = messageText.value;
      const recipientEmail = email.value;

      let postData = await serverstub
        .postMessage(Token, userEmail, message, recipientEmail, position)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log(err);
        });

      if (!message.length) {
        document.getElementById("messageText").placeholder =
          "Write something here!";
      } else if (!postData.success) {
        document.getElementById("postemail").value = "";
        document.getElementById("postemail").placeholder = "Incorrect Email";
      } else {
        document.getElementById("messageText").placeholder = "Message...";
        document.getElementById("postemail").placeholder = "User Email";
        messageText.value = "";
        email.value = "";
        reloadWall();
      }
    })
  );

  reloadWallBtn.addEventListener("click", reloadWall);

  async function reloadWall() {
    let Token = localStorage.getItem("loggedinusers");
    let userEmail = localStorage.getItem("email");
    let messages = await serverstub
      .getUserMessagesByToken(Token, userEmail)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });

    messageWall.innerHTML = "";

    messages.post.reverse().forEach(function (message) {
      const messageDiv = document.createElement("div");
      messageDiv.classList.add("message");

      const avatarImg = document.createElement("img");
      avatarImg.src =
        "https://randomuser.me/api/portraits/lego/" +
        hashfunc(message.poster) +
        ".jpg";
      avatarImg.alt = "User Avatar";
      messageDiv.appendChild(avatarImg);

      const textDiv = document.createElement("div");
      textDiv.classList.add("textMessage");

      const writerP = document.createElement("h3");
      if (message.location === undefined) {
        writerP.textContent = message.poster + " from " + "Unknown";
      }

      writerP.textContent = message.poster + " from " + message.location;
      textDiv.appendChild(writerP);

      const messageP = document.createElement("p");
      messageP.textContent = message.text;
      textDiv.appendChild(messageP);

      messageDiv.appendChild(textDiv);

      messageWall.appendChild(messageDiv);
    });
  }
  try {
    let userSearched = null;

    browseBtn.addEventListener(
      "click",
      (func6 = async () => {
        let input = document.querySelector("#browseInput");
        let Token = localStorage.getItem("loggedinusers");
        let userEmail = localStorage.getItem("email");
        let userData = await serverstub
          .getUserDataByEmail(Token, userEmail, input.value)
          .then((res) => {
            return res;
          })
          .catch((err) => {
            console.log(err);
          });

        if (userData.success == false) {
          document.getElementById("browseInput").placeholder =
            "User not exist!";
          document.getElementById("browseInput").value = "";
          return;
        } else {
          document.getElementById("browseInput").placeholder =
            "Who are you looking for?";
          // Show the div with user informmation
          browseTab.style.display = "block";

          // Send socket event to server to notify that a user hasb been browsed
          console.log("user browsed: " + input.value);

          socket.emit("userBrowsed", input.value);

          //profile info
          /* let userdata = await serverstub
          .getUserDataByEmail(Token, userEmail, input.value)
          .then((res) => {
            return res.data;
          })
          .catch((err) => {
            console.log(err);
          }); */
          let userdata = userData.data;

          console.log(userdata);

          let nameBrowse = document.querySelectorAll("h1.nameBrowse")[0];
          nameBrowse.innerHTML =
            userdata.first_name + " " + userdata.family_name;

          let userBrowse = document.querySelectorAll("h3.userBrowse")[0];
          userBrowse.innerHTML = userdata.email;
          userSearched = userdata.email;

          let infoBrowse = document.querySelectorAll("p.infoBrowse")[0];
          infoBrowse.innerHTML =
            "Hello, I'm from " + userdata.city + " in " + userdata.country;

          let browseImage = document.getElementById("browseImage");
          browseImage.src =
            "https://randomuser.me/api/portraits/lego/" +
            hashfunc(userSearched) +
            ".jpg";

          //load user wall
          BreloadWall();
        }
      })
    );

    BreloadWallBtn.addEventListener("click", BreloadWall);

    async function BreloadWall() {
      console.log(userSearched);
      let Token = localStorage.getItem("loggedinusers");
      let userEmail = localStorage.getItem("email");
      let messages = await serverstub
        .getUserMessagesByEmail(Token, userEmail, userSearched)
        .then((res) => {
          return res;
        })
        .catch((err) => {
          console.log(err);
        });

      BmessageWall.innerHTML = "";

      if (messages.post == undefined) {
        return;
      }

      messages.post.forEach(function (message) {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");

        const avatarImg = document.createElement("img");
        avatarImg.src =
          "https://randomuser.me/api/portraits/lego/" +
          hashfunc(message.poster) +
          ".jpg";
        avatarImg.alt = "User Avatar";
        messageDiv.appendChild(avatarImg);

        const textDiv = document.createElement("div");
        textDiv.classList.add("textMessage");

        const writerP = document.createElement("h3");
        writerP.textContent = message.poster + message.location;
        textDiv.appendChild(writerP);

        const messageP = document.createElement("p");
        messageP.textContent = message.text;
        textDiv.appendChild(messageP);

        messageDiv.appendChild(textDiv);

        BmessageWall.appendChild(messageDiv);
      });
    }
  } catch (e) {} /*
  /*
  if (!Token) {
  } else {
    try {
      /*
      let userSearched = null;
      browseBtn.addEventListener("click", async function () {
        let input = document.querySelector("#browseInput");
        let Token = localStorage.getItem("loggedinusers");
        let userEmail = localStorage.getItem("email");
        let userData = await serverstub
          .getUserDataByEmail(Token, userEmail, input.value)
          .then((res) => {
            return res;
          })
          .catch((err) => {
            console.log(err);
          });
        if (userData.success == false) {
          document.getElementById("browseInput").placeholder =
            "User not exist!";
          document.getElementById("browseInput").value = "";
          return;
        } else {
          document.getElementById("browseInput").placeholder =
            "Who are you looking for?";
          // Show the div with user informmation
          browseTab.style.display = "block";
          //profile info
          /* let userdata = await serverstub
            .getUserDataByEmail(Token, userEmail, input.value)
            .then((res) => {
              return res.data;
            })
            .catch((err) => {
              console.log(err);
            }); 
            let userdata = userData.data;
          let nameBrowse = document.querySelectorAll("h1.nameBrowse")[0];
          nameBrowse.innerHTML =
            userdata.first_name + " " + userdata.family_name;
          let userBrowse = document.querySelectorAll("h3.userBrowse")[0];
          userBrowse.innerHTML = userdata.email;
          userSearched = userdata.email;
          let infoBrowse = document.querySelectorAll("p.infoBrowse")[0];
          infoBrowse.innerHTML =
            "Hello, I'm from " + userdata.city + " in " + userdata.country;
          let browseImage = document.getElementById("browseImage");
          browseImage.src =
            "https://randomuser.me/api/portraits/lego/" +
            hashfunc(userSearched) +
            ".jpg";
          //load user wall
          BreloadWall();
        }
      }
      );
      */
  /*
      BreloadWallBtn.addEventListener("click", BreloadWall);
      async function BreloadWall() {
        console.log(userSearched);
        let Token = localStorage.getItem("loggedinusers");
        let userEmail = localStorage.getItem("email");
        let messages = await serverstub
          .getUserMessagesByEmail(Token, userEmail, userSearched)
          .then((res) => {
            return res;
          })
          .catch((err) => {
            console.log(err);
          });
        BmessageWall.innerHTML = "";
        messages.post.reverse().forEach(function (message) {
          const messageDiv = document.createElement("div");
          messageDiv.classList.add("message");
          const avatarImg = document.createElement("img");
          avatarImg.src =
            "https://randomuser.me/api/portraits/lego/" +
            hashfunc(message.poster) +
            ".jpg";
          avatarImg.alt = "User Avatar";
          messageDiv.appendChild(avatarImg);
          const textDiv = document.createElement("div");
          textDiv.classList.add("textMessage");
          const writerP = document.createElement("h3");
          writerP.textContent = message.poster;
          textDiv.appendChild(writerP);
          const messageP = document.createElement("p");
          messageP.textContent = message.text;
          textDiv.appendChild(messageP);
          messageDiv.appendChild(textDiv);
          BmessageWall.appendChild(messageDiv);
        });
      } *//*
    } catch (e) {}
  }*/
}

function delete_event_listener() {
  homeButton.removeEventListener("click", func1);
  logoButton.removeEventListener("click", func2);
  browseButton.removeEventListener("click", func3);
  accountButton.removeEventListener("click", func4);
  const postBtn = document.querySelector("#postBtn");
  console.log(postBtn);
  postBtn.removeEventListener("click", func5);
  // const reloadWallBtn = document.querySelector("#reloadWallBtn");
  // reloadWallBtn.removeEventListener("click", reloadWall);
  browseBtn.removeEventListener("click", func6);
}