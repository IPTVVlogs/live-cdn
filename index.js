const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// ===== Replace this with your restricted M3U8 URL =====
const RESTRICTED_M3U8_URL = 'https://5nhp186eg31fofnc.chinese-restaurant-api.site/v3/variant/VE1AO1NTbu8mbv12LxEWM21ycrNWYyR3LwczMhRTYlRGNiNWZtQTNjlTLjVWZ00iM3QTZtImYhdTY0QTZ/master.m3u8';

// Serve DPlayer page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>DPlayer Restricted Stream</title>
      <link rel="stylesheet" href="https://unpkg.com/dplayer/dist/DPlayer.min.css" />
      <script src="https://unpkg.com/dplayer/dist/DPlayer.min.js"></script>
      <style>
        body { display:flex; justify-content:center; align-items:center; height:100vh; margin:0; background:#000; color:#fff; }
        #player { width:90%; max-width:800px; height:450px; }
      </style>
    </head>
    <body>
      <div id="player"></div>
      <script>
        new DPlayer({
          container: document.getElementById('player'),
          autoplay: true,
          video: {
            url: '/proxy?url=${encodeURIComponent(RESTRICTED_M3U8_URL)}',
            type: 'hls'
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Robust proxy route
app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing URL');

  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Referer': url,
      // Add more headers if the stream requires them, like cookies:
      // 'Cookie': 'YOUR_COOKIE_HERE'
    };

    const response = await fetch(url, { headers });
    const contentType = response.headers.get('content-type');

    res.set('Content-Type', contentType || 'application/vnd.apple.mpegurl');

    // Stream the response directly to the client
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send('Error fetching restricted stream');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
