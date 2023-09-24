const loc = document.getElementById("location");

const temperature = document.getElementById("temperature");
const feelslike = document.getElementById("feelslike");

const conditions1 = document.getElementById("conditions1");
const conditions2 = document.getElementById("conditions2");

const mapbox = document.getElementById("mapbox");

const rainchance = document.getElementById("rainchance");
const dewpoint = document.getElementById("dewpoint");
const visibility = document.getElementById("visibility");

const wind = document.getElementById("windtext");
const conditions = document.getElementById("conditionstext");
const humidity = document.getElementById("humiditytext");

let data = {
    "location": "San Francisco",
    "temperature": 58,
    "feelslike": 59,
    "conditions1": "Sunny",
    "conditions2": "Moderate Winds",
    "rainchance": 64,
    "dewpoint": 56,
    "visibility": 6,
    "wind": 17.3,
    "conditions": "Sunny",
    "humidity": 88
}

let mainLoop = setInterval(function () {
    loc.innerHTML = data.location;

    temperature.innerHTML = `${data.temperature}°F`;
    feelslike.innerHTML = `Feels like ${data.feelslike}°F`;
    
    conditions1.innerHTML = data.conditions1;
    conditions2.innerHTML = data.conditions2;
    
    rainchance.innerHTML = `Chance to Rain: ${data.rainchance}%`;
    dewpoint.innerHTML = `Dew Point: ${data.dewpoint}°F`;
    visibility.innerHTML = `Visibility: ${data.visibility}km`;
    
    wind.innerHTML = `${data.wind} mph`;
    conditions.innerHTML = data.conditions1;
    humidity.innerHTML = `${data.humidity}%`;
}, 1);
