'use strict';

import { sidebar } from "./sidebar.js";
import { apikey,baseURL, getMovieData } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";
import { initializeFavourites, updateUI} from "./favourite-list.js";

sidebar();

const pageContent = document.querySelector("[data-page-content]")
const favourites = localStorage.getItem("favourites");
const favouritesList = favourites ? JSON.parse(favourites) : [];

const movieListElem = document.createElement("section");
movieListElem.classList.add("movie-list", "genre-list");

movieListElem.innerHTML = `
    <div class="title-wrapper">
        <h1 class="heading">Favourites</h1>
    </div>

    <div class="grid-list">

    </div>
`;

for( const movieId of favouritesList){
    getMovieData(`${baseURL}&apikey=${apikey}&i=${movieId}`,  function(movie){
        const movieCard =  createMovieCard(movie);

        movieListElem.querySelector(".grid-list").appendChild(movieCard);
    });
}

pageContent.appendChild(movieListElem);

search();
updateUI();
initializeFavourites();