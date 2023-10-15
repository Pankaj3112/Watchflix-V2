'use strict';

import { baseURL } from "./api.js";

// movie card

export function createMovieCard(movie){
    const {
        Poster,
        Title,
        imdbRating,
        Year,                                               
        imdbID
    } = movie;

    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
        <figure class="poster-box card-banner">
            <img src="${Poster}" class="img-cover" alt="${Title}" loading="lazy">
        </figure>

        <div class="card-movie-detail">
            <h4 class="title">${Title}</h4>
            <i class="fa-regular fa-heart fav-icon" data-movie-id="${imdbID}"></i>
        </div>

        <div class="meta-list">

            <div class="meta-item">
                <img width="24" height="20" src="https://img.icons8.com/3d-fluency/94/star.png" loading="lazy" alt="rating"/>
                <span class="span">${imdbRating}</span>
            </div>

            <div class="card-badge">${Year}</div>
        </div>

        <a href="./detail.html" class="card-btn" title="${Title}" onclick="localStorage.setItem('movieId', '${imdbID}')"></a>
                    
    `;

    return card;
}