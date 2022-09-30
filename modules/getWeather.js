'use strict';

const axios = require('axios');

//Accesses the Weather API using parameters from the taken from the front end and sends back a city weather data json.
//The json data is mapped through and returns an array of instances of daily forecasts.
//If the request for the API fails an error message is returned.

async function getWeather(req, res) {
  try {
    const weatherResponse = await axios.get(
      `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${req.query.lat}&lon=${req.query.lon}&days=7`
    );
    const weatherData = weatherResponse.data.data.map(
      (details) =>
        new Forecast(
          details.low_temp,
          details.high_temp,
          details.weather.description,
          details.datetime
        )
    );
    res.status(200).send(weatherData);
  } catch (error) {
    console.log('error message is: ' + error);
    response.status(500).send(`server error ${error}`);
  }
}

//Creates instances of weather forecasts.
class Forecast {
  constructor(low, high, description, date) {
    this.date = date;
    this.description = `Low of ${low}, high of ${high} with ${description.toLowerCase()}.`;
  }
}

module.exports = getWeather;
