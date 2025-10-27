const apiKey = "6c37c2c7399e1abf1f924cb5e4bd3272";

const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const weatherList = document.getElementById("weatherList");
const resetBtn = document.getElementById("resetBtn");

let cities = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) return;
  if (cities.length >= 2) {
    alert("You can only check 2 cities at a time! Remove one to add another.");
    return;
  }
  getWeather(city);
  cityInput.value = "";
});

resetBtn.addEventListener("click", () => {
  cities = [];
  weatherList.innerHTML = "";
});

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      alert("City not found!");
      return;
    }
    const data = await res.json();
    cities.push(data);
    displayCities();
  } catch (err) {
    alert("Error fetching weather.");
    console.error(err);
  }
}

function displayCities() {
  weatherList.innerHTML = "";
  cities.forEach((data, index) => {
    const card = document.createElement("div");
    card.classList.add("weather-card");

    const wearAdvice = getWearSuggestion(data.main.temp, data.weather[0].main);

    card.innerHTML = `
      <button class="remove-btn" onclick="removeCity(${index})">X</button>
      <h2>${data.name}, ${data.sys.country}</h2>
      <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="Weather icon">
      <p><strong>${Math.round(data.main.temp)}°C</strong> — ${data.weather[0].description}</p>
      <p class="wear-suggestion">Bring: ${wearAdvice}</p>
    `;
    weatherList.appendChild(card);
  });
}

function getWearSuggestion(temp, condition) {
  condition = condition.toLowerCase();
  if (condition.includes("rain")) return "a waterproof jacket or umbrella";
  if (temp < 5) return "a heavy coat and warm accessories";
  if (temp < 15) return "a warm sweater or light jacket";
  if (temp < 25) return "a t-shirt or light shirt";
  return "cool, breathable clothing";
}

function removeCity(index) {
  cities.splice(index, 1);
  displayCities();
}
