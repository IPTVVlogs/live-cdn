const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// Root route serves the player page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>DPlayer M3U8 Player</title>
      <link rel="stylesheet" href="https://unpkg.com/dplayer/dist/DPlayer.min.css" />
      <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
      <script src="https://unpkg.com/dplayer/dist/DPlayer.min.js"></script>
      <style>
        body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #000; color: #fff; }
        #player { width: 90%; max-width: 800px; height: 450px; margin-top: 20px; }
        input, button { margin-top: 10px; font-size: 16px; padding: 8px; }
      </style>
    </head>
    <body>
      <h1>DPlayer M3U8 Player</h1>
      <input id="url" type="text" placeholder="Enter M3U8 URL here" style="width: 80%;" />
      <button onclick="playVideo()">Play</button>
      <div id="player"></div>

      <script>
        let dp;
        function playVideo() {
          const url = document.getElementById('url').value.trim();
          if (!url) return alert('Enter a valid M3U8 URL');

          // Destroy previous player if exists
          if (dp) dp.destroy();

          dp = new DPlayer({
            container: document.getElementById('player'),
            autoplay: true,
            video: {
              url: '/proxy?url=' + encodeURIComponent(url),
              type: 'hls',
            },
          });
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
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const data = await response.text();
    res.set('Content-Type', 'application/vnd.apple.mpegurl');
    res.send(data);
  } catch (err) {
    res.status(500).send('Error fetching M3U8');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
