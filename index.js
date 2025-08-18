import express from 'express';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static HTML
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

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
