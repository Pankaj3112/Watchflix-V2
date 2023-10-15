'use strict';

import { apikey, getMovieData } from "./api.js";

export function sidebar() {

    const toggleSidebar = function(sidebar){

        const sidebarBtn = document.querySelector("[data-menu-btn]");
        const sidebarTogglers = document.querySelectorAll("[data-menu-toggler]");
        // const sidebarClose = document.querySelectorAll("[data-menu-close]");
        const overlay = document.querySelector("[data-overlay]");

        addEventOnElements(sidebarTogglers, "click", function(){
            sidebar.classList.toggle("active");
            sidebarBtn.classList.toggle("active");
            overlay.classList.toggle("active");
        });

        // addEventOnElements(sidebarClose, "click", function(){
        //     sidebar.classList.remove("active");
        //     sidebarBtn.classList.remove("active");
        //     overlay.classList.remove("active");
        // });

    }

    // needs to be modified when OMDB API adds search by gene feature (DO REMEMBER to remove these curl bracates then)
    
    // {
    // // Fetch all according to type: movie, series, episodes
    // const categoryList = {};
    // const category = ['movie', 'series', 'episode'];

    // (async () => {
    //     await Promise.all(category.map(async (Type) => {
    //         const { Search } = await new Promise((resolve) => {
    //             getMovieData(`https://www.omdbapi.com/?apikey=${apikey}&r=json&type=${Type}&s=abc`, (data) => resolve(data));
    //         });
    
    //         if (Search) {
    //             categoryList[Type] = Search[0].Type;
    //             console.log(categoryList);
    //         }
    //     }));
    
    //     typeLink();
    // })();

    // const typeLink = function(){
    //     for (const [Type, Title] of Object.entries(categoryList)){
    //         const link = document.createElement("a");
    //         link.classList.add("sidebar-link");
    //         link.setAttribute("href", "./movie-list.html");
    //         link.setAttribute("menu-close", "");
    //         // link.setAttribute("onclick", `getMoviesList("with_type=${Type}", "${Title}")`);
    //         link.textContent = Title.charAt(0).toUpperCase() + Title.slice(1);

    //         sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);
    //     }
    // }
    // }


    const sidebarInner = document.createElement("div");
    sidebarInner.classList.add("sidebar-inner");

    sidebarInner.innerHTML = `

        <div class="sidebar-list">
            <p class="title">Category</p>
            <a href="./movie-list.html" data-menu-close class="sidebar-link" onclick='getMovieList("Movies","type=movie&s=disney")'>Movies</a>
            <a href="./movie-list.html" data-menu-close class="sidebar-link" onclick='getMovieList("Series","type=series&s=disney")'>Series</a>

            <!-- removed it coz adding a episode of hardcoded movie id like this need code modification in movie-list.js file || if needed in future, i shall do it -->
            <!-- <a href="./movie-list.html" data-menu-close class="sidebar-link" onclick='getMovieList("Episodes","i=tt0277535&season=1")'>Episodes</a> -->
        </div>
        <div class="sidebar-list">
            <p class="title">
                <a href="./favourite.html">Favourites</a>
            </p>

            <!-- removed it coz adding a episode of hardcoded movie id like this need code modification in movie-list.js file || if needed in future, i shall do it -->
            <!-- <a href="./movie-list.html" data-menu-close class="sidebar-link" onclick='getMovieList("Episodes","i=tt0277535&season=1")'>Episodes</a> -->
        </div>
        <div class="sidebar-footer">
            <p class="copyright">
                Copyright 2023 
                <br>
                <a href="https://github.com/sam23599/" class="link">Satyam Virat</a>
            </p>
            <img src="./assets/images/omdb-logo.png" width="70" height="20 !important" alt="movie db logo">
        </div>
    `;

    // needs to be modified when OMDB API adds search by gene feature
    

    const sidebar = document.querySelector("[data-sidebar]");
    sidebar.appendChild(sidebarInner);
    toggleSidebar(sidebar);


    
}