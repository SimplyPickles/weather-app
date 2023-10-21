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

// Get elements
const locationbox = document.getElementById("locationbox");
const l1 = document.getElementById("location");
const l2 = document.getElementById("location2");

const lbox = document.getElementById("loadingbox");

const uvindex = document.getElementById("uv");

const temperature = document.getElementById("temperature");
const feelslike = document.getElementById("feelslike");

const visibility = document.getElementById("visibilitytxt");

const conditions = document.getElementById("conditionstxt");
const humidity = document.getElementById("humiditytxt");
const windspeed = document.getElementById("windspeedtxt");

let map;

let locationselection = document.getElementById("locationselection");

locationbox.onclick = function () {
    l1.style.opacity = 0;
    l2.style.opacity = 0;
    locationselection.style.opacity = 1;
}

// Get user location
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        let loc = [position.coords.latitude, position.coords.longitude];
        loadMap(loc);

        map = L.map('mapcontainer', {
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

            loadMap([e.latlng.lat, e.latlng.lng]);
        });
    });
}

function loadMap(loc) {
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

    temperature.innerHTML = `${response.current_weather.temperature}°C`;
    feelslike.innerHTML = `Feels like ${response.hourly.apparent_temperature[timeIndex]}°C`;

    visibility.innerHTML = `${response.hourly.visibility[timeIndex] / 1000} km`;
    
    conditions.innerHTML = `${codes[response.daily.weathercode[0].toString()]}`;
    humidity.innerHTML = `${response.hourly.relativehumidity_2m[timeIndex]}%`;
    windspeed.innerHTML = `${response.current_weather.windspeed} km/h`;
}

function openmap() {
    document.getElementById("mapbox").style.display = "inline";
    document.getElementById("widgetbox").style.display = "none";
    document.getElementById("forecast").style.display = "none";
    setTimeout(function() { map.invalidateSize() }, 100);
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