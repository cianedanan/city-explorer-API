'use strict';

const axios = require('axios');

async function getMovies(req, res) {
  try {
    const movieResponse = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${req.query.searchQuery}`
    );
    const movieData = movieResponse.data.results.map(
      (objects) => new Movies(objects)
    );
    res.status(200).send(movieData);
  } catch (error) {
    console.log('error message is: ' + error);
    response.status(500).send(`server error ${error}`);
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
