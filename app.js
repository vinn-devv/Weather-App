const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const message = document.querySelector("#message");
const weatherResult = document.querySelector("#weather-result");

const cityName = document.querySelector("#city-name");
const temperature = document.querySelector("#temperature");
const weatherDescription = document.querySelector("#weather-description");

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
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to fetch weather data.");
  }

  const data = await response.json();

  return data.current;
}

function getWeatherDescription(code) {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";

  if ([45, 48].includes(code)) {
    return "Fog";
  }

  if ([51, 53, 55].includes(code)) {
    return "Drizzle";
  }

  if ([61, 63, 65].includes(code)) {
    return "Rain";
  }

  if ([71, 73, 75].includes(code)) {
    return "Snow";
  }

  if ([80, 81, 82].includes(code)) {
    return "Rain showers";
  }

  if ([95, 96, 99].includes(code)) {
    return "Thunderstorm";
  }

  return "Unknown weather";
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
