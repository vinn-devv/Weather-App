# Weather App

A simple, responsive weather app built with vanilla JavaScript. Search for a city, check current conditions, and plan ahead with a five-day forecast.

<p align="center">
  <a href="https://vinn-devv.github.io/Weather-App/">
    <img src="https://img.shields.io/badge/Live%20Demo-Open%20App-2563EB?style=for-the-badge" alt="Open Live Demo">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/API-Open--Meteo-0F766E?style=flat-square" alt="Open-Meteo">
</p>

---

## Overview

Get the weather information you need in one place. The app uses the Open-Meteo API to retrieve weather data and presents it in a clean, easy-to-read interface.

## Features

| Feature           | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| City Search       | Find weather conditions by city name                               |
| Current Weather   | View temperature, feels-like temperature, humidity, and wind speed |
| Temperature Units | Switch between Celsius and Fahrenheit                              |
| Five-Day Forecast | Check upcoming daily conditions and temperatures                   |
| Weather Advice    | Get simple suggestions based on weather conditions                 |
| Current Location  | Retrieve local weather using browser geolocation                   |
| Recent Searches   | Revisit previous cities or clear your search history               |
| Local Time        | View the local time of a searched city                             |
| Refresh           | Fetch the latest available weather data                            |
| Responsive Design | Use the app across different screen sizes                          |

## Preview

Open the live app to explore the interface and its features.

**[Launch Weather App →](https://vinn-devv.github.io/Weather-App/)**

> Want to show a screenshot here? Add an image to your repository, for example `screenshots/weather-app.png`, then uncomment and update this line:
>
> `<!-- ![Weather App Preview](screenshots/weather-app.png) -->`

## Built With

- **HTML5** — application structure
- **CSS3** — layout, styling, and responsive design
- **JavaScript** — application logic and DOM updates
- **Open-Meteo** — geocoding and weather forecast data
- **Geolocation API** — current-location weather
- **Local Storage** — recent search history
- **SVG** — weather icons

## Run Locally

```bash
git clone https://github.com/vinn-devv/Weather-App.git
cd Weather-App
```

Open `index.html` in your browser, or use the Live Server extension in VS Code.

No API key is required for the Open-Meteo endpoints used by this project.

## Project Structure

```text
Weather-App/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## What I Learned

- Fetching and handling API responses
- Using `async`/`await` and `try`/`catch`
- Updating the DOM based on API data
- Working with geolocation
- Persisting data with Local Storage
- Building responsive layouts with CSS

## Author

**Renzo Cabaya**

[GitHub Profile](https://github.com/vinn-devv)

---

<p align="center">
  Built with HTML, CSS, and JavaScript.
</p>
