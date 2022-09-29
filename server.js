'use strict';

// Set Up:
// ----------

//Imports require 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { response } = require('express');

// Express opens a port for the server
const app = express();
const PORT = process.env.PORT || 3002;
app.use(cors());
app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));

// Endpoints: 
// -------------------

// Testing for life
app.get('/', (req, res) => {
	res.send('Hello from the home route!');
});

// Defines route handler to perform getWeather
app.get('/weather', getWeather);

app.get('/movies', getMovies);

// Accesses the Weather API to brin
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

async function getMovies (req, res){
	const searchQuery = req.query.searchQuery;
	const url = `https://api.themoviedb.org/3/movie/76341?api_key=${MOVIE_API_KEY}`;
	try{
		const movieResponse = await axios.get(url);
		res.status(200).send(movieResponse);
	}
	catch(error){
		console.log('error message is: ' + error);
		response.status(500).send(`server error ${error}`);
	}
}

//catch all
app.get('*', (req, res) => {
	res.status(404).send('Page Not Found');
});

