const api = {
    key: "2fca39b9842955d4d63ad055025609dd",
    base: "https://api.openweathermap.org/data/2.5/"
}

const api2 = {
    key: "2fca39b9842955d4d63ad055025609dd",
    base: "https://api.openweathermap.org/geo/1.0/reverse?"
}
//Default behavior when page is opened is to give weather in Springfield, Illinois.
getResults('Springfield');

const btn = document.querySelector('#show');
btn.addEventListener('click', checkGeolocation);

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

function setQuery(evt) {
    if (evt.keyCode == 13) {
        getResults(searchbox.value);
    }
}

function getResults(query) {
    fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(weather => {
            if(weather.ok) {
                return weather.json();
            }
            else {
                window.confirm("Couldn\'t find that city. Please try again");
                searchbox.value = "";
            }
        }).then(displayResults);
}

function displayResults(weather) {
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    let now = new Date();
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(now);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;
    
    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`;

    let feelslike = document.querySelector('.feels-like');
    feelslike.innerText = `Feels like ${Math.round(weather.main.feels_like)}°C`;

    let humidity = document.querySelector('.humidity');
    humidity.innerText = `Humidity: ${weather.main.humidity}%`;
    
    let body = document.querySelector('body');

    weatherBGChange(weather, body);    
    cityBGChange(weather, body);
    searchbox.value = "";
}

function dateBuilder(d) {
    let months = ["January", "February", "March", "April", "May",
    "June", "July", "August", "September", "October", "November", "December"];
    
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${month} ${date}, ${year}`;
}

//Changes background image according to the conditions at the location
function weatherBGChange(conditions, body) {
    let condition = conditions.weather[0].main;
    switch (condition) {
        case 'Rain':
            body.style.backgroundImage = "url('rainy.jpg')";
            break;
        case 'Clouds':
            body.style.backgroundImage = "url('cloudy.jpg')";
            break;
        case 'Snow':
            body.style.backgroundImage = "url('snowy.jpg')";
            break;
        default:
            body.style.backgroundImage = "url('sunny.jpg')";
            break;
    }
}

//Changes background image if searched city is one of a few specific cities
function cityBGChange(city, body) {
    let currentcity = city.name;
    switch (currentcity) {
        case 'New York':
            body.style.backgroundImage = "url('newyork.jpg')";
            break;
        case 'Chicago':
            body.style.backgroundImage = "url('chicago.jpg')";
            break;
        case 'Champaign':
            body.style.backgroundImage = "url('champaign.jpg')";
            break;
        case 'Urbana':
            body.style.backgroundImage = "url('champaign.jpg')";
            break;
        case 'London':
            body.style.backgroundImage = "url('london.jpg')";
            break;
        case 'Beijing':
            body.style.backgroundImage = "url('beijing.jpg')";
            break;
        case 'Paris':
            body.style.backgroundImage = "url('paris.jpg')";
            break;
        default:
            break;
    }
}

function checkGeolocation() {
    if (!navigator.geolocation) {
        window.confirm(`Your browser doesn't support Geolocation`);
    }
    navigator.geolocation.getCurrentPosition(onSuccess);
}

function onSuccess(position) {
    const {
        latitude,
        longitude
    } = position.coords;
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    fetch(`${api2.base}lat=${lat}&lon=${lon}&limit=1&APPID=${api2.key}`)
        .then(result => {
                return result.json();
        }).then(passToGet);
}

function passToGet(query) {
    getResults(query[0].name);
}
