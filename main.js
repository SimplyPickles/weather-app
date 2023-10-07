/*
// Get element references
const uvindex = document.getElementById("uv");

const temperature = document.getElementById("temp");
const feelslike = document.getElementById("feelslike");

const visibility = document.getElementById("visibility");
const dewpoint = document.getElementById("dewpoint");

const conditions = document.getElementById("conditiontext");
const humidity = document.getElementById("humidypercent");
const windspeed = document.getElementById("windspeed");

// Get user location
let loc = [40.7648, -73.9808];

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        loc = [position.coords.latitude, position.coords.longitude];
    });
}

let url = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=relativehumidity_2m,dewpoint_2m,visibility,uv_index&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_probability_max,windspeed_10m_max,winddirection_10m_dominant&current_weather=true&timezone=auto&past_days=1`;
let xmlHttp = new XMLHttpRequest();
xmlHttp.open("GET", url, false);
xmlHttp.send(null);
let response = JSON.parse(xmlHttp.responseText);

// Get timestamp
let timestamp = new Date().toISOString().split(":")[0];
let timeIndex = response.hourly.time.indexOf((timestamp + ":00"));

// Change text
uvindex.innerHTML = `UV Index: ${response.hourly.uv_index[timeIndex]}`;

temperature.innerHTML = `${response.current_weather.temperature}°C`;
//feelslike.innerHTML = `Feels like ${((apparent_temperature_max + apparent_temperature_min) / 2)}°C`;

visibility.innerHTML = `Visibility: ${response.hourly.visibility[timeIndex] / 1000} km`;
dewpoint.innerHTML = `Dew Point: ${response.hourly.dewpoint_2m[timeIndex]}°C`;

conditions.innerHTML = `${response.daily.weathercode[0]}`;
humidity.innerHTML = `${response.hourly.relativehumidity_2m[timeIndex]}%`;
windspeed.innerHTML = `${response.current_weather.windspeed} km/h`;
*/