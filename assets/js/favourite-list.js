'use strict';

// Function to toggle the favorite status
export function toggleFavorite(movieId) {
    const favourites = getFavourites();

    if (favourites.includes(movieId)) {
        // Movie is already in favourites, remove it
        const index = favourites.indexOf(movieId);
        favourites.splice(index, 1);
    } else {
        // Movie is not in favourites, add it
        favourites.push(movieId);
    }

    // Save favourites to localStorage
    localStorage.setItem('favourites', JSON.stringify(favourites));

    // Update UI
    updateUI();
}

// Function to get the list of favourites from localStorage
function getFavourites() {
    const storedFavourites = localStorage.getItem('favourites');
    return storedFavourites ? JSON.parse(storedFavourites) : [];
}

// Function to update the UI based on the favorite status
export function updateUI() {
    const favIcons = document.querySelectorAll('.fav-icon');	
    const favourites = getFavourites();

    favIcons.forEach((icon) => {
        const movieId = icon.getAttribute('data-movie-id');
        if (favourites.includes(movieId)) {
            icon.classList.add('active');
			icon.classList.add('fa-solid');
			icon.classList.remove('fa-regular');
        } else {
            icon.classList.remove('active');
			icon.classList.add('fa-regular');
			icon.classList.remove('fa-solid');
        }

    });
}

// Function to initialize the favourites functionality
export function initializeFavourites() {
    
    // Attach click event to the parent element containing fav-icons
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('fav-icon')) {
            const movieId = event.target.getAttribute('data-movie-id');
            toggleFavorite(movieId);
        }
    });

    // Initialize UI
    updateUI();
}

// Event listener to update UI when the DOM is fully loaded
// document.addEventListener('DOMContentLoaded', () => {
//     // Adding a delay to allow time for asynchronous operations
//     setTimeout(() => {
//         updateUI();
//     }, 1000);
// });
