'use strict';

// Function to add an event on multiple elements
const addEventOnElements = function (elements, eventType, callback) {
    for (const elem of elements) {
        elem.addEventListener(eventType, callback);
    }
}

// Toggle search box on mobile devices or small screens
const searchBox = document.querySelector("[data-search-box]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

// Add click event to toggle the search box
addEventOnElements(searchTogglers, "click", function () {
    searchBox.classList.toggle("active");
});

// Function to get a movie list with specified type and URL parameter
const getMovieList = function (typeName, urlParam) {
    // Store URL parameters and type name in local storage
    window.localStorage.setItem("urlParam", urlParam);
    window.localStorage.setItem("typeName", typeName);
}
