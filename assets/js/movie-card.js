'use strict';

// Importing the baseURL from the api module
import { baseURL } from "./api.js";

// Movie card creation function
export function createMovieCard(movie) {
    // Destructuring movie details
    const {
        Poster,
        Title,
        imdbRating,
        Year,
        imdbID
    } = movie;

    // Create a card element
    const card = document.createElement("div");
    card.classList.add("movie-card");

    // Populate the card with movie details
    card.innerHTML = `
        <figure class="poster-box card-banner">
            <img src="${Poster}" class="img-cover" alt="${Title}" loading="lazy">
        </figure>

        <div class="card-movie-detail">
            <h4 class="title">${Title}</h4>
            
            <!-- Adding a heart icon for favoriting with data attribute for movie ID -->
            <i class="fa-regular fa-heart fav-icon" data-movie-id="${imdbID}"></i>
        </div>

        <div class="meta-list">
            <!-- Adding star icon for IMDb rating -->
            <div class="meta-item">
                <img width="24" height="20" src="https://img.icons8.com/3d-fluency/94/star.png" loading="lazy" alt="rating"/>
                <span class="span">${imdbRating}</span>
            </div>
            
            <!-- Displaying the year as a badge -->
            <div class="card-badge">${Year}</div>
        </div>

        <!-- Adding a button for navigating to the movie detail page -->
        <a href="./detail.html" class="card-btn" title="${Title}" onclick="localStorage.setItem('movieId', '${imdbID}')"></a>
    `;

    return card;
}
