const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const message = document.querySelector("#message");
const weatherResult = document.querySelector("#weather-result");
const clearHistoryButton = document.querySelector("#clear-history-button");
const forecastList = document.querySelector("#forecast-list");

const cityName = document.querySelector("#city-name");
const localTime = document.querySelector("#local-time");
const lastUpdated = document.querySelector("#last-updated");
const temperature = document.querySelector("#temperature");
const weatherDescription = document.querySelector("#weather-description");
const weatherAdvice = document.querySelector("#weather-advice");
const windSpeed = document.querySelector("#wind-speed");
const humidity = document.querySelector("#humidity");
const refreshButton = document.querySelector("#refresh-button");

const searchButton = document.querySelector("#search-button");
const locationButton = document.querySelector("#location-button");
const weatherIcon = document.querySelector("#weather-icon");
const feelsLike = document.querySelector("#feels-like");
const celsiusButton = document.querySelector("#celsius-button");
const fahrenheitButton = document.querySelector("#fahrenheit-button");
const historyList = document.querySelector("#history-list");
const searchHistory =
  JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];

let temperatureUnit = "celsius";
let lastSearchedCity = "";

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
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;

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

  return {
    ...data.current,
    timezone: data.timezone,
    daily: data.daily,
  };
  d;
}

function getWeatherCategory(code) {
  if (code === 0 || code === 1) return "clear";
  if (code === 2 || code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";
  if (code >= 71 && code <= 86) return "snow";
  if (code >= 95) return "storm";

  return "default";
}

function getWeatherAdvice(code) {
  if (code >= 95) return "Stay alert for thunderstorms.";
  if (code >= 51 && code <= 82) return "Bring an umbrella.";
  if (code === 45 || code === 48) return "Take care in low visibility.";
  if (code >= 71 && code <= 86) return "Dress warmly.";
  if (code === 0 || code === 1) return "Enjoy the clear weather!";
  if (code === 2 || code === 3) return "Expect cloudy skies.";

  return "Check conditions before heading out.";
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
  lastSearchedCity = city;

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
    document.body.dataset.weather = getWeatherCategory(weather.weather_code);
    cityName.textContent = `${location.name}, ${location.country}`;
    if (!searchHistory.includes(location.name)) {
      searchHistory.unshift(location.name);
    }

    if (searchHistory.length > 5) {
      searchHistory.pop();
    }

    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));

    historyList.innerHTML = "";

    searchHistory.forEach(function (city) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = city;

      button.addEventListener("click", function () {
        cityInput.value = city;
        searchForm.requestSubmit();
      });

      item.appendChild(button);
      historyList.appendChild(item);
    });
    localTime.textContent = `Local time: ${new Date().toLocaleTimeString(
      "en-US",
      {
        timeZone: weather.timezone,
        hour: "numeric",
        minute: "2-digit",
      },
    )}`;
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

    weatherAdvice.textContent = getWeatherAdvice(weather.weather_code);

    windSpeed.textContent = `Wind: ${weather.wind_speed_10m} km/h`;
    lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString(
      "en-US",
      {
        hour: "numeric",
        minute: "2-digit",
      },
    )}`;
    humidity.textContent = `Humidity: ${weather.relative_humidity_2m}%`;

    weatherResult.hidden = false;
    forecastList.innerHTML = "";

    weather.daily.time.forEach(function (date, index) {
      const day = document.createElement("div");
      day.className = "forecast-day";
      const icon = document.createElement("div");
      icon.className = "forecast-icon";
      icon.innerHTML = getWeatherIcon(weather.daily.weather_code[index]);

      const dayName = document.createElement("p");
      dayName.textContent =
        index === 0
          ? "Today"
          : new Date(date + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            });

      const description = document.createElement("p");
      description.textContent = getWeatherDescription(
        weather.daily.weather_code[index],
      );

      const temperatures = document.createElement("p");
      const high = weather.daily.temperature_2m_max[index];
      const low = weather.daily.temperature_2m_min[index];

      const convertTemperature = function (value) {
        return temperatureUnit === "celsius" ? value : (value * 9) / 5 + 32;
      };

      temperatures.textContent = `${Math.round(convertTemperature(high))}° / ${Math.round(convertTemperature(low))}°${temperatureUnit === "celsius" ? "C" : "F"}`;

      day.append(dayName, icon, description, temperatures);
      forecastList.appendChild(day);
    });
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

refreshButton.addEventListener("click", function () {
  if (lastSearchedCity) {
    cityInput.value = lastSearchedCity;
    searchForm.requestSubmit();
  }
});

clearHistoryButton.addEventListener("click", function () {
  searchHistory.length = 0;
  localStorage.removeItem("weatherSearchHistory");
  historyList.innerHTML = "";
});

locationButton.addEventListener("click", function () {
  if (!navigator.geolocation) {
    message.classList.add("error");
    message.textContent = "Geolocation is not supported by your browser.";
    return;
  }

  message.classList.remove("error");
  message.textContent = "Getting your location...";

  navigator.geolocation.getCurrentPosition(
    async function (position) {
      const { latitude, longitude } = position.coords;

      try {
        const weather = await getCurrentWeather(latitude, longitude);
        weatherIcon.innerHTML = getWeatherIcon(weather.weather_code);
        cityName.textContent = "Your Current Location";

        document.body.dataset.weather = getWeatherCategory(
          weather.weather_code,
        );

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

        localTime.textContent = `Local time: ${new Date().toLocaleTimeString(
          "en-US",
          {
            timeZone: weather.timezone,
            hour: "numeric",
            minute: "2-digit",
          },
        )}`;

        lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString(
          "en-US",
          {
            hour: "numeric",
            minute: "2-digit",
          },
        )}`;

        weatherResult.hidden = false;
        message.textContent = "";
        message.textContent =
          "Weather loaded for your current coordinates. Search a city to see its name.";
      } catch (error) {
        message.classList.add("error");
        message.textContent = error.message;
      }
    },
    function () {
      message.classList.add("error");
      message.textContent =
        "Unable to access location. Check your browser permission settings.";
    },
  );
});
