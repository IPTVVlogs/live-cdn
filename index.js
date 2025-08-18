const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 3000;

// Root page with DPlayer
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

          if(dp) dp.destroy();

          dp = new DPlayer({
            container: document.getElementById('player'),
            autoplay: true,
            video: {
              url: '/proxy?url=' + encodeURIComponent(url),
              type: 'hls',
            }
          });
        }
      </script>
    </body>
    </html>
  `);
});

// Proxy route
app.use('/proxy', createProxyMiddleware({
  target: 'http://example.com', // this will be overridden by `req.query.url`
  changeOrigin: true,
  selfHandleResponse: false,
  router: (req) => {
    const url = req.query.url;
    if(!url) return 'http://example.com';
    return url;
  },
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
  }
}));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
