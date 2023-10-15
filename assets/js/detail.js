'use strict';

// Importing required modules and functions
import { apikey, baseURL, getMovieData } from "./api.js";
import { youtubeUrl, fetchYoutubeVideos } from "./youtube-api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";
import { initializeFavourites, updateUI } from "./favourite-list.js";

// Getting movie ID from local storage
const movieId = window.localStorage.getItem("movieId");

// Selecting the main content area
const pageContent = document.querySelector("[data-page-content]");

// Initializing the sidebar
sidebar();

// Function to fetch detailed movie data from OMDB API
const movieData = function (movieId) {
    return new Promise((resolve) => {
        getMovieData(`${baseURL}&apikey=${apikey}&i=${movieId}`, function (data) {
            resolve({ data, error: !data ? `No data found for movie with ID ${movieId}` : null });
        });
    });
};

// Fetching detailed movie data and displaying it on the page
getMovieData(`${baseURL}&apikey=${apikey}&i=${movieId}`, function (movie) {
    console.log(movie);

    // Extracting relevant movie details
    const {
        imdbID,
        Poster,
        Title,
        Year,
        Released,
        Runtime,
        imdbRating,
        Genre,
        Plot,
        Actors,
        Director,
        Rated,
    } = movie;

    // Updating the document title
    document.title = `${Title} - WatchFlix`;

    // Creating and populating the movie detail section
    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");
    movieDetail.innerHTML = `
        <div class="backdrop-image" style="background-image: url('${Poster});">

        </div>

        <figure class="poster-box movie-poster">
            <img src="${Poster}" alt="${Title}" class="img-cover">
        </figure>

        <div class="detail-box">
            <div class="detail-content">
                <h1 class="heading">
                    ${Title}
                </h1>

                <div class="meta-list">
                    <img width="24" height="20" src="https://img.icons8.com/3d-fluency/94/star.png" loading="lazy" alt="rating"/>
                    <span class="span">${imdbRating}</span>
                    <div class="meta-item">${Runtime}</div>
                    <div class="meta-item">${Year}</div>
                    <div class="meta-item card-badge">${Rated}</div>
                    <i class="fa-regular fa-heart fav-icon" data-movie-id="${imdbID}"></i>

                </div>

                <p class="genre">
                    ${Genre}
                </p>

                <p class="overview">
                    ${Plot}
                </p>

                <ul class="detail-list">
                    <div class="list-item">
                        <p class="list-name">Starring</p>
                        <p>${Actors}</p>
                    </div>

                    <div class="list-item">
                        <p class="list-name">Directed By</p>
                        <p>${Director}</p>
                    </div>
                </ul>
            </div>

            <div class="title-wrapper">
                <h3 class="title-large">Trailers and Clips</h3>
            </div>

            <div class="slider-list">
                <div class="slider-inner">
                </div>
            </div>
        </div>
    `;

    // Searching for official trailers using the movie title
    const searchQuery = `${Title} official trailer|teaser`;
    
    // Fetching and adding suggested movie trailers to the page
    fetchYoutubeVideos(`${youtubeUrl}&q=${encodeURIComponent(searchQuery)}`, function (trailerList) {
        for (const trailer of trailerList) {
            const videoCard = document.createElement("div");
            videoCard.classList.add("video-card");
            videoCard.innerHTML = `
                <iframe width="500" height="294" src="https://www.youtube.com/embed/${trailer.id.videoId}" title="${Title}" frameborder="0"  allowfullscreen class="img-cover" loading="lazy"></iframe>
            `;
            movieDetail.querySelector(".slider-inner").appendChild(videoCard);
        }
    });

    // Appending the movie detail section to the main content area
    pageContent.appendChild(movieDetail);

    // Fetching a list of suggested movies and adding them to the page
    getMovieData(`${baseURL}&apikey=${apikey}&s=disney`, addSuggestedMovies);
});

// Function to add suggested movies to the page
const addSuggestedMovies = async function ({ Search: movieList }) {
    // Fetching complete movie data for suggested movies
    const completeMovieDataList = (await Promise.all(movieList.map(async mov => 
        (await movieData(mov.imdbID)).data)));

    // Sort movies by IMDb rating
    completeMovieDataList.sort((a, b) =>    
        (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0));

    // Creating and populating the suggested movie list section
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list");
    movieListElem.innerHTML = `
        <div class="title-wrapper">
            <h3 class="title-large">You May Also Like</h3>
        </div>
        
        <div class="slider-list">
            <div class="slider-inner"></div>
        </div>
    `;

    // Adding suggested movies to the list
    for (const movie of completeMovieDataList) {
        const movieCard = createMovieCard(movie);   // called from movie-card.js
        movieListElem.querySelector(".slider-inner").appendChild(movieCard);
    }

    // Appending the suggested movie list section to the main content area
    pageContent.appendChild(movieListElem);
}

// Initiating search functionality
search();

// Delayed update of UI to allow time for asynchronous operations
setTimeout(() => {
    updateUI();
}, 1500);

// Initializing the favourites list
initializeFavourites();
