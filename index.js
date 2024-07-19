const express = require('express');
const ytdl = require('@distube/ytdl-core');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const YOUTUBE_API_KEY = 'AIzaSyB1bRFJEil3Mf_KUFhQiWXUWedAERxXbt4'; // Ganti dengan API Key Anda
async function ytmp4(videoUrl) {
  try {
    const memanggil_tobrut = async () => {
      const apayah = 'https://youtube-dl.wave.video/info';
      const nganuyt = encodeURIComponent(videoUrl);
      const apanya = `${apayah}?url=${nganuyt}`;
      const respon_tobrut = await axios.get(apanya);
      return respon_tobrut.data;
    };

    const respon_cekerbabat = async (url_nganu) => {
      try {
        const Kebakaran = `https://cdn36.savetube.me/info?url=${encodeURIComponent(url_nganu)}`;
        const ngloot = await axios.get(Kebakaran);

        if (!ngloot.data || !ngloot.data.data || !ngloot.data.data.audio_formats) {
          throw new Error('Gagal nggawe daptar format audio');
        }

        const key = ngloot.data.data.key;

        const pecel_lele = `https://cdn34.savetube.me/download/audio/128/${key}`;
        const pencuri_matiae = await axios.get(pecel_lele);

        if (!pencuri_matiae.data || !pencuri_matiae.data.data || !pencuri_matiae.data.data.downloadUrl) {
          throw new Error('Gagal nggawe daptar URL dhuwit');
        }

        return pencuri_matiae.data.data.downloadUrl;
      } catch (error) {
        console.error('Kesalahan:', error.message);
        return null;
      }
    };

    const [videoInfo, audioUrl] = await Promise.all([memanggil_tobrut(), respon_cekerbabat(videoUrl)]);

    if (!videoInfo) {
      throw new Error('未收到视频信息');
    }

    const anu = videoInfo.formats.find(format => format.format_id === '18');
    const inpo_pemanggilan = {
      channel_name: videoInfo.uploader,
      channel_name_id: videoInfo.uploader_id,
      title: videoInfo.title || '没有可用的标题',
      duration: videoInfo.duration,
      thumbnails: videoInfo.thumbnail ? [{ url: videoInfo.thumbnail }] : [],
      v1_video_url: anu ? anu.url : null,
      v1_audio_url: audioUrl || null
    };

    return inpo_pemanggilan;
  } catch (error) {
    console.error('gagal memanggil tobrut:', error);

    return {
      error: 'terjadi kegagalan saat memanggil tobrut',
      status: 1
    };
  }
}
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
