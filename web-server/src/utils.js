const fetch = require("node-fetch");

const urlLocation = function (locationStr) {
  return `https://api.opencagedata.com/geocode/v1/json?q=${locationStr}&key=2be955029ea84d5f9f725d3797af01c1`;
};

const urlWeather = function (lat, lng) {
  return `http://api.weatherstack.com/forecast?access_key=6d6f1f48b88898de58cb5145afbbc10f&query=${lat},${lng}`;
};

const locate = async function (locationStr) {
  try {
    const response = await fetch(urlLocation(locationStr));
    const data = await response.json();
    if (!data?.results.length) throw new Error("Invalid location!");
    return data.results[0].geometry;
  } catch (err) {
    throw new Error(err.message);
  }
};

const fetchWeather = async function ({ lat, lng }) {
  try {
    const response = await fetch(urlWeather(lat, lng));
    if (!response.ok) throw new Error(response.statusText);
    const data = await response.json();
    return {
      temperature: data.current.temperature,
      precip: data.current.precip,
      isDay: data.is_day,
      description: data.current.weather_descriptions[0],
      country: data.location.country,
      city: data.location.region,
      accurateLocation: data.location.name,
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const logWeather = function ({
  temperature,
  precip,
  isDay,
  description,
  country,
  city,
  accurateLocation,
}) {
  return `It is currently ${temperature} Celsius degrees out. There is a ${precip}% chance of rain. It is ${description.toLowerCase()} ${
    isDay !== "no" ? "throughout the day" : "overnight"
  }.`;
};

module.exports = {
  geocode: locate,
  forecast: fetchWeather,
  forecastToString: logWeather,
};
