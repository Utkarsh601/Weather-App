const userTab = document.querySelector("[data-userWeather]");
const SearchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector('.weather-container');
const grantAccesscontainer = document.querySelector('.grant-location-container');
const searchform = document.querySelector('[data-searchForm]');
const loadingScreen = document.querySelector('.loading-container');
const userInfoContainer = document.querySelector('.user-info-container');

let oldTab = userTab;
const API_KEY = 'c735a615c0cb3926cedeff64bf5b3961';
oldTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(newTab) {
    if(newTab != oldTab) {
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchform.classList.contains("active")){
         
            userInfoContainer.classList.remove("active")
            grantAccesscontainer.classList.remove("active");
            searchform.classList.add("active");
        }else{
            
            searchform.classList.remove("active");
            userInfoContainer.classList.remove('active');
            
            getFromSessionStorage();
        }
    }
}
userTab.addEventListener('click' , ()=>{

    switchTab(userTab)
});

SearchTab.addEventListener('click' , ()=>{
    
    switchTab(SearchTab)
});

function getFromSessionStorage() {
    const localCoordinate = sessionStorage.getItem('user-coordinates');
    if(!localCoordinate) {
     
        grantAccesscontainer.classList.add('active');
    }else{
        const coordinates = JSON.parse(localCoordinate);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat,lon} = coordinates;
    grantAccesscontainer.classList.remove('active');
    loadingScreen.classList.add('active');

    try {
        const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
              );
        const data = await response.json();
        loadingScreen.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }catch(e) {
        loadingScreen.classList.remove("active");
        console.log("No location found")
    }
}
function renderWeatherInfo(weatherInfo) {
    const cityName = document.querySelector("[data-city-name]");
    const countryIcon = document.querySelector("[data-country-icon]");
    const desc = document.querySelector("[data-weather-description]");
    const weatherIcon = document.querySelector("[data-weather-icon]");
    const temp  = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humdidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp}°C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}
function getLocation() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }else{
        alert('Please Grant Access');
    }
}

function showPosition(position) {
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessbutton = document.querySelector("[data-grantAccess]");
grantAccessbutton.addEventListener('click' , getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchform.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {
    loadingScreen.classList.add('active');
    userInfoContainer.classList.remove("active");
    grantAccesscontainer.classList.remove("active")

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
          const data = await response.json();
          loadingScreen.classList.remove('active');
          userInfoContainer.classList.add("active");
          renderWeatherInfo(data);
    }
    catch(e) {
        
    }
}
