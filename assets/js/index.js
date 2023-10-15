'use strict';

// Importing modules
import { sidebar } from "./sidebar.js";
import { apikey, baseURL, getMovieData, imageBaseURL } from "./api.js";
import { createMovieCard } from "./movie-card.js"
import { search } from "./search.js";
import { initializeFavourites, updateUI} from "./favourite-list.js";

// Selecting the page content
const pageContent = document.querySelector("[data-page-content]");

// Initializing sidebar
sidebar();

// Home Page Section (top Rated, upcoming, trending)
const homePageSections = [
    { title: "Upcoming Movies", path: "2024" },
    { title: "Weekly Trending", path: "2023" },
    { title: "Top Rated", path: "" }
]

// Function to get movie data using Promise
const movieData = function(movieId) {
    return new Promise((resolve) => {
        getMovieData(`${baseURL}&apikey=${apikey}&i=${movieId}`, function (data) {
            resolve({ data, error: !data ? `No data found for movie with ID ${movieId}` : null });
        });
    });
};

// Async function to create hero banner
const heroBanner = async function({Search: movieList}) {
    // Creating banner element
    const banner = document.createElement("section");
    banner.classList.add("banner");
    
    // Adding HTML content to the banner
    banner.innerHTML = `
        <div class="banner-slider"></div>
        <div class="slider-control">
            <div class="control-inner"></div>
        </div>
    `;

    let controlItemIndex = 0;

    for(const [index, movie] of movieList.entries()){
        // Extracting movie details
        const { Title, Year, imdbID, Type, Poster } = movie;

        // Fetching movie data
        let movieDataReceived = await movieData(imdbID);

        // Creating slider item
        const sliderItem = document.createElement("div")
        sliderItem.classList.add("slider-item")
        sliderItem.setAttribute("slider-item", "")

        // Adding HTML content to the slider item
        sliderItem.innerHTML = `
            <img src="${Poster}" alt="${Title}" class="img-cover" loading=${index === 0 ? "eager": "lazy"}>
            <div class="banner-content">
                <h2 class="heading">${Title}</h2>
                <div class="meta-list">
                    <div class="meta-item">${Year}</div>
                    <div class="meta-item card-badge">${Type}</div>
                    <i class="fa-regular fa-heart fav-icon" data-movie-id="${imdbID}"></i>
                </div>
                <p class="genre">${movieDataReceived.data.Genre}</p>
                <p class="banner-text">${movieDataReceived.data.Plot}</p>
                <a href="./detail.html" class="btn" onclick="localStorage.setItem('movieId', '${imdbID}')">
                    <i class="fa-regular fa-circle-play fa-xl"></i>
                    <span class="span">Watch Now</span>
                </a>
            </div>
        `;

        banner.querySelector(".banner-slider").appendChild(sliderItem);

        // Creating control item
        const controlItem = document.createElement("button");
        controlItem.classList.add("poster-box", "slider-item");
        controlItem.setAttribute("slider-control", `${controlItemIndex}`);

        controlItemIndex++;

        // Adding HTML content to the control item
        controlItem.innerHTML = `
            <img src="${Poster}" alt="${Title}" loading="lazy" draggable="false"  class="img-cover">
        `
        banner.querySelector(".control-inner").appendChild(controlItem);
    }

    pageContent.appendChild(banner);

    // Adding hero slide functionality
    addHeroSlide();

    // Fetching data for home page sections (top rated, upcoming, trending)
    for (const {title, path} of homePageSections){
        getMovieData(`${baseURL}&apikey=${apikey}&s=batman&y=${path}`, createMovieList, title);
    }
}

// Function to add hero slide
const addHeroSlide = function(){
    const sliderItems = document.querySelectorAll("[slider-item]");
    const sliderControls = document.querySelectorAll("[slider-control");

    let lastSliderItem = sliderItems[0];
    let lastSliderControl = sliderControls[0];

    lastSliderItem.classList.add("active");
    lastSliderControl.classList.add("active");
    
    const sliderStart = function () {
        lastSliderItem.classList.remove("active");
        lastSliderControl.classList.remove("active");

        // this ==slider-control
        sliderItems[Number(this.getAttribute("slider-control"))].classList.add("active");
        this.classList.add("active");

        lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];
        lastSliderControl = this;
    }

    addEventOnElements(sliderControls, "click", sliderStart);
}

// Implementing caching method for faster page rendering 
const movieCache = {};

// Function to get movie data with caching
const getMovieDataCached = async function (imdbID) {
    if (movieCache[imdbID]) {
        console.log(`Using cached data for ${imdbID}`);
        return movieCache[imdbID];
    }

    const movieDataResponse = await movieData(imdbID);
    movieCache[imdbID] = movieDataResponse.data; // Caching the data
    return movieDataResponse.data;
};

// Function to create movie list
const createMovieList = async function({ Search: movieList}, title){
    // Fetching movie's complete data from their imdbID
    const batchSize = 5;
    const completeMovieDataList = [];

    for (let i = 0; i < movieList.length; i += batchSize) {
        const batch = movieList.slice(i, i + batchSize);
        const batchData = await Promise.all(
            batch.map(async mov => await getMovieDataCached(mov.imdbID))
        );
        completeMovieDataList.push(...batchData);
    }

    // Sorting movies by IMDb rating
    completeMovieDataList.sort((a, b) =>    
        (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0));

    // Creating movie list element
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list");
    movieListElem.innerHTML = `
        <div class="title-wrapper">
            <h3 class="title-large">${title}</h3>
        </div>
        <div class="slider-list">
            <div class="slider-inner"></div>
        </div>
    `;

    // Appending movie cards to the movie list
    for(const movie of completeMovieDataList){
        const movieCard = createMovieCard(movie);   // called from movie-card.js
        movieListElem.querySelector(".slider-inner").appendChild(movieCard);
    }

    pageContent.appendChild(movieListElem);
}

// Fetching movie data for hero banner
getMovieData(`https://www.omdbapi.com/?apikey=${apikey}&r=json&type=movie&s=dragon&page=1`, heroBanner);

// Initializing search functionality
search();

// Updating UI after a delay
setTimeout(() => {
    updateUI();
}, 2000); 

// Initializing favorites
initializeFavourites();