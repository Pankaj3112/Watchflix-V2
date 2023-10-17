'use strict';

// Importing required modules and functions
import { sidebar } from "./sidebar.js";
import { apikey, baseURL, getMovieData } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";
import { initializeFavourites, updateUI } from "./favourite-list.js";

// Collect type name & url param from local storage
const typeName = window.localStorage.getItem("typeName");
const urlParam = window.localStorage.getItem("urlParam");
const pageContent = document.querySelector("[data-page-content]");

// Initialize the sidebar
sidebar();

// Function to fetch detailed movie data from OMDB API
const movieData = function (movieId) {
    return new Promise((resolve) => {
        getMovieData(`${baseURL}&apikey=${apikey}&i=${movieId}`, function (data) {
            resolve({ data, error: !data ? `No data found for movie with ID ${movieId}` : null });
        });
    });
};

// Initialize variables for pagination
let currentPage = 1;
let totalPages = 0;

// Fetch movie data based on type and URL parameter
getMovieData(`${baseURL}&apikey=${apikey}&${urlParam}&page=${currentPage}`, async function (data) {

    const movieList = data.Search;
    totalPages = Math.ceil(data.totalResults / 10);

    document.title = `${typeName} - WatchFLix`;

    // Fetch detailed data for each movie in the list
    const completeMovieDataList = (await Promise.all(movieList.map(async mov =>
        (await movieData(mov.imdbID)).data)));

    // Sort movies by IMDb rating
    completeMovieDataList.sort((a, b) =>
        (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0));

    // Create a movie list section
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list", "genre-list");

    movieListElem.innerHTML = `
        <div class="title-wrapper">
            <h1 class="heading">All ${typeName} </h1>
        </div>

        <div class="grid-list">

        </div>

        <button class="btn load-more" data-load-more>Load More</button>
    `;

    // Add movie cards based on fetched items
    for (const movie of completeMovieDataList) {
        const movieCard = createMovieCard(movie);
        movieListElem.querySelector(".grid-list").appendChild(movieCard);
    }

    // Append the movie list to the page content
    pageContent.appendChild(movieListElem);

	updateUI();

    // Load more button functionality
    document.querySelector("[data-load-more]").addEventListener("click", function () {
        if (currentPage >= totalPages) {
            this.style.display = "none"; // Hide the button when all pages are loaded
            return;
        }
        currentPage++;
        this.classList.add("loading"); // Add loading state to the button

        // Fetch data for the next page
        getMovieData(`${baseURL}&apikey=${apikey}&${urlParam}&page=${currentPage}`, async (data) => {
            this.classList.remove("loading"); // Remove loading state from the button

            const movieList = data.Search;
            const completeMovieDataList = (await Promise.all(movieList.map(async mov =>
                (await movieData(mov.imdbID)).data)));

            // Sort movies by IMDb rating
            completeMovieDataList.sort((a, b) =>
                (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0));

            // Add movie cards for the new data
            for (const movie of completeMovieDataList) {
                const movieCard = createMovieCard(movie);
                movieListElem.querySelector(".grid-list").appendChild(movieCard);
            }
        });
    });

});

// Initialize search and favorites functionality
search();
initializeFavourites();