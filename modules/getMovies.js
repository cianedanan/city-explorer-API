'use strict';

const axios = require('axios');

const cache = require('./cache.js');

async function getMovies(req, res) {
  try {
    const key = `${req.query.searchQuery}movies`;
    //If key exists in cache and is valid, send that data from cache
    if (cache[key] && (Date.now() - cache[key].timeStamp < 2628000000)) {
      console.log('Cache hit, movies present');
      res.status(200).send(cache[key].data);
    } else {
      const movieResponse = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${req.query.searchQuery}`
      );
      const movieData = movieResponse.data.results.map(
        (objects) => new Movies(objects)
      );
      //Save to cache
      cache[key] = {
        timeStamp: Date.now(),
        data: movieData,
      }
      // console.log('Cache is:', cache[key].data);
      res.status(200).send(movieData);
    }
  } catch (error) {
    console.log('error message is: ' + error);
    res.status(500).send(`server error ${error}`);
  }
}

//Creates instances of movies and details
class Movies {
  constructor(objects) {
    this.title = objects.original_title;
    this.overview = objects.overview;
    this.avg_votes = objects.vote_average;
    this.total_votes = objects.vote_count;
    this.image_url = `https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${objects.poster_path}`;
    this.popularity = objects.popularity;
    this.released_on = objects.release_date;
  }
}

module.exports = getMovies;
