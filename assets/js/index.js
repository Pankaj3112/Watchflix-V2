'use strict';

import { sidebar } from "./sidebar.js";
import { apikey, baseURL, getMovieData, imageBaseURL } from "./api.js";
import { createMovieCard } from "./movie-card.js"
import { search } from "./search.js";

const pageContent = document.querySelector("[data-page-content]");

sidebar();


// Home Page Section (top Rated, upcoimg, trending)

const homePageSections = [
    {
        title: "Upcoming Movies",
        path: "2024"
    },
    {
        title: "Weekly Trending", 
        path: "2023"
    },
    {
        title: "Top Rated", 
        path: ""
    }
]


const movieData = function(movieId) {
    return new Promise((resolve) => {
        getMovieData(`${baseURL}&apikey=${apikey}&i=${movieId}`, function (data) {
            resolve({ data, error: !data ? `No data found for movie with ID ${movieId}` : null });
        });
    });
};


const heroBanner = async function({Search: movieList}){

    const banner = document.createElement("section");
    banner.classList.add("banner");
    
    banner.innerHTML = `
        
        <!-- popular movies and thier data from slider -->
        <div class="banner-slider"></div>

        <!-- Slider for popular movies selection-->
        <div class="slider-control">
            <div class="control-inner"></div>
        </div>

    `;

    let contorlItemIndex = 0;

    for(const [index, movie] of movieList.entries()){

        const {
            Title,
            Year,
            imdbID,
            Type,
            Poster
        } = movie;

        let movieDataRecieved = await movieData(imdbID);

        const sliderItem = document.createElement("div")
        sliderItem.classList.add("slider-item")
        sliderItem.setAttribute("slider-item", "")

        
        sliderItem.innerHTML = `
            
            <img src="${Poster}" alt="${Title}" class="img-cover" loading=${index === 0 ? "eager": "lazy"}>
            
            <div class="banner-content">
                <h2 class="heading">${Title}</h2>

                <div class="meta-list">
                    <div class="meta-item">${Year}</div>

                    <div class="meta-item card-badge">${Type}</div>
                </div>

                <p class="genre">${movieDataRecieved.data.Genre}</p>

                <p class="banner-text">${movieDataRecieved.data.Plot}</p>
                
                <a href="./detail.html" class="btn" onclick="localStorage.setItem('movieId', '${imdbID}')">
                    <i class="fa-regular fa-circle-play fa-xl"></i>
                    <span class="span">Watch Now</span>
                </a>
            </div>
            
        `;

        banner.querySelector(".banner-slider").appendChild(sliderItem);

        const controlItem = document.createElement("button");
        controlItem.classList.add("poster-box", "slider-item");
        controlItem.setAttribute("slider-control", `${contorlItemIndex}`);

        contorlItemIndex++;

        controlItem.innerHTML = `
            <img src="${Poster}" alt="${Title}" loading="lazy" draggable="false"  class="img-cover">
        `
        banner.querySelector(".control-inner").appendChild(controlItem);

    }

    pageContent.appendChild(banner);

    addHeroSlide();
    

    // fetch data for home page sections (top rated, upcoimg, trending)

    for (const {title, path} of homePageSections){
        getMovieData(`${baseURL}&apikey=${apikey}&s=batman&y=${path}`, createMovieList, title);
    }
}


// Hero Slider functions

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

// Implemented cacheing method for faster page rendering 
const movieCache = {};

const getMovieDataCached = async function (imdbID) {
    if (movieCache[imdbID]) {
        console.log(`Using cached data for ${imdbID}`);
        return movieCache[imdbID];
    }

    const movieDataResponse = await movieData(imdbID);
    movieCache[imdbID] = movieDataResponse.data; // Cache the data
    return movieDataResponse.data;
};

const createMovieList = async function({ Search: movieList}, title){

    // Fetch movie's complete data from their imdbID

    // one liner without using caching method-
    // const completeMovieDataList = (await Promise.all(movieList.map(async mov => 
    //     (await movieData(mov.imdbID)).data)));

    const batchSize = 5;
    const completeMovieDataList = [];

    for (let i = 0; i < movieList.length; i += batchSize) {
        const batch = movieList.slice(i, i + batchSize);
        const batchData = await Promise.all(
            batch.map(async mov => await getMovieDataCached(mov.imdbID))
        );
        completeMovieDataList.push(...batchData);
    }

    // Sort movies by IMDb rating
    completeMovieDataList.sort((a, b) =>    
        (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0));


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

    for(const movie of completeMovieDataList){
        const movieCard = createMovieCard(movie);   // called from movie-card.js
        movieListElem.querySelector(".slider-inner").appendChild(movieCard);
    }

    pageContent.appendChild(movieListElem);
}


getMovieData(`https://www.omdbapi.com/?apikey=${apikey}&r=json&type=movie&s=dragon&page=1`, heroBanner);


search();