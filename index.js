const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve HTML page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Video.js Restricted M3U8 Player</title>
      <link href="https://vjs.zencdn.net/8.0.4/video-js.css" rel="stylesheet" />
      <script src="https://vjs.zencdn.net/8.0.4/video.min.js"></script>
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
      <video id="player" class="video-js vjs-default-skin" controls autoplay></video>

      <script>
        let player = videojs('player');

        function playVideo() {
          const url = document.getElementById('url').value.trim();
          if(!url) return alert('Enter a valid M3U8 URL');

          player.src({
            src: '/proxy?url=' + encodeURIComponent(url),
            type: 'application/x-mpegURL'
          });
          player.play();
        }
      </script>
    </body>
    </html>
  `);
});

// Proxy route for playlist + TS segments
app.get('/proxy', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).send('Missing URL');

  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Referer': url,
      // Add cookies if required:
      // 'Cookie': 'session=YOUR_SESSION; other=XYZ'
    };

    const response = await fetch(url, { headers });
    const contentType = response.headers.get('content-type');
    res.set('Content-Type', contentType || 'application/vnd.apple.mpegurl');

    // Forward the playlist or TS stream
    response.body.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch stream. Check URL, headers, cookies, or geo-restriction.');
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
