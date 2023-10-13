'use strict';

import { sidebar } from "./sidebar.js";
import { apikey,baseURL, getMovieData } from "./api.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";

//  collect type name & url param from local storage
const typeName = window.localStorage.getItem("typeName");
const urlParam = window.localStorage.getItem("urlParam");
const pageContent = document.querySelector("[data-page-content]")

sidebar();

// fetch movie's data using movieId || populate movie data
const movieData = function(movieId) {
    return new Promise((resolve) => {
        getMovieData(`${baseURL}&apikey=${apikey}&i=${movieId}`, function (data) {
            resolve({ data, error: !data ? `No data found for movie with ID ${movieId}` : null });
        });
    });
};

let currentPage = 1;
let totalPages = 0;


getMovieData(`${baseURL}&apikey=${apikey}&${urlParam}&page=${currentPage}`, async function(data){
    
    const movieList =  data.Search;
    totalPages = Math.ceil(data.totalResults/10);

    document.title = `${typeName} - WatchFLix`;
    // one liner without using caching method-
    const completeMovieDataList = (await Promise.all(movieList.map(async mov => 
        (await movieData(mov.imdbID)).data)));

    // Sort movies by IMDb rating
    completeMovieDataList.sort((a, b) =>    
        (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0));

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

    // add movie card based on fetched item

    for(const movie of completeMovieDataList){
        const movieCard = createMovieCard(movie);

        movieListElem.querySelector(".grid-list").appendChild(movieCard);
    }

    pageContent.appendChild(movieListElem);


    // load more

    document.querySelector("[data-load-more]").addEventListener("click", function(){
        if (currentPage>= totalPages){
            this.style.display = "none";    // this = load button
            return;
        }
        currentPage++;
        this.classList.add("loading");  // this = load button

        getMovieData(`${baseURL}&apikey=${apikey}&${urlParam}&page=${currentPage}`, async (data)=>{
            this.classList.remove("loading");  // this = load button

            const movieList =  data.Search;
            const completeMovieDataList = (await Promise.all(movieList.map(async mov => 
                (await movieData(mov.imdbID)).data)));
        
            // Sort movies by IMDb rating
            completeMovieDataList.sort((a, b) =>    
                (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0));
        
            for (const movie of completeMovieDataList){
                const movieCard = createMovieCard(movie);
                movieListElem.querySelector(".grid-list").appendChild(movieCard);
            }
        });
    })
});

search();
