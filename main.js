// Weather codes list
let codes = [
    "Clear Sky",
    "Clouds Dissolving",
    "Clear Sky",
    "Clouds Developing",
    "Reduced Visiblity",
    "Haze",
    "Widespread Dust",
    "Dust",
    "Dust",
    "Duststorms",
    "Mist",
    "Fog Patches",
    "Continuous Fog",
    "Visible Lightning",
    "Light Rain",
    "Light Rain",
    "Light Rain",
    "Thunderstorm",
    "Heavy Winds",
    "Funnel Clouds",
    "Drizzle",
    "Rain",
    "Snow",
    "Rain and Snow",
    "Drizzle",
    "Rain Showers",
    "Snow Showers",
    "Hail Showers",
    "Fog",
    "Thunderstorm",
    "Slight Duststorm",
    "Slight Duststorm",
    "Slight Duststorm",
    "Severe Duststorm",
    "Severe Duststorm",
    "Severe Duststorm",
    "Slight Snow",
    "Heavy Snow",
    "Moderate Slight",
    "Heavy drifting snow",
    "Fog",
    "Fog Patches",
    "Fog Thinning",
    "Fog",
    "Fog",
    "Fog",
    "Fog Thickening",
    "Fog",
    "Fog",
    "Fog",
    "Drizzle",
    "Drizzle",
    "Moderate Drizzle",
    "Drizzle",
    "Heavy Drizzle",
    "Drizzle",
    "Slight Drizzle",
    "Heavy Drizzle",
    "Slight Rain",
    "Moderate Rain",
    "Slight Rain",
    "Rain",
    "Moderate Rain",
    "Rain",
    "Heavy Rain",
    "Continuous Rain",
    "Freezing Rain",
    "Moderate Rain",
    "Slight Rain",
    "Heavy Rain",
    "Snow",
    "Snow",
    "Moderate Snow",
    "Snow",
    "Heavy Snow",
    "Snow",
    "Diamond Dust",
    "Snow Grains",
    "Snow Crystals",
    "Ice Pellets",
    "Slight Rain",
    "Heavy Rain",
    "Violent Rain",
    "Slight Snow",
    "Heavy Snow",
    "Slight Snow",
    "Heavy Snow",
    "Hail",
    "Hail",
    "Hail",
    "Hail",
    "Slight Rain",
    "Moderate Rain",
    "Slight Snow",
    "Moderate Snow",
    "Moderate Thunderstorm",
    "Slight Thunderstorm",
    "Heavy Thunderstorm",
    "Thunderstorm",
    "Heavy Thunderstorms"
];

// Daily elements
const locationbox = document.getElementById("locationbox");
const l1 = document.getElementById("location");
const l2 = document.getElementById("location2");

const lbox = document.getElementById("loadingbox");

const uvindex = document.getElementById("uv");
const aqindex = document.getElementById("airquality");
const uvdot = document.getElementById("uvdot");
const aqidot = document.getElementById("aqidot");

const temperature = document.getElementById("temperature");
const feelslike = document.getElementById("feelslike");

const visibility = document.getElementById("visibilitytxt");

const conditions = document.getElementById("conditionstxt");
const conditionsimg = document.getElementById("conditionsimg");

const humidity = document.getElementById("humiditytxt");
const windspeed = document.getElementById("windspeedtxt");

const rainfall = document.getElementById("rainfalltxt");
const rainchance = document.getElementById("rainchance");

// Forecast elements
const d1r = document.getElementById("d1r");
const t1r = document.getElementById("t1r");
const f1r = document.getElementById("f1r");
const f1i = document.getElementById("f1i");

const d2r = document.getElementById("d2r");
const t2r = document.getElementById("t2r");
const f2r = document.getElementById("f2r");
const f2i = document.getElementById("f2i");

const d3r = document.getElementById("d3r");
const t3r = document.getElementById("t3r");
const f3r = document.getElementById("f3r");
const f3i = document.getElementById("f3i");

const d4r = document.getElementById("d4r");
const t4r = document.getElementById("t4r");
const f4r = document.getElementById("f4r");
const f4i = document.getElementById("f4i");

const d5r = document.getElementById("d5r");
const t5r = document.getElementById("t5r");
const f5r = document.getElementById("f5r");
const f5i = document.getElementById("f5i");

const d6r = document.getElementById("d6r");
const t6r = document.getElementById("t6r");
const f6r = document.getElementById("f6r");
const f6i = document.getElementById("f6i");

const d7r = document.getElementById("d7r");
const t7r = document.getElementById("t7r");
const f7r = document.getElementById("f7r");
const f7i = document.getElementById("f7i");

// Maps and location
let map;
let locationselection = document.getElementById("locationselection");

// Temperature
let celcius = false;
const tempbox = document.getElementById("tempbox");
tempbox.onclick = function () {
    celcius = !celcius;
    loadData(loc);
};

// Get user location
let loc = [0, 0];
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        loc = [clamp(position.coords.latitude, -89, 89), clamp(position.coords.longitude, -179, 179)];
    });
} else {
    loc = [0, 0];
}

loadData(loc);

map = L.map('mapbox', {
    center: loc,
    zoom: 15
}).setView(new L.LatLng(loc[0], loc[1]), 10);

setTimeout(function() { map.invalidateSize(true); }, 100);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let marker = L.marker(loc).addTo(map);
map.on('click', function(e) {
    if (marker) map.removeLayer(marker);
    
    marker = L.marker(e.latlng).addTo(map);
    loc = [clamp(e.latlng.lat, -89, 89), clamp(e.latlng.lng, -179, 179)];
    loadData(loc);
});

let searchControl = new L.esri.Controls.Geosearch().addTo(map);
let results = new L.LayerGroup().addTo(map);
searchControl.on('results', function(data){
    results.clearLayers();
    loadData([clamp(data.results[0].latlng.lat, -89, 89), clamp(data.results[0].latlng.lng, -179, 179)]);
    
    for (let i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng));
    }
});

setInterval(function () {
    map.invalidateSize();
}, 100);

// Load weather data
function loadData(loc) {
    let url = `https://api.open-meteo.com/v1/forecast?latitude=${loc[0]}&longitude=${loc[1]}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,snowfall,weathercode,visibility,windspeed_10m,winddirection_10m,uv_index&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max&current_weather=true&timezone=auto`;
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    let response = JSON.parse(xmlHttp.responseText);
    
    if (response != null & response != undefined) {
        document.getElementById("loadingbg").style.display = "none";
        document.getElementById("loadingbox").style.display = "none";
    }

    // Get timestamp
    let timestamp = new Date().toISOString().split(":")[0];
    let timeIndex = response.hourly.time.indexOf((timestamp + ":00"));
    
    // Change text
    uvindex.innerHTML = `UV Index: ${response.hourly.uv_index[timeIndex]}`;
    uvdot.style.marginLeft = `${(100 * (response.hourly.uv_index[timeIndex]) / 75) - 79}vw`;

    if (celcius) {
        temperature.innerHTML = `${response.current_weather.temperature}°C`;
        feelslike.innerHTML = `Feels like ${response.hourly.apparent_temperature[timeIndex]}°C`;
    } else {
        temperature.innerHTML = `${temperatureConversion(response.current_weather.temperature)}°F`;
        feelslike.innerHTML = `Feels like ${temperatureConversion(response.hourly.apparent_temperature[timeIndex])}°F`;
    }
    
    if (celcius) {
        visibility.innerHTML = `${response.hourly.visibility[timeIndex] / 1000} km`;
        windspeed.innerHTML = `${response.current_weather.windspeed} km/h`;
    } else {
        visibility.innerHTML = `${kmtm(response.hourly.visibility[timeIndex] / 1000)} Mi`;
        windspeed.innerHTML = `${kmtm(response.current_weather.windspeed)} mph`;
    }

    rainchance.innerHTML = `${response.hourly.precipitation_probability[timeIndex].toString()}%`;
    humidity.innerHTML = `${response.hourly.relativehumidity_2m[timeIndex]}%`;

    conditions.innerHTML = `${codes[response.daily.weathercode[0].toString()]}`;
    let conditionsID = response.daily.weathercode[0];

    if (conditionsID >= 1 && conditionsID <= 3) conditionsimg.src = 'icons/Sunny.png';
    if (conditionsID == 4) conditionsimg.src = 'icons/Cloudy.png';
    if (conditionsID >= 5 && conditionsID <= 13) conditionsimg.src = 'icons/Fog.png';
    if (conditionsID == 14) conditionsimg.src = 'icons/Lightning.png';
    if (conditionsID >= 15 && conditionsID <= 17) conditionsimg.src = 'icons/Rain.png';
    if (conditionsID == 18) conditionsimg.src = 'icons/Lightning.png';
    if (conditionsID == 19) conditionsimg.src = 'icons/Wind.png';
    if (conditionsID == 20) conditionsimg.src = 'icons/Cloudy.png';
    if (conditionsID >= 21 && conditionsID <= 22) conditionsimg.src = 'icons/Rain.png';
    if (conditionsID == 23) conditionsimg.src = 'icons/Snow.png';
    if (conditionsID == 24) conditionsimg.src = 'icons/SnowRain.png';
    if (conditionsID >= 25 && conditionsID <= 26) conditionsimg.src = 'icons/Rain.png';
    if (conditionsID >= 27 && conditionsID <= 28) conditionsimg.src = 'icons/Snow.png';
    if (conditionsID == 29) conditionsimg.src = 'icons/Fog.png';
    if (conditionsID == 30) conditionsimg.src = 'icons/RainLightning.png';
    if (conditionsID >= 31 && conditionsID <= 36) conditionsimg.src = 'icons/Fog.png';
    if (conditionsID >= 37 && conditionsID <= 40) conditionsimg.src = 'icons/Snow.png';
    if (conditionsID >= 41 && conditionsID <= 50) conditionsimg.src = 'icons/Fog.png';
    if (conditionsID >= 51 && conditionsID <= 70) conditionsimg.src = 'icons/Rain.png';
    if (conditionsID >= 71 && conditionsID <= 80) conditionsimg.src = 'icons/Snow.png';
    if (conditionsID >= 81 && conditionsID <= 83) conditionsimg.src = 'icons/Rain.png';
    if (conditionsID >= 84 && conditionsID <= 91) conditionsimg.src = 'icons/Snow.png';
    if (conditionsID >= 92 && conditionsID <= 93) conditionsimg.src = 'icons/Rain.png';
    if (conditionsID >= 94 && conditionsID <= 95) conditionsimg.src = 'icons/Snow.png';
    if (conditionsID >= 96 && conditionsID <= 100) conditionsimg.src = 'icons/RainLightning.png';

    url = `https://api.open-meteo.com/v1/forecast?latitude=${loc[0]}&longitude=${loc[1]}&current=precipitation&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_max,windspeed_10m_max&timezone=auto`;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    response = JSON.parse(xmlHttp.responseText);
    
    url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${loc[0]}&longitude=${loc[1]}&current=us_aqi&domains=cams_global`;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    response = JSON.parse(xmlHttp.responseText);

    aqindex.innerHTML = `Air Quality Index: ${response.current.us_aqi}`;
    aqidot.style.marginLeft = `${(100 * (response.current.us_aqi / 5) / 75) - 79}vw`;
    
    url = `https://api.open-meteo.com/v1/forecast?latitude=${loc[0]}&longitude=${loc[1]}&daily=weathercode,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum,precipitation_probability_max&timezone=auto`;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    response = JSON.parse(xmlHttp.responseText);

    if (celcius) {
        rainfall.innerHTML = `${response.daily.precipitation_sum[0]} mm`
    } else {
        rainfall.innerHTML = `${mmtin(response.daily.precipitation_sum[0])}″`
    }
    
    // Forecasts
    d1r.innerHTML = `Today • UV Index: ${response.daily.uv_index_max[0]}`;
    d2r.innerHTML = `${response.daily.time[1].split("-")[1]}/${response.daily.time[1].split("-")[2]} • UV Index: ${response.daily.uv_index_max[1]}`;
    d3r.innerHTML = `${response.daily.time[2].split("-")[1]}/${response.daily.time[2].split("-")[2]} • UV Index: ${response.daily.uv_index_max[2]}`;
    d4r.innerHTML = `${response.daily.time[3].split("-")[1]}/${response.daily.time[3].split("-")[2]} • UV Index: ${response.daily.uv_index_max[3]}`;
    d5r.innerHTML = `${response.daily.time[4].split("-")[1]}/${response.daily.time[4].split("-")[2]} • UV Index: ${response.daily.uv_index_max[4]}`;
    d6r.innerHTML = `${response.daily.time[5].split("-")[1]}/${response.daily.time[5].split("-")[2]} • UV Index: ${response.daily.uv_index_max[5]}`;
    d7r.innerHTML = `${response.daily.time[6].split("-")[1]}/${response.daily.time[6].split("-")[2]} • UV Index: ${response.daily.uv_index_max[6]}`;

    if (celcius) {
        t1r.innerHTML = `${Math.round((response.daily.temperature_2m_max[0] + response.daily.temperature_2m_min[0]) / 2)}°C`;
        t2r.innerHTML = `${Math.round((response.daily.temperature_2m_max[1] + response.daily.temperature_2m_min[1]) / 2)}°C`;
        t3r.innerHTML = `${Math.round((response.daily.temperature_2m_max[2] + response.daily.temperature_2m_min[2]) / 2)}°C`;
        t4r.innerHTML = `${Math.round((response.daily.temperature_2m_max[3] + response.daily.temperature_2m_min[3]) / 2)}°C`;
        t5r.innerHTML = `${Math.round((response.daily.temperature_2m_max[4] + response.daily.temperature_2m_min[4]) / 2)}°C`;
        t6r.innerHTML = `${Math.round((response.daily.temperature_2m_max[5] + response.daily.temperature_2m_min[5]) / 2)}°C`;
        t7r.innerHTML = `${Math.round((response.daily.temperature_2m_max[6] + response.daily.temperature_2m_min[6]) / 2)}°C`;
    } else {
        t1r.innerHTML = `${temperatureConversion(Math.round((response.daily.temperature_2m_max[0] + response.daily.temperature_2m_min[0]) / 2))}°F`;
        t2r.innerHTML = `${temperatureConversion(Math.round((response.daily.temperature_2m_max[1] + response.daily.temperature_2m_min[1]) / 2))}°F`;
        t3r.innerHTML = `${temperatureConversion(Math.round((response.daily.temperature_2m_max[2] + response.daily.temperature_2m_min[2]) / 2))}°F`;
        t4r.innerHTML = `${temperatureConversion(Math.round((response.daily.temperature_2m_max[3] + response.daily.temperature_2m_min[3]) / 2))}°F`;
        t5r.innerHTML = `${temperatureConversion(Math.round((response.daily.temperature_2m_max[4] + response.daily.temperature_2m_min[4]) / 2))}°F`;
        t6r.innerHTML = `${temperatureConversion(Math.round((response.daily.temperature_2m_max[5] + response.daily.temperature_2m_min[5]) / 2))}°F`;
        t7r.innerHTML = `${temperatureConversion(Math.round((response.daily.temperature_2m_max[6] + response.daily.temperature_2m_min[6]) / 2))}°F`;
    }

    f1r.innerHTML = `${response.daily.precipitation_probability_max[0]}%`;
    f2r.innerHTML = `${response.daily.precipitation_probability_max[1]}%`;
    f3r.innerHTML = `${response.daily.precipitation_probability_max[2]}%`;
    f4r.innerHTML = `${response.daily.precipitation_probability_max[3]}%`;
    f5r.innerHTML = `${response.daily.precipitation_probability_max[4]}%`;
    f6r.innerHTML = `${response.daily.precipitation_probability_max[5]}%`;
    f7r.innerHTML = `${response.daily.precipitation_probability_max[6]}%`;
    
    conditionsID = response.daily.weathercode[0];
    if (conditionsID >= 1 && conditionsID <= 3) f1i.src = 'icons/Sunny.png';
    if (conditionsID == 4) f1i.src = 'icons/Cloudy.png';
    if (conditionsID >= 5 && conditionsID <= 13) f1i.src = 'icons/Fog.png';
    if (conditionsID == 14) f1i.src = 'icons/Lightning.png';
    if (conditionsID >= 15 && conditionsID <= 17) f1i.src = 'icons/Rain.png';
    if (conditionsID == 18) f1i.src = 'icons/Lightning.png';
    if (conditionsID == 19) f1i.src = 'icons/Wind.png';
    if (conditionsID == 20) f1i.src = 'icons/Cloudy.png';
    if (conditionsID >= 21 && conditionsID <= 22) f1i.src = 'icons/Rain.png';
    if (conditionsID == 23) f1i.src = 'icons/Snow.png';
    if (conditionsID == 24) f1i.src = 'icons/SnowRain.png';
    if (conditionsID >= 25 && conditionsID <= 26) f1i.src = 'icons/Rain.png';
    if (conditionsID >= 27 && conditionsID <= 28) f1i.src = 'icons/Snow.png';
    if (conditionsID == 29) f1i.src = 'icons/Fog.png';
    if (conditionsID == 30) f1i.src = 'icons/RainLightning.png';
    if (conditionsID >= 31 && conditionsID <= 36) f1i.src = 'icons/Fog.png';
    if (conditionsID >= 37 && conditionsID <= 40) f1i.src = 'icons/Snow.png';
    if (conditionsID >= 41 && conditionsID <= 50) f1i.src = 'icons/Fog.png';
    if (conditionsID >= 51 && conditionsID <= 70) f1i.src = 'icons/Rain.png';
    if (conditionsID >= 71 && conditionsID <= 80) f1i.src = 'icons/Snow.png';
    if (conditionsID >= 81 && conditionsID <= 83) f1i.src = 'icons/Rain.png';
    if (conditionsID >= 84 && conditionsID <= 91) f1i.src = 'icons/Snow.png';
    if (conditionsID >= 92 && conditionsID <= 93) f1i.src = 'icons/Rain.png';
    if (conditionsID >= 94 && conditionsID <= 95) f1i.src = 'icons/Snow.png';
    if (conditionsID >= 96 && conditionsID <= 100) f1i.src = 'icons/RainLightning.png';
    
    conditionsID = response.daily.weathercode[1];
    if (conditionsID >= 1 && conditionsID <= 3) f2i.src = 'icons/Sunny.png';
    if (conditionsID == 4) f2i.src = 'icons/Cloudy.png';
    if (conditionsID >= 5 && conditionsID <= 13) f2i.src = 'icons/Fog.png';
    if (conditionsID == 14) f2i.src = 'icons/Lightning.png';
    if (conditionsID >= 15 && conditionsID <= 17) f2i.src = 'icons/Rain.png';
    if (conditionsID == 18) f2i.src = 'icons/Lightning.png';
    if (conditionsID == 19) f2i.src = 'icons/Wind.png';
    if (conditionsID == 20) f2i.src = 'icons/Cloudy.png';
    if (conditionsID >= 21 && conditionsID <= 22) f2i.src = 'icons/Rain.png';
    if (conditionsID == 23) f2i.src = 'icons/Snow.png';
    if (conditionsID == 24) f2i.src = 'icons/SnowRain.png';
    if (conditionsID >= 25 && conditionsID <= 26) f2i.src = 'icons/Rain.png';
    if (conditionsID >= 27 && conditionsID <= 28) f2i.src = 'icons/Snow.png';
    if (conditionsID == 29) f2i.src = 'icons/Fog.png';
    if (conditionsID == 30) f2i.src = 'icons/RainLightning.png';
    if (conditionsID >= 31 && conditionsID <= 36) f2i.src = 'icons/Fog.png';
    if (conditionsID >= 37 && conditionsID <= 40) f2i.src = 'icons/Snow.png';
    if (conditionsID >= 41 && conditionsID <= 50) f2i.src = 'icons/Fog.png';
    if (conditionsID >= 51 && conditionsID <= 70) f2i.src = 'icons/Rain.png';
    if (conditionsID >= 71 && conditionsID <= 80) f2i.src = 'icons/Snow.png';
    if (conditionsID >= 81 && conditionsID <= 83) f2i.src = 'icons/Rain.png';
    if (conditionsID >= 84 && conditionsID <= 91) f2i.src = 'icons/Snow.png';
    if (conditionsID >= 92 && conditionsID <= 93) f2i.src = 'icons/Rain.png';
    if (conditionsID >= 94 && conditionsID <= 95) f2i.src = 'icons/Snow.png';
    if (conditionsID >= 96 && conditionsID <= 100) f2i.src = 'icons/RainLightning.png';
    
    conditionsID = response.daily.weathercode[2];
    if (conditionsID >= 1 && conditionsID <= 3) f3i.src = 'icons/Sunny.png';
    if (conditionsID == 4) f3i.src = 'icons/Cloudy.png';
    if (conditionsID >= 5 && conditionsID <= 13) f3i.src = 'icons/Fog.png';
    if (conditionsID == 14) f3i.src = 'icons/Lightning.png';
    if (conditionsID >= 15 && conditionsID <= 17) f3i.src = 'icons/Rain.png';
    if (conditionsID == 18) f3i.src = 'icons/Lightning.png';
    if (conditionsID == 19) f3i.src = 'icons/Wind.png';
    if (conditionsID == 20) f3i.src = 'icons/Cloudy.png';
    if (conditionsID >= 21 && conditionsID <= 22) f3i.src = 'icons/Rain.png';
    if (conditionsID == 23) f3i.src = 'icons/Snow.png';
    if (conditionsID == 24) f3i.src = 'icons/SnowRain.png';
    if (conditionsID >= 25 && conditionsID <= 26) f3i.src = 'icons/Rain.png';
    if (conditionsID >= 27 && conditionsID <= 28) f3i.src = 'icons/Snow.png';
    if (conditionsID == 29) f3i.src = 'icons/Fog.png';
    if (conditionsID == 30) f3i.src = 'icons/RainLightning.png';
    if (conditionsID >= 31 && conditionsID <= 36) f3i.src = 'icons/Fog.png';
    if (conditionsID >= 37 && conditionsID <= 40) f3i.src = 'icons/Snow.png';
    if (conditionsID >= 41 && conditionsID <= 50) f3i.src = 'icons/Fog.png';
    if (conditionsID >= 51 && conditionsID <= 70) f3i.src = 'icons/Rain.png';
    if (conditionsID >= 71 && conditionsID <= 80) f3i.src = 'icons/Snow.png';
    if (conditionsID >= 81 && conditionsID <= 83) f3i.src = 'icons/Rain.png';
    if (conditionsID >= 84 && conditionsID <= 91) f3i.src = 'icons/Snow.png';
    if (conditionsID >= 92 && conditionsID <= 93) f3i.src = 'icons/Rain.png';
    if (conditionsID >= 94 && conditionsID <= 95) f3i.src = 'icons/Snow.png';
    if (conditionsID >= 96 && conditionsID <= 100) f3i.src = 'icons/RainLightning.png';
    
    conditionsID = response.daily.weathercode[3];
    if (conditionsID >= 1 && conditionsID <= 3) f4i.src = 'icons/Sunny.png';
    if (conditionsID == 4) f4i.src = 'icons/Cloudy.png';
    if (conditionsID >= 5 && conditionsID <= 13) f4i.src = 'icons/Fog.png';
    if (conditionsID == 14) f4i.src = 'icons/Lightning.png';
    if (conditionsID >= 15 && conditionsID <= 17) f4i.src = 'icons/Rain.png';
    if (conditionsID == 18) f4i.src = 'icons/Lightning.png';
    if (conditionsID == 19) f4i.src = 'icons/Wind.png';
    if (conditionsID == 20) f4i.src = 'icons/Cloudy.png';
    if (conditionsID >= 21 && conditionsID <= 22) f4i.src = 'icons/Rain.png';
    if (conditionsID == 23) f4i.src = 'icons/Snow.png';
    if (conditionsID == 24) f4i.src = 'icons/SnowRain.png';
    if (conditionsID >= 25 && conditionsID <= 26) f4i.src = 'icons/Rain.png';
    if (conditionsID >= 27 && conditionsID <= 28) f4i.src = 'icons/Snow.png';
    if (conditionsID == 29) f4i.src = 'icons/Fog.png';
    if (conditionsID == 30) f4i.src = 'icons/RainLightning.png';
    if (conditionsID >= 31 && conditionsID <= 36) f4i.src = 'icons/Fog.png';
    if (conditionsID >= 37 && conditionsID <= 40) f4i.src = 'icons/Snow.png';
    if (conditionsID >= 41 && conditionsID <= 50) f4i.src = 'icons/Fog.png';
    if (conditionsID >= 51 && conditionsID <= 70) f4i.src = 'icons/Rain.png';
    if (conditionsID >= 71 && conditionsID <= 80) f4i.src = 'icons/Snow.png';
    if (conditionsID >= 81 && conditionsID <= 83) f4i.src = 'icons/Rain.png';
    if (conditionsID >= 84 && conditionsID <= 91) f4i.src = 'icons/Snow.png';
    if (conditionsID >= 92 && conditionsID <= 93) f4i.src = 'icons/Rain.png';
    if (conditionsID >= 94 && conditionsID <= 95) f4i.src = 'icons/Snow.png';
    if (conditionsID >= 96 && conditionsID <= 100) f4i.src = 'icons/RainLightning.png';
    
    conditionsID = response.daily.weathercode[4];
    if (conditionsID >= 1 && conditionsID <= 3) f5i.src = 'icons/Sunny.png';
    if (conditionsID == 4) f5i.src = 'icons/Cloudy.png';
    if (conditionsID >= 5 && conditionsID <= 13) f5i.src = 'icons/Fog.png';
    if (conditionsID == 14) f5i.src = 'icons/Lightning.png';
    if (conditionsID >= 15 && conditionsID <= 17) f5i.src = 'icons/Rain.png';
    if (conditionsID == 18) f5i.src = 'icons/Lightning.png';
    if (conditionsID == 19) f5i.src = 'icons/Wind.png';
    if (conditionsID == 20) f5i.src = 'icons/Cloudy.png';
    if (conditionsID >= 21 && conditionsID <= 22) f5i.src = 'icons/Rain.png';
    if (conditionsID == 23) f5i.src = 'icons/Snow.png';
    if (conditionsID == 24) f5i.src = 'icons/SnowRain.png';
    if (conditionsID >= 25 && conditionsID <= 26) f5i.src = 'icons/Rain.png';
    if (conditionsID >= 27 && conditionsID <= 28) f5i.src = 'icons/Snow.png';
    if (conditionsID == 29) f5i.src = 'icons/Fog.png';
    if (conditionsID == 30) f5i.src = 'icons/RainLightning.png';
    if (conditionsID >= 31 && conditionsID <= 36) f5i.src = 'icons/Fog.png';
    if (conditionsID >= 37 && conditionsID <= 40) f5i.src = 'icons/Snow.png';
    if (conditionsID >= 41 && conditionsID <= 50) f5i.src = 'icons/Fog.png';
    if (conditionsID >= 51 && conditionsID <= 70) f5i.src = 'icons/Rain.png';
    if (conditionsID >= 71 && conditionsID <= 80) f5i.src = 'icons/Snow.png';
    if (conditionsID >= 81 && conditionsID <= 83) f5i.src = 'icons/Rain.png';
    if (conditionsID >= 84 && conditionsID <= 91) f5i.src = 'icons/Snow.png';
    if (conditionsID >= 92 && conditionsID <= 93) f5i.src = 'icons/Rain.png';
    if (conditionsID >= 94 && conditionsID <= 95) f5i.src = 'icons/Snow.png';
    if (conditionsID >= 96 && conditionsID <= 100) f5i.src = 'icons/RainLightning.png';
    
    conditionsID = response.daily.weathercode[5];
    if (conditionsID >= 1 && conditionsID <= 3) f6i.src = 'icons/Sunny.png';
    if (conditionsID == 4) f6i.src = 'icons/Cloudy.png';
    if (conditionsID >= 5 && conditionsID <= 13) f6i.src = 'icons/Fog.png';
    if (conditionsID == 14) f6i.src = 'icons/Lightning.png';
    if (conditionsID >= 15 && conditionsID <= 17) f6i.src = 'icons/Rain.png';
    if (conditionsID == 18) f6i.src = 'icons/Lightning.png';
    if (conditionsID == 19) f6i.src = 'icons/Wind.png';
    if (conditionsID == 20) f6i.src = 'icons/Cloudy.png';
    if (conditionsID >= 21 && conditionsID <= 22) f6i.src = 'icons/Rain.png';
    if (conditionsID == 23) f6i.src = 'icons/Snow.png';
    if (conditionsID == 24) f6i.src = 'icons/SnowRain.png';
    if (conditionsID >= 25 && conditionsID <= 26) f6i.src = 'icons/Rain.png';
    if (conditionsID >= 27 && conditionsID <= 28) f6i.src = 'icons/Snow.png';
    if (conditionsID == 29) f6i.src = 'icons/Fog.png';
    if (conditionsID == 30) f6i.src = 'icons/RainLightning.png';
    if (conditionsID >= 31 && conditionsID <= 36) f6i.src = 'icons/Fog.png';
    if (conditionsID >= 37 && conditionsID <= 40) f6i.src = 'icons/Snow.png';
    if (conditionsID >= 41 && conditionsID <= 50) f6i.src = 'icons/Fog.png';
    if (conditionsID >= 51 && conditionsID <= 70) f6i.src = 'icons/Rain.png';
    if (conditionsID >= 71 && conditionsID <= 80) f6i.src = 'icons/Snow.png';
    if (conditionsID >= 81 && conditionsID <= 83) f6i.src = 'icons/Rain.png';
    if (conditionsID >= 84 && conditionsID <= 91) f6i.src = 'icons/Snow.png';
    if (conditionsID >= 92 && conditionsID <= 93) f6i.src = 'icons/Rain.png';
    if (conditionsID >= 94 && conditionsID <= 95) f6i.src = 'icons/Snow.png';
    if (conditionsID >= 96 && conditionsID <= 100) f6i.src = 'icons/RainLightning.png';
    
    conditionsID = response.daily.weathercode[5];
    if (conditionsID >= 1 && conditionsID <= 3) f7i.src = 'icons/Sunny.png';
    if (conditionsID == 4) f7i.src = 'icons/Cloudy.png';
    if (conditionsID >= 5 && conditionsID <= 13) f7i.src = 'icons/Fog.png';
    if (conditionsID == 14) f7i.src = 'icons/Lightning.png';
    if (conditionsID >= 15 && conditionsID <= 17) f7i.src = 'icons/Rain.png';
    if (conditionsID == 18) f7i.src = 'icons/Lightning.png';
    if (conditionsID == 19) f7i.src = 'icons/Wind.png';
    if (conditionsID == 20) f7i.src = 'icons/Cloudy.png';
    if (conditionsID >= 21 && conditionsID <= 22) f7i.src = 'icons/Rain.png';
    if (conditionsID == 23) f7i.src = 'icons/Snow.png';
    if (conditionsID == 24) f7i.src = 'icons/SnowRain.png';
    if (conditionsID >= 25 && conditionsID <= 26) f7i.src = 'icons/Rain.png';
    if (conditionsID >= 27 && conditionsID <= 28) f7i.src = 'icons/Snow.png';
    if (conditionsID == 29) f7i.src = 'icons/Fog.png';
    if (conditionsID == 30) f7i.src = 'icons/RainLightning.png';
    if (conditionsID >= 31 && conditionsID <= 36) f7i.src = 'icons/Fog.png';
    if (conditionsID >= 37 && conditionsID <= 40) f7i.src = 'icons/Snow.png';
    if (conditionsID >= 41 && conditionsID <= 50) f7i.src = 'icons/Fog.png';
    if (conditionsID >= 51 && conditionsID <= 70) f7i.src = 'icons/Rain.png';
    if (conditionsID >= 71 && conditionsID <= 80) f7i.src = 'icons/Snow.png';
    if (conditionsID >= 81 && conditionsID <= 83) f7i.src = 'icons/Rain.png';
    if (conditionsID >= 84 && conditionsID <= 91) f7i.src = 'icons/Snow.png';
    if (conditionsID >= 92 && conditionsID <= 93) f7i.src = 'icons/Rain.png';
    if (conditionsID >= 94 && conditionsID <= 95) f7i.src = 'icons/Snow.png';
    if (conditionsID >= 96 && conditionsID <= 100) f7i.src = 'icons/RainLightning.png';

    url = `https://nominatim.openstreetmap.org/reverse?lat=${loc[0]}&lon=${loc[1]}&<params>`;
    xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
    xmlHttp.send(null);
    response = xmlToJson.parse(xmlHttp.responseText);

    l1.innerHTML = "Coordinates:";
    l2.innerHTML = `${loc[0].toFixed(7)}, ${loc[1].toFixed(7)}`;

    try {
        if (response.reversegeocode.addressparts.state_district != undefined) l1.innerHTML = response.reversegeocode.addressparts.state_district;
        if (response.reversegeocode.addressparts.country != undefined) l1.innerHTML = response.reversegeocode.addressparts.country;
        if (response.reversegeocode.addressparts.county != undefined) l1.innerHTML = response.reversegeocode.addressparts.county;
        if (response.reversegeocode.addressparts.region != undefined) l1.innerHTML = response.reversegeocode.addressparts.region;
        if (response.reversegeocode.addressparts.state != undefined) l1.innerHTML = response.reversegeocode.addressparts.state;

        if (response.reversegeocode.addressparts.pt != undefined) l2.innerHTML = response.reversegeocode.addressparts.pt;
        if (l1.innerHTML != response.reversegeocode.addressparts.county && response.reversegeocode.addressparts.county != undefined) l2.innerHTML = response.reversegeocode.addressparts.county;
        if (response.reversegeocode.addressparts.city != undefined) l2.innerHTML = response.reversegeocode.addressparts.city;
        if (response.reversegeocode.addressparts.village != undefined) l2.innerHTML = response.reversegeocode.addressparts.village;
        if (response.reversegeocode.addressparts.municipality != undefined) l2.innerHTML = response.reversegeocode.addressparts.municipality;
        if (response.reversegeocode.addressparts.town != undefined) l2.innerHTML = response.reversegeocode.addressparts.town;
    } catch (err) {

    }

    if (l1.innerHTML == "Coordinates:") {
        l2.innerHTML = `${loc[0].toFixed(7)}, ${loc[1].toFixed(7)}`;
    }
}

// Navbar button functionality
function openmap() {
    document.getElementById("mapbox").style.display = "inline";
    document.getElementById("widgetbox").style.display = "none";
    document.getElementById("forecastbox").style.display = "none";
}

function opendaily() {
    document.getElementById("mapbox").style.display = "none";
    document.getElementById("widgetbox").style.display = "inline";
    document.getElementById("forecastbox").style.display = "none";
}

function openforecast() {
    document.getElementById("mapbox").style.display = "none";
    document.getElementById("widgetbox").style.display = "none";
    document.getElementById("forecastbox").style.display = "inline";
}

// Math stuff
function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
}

function temperatureConversion(d) {
    return Math.round(((d * 9 / 5) + 32) * 10) / 10;
}

function kmtm(km) {
    return Math.round((km * 0.621371) * 10) / 10;
}

function mmtin(mm) {
    return Math.round((mm / 25.4) * 10) / 10;
}
