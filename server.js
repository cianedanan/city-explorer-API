'use strict';

// Set Up:
// ----------

// Require
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const axios = require('axios');
const { response } = require('express');

// Express
const app = express();
const PORT = process.env.PORT || 3002;
app.use(cors());
app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));

// Endpoints: 
// -------------------

app.get('/', (req, res) => {
	res.send('Hello from the home route!');
});

// app.get('/weather', (req, res) => {
// 	const query = req.query.searchQuery;
// 	const weather = data.find( city => city.city_name.toLowerCase() == query.toLowerCase());
// 	const weatherData = weather.data.map(details => new Forecast(details.low_temp, details.high_temp, details.weather.description, details.datetime));
// 	res.send(weatherData);
// });

app.get('/weather', getWeather);

async function getWeather (req, res){
	const lat = req.query.lat;
	const lon = req.query.lon;
	const url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${lat}&lon=${lon}&days=7`;
	try{
		const weatherResponse = await axios.get(url);
		console.log(url);
	  const weatherData = weatherResponse.data.data.map(details => new Forecast(details.low_temp, details.high_temp, details.weather.description, details.datetime));
		res.status(200).send(weatherData);
	}
	catch(error){
		console.log('error message is: ' + error);
		response.status(500).send(`server error ${error}`);
	}
}

class Forecast{
	constructor(low, high, description, date){
		this.date = date;
		this.description = `Low of ${low}, high of ${high} with ${description.toLowerCase()}.`;
	}
}

//catch all
app.get('*', (req, res) => {
	res.status(404).send('Page Not Found');
});

