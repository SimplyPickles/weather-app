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
    "Fog ",
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
const humidity = document.getElementById("humiditytxt");
const windspeed = document.getElementById("windspeedtxt");

const rainfall = document.getElementById("rainfalltxt");
const rainchance = document.getElementById("rainchance");

// Forecast elements
const d1r = document.getElementById("d1r");
const t1r = document.getElementById("t1r");
const f1r = document.getElementById("f1r");

const d2r = document.getElementById("d2r");
const t2r = document.getElementById("t2r");
const f2r = document.getElementById("f2r");

const d3r = document.getElementById("d3r");
const t3r = document.getElementById("t3r");
const f3r = document.getElementById("f3r");

const d4r = document.getElementById("d4r");
const t4r = document.getElementById("t4r");
const f4r = document.getElementById("f4r");

const d5r = document.getElementById("d5r");
const t5r = document.getElementById("t5r");
const f5r = document.getElementById("f5r");

const d6r = document.getElementById("d6r");
const t6r = document.getElementById("t6r");
const f6r = document.getElementById("f6r");

const d7r = document.getElementById("d7r");
const t7r = document.getElementById("t7r");
const f7r = document.getElementById("f7r");

// Maps and location
let map;
let locationselection = document.getElementById("locationselection");

// Search functions
locationbox.onclick = function () {
    l1.style.opacity = 0;
    l2.style.opacity = 0;
    locationselection.style.opacity = 1;
}

// Get user location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        let loc = [position.coords.latitude, position.coords.longitude];
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

            loadData([e.latlng.lat, e.latlng.lng]);
        });
    });
} 

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

    temperature.innerHTML = `${response.current_weather.temperature}°C`;
    feelslike.innerHTML = `Feels like ${response.hourly.apparent_temperature[timeIndex]}°C`;

    visibility.innerHTML = `${response.hourly.visibility[timeIndex] / 1000} km`;
    conditions.innerHTML = `${codes[response.daily.weathercode[0].toString()]}`;
    
    rainchance.innerHTML = `${response.hourly.precipitation_probability[timeIndex].toString()}%`;
    humidity.innerHTML = `${response.hourly.relativehumidity_2m[timeIndex]}%`;
    windspeed.innerHTML = `${response.current_weather.windspeed} km/h`;

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

    rainfall.innerHTML = `${response.daily.precipitation_sum[0]} mm`
    console.log(response.daily);

    d1r.innerHTML = `Today • UV Index: ${response.daily.uv_index_max[0]}`;
    d2r.innerHTML = `${response.daily.time[1].split("-")[1]}/${response.daily.time[1].split("-")[2]} • UV Index: ${response.daily.uv_index_max[1]}`;
    d3r.innerHTML = `${response.daily.time[2].split("-")[1]}/${response.daily.time[2].split("-")[2]} • UV Index: ${response.daily.uv_index_max[2]}`;
    d4r.innerHTML = `${response.daily.time[3].split("-")[1]}/${response.daily.time[3].split("-")[2]} • UV Index: ${response.daily.uv_index_max[3]}`;
    d5r.innerHTML = `${response.daily.time[4].split("-")[1]}/${response.daily.time[4].split("-")[2]} • UV Index: ${response.daily.uv_index_max[4]}`;
    d6r.innerHTML = `${response.daily.time[5].split("-")[1]}/${response.daily.time[5].split("-")[2]} • UV Index: ${response.daily.uv_index_max[5]}`;
    d7r.innerHTML = `${response.daily.time[6].split("-")[1]}/${response.daily.time[6].split("-")[2]} • UV Index: ${response.daily.uv_index_max[6]}`;

    t1r.innerHTML = `${Math.round((response.daily.temperature_2m_max[0] + response.daily.temperature_2m_min[0]) / 2)}°C`;
    t2r.innerHTML = `${Math.round((response.daily.temperature_2m_max[1] + response.daily.temperature_2m_min[1]) / 2)}°C`;
    t3r.innerHTML = `${Math.round((response.daily.temperature_2m_max[2] + response.daily.temperature_2m_min[2]) / 2)}°C`;
    t4r.innerHTML = `${Math.round((response.daily.temperature_2m_max[3] + response.daily.temperature_2m_min[3]) / 2)}°C`;
    t5r.innerHTML = `${Math.round((response.daily.temperature_2m_max[4] + response.daily.temperature_2m_min[4]) / 2)}°C`;
    t6r.innerHTML = `${Math.round((response.daily.temperature_2m_max[5] + response.daily.temperature_2m_min[5]) / 2)}°C`;
    t7r.innerHTML = `${Math.round((response.daily.temperature_2m_max[6] + response.daily.temperature_2m_min[6]) / 2)}°C`;

    f1r.innerHTML = `${response.daily.precipitation_probability_max[0]}%`;
    f2r.innerHTML = `${response.daily.precipitation_probability_max[1]}%`;
    f3r.innerHTML = `${response.daily.precipitation_probability_max[2]}%`;
    f4r.innerHTML = `${response.daily.precipitation_probability_max[3]}%`;
    f5r.innerHTML = `${response.daily.precipitation_probability_max[4]}%`;
    f6r.innerHTML = `${response.daily.precipitation_probability_max[5]}%`;
    f7r.innerHTML = `${response.daily.precipitation_probability_max[6]}%`;
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