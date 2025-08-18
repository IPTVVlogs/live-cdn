const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve DPlayer page with input box
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>DPlayer Dynamic Restricted Stream</title>
      <link rel="stylesheet" href="https://unpkg.com/dplayer/dist/DPlayer.min.css" />
      <script src="https://unpkg.com/dplayer/dist/DPlayer.min.js"></script>
      <style>
        body { display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; margin:0; background:#000; color:#fff; }
        #player { width:90%; max-width:800px; height:450px; margin-top:20px; }
        input, button { font-size:16px; padding:8px; margin-top:10px; width:80%; max-width:800px; }
      </style>
    </head>
    <body>
      <h1>DPlayer Restricted M3U8</h1>
      <input id="url" type="text" placeholder="Enter restricted M3U8 URL here" />
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

// Proxy route for M3U8 playlist + TS segments
app.use('/proxy', createProxyMiddleware({
  target: 'http://example.com', // placeholder
  changeOrigin: true,
  selfHandleResponse: false,
  router: (req) => req.query.url, // dynamically forward to the M3U8 URL
  onProxyReq: (proxyReq) => {
    // headers to bypass CORS / restrictions
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    proxyReq.setHeader('Referer', 'https://example.com'); // optional, can be the stream domain
  }
}));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
