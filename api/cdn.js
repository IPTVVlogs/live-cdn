import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const path = req.url.replace("/api/cdn", "");
    const targetUrl = "https://5nhp186eg31fofnc.chinese-restaurant-api.site" + path;

    const response = await fetch(targetUrl, {
      headers: {
        "Referer": "https://5nhp186eg31fofnc.chinese-restaurant-api.site",
        "User-Agent": req.headers["user-agent"] || "Mozilla/5.0"
      }
    });

    res.setHeader("Content-Type", response.headers.get("content-type"));
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send("Proxy Error: " + err.message);
  }
}
