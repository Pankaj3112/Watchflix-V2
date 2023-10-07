'use strict';

const apikey = '53fb11ff';
const imageBaseURL = 'https://img.omdbapi.com/';
const baseURL = "http://www.omdbapi.com/?r=json"

// fetch data from server and pass the result in JSON format
const getMovieData = function (url, callback, opt){
    fetch(url)
        .then(res => res.json())
        .then(data => callback(data, opt));
}

export{ imageBaseURL, apikey, baseURL, getMovieData };
