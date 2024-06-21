const express = require('express');
const ytdl = require('ytdl-core');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const YOUTUBE_API_KEY = 'AIzaSyB1bRFJEil3Mf_KUFhQiWXUWedAERxXbt4'; // Ganti dengan API Key Anda

app.use(express.static('public'));
app.get('/download', async (req, res) => {
    const url = req.query.url;
    const resolution = req.query.resolution;

    if (!url) {
        return res.status(400).send('URL video YouTube diperlukan.');
    }

    try {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: resolution });

        if (!format) {
            return res.status(400).send('Resolusi tidak ditemukan.');
        }

        res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
        ytdl(url, { format }).pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat memproses permintaan Anda.');
    }
});
app.get('/search', async (req, res) => {
    const query = req.query.query;
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
    const info = await ytdl.getInfo(url);
            res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp3"`);
    ytdl(url, { filter: 'audioonly' }).pipe(res);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
