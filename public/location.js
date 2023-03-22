window.onload = getPosition();

async function getPosition() {
    console.log("GETTING LOCATION");
    const location = await new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
        //Console.log("Promise Resolved");
      } else {
        reject("Geolocation is not supported by this browser.");
      }
    }).then((location) => {
        getLocationData(location.coords.latitude, location.coords.longitude);
    }).catch((error) => {
      //console.log("ERROR in POSITION", error);
    });
    return;
}

async function getLocationData(lat, lon) {
    let string = "https://geocode.xyz/" + lat + "," + lon + "?geoit=json&auth=" + '41131981974687277476x60871';
    //console.log("STRING", string);
    fetch(string)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            localStorage.setItem("position", JSON.stringify(data.city + ", " + data.country));
        })
        .catch(error => console.error(error));
}