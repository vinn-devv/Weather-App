const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const message = document.querySelector("#message");
const weatherResult = document.querySelector("#weather-result");

const cityName = document.querySelector("#city-name");
const temperature = document.querySelector("#temperature");
const weatherDescription = document.querySelector("#weather-description");
const windSpeed = document.querySelector("#wind-speed");
const humidity = document.querySelector("#humidity");

const searchButton = document.querySelector("#search-button");
const weatherIcon = document.querySelector("#weather-icon");
const feelsLike = document.querySelector("#feels-like");
const celsiusButton = document.querySelector("#celsius-button");
const fahrenheitButton = document.querySelector("#fahrenheit-button");

let temperatureUnit = "celsius";

async function getCityCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

  let response;

  try {
    response = await fetch(url);
  } catch {
    throw new Error("Network error. Check your internet connection.");
  }

  if (!response.ok) {
    throw new Error("Unable to find city.");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("City not found. Try another name.");
  }

  return data.results[0];
}

async function getCurrentWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`;

  let response;

  try {
    response = await fetch(url);
  } catch {
    throw new Error("Network error. Check your internet connection.");
  }

  if (!response.ok) {
    throw new Error("Unable to fetch weather data.");
  }

  const data = await response.json();

  return data.current;
}

function getWeatherDescription(code) {
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail",
  };

  return weatherCodes[code] || "Unknown weather";
}

searchForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    message.classList.add("error");
    message.textContent = "Please enter a city name.";
    return;
  }

  searchButton.disabled = true;
  searchButton.textContent = "Loading...";
  message.classList.remove("error");
  message.textContent = "Fetching weather...";
  weatherResult.hidden = true;

  try {
    const location = await getCityCoordinates(city);

    const weather = await getCurrentWeather(
      location.latitude,
      location.longitude,
    );

    weatherIcon.innerHTML = getWeatherIcon(weather.weather_code);
    cityName.textContent = `${location.name}, ${location.country}`;
    const currentTemperature =
      temperatureUnit === "celsius"
        ? weather.temperature_2m
        : (weather.temperature_2m * 9) / 5 + 32;

    temperature.textContent = `${Math.round(currentTemperature)}°${temperatureUnit === "celsius" ? "C" : "F"}`;
    const feelsLikeTemperature =
      temperatureUnit === "celsius"
        ? weather.apparent_temperature
        : (weather.apparent_temperature * 9) / 5 + 32;

    feelsLike.textContent = `Feels like ${Math.round(feelsLikeTemperature)}°${temperatureUnit === "celsius" ? "C" : "F"}`;
    weatherDescription.textContent = getWeatherDescription(
      weather.weather_code,
    );
    windSpeed.textContent = `Wind: ${weather.wind_speed_10m} km/h`;
    humidity.textContent = `Humidity: ${weather.relative_humidity_2m}%`;

    weatherResult.hidden = false;
    message.textContent = "";
  } catch (error) {
    weatherResult.hidden = true;
    message.classList.add("error");
    message.textContent = error.message;
  } finally {
    searchButton.disabled = false;
    searchButton.textContent = "Search";
  }
});

function getWeatherIcon(code) {
  let icon = "";

  if (code === 0) {
    icon = `<circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path>`;
  } else if (code <= 3) {
    icon = `<path d="M20 16.2A4.5 4.5 0 0 0 18 7.5a6 6 0 0 0-11.4 2A4 4 0 0 0 7 17h11"></path>`;
  } else if (code === 45 || code === 48) {
    icon = `<path d="M3 8h18M5 12h14M3 16h18"></path>`;
  } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    icon = `<path d="M20 15.5A4.5 4.5 0 0 0 18 7a6 6 0 0 0-11.4 2A4 4 0 0 0 7 16h11"></path>
      <path d="m8 19-1 2m6-2-1 2m6-2-1 2"></path>`;
  } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    icon = `<path d="M12 2v20M4 7l16 10M4 17 20 7M7 3l10 18"></path>`;
  } else if (code >= 95) {
    icon = `<path d="M20 15.5A4.5 4.5 0 0 0 18 7a6 6 0 0 0-11.4 2A4 4 0 0 0 7 16h11"></path>
      <path d="m13 16-4 4h4l-1 4 5-6h-4l1-2"></path>`;
  } else {
    icon = `<circle cx="12" cy="12" r="4"></circle>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"
    viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">${icon}</svg>`;
}
function updateTemperatureUnit(unit) {
  temperatureUnit = unit;

  celsiusButton.classList.toggle("active", unit === "celsius");
  fahrenheitButton.classList.toggle("active", unit === "fahrenheit");

  if (cityName.textContent) {
    searchForm.requestSubmit();
  }
}

celsiusButton.addEventListener("click", function () {
  updateTemperatureUnit("celsius");
});

fahrenheitButton.addEventListener("click", function () {
  updateTemperatureUnit("fahrenheit");
});
