'use strict';

// Add event on multiple elements

const addEventOnElements = function(elements, eventType, callback){
    for(const elem of elements){
        elem.addEventListener(eventType, callback);
    }
}

// Toggle search box in mobile device || small screen

const searchBox = document.querySelector("[data-search-box]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

addEventOnElements(searchTogglers, "click", function(){
    searchBox.classList.toggle("active");
});


// TODO: Add like button feature