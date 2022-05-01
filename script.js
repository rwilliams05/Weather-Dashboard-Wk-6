const openWeatherKey = "5d34682fe2de077e2f89aa89269c2c87";

const formEl = document.getElementById("form");

//checks for existing search history in local storage
let cityVal = null;
let cityList = null;
let cityListString = localStorage.getItem("weather-cityNames");
if (cityListString == null) {
    cityList = [];
}
else {
    cityList = (JSON.parse(cityListString));
}
//creates search history list
for (let i = 0; i < 8; i++) {
    let searchEL = document.getElementById("search" + i);
    if (i < cityList.length) {
        searchEL.textContent = cityList[i];
    } else {
        searchEL.textContent = " ";
    };
}
//activates buttons for past searches
let searchHistoryEL = document.getElementById("searchHistory");
searchHistoryEL.onclick = searchFunction;
function searchFunction(event) {
    cityVal = event.target.innerText;
    getWeather();
}

//input form
function handleSearchFormSubmit(event) {
    event.preventDefault();
    cityVal = document.querySelector('input[name="city"]').value;
    getWeather();
}
//pushes new searches to search history, sets hestory in local storage,fetches weather data from API
function getWeather() {
//

    let doThePush = true;
    for (let i = 0; i < cityList.length; i++) {
        if (cityVal == cityList[i]) {
            doThePush = false;
        }
    }
    if (doThePush) {
        cityList.push(cityVal);
        if (cityList.length > 8) {
            cityList.splice(0, 1);
        }
        localStorage.setItem("weather-cityNames", JSON.stringify(cityList));
    }
//fetches initial API inof in order to obtain latitude and longitude
    const cityString = "https://api.openweathermap.org/data/2.5/weather?q=" + cityVal + "&appid=5d34682fe2de077e2f89aa89269c2c87&units=imperial"
    for (let i = 0; i < 8; i++) {
        let searchEL = document.getElementById("search" + i);
        if (i < cityList.length) {
            searchEL.textContent = cityList[i];
        } else {
            searchEL.textContent = "";
        };


    }
    if (!cityVal) {
        console.error("You need to enter a city");
        return;
    }

    fetch(cityString)
        .then(function (response) {
            if (!response.ok) {
                throw response.json();
            }
            return response.json();
        })

        .then(function (response) {
            
            latString = response.coord.lat;
            lonString = response.coord.lon;

//fetch weather data from API
            const oneCall = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latString + "&lon=" + lonString + "&units=imperial&appid=" + openWeatherKey;
            fetch(oneCall)
                .then(function (response) {
                    if (!response.ok) {
                        throw response.json();
                    }

                    return response.json();

                })

                .then(function (response) {
                    console.log(response);
                    displayWeatherData(response);
                })
        })

}
//Creates display of weather data for current day
function displayWeatherData(response) {
    const daily = response.daily;
    const current = response.current;
    let currentDay = moment.unix(current.dt).format("M/D/YYYY");
    let currrentTempEL = document.getElementById("todayTemp");
    let currrentWindEL = document.getElementById("todayWind");
    let currrentHumEL = document.getElementById("todayHum");
    let currentUviEL = document.getElementById("todayUvi");
    let currentHeaderEl = document.getElementById("todayHeader");
    let currentIconEl = document.getElementById("todayIcon");
    let todayiconInfo = current.weather[0].icon;
    let todayiconLoc = "https://openweathermap.org/img/wn/" + todayiconInfo + ".png"
    let todayiconFetch = "<p><img src='" + todayiconLoc + "'></p>";
    currentIconEl.innerHTML = todayiconFetch;
    currrentTempEL.textContent = "Temp " + current.temp;
    currrentWindEL.textContent = "Wind " + current.wind_speed;
    currrentHumEL.textContent = "Humidity " +current.humidity;
    currentHeaderEl.textContent = cityVal + ' ' + currentDay;

//color codes UVI
    currentUviEL.textContent = "UV Index" + current.uvi;
    if (current.uvi < 3) {
        current_color = "text-success";
    } else if (current.uvi < 6) {
        current_color = "text-warning";
    } else {
        current_color = "text-danger";
    }
    let uviColor = "<span class= '" + current_color + "'>" + current.uvi + "</span>";
    
    currentUviEL.innerHTML=  "UV Index " + uviColor;

    //creates display for five day forecast
    for (let i = 1; i < 6; i++) {
        let tempEL = document.getElementById("day" + i + "Temp");
        let windEL = document.getElementById("day" + i + "Wind");
        let humEL = document.getElementById("day" + i + "Hum");
        let iconEL = document.getElementById("day" + i + "Icon");
        let dateEl = document.getElementById("date" + i);
        let dateVar = daily[i].dt;
        let dateUnix = moment.unix(dateVar);
        let dateFormat = dateUnix.format("M/D/YYYY");
        dateEl.textContent = dateFormat;
        tempEL.textContent = "Temp " + daily[i].temp.max;
        windEL.textContent = "Wind " +daily[i].wind_speed;
        humEL.textContent = "Hum " +daily[i].humidity;
        let iconInfo = daily[i].weather[0].icon;
        let iconLoc = "https://openweathermap.org/img/wn/" + iconInfo + ".png"
        let iconFetch = "<p><img src='" + iconLoc + "'></p>";
        iconEL.innerHTML = iconFetch;


    }

    
}
formEl.addEventListener("submit", handleSearchFormSubmit);