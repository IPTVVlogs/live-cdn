const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
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
      <title>DPlayer Auto-Play Restricted Stream</title>
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

// Proxy route for M3U8 playlist + TS segments
app.use('/proxy', createProxyMiddleware({
  target: 'http://example.com', // placeholder
  changeOrigin: true,
  selfHandleResponse: false,
  router: (req) => req.query.url, // forward to the restricted URL
  onProxyReq: (proxyReq) => {
    // headers to bypass basic restrictions
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
    proxyReq.setHeader('Referer', 'https://example.com'); // optional, can match stream domain
  }
}));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
