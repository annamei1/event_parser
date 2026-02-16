const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files (index.html)

// Fetch a URL server-side (avoids CORS) and return its text content
app.post('/api/fetch-url', async (req, res) => {
  const { url } = req.body;
  if (!url || !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; EventParser/1.0)' },
      redirect: 'follow',
    });
    if (!response.ok) {
      return res.status(502).json({ error: `Fetch failed: ${response.status} ${response.statusText}` });
    }
    const html = await response.text();
    // Strip tags, collapse whitespace
    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    res.json({ text });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// Stub endpoint — Gemini disabled for UI development
// When re-enabling, add "host" to the return format:
// [{"title":"...","date":"YYYY-MM-DD","time":"HH:MM or null","location":"... or null","host":"... or null","description":"...","url":"... or null"}]
app.post('/api/extract-events', (req, res) => {
  // Return a realistic fake event so the UI has something to display
  res.json({
    candidates: [{
      content: {
        parts: [{
          text: JSON.stringify([
            {
              title: "Sample Talk: AI in Robotics",
              date: "2026-03-15",
              time: "16:00",
              location: "Virtual",
              host: "Rora Robotics",
              description: "A sample event returned by the stub while the API is disabled.",
              url: "https://example.com/event",
              sourceEmailIndex: 1
            }
          ])
        }]
      }
    }]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
