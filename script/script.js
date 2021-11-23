import { fahrenheitConverter } from "./helpers.js";

const body = document.querySelector("body");
const form = document.querySelector(".container form");
const input = document.querySelector(".container input");
const msg = document.querySelector(".container .msg");
const container = document.querySelector(".current-weather-container");
const weatherDetails = document.querySelector(".current-weather-details");
const searchCities = document.querySelector(".cities-searched-container");
const apiKey = "6c682001acd0b4db3cb14934f6809fff";
let cityArray = [];

changeBackground();

function checkClass(el, weatherType) {
  let weather = weatherType?.toString();
  let currentClass = el.className;

  if (currentClass !== weatherType) {
    el.classList.remove(currentClass);
    el.classList.add(weather?.toLowerCase());
  }
}

function changeBackground(weather) {
  return !weather ? body.classList.add("landing") : checkClass(body, weather);
}

function createCityList(cityArray) {
  if (cityArray) {
    const ul = document.createElement("ul");
    ul.className = "cities-searched-list";
    const city = `
      ${cityArray
        .map(function (city) {
          return `<li>${city}</li>`;
        })
        .join("")}
    `;

    ul.innerHTML = city;
    searchCities.replaceChildren(ul);
  }
}

function createWeatherDetails(main, wind) {
  const div = document.createElement("div");
  div.className = "weather-details";
  let windCheck = wind.gust ? wind.gust : "--";
  const details = `
    <p>Weather Details</p>
    <ul>
      <li>
        <div>Daily High</div> 
        <div>${fahrenheitConverter(main.temp_max)}<sup>°F</sup></div>
      </li>
      <li>
        <div>Daily Low</div>  
        <div>${fahrenheitConverter(main.temp_min)}<sup>°F</sup></div>
      </li>
      <li>
        <div>Humidity</div>
        <div>${main.humidity}%</div>
      </li>
      <li>
        <div>Wind</div> 
        <div>${windCheck}</div>
      </li>
    </ul>
  `;
  div.innerHTML = details;
  weatherDetails.replaceChildren(div);
}

function createMainWeatherUpdate(main, name, sys, weather) {
  const div = document.createElement("div");
  const icon = `https://openweathermap.org/img/wn/${weather[0]["icon"]}@2x.png`;

  div.className = "details";
  //TO-DO time zone
  const markup = `
    <div class="flex-item city-temp">${fahrenheitConverter(
      main.temp
    )}<sup>°F</sup>
    </div>
    <div class="flex-item city-name" data-name="${name},${sys.country}">
      <span>${name}</span>
      <sup>${sys.country}</sup>
    </div>
    <div class="city-weather flex-item">
      <img class="city-icon" src=${icon} alt=${weather[0]["main"]}>
      <figcaption>${weather[0]["description"]}</figcaption>
    </div>
    
    `;
  div.innerHTML = markup;
  container.replaceChildren(div);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputVal = input.value;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${inputVal}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const { main, name, sys, weather, wind } = data;

      createMainWeatherUpdate(main, name, sys, weather);
      changeBackground(weather[0].main);
      createWeatherDetails(main, wind);

      if (!cityArray.includes(inputVal.toLowerCase())) {
        cityArray.push(inputVal);
        createCityList(cityArray);
      }
    })
    .catch((error) => {
      msg.textContent = "Please search for a valid city 😩";
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });
  msg.textContent = "";
  form.reset();
  input.focus();
});
