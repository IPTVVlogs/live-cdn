const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Root route serves JW Player page
app.get('/', (req, res) => {
  const streamUrl = req.query.url || ''; // optional: pass ?url= link
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>JW M3U8 Player</title>
      <script src="https://cdn.jwplayer.com/libraries/IDzF9Zmk.js"></script>
      <style>
        body { display: flex; justify-content: center; align-items: center; height: 100vh; background: #000; margin: 0; }
        #player { width: 90%; max-width: 800px; height: 450px; }
        input, button { margin-top: 10px; font-size: 16px; }
      </style>
    </head>
    <body>
      <div>
        <input id="url" type="text" placeholder="Enter M3U8 URL" style="width: 80%;" />
        <button onclick="playStream()">Play</button>
      </div>
      <div id="player"></div>

      <script>
        function playStream() {
          const url = document.getElementById('url').value.trim();
          if(!url) return alert('Enter M3U8 URL');
          jwplayer("player").setup({
            file: url,
            width: "100%",
            height: "100%",
            autostart: true
          });
        }

        // If ?url= is passed in query string, play automatically
        const params = new URLSearchParams(window.location.search);
        if(params.get('url')) {
          document.getElementById('url').value = params.get('url');
          playStream();
        }
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
