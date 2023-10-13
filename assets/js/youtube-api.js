'use strict';

const youtubeApiKey = 'AIzaSyB5ZgefAXVff72XlnsUCOwgS4fQD94GLT4';
const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&videoCategoryId=30&part=snippet&type=video&videoType=movie&maxResults=5`;

// fetch data from server and pass the result in JSON format
const fetchYoutubeVideos = function (url, callback, opt){
    fetch(url)
        .then(res => res.json())
        .then(data => callback(data.items, opt));
}

export{ youtubeUrl, fetchYoutubeVideos };
