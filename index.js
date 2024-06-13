const express = require('express');
const ytdl = require('ytdl-core');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const YOUTUBE_API_KEY = 'AIzaSyB1bRFJEil3Mf_KUFhQiWXUWedAERxXbt4'; // Ganti dengan API Key Anda

app.use(express.static('public'));

app.get('/search', async (req, res) => {
    const query = req.query.q;
    const response = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
        params: {
            part: 'snippet',
            type: 'video',
            q: query,
            key: YOUTUBE_API_KEY
        }
    });
    res.json(response.data);
});

app.get('/audio', (req, res) => {
    const url = req.query.url;
    ytdl(url, { filter: 'audioonly' }).pipe(res);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
