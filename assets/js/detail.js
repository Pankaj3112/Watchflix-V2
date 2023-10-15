'use strict';

import { apikey, baseURL, getMovieData } from "./api.js";
import { youtubeUrl, fetchYoutubeVideos } from "./youtube-api.js";
import { sidebar } from "./sidebar.js";
import { createMovieCard } from "./movie-card.js";
import { search } from "./search.js";
import { initializeFavourites, updateUI} from "./favourite-list.js";


const movieId = window.localStorage.getItem("movieId");
const pageContent = document.querySelector("[data-page-content]");

sidebar();

const movieData = function(movieId) {
    return new Promise((resolve) => {
        getMovieData(`${baseURL}&apikey=${apikey}&i=${movieId}`, function (data) {
            resolve({ data, error: !data ? `No data found for movie with ID ${movieId}` : null });
        });
    });
};


getMovieData(`${baseURL}&apikey=${apikey}&i=${movieId}`, function(movie){
    console.log(movie);
    const {
        Poster,
        Title,
        Year,
        Released,
        Runtime,
        imdbRating,
        Genre,
        Plot,
        Actors,
        Director,
        Rated,
    } = movie;

    document.title = `${Title} - WatchFlix`;

    const movieDetail = document.createElement("div");
    movieDetail.classList.add("movie-detail");

    movieDetail.innerHTML = `
        <div class="backdrop-image" style="background-image: url('${Poster});">

            </div>

            <figure class="poster-box movie-poster">
                <img src="${Poster}" alt="${Title}" class="img-cover">
            </figure>

            <div class="detail-box">
                <div class="detail-content">
                    <h1 class="heading">
                        ${Title}
                    </h1>

                    <div class="meta-list">
                        <img width="24" height="20" src="https://img.icons8.com/3d-fluency/94/star.png" loading="lazy" alt="rating"/>
                        <span class="span">${imdbRating}</span>
                        <div class="meta-item">${Runtime}</div>
                        <div class="meta-item">${Year}</div>
                        <div class="meta-item card-badge">${Rated}</div>
                    </div>

                    <p class="genre">
                        ${Genre}
                    </p>

                    <p class="overview">
                        ${Plot}
                    </p>

                    <ul class="detail-list">
                        <div class="list-item">
                            <p class="list-name">Starring</p>
                            <p>${Actors}</p>
                        </div>

                        <div class="list-item">
                            <p class="list-name">Directed By</p>
                            <p>${Director}</p>
                        </div>


                    </ul>
                </div>

                <div class="title-wrapper">
                    <h3 class="title-large">Trailers and Clips</h3>
                </div>

                <div class="slider-list">
                    <div class="slider-inner">
                    </div>
                </div>
            </div>
    `;

    const searchQuery = `${Title} official trailer|teaser`;
    // const trailerList = {
    //     "kind": "youtube#searchListResponse",
    //     "etag": "N6q94CwnKxtuBd3d4hanQ4EbsZA",
    //     "nextPageToken": "CAUQAA",
    //     "regionCode": "IN",
    //     "pageInfo": {
    //         "totalResults": 127,
    //         "resultsPerPage": 5
    //     },
    //     "items": [
    //         {
    //             "kind": "youtube#searchResult",
    //             "etag": "wx5Q6ekFEA8slS8MdqYSwyamX-M",
    //             "id": {
    //                 "kind": "youtube#video",
    //                 "videoId": "XNNGgIxKzYw"
    //             },
    //             "snippet": {
    //                 "publishedAt": "2018-08-12T18:30:04Z",
    //                 "channelId": "UCW9XDwQzPnhgRWQ0czXbSjQ",
    //                 "title": "LEGO DC Super Heroes: Aquaman: Rage of Atlantis",
    //                 "description": "Behold Atlantis, a kingdom of wonder and power beneath the ocean's surface and ruled by ranking Justice League member and ...",
    //                 "thumbnails": {
    //                     "default": {
    //                         "url": "https://i.ytimg.com/vi/XNNGgIxKzYw/default.jpg",
    //                         "width": 120,
    //                         "height": 90
    //                     },
    //                     "medium": {
    //                         "url": "https://i.ytimg.com/vi/XNNGgIxKzYw/mqdefault.jpg",
    //                         "width": 320,
    //                         "height": 180
    //                     },
    //                     "high": {
    //                         "url": "https://i.ytimg.com/vi/XNNGgIxKzYw/hqdefault.jpg",
    //                         "width": 480,
    //                         "height": 360
    //                     }
    //                 },
    //                 "channelTitle": "YouTube Movies",
    //                 "liveBroadcastContent": "none",
    //                 "publishTime": "2018-08-12T18:30:04Z"
    //             }
    //         },
    //         {
    //             "kind": "youtube#searchResult",
    //             "etag": "kWn90vI3tnsGxlFqh7rBTzgNC6M",
    //             "id": {
    //                 "kind": "youtube#video",
    //                 "videoId": "OgPxh5aC-hg"
    //             },
    //             "snippet": {
    //                 "publishedAt": "2015-06-22T18:35:25Z",
    //                 "channelId": "UCgrVS49chVzXz229q0towqA",
    //                 "title": "Justice League: Throne of Atlantis",
    //                 "description": "Darkness, mystery, legend – these are the whispers that echo through time regarding Atlantis. A kingdom long since forgotten to ...",
    //                 "thumbnails": {
    //                     "default": {
    //                         "url": "https://i.ytimg.com/vi/OgPxh5aC-hg/default.jpg",
    //                         "width": 120,
    //                         "height": 90
    //                     },
    //                     "medium": {
    //                         "url": "https://i.ytimg.com/vi/OgPxh5aC-hg/mqdefault.jpg",
    //                         "width": 320,
    //                         "height": 180
    //                     },
    //                     "high": {
    //                         "url": "https://i.ytimg.com/vi/OgPxh5aC-hg/hqdefault.jpg",
    //                         "width": 480,
    //                         "height": 360
    //                     }
    //                 },
    //                 "channelTitle": "YouTube Movies",
    //                 "liveBroadcastContent": "none",
    //                 "publishTime": "2015-06-22T18:35:25Z"
    //             }
    //         },
    //         {
    //             "kind": "youtube#searchResult",
    //             "etag": "gEJ2MyxQa4qyN7IJYYwJEVjZrSQ",
    //             "id": {
    //                 "kind": "youtube#video",
    //                 "videoId": "dXSR8gwIDKo"
    //             },
    //             "snippet": {
    //                 "publishedAt": "2019-01-07T15:42:59Z",
    //                 "channelId": "UC8QwR21oJVrax_w1aAG4Cxw",
    //                 "title": "DC Super Hero Girls: Legends of Atlantis",
    //                 "description": "Dive deep into adventure with the DC Super Hero Girls in this an underwater epic. Sisters of the sea, Siren and Mera catch the ...",
    //                 "thumbnails": {
    //                     "default": {
    //                         "url": "https://i.ytimg.com/vi/dXSR8gwIDKo/default.jpg",
    //                         "width": 120,
    //                         "height": 90
    //                     },
    //                     "medium": {
    //                         "url": "https://i.ytimg.com/vi/dXSR8gwIDKo/mqdefault.jpg",
    //                         "width": 320,
    //                         "height": 180
    //                     },
    //                     "high": {
    //                         "url": "https://i.ytimg.com/vi/dXSR8gwIDKo/hqdefault.jpg",
    //                         "width": 480,
    //                         "height": 360
    //                     }
    //                 },
    //                 "channelTitle": "YouTube Movies",
    //                 "liveBroadcastContent": "none",
    //                 "publishTime": "2019-01-07T15:42:59Z"
    //             }
    //         },
    //         {
    //             "kind": "youtube#searchResult",
    //             "etag": "o1b8mDPSDfbF9uU8i7weR0Y1JOk",
    //             "id": {
    //                 "kind": "youtube#video",
    //                 "videoId": "dJK9neH350A"
    //             },
    //             "snippet": {
    //                 "publishedAt": "2015-08-10T18:30:03Z",
    //                 "channelId": "UCTexMi1r9SNgehr5KU2NzYw",
    //                 "title": "Lego DC Super Heroes: Justice League: Attack of the Legion of Doom!",
    //                 "description": "Crime is on the run as the newly formed Justice League keeps Metropolis safe and this makes evil genius Lex Luthor very ...",
    //                 "thumbnails": {
    //                     "default": {
    //                         "url": "https://i.ytimg.com/vi/dJK9neH350A/default.jpg",
    //                         "width": 120,
    //                         "height": 90
    //                     },
    //                     "medium": {
    //                         "url": "https://i.ytimg.com/vi/dJK9neH350A/mqdefault.jpg",
    //                         "width": 320,
    //                         "height": 180
    //                     },
    //                     "high": {
    //                         "url": "https://i.ytimg.com/vi/dJK9neH350A/hqdefault.jpg",
    //                         "width": 480,
    //                         "height": 360
    //                     }
    //                 },
    //                 "channelTitle": "YouTube Movies",
    //                 "liveBroadcastContent": "none",
    //                 "publishTime": "2015-08-10T18:30:03Z"
    //             }
    //         },
    //         {
    //             "kind": "youtube#searchResult",
    //             "etag": "AThm-xTQcua0dy4wvR4_0h8PmBU",
    //             "id": {
    //                 "kind": "youtube#video",
    //                 "videoId": "c8K3qgpJAUc"
    //             },
    //             "snippet": {
    //                 "publishedAt": "2016-07-03T18:30:02Z",
    //                 "channelId": "UCOVFz53Ynn-qUI4pfO3Ymsw",
    //                 "title": "LEGO DC Super Heroes: Justice League: Gotham City Breakout",
    //                 "description": "Batman faces his greatest challenge yet: VACATION! The caped crusader reluctantly agrees to let Batgirl and Nightwing take him ...",
    //                 "thumbnails": {
    //                     "default": {
    //                         "url": "https://i.ytimg.com/vi/c8K3qgpJAUc/default.jpg",
    //                         "width": 120,
    //                         "height": 90
    //                     },
    //                     "medium": {
    //                         "url": "https://i.ytimg.com/vi/c8K3qgpJAUc/mqdefault.jpg",
    //                         "width": 320,
    //                         "height": 180
    //                     },
    //                     "high": {
    //                         "url": "https://i.ytimg.com/vi/c8K3qgpJAUc/hqdefault.jpg",
    //                         "width": 480,
    //                         "height": 360
    //                     }
    //                 },
    //                 "channelTitle": "YouTube Movies",
    //                 "liveBroadcastContent": "none",
    //                 "publishTime": "2016-07-03T18:30:02Z"
    //             }
    //         }
    //     ]
    // };

    // update trailer to trailerList later and delete above object
    fetchYoutubeVideos(`${youtubeUrl}&q=${encodeURIComponent(searchQuery)}`, function(trailerList){
        for(const trailer of trailerList){

            const videoCard = document.createElement("div");
            videoCard.classList.add("video-card");
            videoCard.innerHTML = `
                <iframe width="500" height="294" src="https://www.youtube.com/embed/${trailer.id.videoId}" title="${Title}" frameborder="0"  allowfullscreen class="img-cover" loading="lazy"></iframe>
            `;
            movieDetail.querySelector(".slider-inner").appendChild(videoCard);
        }
    
    });

    pageContent.appendChild(movieDetail);

    getMovieData(`${baseURL}&apikey=${apikey}&s=disney`, addSuggestedMovies);    

});


const addSuggestedMovies = async function({ Search: movieList}){


    // one liner without using caching method-
    const completeMovieDataList = (await Promise.all(movieList.map(async mov => 
        (await movieData(mov.imdbID)).data)));

    // Sort movies by IMDb rating
    completeMovieDataList.sort((a, b) =>    
        (parseFloat(b.imdbRating) || 0) - (parseFloat(a.imdbRating) || 0));


    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list");
    movieListElem.innerHTML = `
        <div class="title-wrapper">
            <h3 class="title-large">You May Also Like</h3>
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

search();
setTimeout(() => {
    updateUI();
}, 1500); 
initializeFavourites();