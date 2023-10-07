'use strict';

import { sidebar } from "./sidebar.js";
import { apikey, baseURL, getMovieData, imageBaseURL } from "./api.js";


const pageContent = document.querySelector("[data-page-content]");

sidebar();

getMovieData(`https://www.omdbapi.com/?apikey=${apikey}&r=json&type=movie&s=marvel&page=1`, heroBanner);

const heroBanner = function({Search: movieList}){

    const banner = document.createElement("section");
    banner.classList.add("banner");
    
    banner.innerHTML = `
        
        <!-- popular movies and thier data from slider -->
        <div class="banner-slider"></div>

        <!-- Slider for popular movies selection-->
        <div class="slider-control">
            <div class="control-inner">

                <button class="poster-box slider-item">
                    <img src="./assets/images/slider-control.jpg" loading="lazy" draggable="false" alt="Slide to movie" class="img-cover">
                </button>
                
            </div>


        </div>
    `;

    let contorlItemIndex = 0;

    for(const [index, movie] of movieList.entries()){

        const {
            title,
            year,
            imdbID,
            type,
            poster
        } = movie;

        const sliderItem = document.createElement("div")
        sliderItem.classList.add("slider-item")
        sliderItem.setAttribute("slider-item", "")

        sliderItem.innerHTML = `
            
            <img src="${imageBaseURL}${apikey}${imdbID}" alt="${title}" class="img-cover" loading="${index === 0 ? "eager": "lazy"}">

            <div class="banner-content">
                <h2 class="heading">${title}</h2>

                <div class="meta-list">
                    <div class="meta-item">${year}</div>

                    // <div class="meta-item card-badge"> Ratings </div>
                </div>

                <p class="genre">Animation, Action, Adventure</p>

                <p class="banner-text">
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit, minus cumque officiis maxime necessitatibus tempore earum dicta labore sint, facere porro. Aliquam accusantium repudiandae exercitationem ullam iusto maxime ut. Error?
                </p>
                <a href="./detail.html" class="btn">
                    <i class="fa-regular fa-circle-play fa-xl"></i>
                    <span class="span">Watch Now</span>
                </a>
            </div>
            
        `;

    }



}


