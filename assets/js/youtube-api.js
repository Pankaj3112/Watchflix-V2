'use strict';

// YouTube API key for authentication
const youtubeApiKey = 'AIzaSyB5ZgefAXVff72XlnsUCOwgS4fQD94GLT4';

// YouTube API URL for searching videos
const youtubeUrl = `https://www.googleapis.com/youtube/v3/search?key=${youtubeApiKey}&videoCategoryId=30&part=snippet&type=video&videoType=movie&maxResults=5`;

// Function to fetch YouTube videos from the server
const fetchYoutubeVideos = function (url, callback, opt) {
    // Use the fetch API to make an HTTP request to the specified URL
    fetch(url)
        // Parse the response as JSON
        .then(res => res.json())
        // Call the provided callback function with the parsed data and optional parameter
        .then(data => callback(data.items, opt));
}

// Exporting the YouTube URL and fetchYoutubeVideos function for external use
export { youtubeUrl, fetchYoutubeVideos };
