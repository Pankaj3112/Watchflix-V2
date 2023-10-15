'use strict';

// API Key for OMDB API
const apikey = '53fb11ff';

// Base URL for fetching movie data by ID
const baseURL = "https://www.omdbapi.com/?r=json";

// Base URL for fetching movie images
const imageBaseURL = 'https://img.omdbapi.com/?';

// Fetch movie data from the server and pass the result in JSON format
const getMovieData = async function (url, callback, opt) {
    const res = await fetch(url);
    const json = await res.json();
    callback(json, opt);
    return json;

    // fetch(url)
    //     .then(res => res.json())
    //     .then(data => callback(data, opt));
}

// Export essential variables and function
export { imageBaseURL, apikey, baseURL, getMovieData };
