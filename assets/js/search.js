'use strict';

// Importing necessary modules and functions
import { apikey, getMovieData, baseURL } from "./api.js";
import { createMovieCard } from "./movie-card.js";

// Function to handle search functionality
export function search() {

    // Selecting search-related elements from the DOM
    const searchWrapper = document.querySelector("[data-search-wrapper]");
    const searchField = document.querySelector("[data-search-field]");
    const searchResultModal = document.createElement("div");

    // Adding classes and attribute to the search result modal
    searchResultModal.classList.add("search-modal", "data-search-list");
    searchResultModal.setAttribute("data-search-button", "");
    document.querySelector("main").appendChild(searchResultModal);

    // Timeout variable for delaying search requests
    let searchTimeout;

    // Function to fetch detailed movie data from OMDB API
    const movieData = function (movieId) {
        return new Promise((resolve) => {
            getMovieData(`${baseURL}&apikey=${apikey}&i=${movieId}`, function (data) {
                resolve({ data, error: !data ? `No data found for movie with ID ${movieId}` : null });
            });
        });
    };

    // Event listener for input changes in the search field
    searchField.addEventListener("input", function () {
        // If the search field is empty, hide the search result modal and clear the timeout
        if (!searchField.value.trim()) {
            searchResultModal.classList.remove("active");
            searchWrapper.classList.remove("searching");
            clearTimeout(searchTimeout);
            return;
        }

        // Add a class to indicate that a search is in progress
        searchWrapper.classList.add("searching");
        clearTimeout(searchTimeout);

        // Set a timeout to delay the search request
        searchTimeout = setTimeout(function () {

            // Fetch data from the OMDB API based on the search query
            getMovieData(`${baseURL}&apikey=${apikey}&s=${searchField.value}`, async function (data) {
                const movieList = data.Search;

                // Fetch detailed movie data for each movie in the search result
                const completeMovieDataList = (await Promise.all(movieList.map(async mov =>
                    (await movieData(mov.imdbID)).data)));

                // Sort movies by IMDb rating
                completeMovieDataList.sort((a, b) =>
                    (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0));

                // Remove the "searching" class and show the search result modal
                searchWrapper.classList.remove("searching");
                searchResultModal.classList.add("active");
                searchResultModal.innerHTML = "";   // Remove old results

                // Update the search result modal with the new results
                searchResultModal.innerHTML = `
                    <p class="label">Results for</p>
                    <h1 class="heading">${searchField.value}</h1>
                    <div class="movie-list">
                        <div class="grid-list"></div>
                    </div>
                `;

                // Create movie cards for each movie in the search result
                for (const movie of completeMovieDataList) {
                    const movieCard = createMovieCard(movie);
                    searchResultModal.querySelector(".grid-list").appendChild(movieCard);
                }

            });

        }, 400);
    });

    // Event listener for the search button to close the search result modal
    const searchButton = document.querySelector("[data-search-toggler]");
    const searchModal = document.querySelector(".search-modal");
    const searchInput = document.querySelector("[data-search-field]");

    searchButton.addEventListener("click", function () {
        // Remove the "active" class from the search result modal and clear the search field
        searchModal.classList.remove("active");
        searchInput.value = "";
    });
}
