const { getStore } = require("@netlify/blobs");

const weatherAPIUrl = "https://api.openweathermap.org/data/2.5/weather?q={city}&appid={YOUR_API_KEY}";

async function getCachedWeather(city) {
  const blobStore = getStore("weather-cache");
  const cacheKey = `${city}-${Date.now()}`;

  const cachedData = await blobStore.get(cacheKey);
  if (cachedData) {
    console.log("Using cached weather data");
    return JSON.parse(cachedData);
  }

  return null;
}

async function getFreshWeather(city) {
  console.log("Fetching fresh weather data");
  const response = await fetch(weatherAPIUrl.replace("{city}", city));
  const weatherData = await response.json();

  // Store data in cache with expiry window (adjust as needed)
  await blobStore.put(cacheKey, JSON.stringify(weatherData), { expiry: 60 * 60 }); // Cache for 1 hour

  return weatherData;
}

exports.handler = async (event, context) => {
  const city = event.queryStringParameters.city;

  const weatherData = await getCachedWeather(city) || await getFreshWeather(city);

  if (weatherData) {
    return {
      statusCode: 200,
      body: JSON.stringify(weatherData),
    };
  } else {
    return {
      statusCode: 404,
      body: "City not found",
    };
  }
};
