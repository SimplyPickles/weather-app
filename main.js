let codes = {
    "0": "Clear Sky",
    "01": "Clouds Dissolving",
    "02": "Clear Sky",
    "03": "Clouds Developing",
    "04": "Reduced Visiblity",
    "05": "Haze",
    "06": "Widespread Dust",
    "07": "Dust",
    "08": "Dust",
    "09": "Duststorms",
    "10": "Mist",
    "11": "Fog Patches",
    "12": "Continuous Fog",
    "13": "Visible Lightning",
    "14": "Light Rain",
    "15": "Light Rain",
    "16": "Light Rain",
    "17": "Thunderstorm",
    "18": "Heavy Winds",
    "19": "Funnel Clouds",
    "20": "Drizzle",
    "21": "Rain",
    "22": "Snow",
    "23": "Rain and Snow",
    "24": "Drizzle",
    "25": "Rain Showers",
    "26": "Snow Showers",
    "27": "Hail Showers",
    "28": "Fog",
    "29": "Thunderstorm",
    "30": "Slight Duststorm",
    "31": "Slight Duststorm",
    "32": "Slight Duststorm",
    "33": "Severe Duststorm",
    "34": "Severe Duststorm",
    "35": "Severe Duststorm",
    "36": "Slight Snow",
    "37": "Heavy Snow",
    "38": "Moderate Slight",
    "39": "Heavy drifting snow",
    "40": "Fog",
    "41": "Fog Patches",
    "42": "Fog Thinning",
    "43": "Fog",
    "44": "Fog",
    "45": "Fog",
    "46": "Fog Thickening",
    "47": "Fog",
    "48": "Fog",
    "49": "Fog ",
    "50": "Drizzle",
    "51": "Drizzle",
    "52": "Moderate Drizzle",
    "53": "Drizzle",
    "54": "Heavy Drizzle",
    "55": "Drizzle",
    "56": "Slight Drizzle",
    "57": "Heavy Drizzle",
    "58": "Slight Rain",
    "59": "Moderate Rain",
    "60": "Slight Rain",
    "61": "Rain",
    "62": "Moderate Rain",
    "63": "Rain",
    "64": "Heavy Rain",
    "65": "Continuous Rain",
    "66": "Freezing Rain",
    "67": "Moderate Rain",
    "68": "Slight Rain",
    "69": "Heavy Rain",
    "70": "Snow",
    "71": "Snow",
    "72": "Moderate Snow",
    "73": "Snow",
    "74": "Heavy Snow",
    "75": "Snow",
    "76": "Diamond Dust",
    "77": "Snow Grains",
    "78": "Snow Crystals",
    "79": "Ice Pellets",
    "80": "Slight Rain",
    "81": "Heavy Rain",
    "82": "Violent Rain",
    "83": "Slight Snow",
    "84": "Heavy Snow",
    "85": "Slight Snow",
    "86": "Heavy Snow",
    "87": "Hail",
    "88": "Hail",
    "89": "Hail",
    "90": "Hail",
    "91": "Slight Rain",
    "92": "Moderate Rain",
    "93": "Slight Snow",
    "94": "Moderate Snow",
    "95": "Moderate Thunderstorm",
    "96": "Slight Thunderstorm",
    "97": "Heavy Thunderstorm",
    "98": "Thunderstorm",
    "99": "Heavy Thunderstorms"
}

// Get elements
const uvindex = document.getElementById("uv");

const temperature = document.getElementById("temperature");
const feelslike = document.getElementById("feelslike");

const visibility = document.getElementById("visibilitytxt");

const conditions = document.getElementById("conditionstxt");
const humidity = document.getElementById("humiditytxt");
const windspeed = document.getElementById("windspeedtxt");

// Get user location
let loc = [40.7648, -73.9808];

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        loc = [position.coords.latitude, position.coords.longitude];
    });
}

let url = `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,snowfall,weathercode,visibility,windspeed_10m,winddirection_10m,uv_index&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max&current_weather=true&timezone=auto`;
let xmlHttp = new XMLHttpRequest();
xmlHttp.open("GET", url, false);
xmlHttp.send(null);
let response = JSON.parse(xmlHttp.responseText);
console.log(response);
// Get timestamp
let timestamp = new Date().toISOString().split(":")[0];
let timeIndex = response.hourly.time.indexOf((timestamp + ":00"));

// Change text
uvindex.innerHTML = `UV Index: ${response.hourly.uv_index[timeIndex]}`;

temperature.innerHTML = `${response.current_weather.temperature}°C`;
feelslike.innerHTML = `Feels like ${((response.hourly.apparent_temperature_max[timeIndex] + response.hourly.apparent_temperature_min[timeIndex]) / 2)}°C`;

visibility.innerHTML = `${response.hourly.visibility[timeIndex] / 1000} km`;
//dewpoint.innerHTML = `Dew Point: ${response.hourly.dewpoint_2m[timeIndex]}°C`;

conditions.innerHTML = `${codes[response.daily.weathercode[0]]}`;
humidity.innerHTML = `${response.hourly.relativehumidity_2m[timeIndex]}%`;
windspeed.innerHTML = `${response.current_weather.windspeed} km/h`;
