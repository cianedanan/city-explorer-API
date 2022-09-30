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

//Accesses the Weather API using parameters from the taken from the front end and sends back a city weather data json.
//The json data is mapped through and returns an array of instances of daily forecasts.
//If the request for the API fails an error message is returned.
async function getWeather (req, res){
	try{
		const weatherResponse = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&lat=${req.query.lat}&lon=${req.query.lon}&days=7`);
	  const weatherData = weatherResponse.data.data.map(details => new Forecast(details.low_temp, details.high_temp, details.weather.description, details.datetime));
		res.status(200).send(weatherData);
	}
	catch(error){
		console.log('error message is: ' + error);
		response.status(500).send(`server error ${error}`);
	}
}

async function getMovies (req, res){
	try{
		const movieResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${req.query.searchQuery}`);
		const movieData = movieResponse.data.results.map(objects => new Movies(objects));
		res.status(200).send(movieData);
	}
	catch(error){
		console.log('error message is: ' + error);
		response.status(500).send(`server error ${error}`);
	}
}

//Creates instances of weather forecasts.
class Forecast{
	constructor(low, high, description, date){
		this.date = date;
		this.description = `Low of ${low}, high of ${high} with ${description.toLowerCase()}.`;
	}
}

//Creates instances of movies and details
class Movies{
	constructor(objects){
		this.title = objects.original_title;
		this.overview = objects.overview;
		this.avg_votes = objects.vote_average;
		this.total_votes = objects.vote_count;
		this.image_url = `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${objects.poster_path}`;
		this.popularity = objects.popularity;
		this.released_on = objects.release_date;
	}
}

//catch all
app.get('*', (req, res) => {
	res.status(404).send('Page Not Found');
});

