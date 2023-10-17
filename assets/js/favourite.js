'use strict';

import { sidebar } from "./sidebar.js";
import { apikey, baseURL, getMovieData } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";
import { initializeFavourites, updateUI } from "./favourite-list.js";

// Initialize sidebar
sidebar();

// Select the content area on the page
const pageContent = document.querySelector("[data-page-content]");

// Retrieve favorites from local storage or initialize an empty array
const favourites = localStorage.getItem("favourites");
const favouritesList = favourites ? JSON.parse(favourites) : [];

// Create a section element for displaying favorite movies
const movieListElem = document.createElement("section");
movieListElem.classList.add("movie-list", "genre-list");

// Set up the HTML structure for the favorites section
movieListElem.innerHTML = `
    <div class="title-wrapper">
        <h1 class="heading">Favourites</h1>
    </div>

    <div class="grid-list"></div>
`;

// Fetch data for each favorite movie and create a movie card for display
for (const movieId of favouritesList) {
    getMovieData(`${baseURL}&apikey=${apikey}&i=${movieId}`, function (movie) {
        const movieCard = createMovieCard(movie);

        // Append the movie card to the grid list
        movieListElem.querySelector(".grid-list").appendChild(movieCard);
    });
}

// Append the favorites section to the page content
pageContent.appendChild(movieListElem);

updateUI();

// Initialize search functionality, update UI, and handle favorites
search();
updateUI();
initializeFavourites();
