'use strict';

// Set Up:
// ----------

require('dotenv').config();

const express = require('express');

const cors = require('cors');

const data = require('./data/weather.json');

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));

class Forecast{
	constructor(low, high, description, date){
		this.date = date;
		this.description = `Low of ${low}, high of ${high} with ${description.toLowerCase()},`;
	}
}

// Endpoints: 
// -------------------

app.get('/', (req, res) => {
	res.send('Hello from the home route!');
});

app.get('/weather', (req, res) => {
	const query = req.query.searchQuery;
	const weather = data.find( city => city.city_name.toLowerCase() === query.toLowerCase());
	const weatherData = weather.data.map(details => new Forecast(details.low_temp, details.high_temp, details.weather.description, details.date));
	res.send(weatherData);
});

//catch all
app.get('*', (req, res) => {
	res.status(404).send('Page Not Found');
});
