let enterButton = document.getElementById("enter");
enterButton.addEventListener("click",getWeather);

async function getWeather() {
  let cityName = document.getElementById("cityName").value;
  let longitude = 0;
  let latitude = 0;

  // verify empty input
  if (verifyInput(cityName) == false) {
    document.getElementById("userCity").innerHTML = "City is empty";
    return;
  }

  // (1) first get longitude / latitude coordinates for the weather API
  let geoURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=secretKey";
  try {
    let geoAPIResponse = await fetch(geoURL); // get the response object
    // if the API was not able to make a round trip to database --> city or state must be invalid
    if (geoAPIResponse.ok == false) {
      document.getElementById("userCity").innerHTML = "City is invalid";
      return;
    }

    let data = await geoAPIResponse.json();
    longitude = data[0].lon;
    latitude = data[0].lat;
  }
  catch (error) { // error meaning the city was incorrect
    document.getElementById("userCity").innerHTML = "City is invalid";
    return;
  }

  // (2) now get the weather using the longitude / latitude coordinates
  weatherURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + 
          "&appid=secretKey";
  try {
    let weatherAPIResponse = await fetch(weatherURL); // get the response object
    // in case the round trip was unnsuccessful --> by this point of long / lat coordinates should be correct
    if (weatherAPIResponse.ok == false) {
      document.getElementById("userCity").innerHTML = "Something went wrong, refresh and try again";
      return;
    }

    // (3) now we have the data --> set the website fields
    let weatherData = await weatherAPIResponse.json();
    setInformation(weatherData);

    // clear Input
    clearInput();

  }
  catch(error) {
    document.getElementById("userCity").innerHTML = "2. something went wrong, refresh and try again";
    return;
  }

}

function verifyInput(city) {
  if (city.trim() == "") {
    return false;
  }
  return true;
}

/**
 * 
 * @param {Array} weatherData 
 */
function setInformation(weatherData) {
  // get key data points
  let FahrenheitTemp = Number.parseInt(kelvinToFahrenheit(weatherData.main.temp));
  let windSpeed = weatherData.wind.speed;
  let humidity = weatherData.main.humidity; 
  let cityName = weatherData.name;

  // set elements on html page
  let userCity = document.getElementById("userCity");
  userCity.textContent = cityName;

  let tempNum = document.getElementById("tempNum");
  tempNum.textContent = FahrenheitTemp + "℉";

  let windNumber = document.getElementById("windNumber");
  windNumber.textContent = windSpeed + " meter/sec";

  let humidityNumber = document.getElementById("humidityNumber");
  humidityNumber.textContent = "" + humidity + "%";


}


function kelvinToFahrenheit(kelvinNum) {
  kelvinNum = Number(kelvinNum);
  const kConstant = 273.15;
  return (kelvinNum - kConstant) * (9/5) + 32;
}

function clearInput() {
  let cityName = document.getElementById("cityName");
  cityName.value = "";

  
}