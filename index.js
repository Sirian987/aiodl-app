const express = require('express');
const ytdl = require('@distube/ytdl-core');
const fetch = require('node-fetch');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const YOUTUBE_API_KEY = 'AIzaSyB1bRFJEil3Mf_KUFhQiWXUWedAERxXbt4'; // Ganti dengan API Key Anda
function Mp3(url) {
  return new Promise((resolve, reject) => {
    let title, image;
    
    const getDownloadId = () => {
      return fetch(`https://ab.cococococ.com/ajax/download.php?copyright=0&format=mp3&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`)
        .then(response => response.json());
    };

    const checkProgress = (id) => {
      return fetch(`https://p.oceansaver.in/ajax/progress.php?id=${id}`)
        .then(response => response.json());
    };

    const pollProgress = (id) => {
      checkProgress(id).then(data => {
        if (data.progress === 1000) {
          resolve({
            type: 'mp3 (128 kbps)',
            title: title,
            image: image,
            download_url: data.download_url
          });
        } else {
          setTimeout(() => pollProgress(id), 1000);
        }
      }).catch(reject);
    };

    getDownloadId()
      .then(data => {
        if (data.success && data.id) {
          title = data.info.title;
          image = data.info.image;
          pollProgress(data.id);
        } else {
          reject(new Error('Gagal mendapatkan ID unduhan'));
        }
      })
      .catch(reject);
  });
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
    let down = await Mp3(message) 
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
