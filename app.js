const HISTORY_KEY = "weatherSearchHistory";
const UNIT_KEY = "weatherUnit";
const HISTORY_LIMIT = 5;

const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-button");
const searchLabel = document.querySelector("#search-label");
const locationButtons = document.querySelectorAll("[data-action='locate']");
const celsiusButton = document.querySelector("#celsius-button");
const fahrenheitButton = document.querySelector("#fahrenheit-button");
const message = document.querySelector("#message");
const historySection = document.querySelector("#search-history");
const historyList = document.querySelector("#history-list");
const clearHistoryButton = document.querySelector("#clear-history-button");
const emptyState = document.querySelector("#empty-state");
const weatherResult = document.querySelector("#weather-result");
const refreshButton = document.querySelector("#refresh-button");

const cityName = document.querySelector("#city-name");
const localTime = document.querySelector("#local-time");
const temperature = document.querySelector("#temperature");
const weatherIcon = document.querySelector("#weather-icon");
const weatherDescription = document.querySelector("#weather-description");
const sunPill = document.querySelector("#sun-pill");
const sunrise = document.querySelector("#sunrise");
const sunset = document.querySelector("#sunset");
const daylight = document.querySelector("#daylight");
const rainPill = document.querySelector("#rain-pill");
const rainIcon = document.querySelector("#rain-icon");
const rainText = document.querySelector("#rain-text");
const highTemp = document.querySelector("#high");
const lowTemp = document.querySelector("#low");
const uvIndex = document.querySelector("#uv-index");
const visibility = document.querySelector("#visibility");
const weatherAdvice = document.querySelector("#weather-advice");
const feelsLike = document.querySelector("#feels-like");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const lastUpdated = document.querySelector("#last-updated");
const forecastList = document.querySelector("#forecast-list");

const ICONS = {
  sun: `<circle cx="12" cy="12" r="4"></circle>
    <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path>`,
  moon: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`,
  cloud: `<path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>`,
  "partly-day": `<circle cx="7" cy="7" r="2.75"></circle>
    <path d="M7 1.5v1M2.1 3.6l.7.7M1.5 8h1M11.9 3.6l-.7.7"></path>
    <g transform="translate(5 7) scale(.75)"><path stroke-width="2" d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></g>`,
  "partly-night": `<g transform="scale(.5)"><path stroke-width="3" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></g>
    <g transform="translate(5 7) scale(.75)"><path stroke-width="2" d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></g>`,
  fog: `<path d="M4 8h16M7 12h13M4 16h11M9 20h9"></path>`,
  rain: `<path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
    <path d="M8 13v8M12 15v8M16 13v8"></path>`,
  "heavy-rain": `<path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path>
    <path d="M6 14v7M10 16v7M14 14v7M18 16v6"></path>`,
  snow: `<path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"></path>
    <path stroke-width="2.4" d="M8 16h.01M8 20h.01M12 18h.01M12 22h.01M16 16h.01M16 20h.01"></path>`,
  storm: `<path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path>
    <path d="m13 11-4 6h6l-4 6"></path>`,
};

const ICON_CATEGORY = {
  sun: "clear",
  moon: "clear",
  "partly-day": "cloudy",
  "partly-night": "cloudy",
  cloud: "cloudy",
  fog: "fog",
  rain: "rain",
  "heavy-rain": "rain",
  snow: "snow",
  storm: "storm",
};

const WEATHER_DESCRIPTIONS = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with heavy hail",
};

const HEAVY_RAIN_CODES = [65, 67, 82];
const SNOW_CODES = [71, 73, 75, 77, 85, 86];

function readStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}

function clearStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    return;
  }
}

const savedHistory = readStorage(HISTORY_KEY, []);
const savedUnit = readStorage(UNIT_KEY, "celsius");

const state = {
  unit: savedUnit === "fahrenheit" ? "fahrenheit" : "celsius",
  history: Array.isArray(savedHistory)
    ? savedHistory
        .filter((city) => typeof city === "string")
        .slice(0, HISTORY_LIMIT)
    : [],
  place: null,
  weather: null,
  busy: false,
};

async function fetchJson(url, failureMessage) {
  let response;

  try {
    response = await fetch(url);
  } catch {
    throw new Error("Network error. Check your internet connection.");
  }

  if (!response.ok) {
    throw new Error(failureMessage);
  }

  return response.json();
}

async function getCityCoordinates(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const data = await fetchJson(url, "Unable to find city.");

  if (!data.results || data.results.length === 0) {
    throw new Error("City not found. Try another name.");
  }

  return data.results[0];
}

async function getWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&hourly=visibility,uv_index&timezone=auto&forecast_days=7`;
  const data = await fetchJson(url, "Unable to fetch weather data.");

  return {
    ...data.current,
    timezone: data.timezone,
    daily: data.daily,
    hourly: data.hourly,
  };
}

function getIconKey(code, isDay = 1) {
  if (code === 0 || code === 1) return isDay ? "sun" : "moon";
  if (code === 2) return isDay ? "partly-day" : "partly-night";
  if (code === 3) return "cloud";
  if (code === 45 || code === 48) return "fog";
  if (HEAVY_RAIN_CODES.includes(code)) return "heavy-rain";
  if ((code >= 51 && code <= 66) || code === 80 || code === 81) return "rain";
  if (SNOW_CODES.includes(code)) return "snow";
  if (code >= 95) return "storm";
  return "cloud";
}

function renderIcon(code, isDay = 1) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[getIconKey(code, isDay)]}</svg>`;
}

function getWeatherCategory(code) {
  return ICON_CATEGORY[getIconKey(code, 1)] || "default";
}

function getWeatherDescription(code) {
  return WEATHER_DESCRIPTIONS[code] || "Unknown weather";
}

function getWeatherAdvice(code) {
  if (code >= 95) return "Thunderstorms expected. Stay indoors if possible.";
  if (HEAVY_RAIN_CODES.includes(code)) {
    return "Heavy rain expected. Avoid flooded areas.";
  }
  if ((code >= 51 && code <= 66) || code === 80 || code === 81) {
    return "Rain expected. Bring an umbrella.";
  }
  if (SNOW_CODES.includes(code)) {
    return "Snow or snow showers expected. Dress warmly.";
  }
  if (code === 45 || code === 48) {
    return "Visibility may be reduced. Travel carefully.";
  }
  if (code === 0 || code === 1) return "Clear conditions. Enjoy your day.";
  if (code === 2 || code === 3) {
    return "Cloudy skies. Check conditions before heading out.";
  }
  return "Check weather conditions before heading out.";
}

function toUnit(celsius) {
  return state.unit === "celsius" ? celsius : (celsius * 9) / 5 + 32;
}

function formatTemp(celsius) {
  return `${Math.round(toUnit(celsius))}°`;
}

function createElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function showMessage(text, isError = false) {
  message.classList.toggle("error", isError);
  message.textContent = text;
}

function setBusy(busy) {
  state.busy = busy;
  document.body.classList.toggle("is-loading", busy);
  weatherResult.setAttribute("aria-busy", String(busy));
  searchButton.disabled = busy;
  refreshButton.disabled = busy;
  locationButtons.forEach((button) => {
    button.disabled = busy;
  });
  searchLabel.textContent = busy ? "Searching" : "Search";
}

async function run(task) {
  if (state.busy) return;
  setBusy(true);

  try {
    await task();
  } catch (error) {
    showMessage(error.message, true);
  } finally {
    setBusy(false);
  }
}

function renderHistory() {
  historyList.replaceChildren(
    ...state.history.map((city) => {
      const item = document.createElement("li");
      const button = createElement("button", "chip", city);
      button.type = "button";
      button.dataset.city = city;
      item.appendChild(button);
      return item;
    }),
  );
  historySection.hidden = state.history.length === 0;
}

function remember(city) {
  state.history = [
    city,
    ...state.history.filter(
      (name) => name.toLowerCase() !== city.toLowerCase(),
    ),
  ].slice(0, HISTORY_LIMIT);
  writeStorage(HISTORY_KEY, state.history);
  renderHistory();
}

function getHourlyValue(weather, key) {
  const { hourly, time } = weather;
  if (!hourly || !hourly[key] || !time) return null;

  const hour = time.slice(0, 13);
  const index = hourly.time.findIndex((entry) => entry.startsWith(hour));
  const value = index === -1 ? null : hourly[key][index];

  return typeof value === "number" ? value : null;
}

function minutesOfDay(iso) {
  const [hours, minutes] = iso.slice(11, 16).split(":").map(Number);
  return hours * 60 + minutes;
}

function formatClock(iso) {
  const [hours, minutes] = iso.slice(11, 16).split(":").map(Number);
  const suffix = hours >= 12 ? "pm" : "am";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function renderSun(daily) {
  const rise = daily.sunrise && daily.sunrise[0];
  const set = daily.sunset && daily.sunset[0];
  const length = rise && set ? minutesOfDay(set) - minutesOfDay(rise) : 0;

  if (!rise || !set || length <= 0) {
    sunPill.hidden = true;
    return;
  }

  sunrise.textContent = formatClock(rise);
  sunset.textContent = formatClock(set);
  daylight.textContent = `${Math.floor(length / 60)}h ${length % 60}m`;
  sunPill.hidden = false;
}

function renderRain(daily, category) {
  const chance = daily.precipitation_probability_max
    ? daily.precipitation_probability_max[0]
    : null;

  if (typeof chance !== "number") {
    rainPill.hidden = true;
    return;
  }

  const isSnow = category === "snow";
  rainIcon.innerHTML = renderIcon(isSnow ? 71 : 61, 1);
  rainText.textContent = `${isSnow ? "Snow" : "Rain"} ${Math.round(chance)}%`;
  rainPill.hidden = false;
}

function getUvLabel(uv) {
  return `${Math.round(uv)} UV`;
}

function formatVisibility(meters) {
  const km = meters / 1000;
  return `${km >= 10 ? Math.round(km) : km.toFixed(1)} km`;
}

function renderForecast(daily) {
  forecastList.replaceChildren(
    ...daily.time.map((date, index) => {
      const code = daily.weather_code[index];
      const item = createElement("li", "forecast-day");

      if (index === 0) {
        item.classList.add("today");
        item.setAttribute("aria-current", "date");
      }

      const name = createElement(
        "span",
        "forecast-name",
        new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
          weekday: "short",
        }),
      );
      if (index === 0)
        name.append(createElement("span", "sr-only", " (today)"));

      const icon = createElement("span", "forecast-icon");
      icon.innerHTML = renderIcon(code, 1);

      const high = createElement("span", "forecast-high");
      high.append(
        createElement(
          "span",
          "sr-only",
          `${getWeatherDescription(code)}, high `,
        ),
        document.createTextNode(formatTemp(daily.temperature_2m_max[index])),
      );

      const low = createElement("span", "forecast-low");
      low.append(
        createElement("span", "sr-only", "low "),
        document.createTextNode(formatTemp(daily.temperature_2m_min[index])),
      );

      item.append(name, icon, high, low);
      return item;
    }),
  );
}

function render() {
  const { place, weather } = state;
  const code = weather.weather_code;
  const now = new Date();
  const timeZone = weather.timezone;
  const category = getWeatherCategory(code);

  document.body.dataset.weather = category;

  cityName.textContent = place.label;

  const weekday = now.toLocaleDateString("en-US", {
    timeZone,
    weekday: "long",
  });
  const clock = now.toLocaleTimeString("en-US", {
    timeZone,
    hour: "numeric",
    minute: "2-digit",
  });
  localTime.textContent = `${weekday}, ${clock}`;

  const unitLetter = state.unit === "celsius" ? "C" : "F";
  const unitName = state.unit === "celsius" ? "Celsius" : "Fahrenheit";
  temperature.textContent = `${Math.round(toUnit(weather.temperature_2m))}°${unitLetter}`;
  temperature.setAttribute(
    "aria-label",
    `${Math.round(toUnit(weather.temperature_2m))} degrees ${unitName}`,
  );

  weatherIcon.innerHTML = renderIcon(code, weather.is_day);
  weatherDescription.textContent = getWeatherDescription(code);
  weatherAdvice.textContent = getWeatherAdvice(code);

  renderSun(weather.daily);
  renderRain(weather.daily, category);

  feelsLike.textContent = formatTemp(weather.apparent_temperature);
  highTemp.textContent = formatTemp(weather.daily.temperature_2m_max[0]);
  lowTemp.textContent = formatTemp(weather.daily.temperature_2m_min[0]);

  windSpeed.textContent = `${Math.round(weather.wind_speed_10m)} km/h`;
  humidity.textContent = `${weather.relative_humidity_2m}%`;

  const uv = getHourlyValue(weather, "uv_index");
  uvIndex.textContent = uv === null ? "—" : getUvLabel(uv);

  const sight = getHourlyValue(weather, "visibility");
  visibility.textContent = sight === null ? "—" : formatVisibility(sight);

  lastUpdated.textContent = `Updated ${now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })}`;

  renderForecast(weather.daily);

  emptyState.hidden = true;
  weatherResult.hidden = false;
}

async function loadPlace(place) {
  const weather = await getWeather(place.latitude, place.longitude);
  state.place = place;
  state.weather = weather;
  render();
  showMessage("");
}

function searchCity(city) {
  cityInput.value = city;

  return run(async () => {
    showMessage("Looking up weather…");
    const found = await getCityCoordinates(city);
    await loadPlace({
      latitude: found.latitude,
      longitude: found.longitude,
      label: [found.name, found.country].filter(Boolean).join(", "),
    });
    remember(found.name);
  });
}

function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 10000,
    });
  });
}

function useMyLocation() {
  if (!navigator.geolocation) {
    showMessage("Geolocation isn't supported by this browser.", true);
    return;
  }

  run(async () => {
    showMessage("Getting your location…");

    let position;
    try {
      position = await getPosition();
    } catch {
      throw new Error(
        "Couldn't access your location. Check your browser's permission settings.",
      );
    }

    await loadPlace({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      label: "Current location",
    });
  });
}

function setUnit(unit) {
  state.unit = unit;
  writeStorage(UNIT_KEY, unit);
  celsiusButton.setAttribute("aria-pressed", String(unit === "celsius"));
  fahrenheitButton.setAttribute("aria-pressed", String(unit === "fahrenheit"));

  if (state.weather) render();
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    showMessage("Enter a city name to search.", true);
    cityInput.focus();
    return;
  }

  searchCity(city);
});

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-city]");
  if (target) searchCity(target.dataset.city);
});

locationButtons.forEach((button) => {
  button.addEventListener("click", useMyLocation);
});

refreshButton.addEventListener("click", () => {
  if (!state.place) return;

  run(async () => {
    showMessage("Refreshing…");
    await loadPlace(state.place);
  });
});

celsiusButton.addEventListener("click", () => setUnit("celsius"));
fahrenheitButton.addEventListener("click", () => setUnit("fahrenheit"));

clearHistoryButton.addEventListener("click", () => {
  state.history = [];
  clearStorage(HISTORY_KEY);
  renderHistory();
});

setUnit(state.unit);
renderHistory();
