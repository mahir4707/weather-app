async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherCard = document.getElementById("weatherCard");

  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  try {
    // Step 1: Get latitude & longitude from city name
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert("City not found!");
      weatherCard.classList.add("hidden");
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Step 2: Get current weather from coordinates
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const current = weatherData.current_weather;

    // Fill card
    document.getElementById("cityName").innerText = `${name}, ${country}`;
    document.getElementById("temperature").innerText = `${current.temperature}°C`;
    document.getElementById("feelsLike").innerText = "-"; // Open-Meteo has no "feels like"
    document.getElementById("humidity").innerText = "-"; // No humidity in free API
    document.getElementById("wind").innerText = current.windspeed;
    document.getElementById("description").innerText = weatherCodeToText(current.weathercode);
    document.getElementById("weatherIcon").src = getWeatherIcon(current.weathercode);

    weatherCard.classList.remove("hidden");

  } catch (error) {
    alert("Error fetching weather data.");
    weatherCard.classList.add("hidden");
  }
}

// Convert weather codes into text
function weatherCodeToText(code) {
  const codes = {
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
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    95: "Thunderstorm"
  };
  return codes[code] || "Unknown";
}

// Simple icon chooser
function getWeatherIcon(code) {
  if (code === 0) return "https://cdn-icons-png.flaticon.com/512/869/869869.png"; // sun
  if ([1,2].includes(code)) return "https://cdn-icons-png.flaticon.com/512/1163/1163624.png"; // partly cloudy
  if (code === 3) return "https://cdn-icons-png.flaticon.com/512/414/414825.png"; // overcast
  if ([61,63,65].includes(code)) return "https://cdn-icons-png.flaticon.com/512/1163/1163657.png"; // rain
  if ([71,73,75].includes(code)) return "https://cdn-icons-png.flaticon.com/512/642/642102.png"; // snow
  if (code === 95) return "https://cdn-icons-png.flaticon.com/512/1146/1146869.png"; // thunderstorm
  return "https://cdn-icons-png.flaticon.com/512/1163/1163624.png"; // default
}
