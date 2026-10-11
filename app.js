const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const message = document.querySelector("#message");
const weatherResult = document.querySelector("#weather-result");

const cityName = document.querySelector("#city-name");
const temperature = document.querySelector("#temperature");
const weatherDescription = document.querySelector("#weather-description");
const windSpeed = document.querySelector("#wind-speed");

const searchButton = document.querySelector("#search-button");

async function getCityCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

  const response = await fetch(url);

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
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`;

  const response = await fetch(url);

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

    cityName.textContent = `${location.name}, ${location.country}`;
    temperature.textContent = `${weather.temperature_2m}°C`;
    weatherDescription.textContent = getWeatherDescription(
      weather.weather_code,
    );
    windSpeed.textContent = `Wind: ${weather.wind_speed_10m} km/h`;

    weatherResult.hidden = false;
    message.textContent = "";
  } catch (error) {
    message.classList.add("error");
    message.textContent = error.message;
  } finally {
    searchButton.disabled = false;
    searchButton.textContent = "Search";
  }
});
