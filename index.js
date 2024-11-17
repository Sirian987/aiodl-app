const express = require('express');
const ytdl = require('@distube/ytdl-core');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const YOUTUBE_API_KEY = 'AIzaSyB1bRFJEil3Mf_KUFhQiWXUWedAERxXbt4'; // Ganti dengan API Key Anda

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,  'index.html'));
});
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
app.get('/audionya', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL video YouTube diperlukan.');
    }

    try {
        const info = await ytdl.getInfo(url);
        res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp3"`);
        ytdl(url, { filter: 'audioonly' }).pipe(res);
    } catch (error) {
        console.error(error);
        res.status(500).send('Terjadi kesalahan saat memproses permintaan Anda.');
    }
});
app.get('/api/get', async (req, res) => {
  try {
    const message = req.query.url;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "url" tidak ditemukan' });
    }
    let down = await ytmp4(message) 
    res.status(200).json({
      status: 200,
      creator: "RIAN X EXONITY",
      result: down
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
