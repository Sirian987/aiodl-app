const express = require('express');
const ytdl = require('ytdl-core');
const axios = require('axios');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY'; // Ganti dengan API Key Anda

app.use(express.static('public'));

app.get('/search', async (req, res) => {
    const query = req.query.q;
    const response = await fetch(`https://api.exonity.my.id/api/yts?query=${query}`);
    res.json(response.result);
});

app.get('/audio', (req, res) => {
    const url = req.query.url;
    ytdl(url, { filter: 'audioonly' }).pipe(res);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
