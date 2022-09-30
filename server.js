'use strict';

// Set Up:
// ----------

//Imports require 
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { response } = require('express');

//Adding relative paths for modules

const getMovies = require('./modules/getMovies.js');

const getWeather = require('./modules/getWeather.js');

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

//catch all
app.get('*', (req, res) => {
	res.status(404).send('Page Not Found');
});

