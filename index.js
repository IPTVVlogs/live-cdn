import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// Root route serves the player page directly
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>M3U8 Player</title>
      <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
      <style>
        body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #000; margin: 0; color: #fff; }
        video { width: 90%; height: auto; margin-top: 20px; }
        input { width: 80%; padding: 10px; font-size: 16px; }
        button { padding: 10px 20px; font-size: 16px; margin-top: 10px; cursor: pointer; }
      </style>
    </head>
    <body>
      <h1>M3U8 Player</h1>
      <input id="url" type="text" placeholder="Enter M3U8 URL here" />
      <button onclick="playVideo()">Play</button>
      <video id="video" controls></video>

      <script>
        const video = document.getElementById('video');
        const input = document.getElementById('url');

        function playVideo() {
          const url = input.value.trim();
          if (!url) return alert('Enter a valid M3U8 URL');

          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource('/proxy?url=' + encodeURIComponent(url));
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = '/proxy?url=' + encodeURIComponent(url);
            video.addEventListener('loadedmetadata', () => video.play());
          } else {
            alert('Your browser does not support HLS.');
          }
        }
      </script>
    </body>
    </html>
  `);
});

// Proxy route for M3U8
app.get('/proxy', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Missing URL');

  try {
    const response = await fetch(url);
    const data = await response.text();
    res.set('Content-Type', 'application/vnd.apple.mpegurl');
    res.send(data);
  } catch (err) {
    res.status(500).send('Error fetching M3U8');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
