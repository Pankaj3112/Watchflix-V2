'use strict';

// Importing necessary modules and functions
import { apikey, getMovieData } from "./api.js";

// Function to create and handle the sidebar
export function sidebar() {

    // Function to toggle the visibility of the sidebar
    const toggleSidebar = function (sidebar) {

        // Selecting required elements
        const sidebarBtn = document.querySelector("[data-menu-btn]");
        const sidebarTogglers = document.querySelectorAll("[data-menu-toggler]");
        const overlay = document.querySelector("[data-overlay]");
        const searchModal = document.querySelector("[data-search-button]");


        // Adding click event to sidebar toggler elements
        addEventOnElements(sidebarTogglers, "click", function () {
            // Toggle classes to show/hide the sidebar and overlay
            sidebar.classList.toggle("active");
            sidebarBtn.classList.toggle("active");
            overlay.classList.toggle("active");
        });
        

    }

    // needs to be modified when OMDB API adds search by gene feature (DO REMEMBER to remove these curl bracates then)
    /* 
    {
    // Fetch all according to type: movie, series, episodes
    const categoryList = {};
    const category = ['movie', 'series', 'episode'];

    (async () => {
        await Promise.all(category.map(async (Type) => {
            const { Search } = await new Promise((resolve) => {
                getMovieData(`https://www.omdbapi.com/?apikey=${apikey}&r=json&type=${Type}&s=abc`, (data) => resolve(data));
            });
    
            if (Search) {
                categoryList[Type] = Search[0].Type;
                console.log(categoryList);
            }
        }));
    
        typeLink();
    })();

    const typeLink = function(){
        for (const [Type, Title] of Object.entries(categoryList)){
            const link = document.createElement("a");
            link.classList.add("sidebar-link");
            link.setAttribute("href", "./movie-list.html");
            link.setAttribute("menu-close", "");
            // link.setAttribute("onclick", `getMoviesList("with_type=${Type}", "${Title}")`);
            link.textContent = Title.charAt(0).toUpperCase() + Title.slice(1);

            sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);
        }
    }
    } 
    */

    // Creating the inner content of the sidebar
    
    const sidebarInner = document.createElement("div");
    sidebarInner.classList.add("sidebar-inner");

    // Adding HTML content to the sidebar
    sidebarInner.innerHTML = `
        <div class="sidebar-list">
            <p class="title">Category</p>
            <!-- Links to movie and series categories with onclick handlers -->
            <a href="./movie-list.html" class="sidebar-link" onclick='getMovieList("Movies","type=movie&s=disney")'>Movies</a>
            <a href="./movie-list.html" class="sidebar-link" onclick='getMovieList("Series","type=series&s=disney")'>Series</a>
        </div>
        <div class="sidebar-list">
            <p class="title">
                <!-- Link to the Favorites page -->
                <a href="./favourite.html">Favourites</a>
            </p>
        </div>
        <div class="sidebar-footer">
            <p class="copyright">
                Copyright 2023 
                <br>
                <!-- Link to the GitHub profile -->
                <a href="https://github.com/sam23599/" class="link">Satyam Virat</a>
            </p>
            <!-- OMDB logo image -->
            <img src="./assets/images/omdb-logo.png" width="70" height="20 !important" alt="movie db logo">
        </div>
    `;

    // Appending the inner content to the sidebar
    const sidebar = document.querySelector("[data-sidebar]");
    sidebar.appendChild(sidebarInner);

    // Calling the toggleSidebar function to handle sidebar visibility
    toggleSidebar(sidebar);

}
