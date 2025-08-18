const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve the player page with dynamic URLs
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Multi Restricted M3U8 Player</title>
      <link rel="stylesheet" href="https://unpkg.com/dplayer/dist/DPlayer.min.css" />
      <script src="https://unpkg.com/dplayer/dist/DPlayer.min.js"></script>
      <style>
        body { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; margin:0; background:#000; color:#fff; }
        #player { width:90%; max-width:800px; height:450px; margin-top:20px; }
        input, button { font-size:16px; padding:8px; margin-top:10px; width:80%; max-width:800px; }
      </style>
    </head>
    <body>
      <h1>Restricted M3U8 Player</h1>
      <input id="url" type="text" placeholder="Enter restricted M3U8 URL" />
      <button onclick="playVideo()">Play</button>
      <div id="player"></div>

      <script>
        let dp;
        function playVideo() {
          const url = document.getElementById('url').value.trim();
          if(!url) return alert('Enter a valid M3U8 URL');

          if(dp) dp.destroy();

          dp = new DPlayer({
            container: document.getElementById('player'),
            autoplay: true,
            video: {
              url: '/proxy?url=' + encodeURIComponent(url),
              type: 'hls'
            }
          });
        }
      </script>
    </body>
    </html>
  `);
});

// Robust proxy: handles playlist + TS segments
app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if(!url) return res.status(400).send('Missing URL');

  try {
    // Forward headers for restricted streams
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Referer': url,
      // Add Cookie if needed for authentication
      // 'Cookie': 'session=abc123; other=xyz'
    };

    const response = await fetch(url, { headers });
    const contentType = response.headers.get('content-type');

    res.set('Content-Type', contentType || 'application/vnd.apple.mpegurl');
    response.body.pipe(res);
  } catch(err) {
    console.error(err);
    res.status(500).send('Error fetching restricted stream');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
