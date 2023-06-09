localStorage.clear();

//function to search city name by city name entered from the apiURL along with current weather.
function citySearch() {
  var cityName = titleCase($("#cityName")[0].value.trim());

  var apiURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";

  fetch(apiURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        $("#city-name")[0].textContent =
          cityName + " (" + dayjs().format("M/D/YYYY") + ")";

        $("#city-list").append(
          '<button type="button" class="list-group-item list-group-item-light list-group-item-action city-name">' +
            cityName
        );

        const lat = data.coord.lat;
        const lon = data.coord.lon;

        var latAndLon = lat.toString() + " " + lon.toString();

        localStorage.setItem(cityName, latAndLon);

        apiURL =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&exclude=minutely,hourly&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";

        fetch(apiURL).then(function (newResponse) {
          if (newResponse.ok) {
            newResponse.json().then(function (newData) {
              getCurrentWeather(newData);
            });
          }
        });
      });
    } else {
      alert("Cannot find city!");
      //else the city is not found this alert comes up
    }
  });
}

//City coordinates function

function CityList(coordinates) {
  apiURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    coordinates[0] +
    "&lon=" +
    coordinates[1] +
    "&exclude=minutely,hourly&units=imperial&appid=71311474f5b26fb7bbfa0bc1985b90cd";

  fetch(apiURL).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        getCurrentWeather(data);
      });
    }
  });
}
//Current weather function

function getCurrentWeather(data) {
  $(".results-panel").addClass("visible");

  $("#currentIcon")[0].src =
    "http://openweathermap.org/img/wn/" +
    data.current.weather[0].icon +
    "@2x.png";
  $("#temperature")[0].textContent =
    "Temperature: " + data.current.temp.toFixed(1) + " \u2109";
  $("#humidity")[0].textContent = "Humidity: " + data.current.humidity + "% ";
  $("#wind-speed")[0].textContent =
    "Wind Speed: " + data.current.wind_speed.toFixed(1) + " MPH";
  $("#uv-index")[0].textContent = "  " + data.current.uvi;

  getForecast(data);
}

//get forecast function loops through the next 5 days 

function getForecast(data) {
  for (var i = 0; i < 5; i++) {
    var forecast = {
      date: convertUnixTime(data, i),
      icon:
        "http://openweathermap.org/img/wn/" +
        data.daily[i + 1].weather[0].icon +
        "@2x.png",
      temp: data.daily[i + 1].temp.day.toFixed(1),
      humidity: data.daily[i + 1].humidity,
    };

    var currentSelector = "#day-" + i;
    $(currentSelector)[0].textContent = forecast.date;
    currentSelector = "#img-" + i;
    $(currentSelector)[0].src = forecast.icon;
    currentSelector = "#temp-" + i;
    $(currentSelector)[0].textContent = "Temp: " + forecast.temp + " \u2109";
    currentSelector = "#hum-" + i;
    $(currentSelector)[0].textContent = "Humidity: " + forecast.humidity + "%";
  }
}

//This function searches cities even though they may be lowercased

function titleCase(city) {
  var cityNameUpdate = city.toLowerCase().split(" ");
  var retrievedCity = "";
  for (var i = 0; i < cityNameUpdate.length; i++) {
    cityNameUpdate[i] =
      cityNameUpdate[i][0].toUpperCase() + cityNameUpdate[i].slice(1);
    retrievedCity += " " + cityNameUpdate[i];
  }
  return retrievedCity;
}

//Function simplifies Unix time
function convertUnixTime(data, index) {
  const dateObject = new Date(data.daily[index + 1].dt * 1000);

  return dateObject.toLocaleDateString();
}

$("#search-button").on("click", function (e) {
  e.preventDefault();

  citySearch();

  $("form")[0].reset();
});

//

$(".city-list-box").on("click", ".city-name", function () {
  var coordinates = localStorage.getItem($(this)[0].textContent).split(" ");
  coordinates[0] = parseFloat(coordinates[0]);
  coordinates[1] = parseFloat(coordinates[1]);

  $("#city-name")[0].textContent =
    $(this)[0].textContent + " (" + dayjs().format("M/D/YYYY") + ")";

  getListCity(coordinates);
});
