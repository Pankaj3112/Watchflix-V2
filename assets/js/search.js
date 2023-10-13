'use strict';

import { apikey, getMovieData, baseURL } from "./api.js";
import { createMovieCard } from "./movie-card.js";

export function search() {
    const searchWrapper = document.querySelector("[data-search-wrapper]");
    const searchField = document.querySelector("[data-search-field]");

    const searchResultModal = document.createElement("div");
    searchResultModal.classList.add("search-modal", "data-search-list");
    document.querySelector("main").appendChild(searchResultModal);

    let searchTimeout;

    const movieData = function (movieId) {
        return new Promise((resolve) => {
            getMovieData(`${baseURL}&apikey=${apikey}&i=${movieId}`, function (data) {
                resolve({ data, error: !data ? `No data found for movie with ID ${movieId}` : null });
            });
        });
    };

    searchField.addEventListener("input", function () {
        if (!searchField.value.trim()) {
            searchResultModal.classList.remove("active");
            searchWrapper.classList.remove("searching");
            clearTimeout(searchTimeout);
            return;
        }

        searchWrapper.classList.add("searching");
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(function () {

            getMovieData(`${baseURL}&apikey=${apikey}&s=${searchField.value}`, async function (data) {
                const movieList = data.Search;
                console.log(data.Search);

                searchWrapper.classList.remove("searching");
                searchResultModal.classList.add("active");
                searchResultModal.innerHTML = "";   // remove old results

                searchResultModal.innerHTML = `
                    <p class="label">Results for</p>
                    <h1 class="heading">${searchField.value}</h1>
                    <div class="movie-list">
                        <div class="grid-list"></div>
                    </div>
                `;

                for (const movie of movieList) {
                    const movieCard = createMovieCard(movie);

                    searchResultModal.querySelector(".grid-list").appendChild(movieCard);
                }

            });

        }, 300);
    });


    // remove search result when close button is clicked
    const searchButton = document.querySelector("[data-search-toggler]");
    const searchModal = document.querySelector(".search-modal");
    const searchInput = document.querySelector("[data-search-field]");

    searchButton.addEventListener("click", function () {
        searchModal.classList.remove("active");
        searchInput.value = ""
    });


}