'use strict';

import { apikey, getMovieData } from "./api.js";

export function sidebar() {
    const categoryList = {};

    getMovieData(`https://www.omdbapi.com/?apikey=${apikey}&r=json&type=movie&s=abc`, function ({ Search }) {
        for (const { Type, Title } of Search) {
            categoryList[Type] = Title;
        }

        typeLink();
    });

    const sidebarInner = document.createElement("div");
    sidebarInner.classList.add("sidebar-inner");

    sidebarInner.innerHTML = `

        <div class="sidebar-list">
            <p class="title">Category</p>
            <a href="./movie-list.html" data-menu-close class="sidebar-link">Movie</a>
            <a href="./movie-list.html" data-menu-close class="sidebar-link">Series</a>
            <a href="./movie-list.html" data-menu-close class="sidebar-link">Episode</a>
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

    const typeLink = function(){
        for (const [Type, Title] of Object.entries(categoryList)){
            const link = document.createElement("a");
            link.classList.add("sidebar-link");
            link.setAttribute("href", "./movie-list.html");
            link.setAttribute("menu-close", "");
            // link.setAttribute("onclick", `getMoviesList("with_type=${Type}", "${Title}")`);
            link.textContent = Title;

            sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);

        }

        const sidebar = document.querySelector("[data-sidebar]");
        sidebar.appendChild(sidebarInner);
        toggleSidebar(sidebar);
    }


    const toggleSidebar = function(sidebar){
        // Toggle sidebar in mobile screen

        const sidebarBtn = document.querySelector("[data-menu-btn]");
        const sidebarTogglers = document.querySelectorAll("[data-menu-toggler]");
        const sidebarClose = document.querySelectorAll("[data-menu-close]");
        const overlay = document.querySelector("[data-overlay]");

        addEventOnElements(sidebarTogglers, "click", function(){
            sidebar.classList.toggle("active");
            sidebarBtn.classList.toggle("active");
            overlay.classList.toggle("active");
        });

        addEventOnElements(sidebarClose, "click", function(){
            sidebar.classList.remove("active");
            sidebarBtn.classList.remove("active");
            overlay.classList.remove("active");
        });

    }
}