const express = require('express');
const cors = require('cors');
const chrono = require('chrono-node');
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

// Gemini API proxy — keeps the API key server-side
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const EXTRACT_PROMPT = `Extract ALL events from the text below. A single email may contain multiple events (e.g. a newsletter listing several upcoming talks, a digest with multiple dates). List every one as a separate object.
Return a JSON array (no markdown fences). Each object must have these exact fields:
- "title": event name (string)
- "date": date in YYYY-MM-DD format (string or null)
- "time": time in HH:MM 24-hour format, e.g. "14:00" not "2:00 PM" (string or null)
- "location": venue or URL (string or null)
- "host": organiser name (string or null)
- "description": 1-2 sentence summary (string or null)
- "url": registration or event link (string or null)
- "sourceEmailIndex": which email number this came from (integer, 1-based)
If no events are found, return an empty array [].`;

// Use chrono-node to strip out emails/text that only reference past dates.
// For batched emails (split by === EMAIL N: ... === markers), each email is
// checked individually. For plain text, the whole block is checked.
// Returns the filtered text, or null if nothing remains.
function filterPastContent(text) {
  const now = new Date();
  const emailMarker = /=== EMAIL \d+:.*?===/g;
  const markers = [...text.matchAll(emailMarker)];

  if (markers.length === 0) {
    // Single (non-batch) text
    const dates = chrono.parse(text);
    if (dates.length > 0 && dates.every(d => d.start.date() < now)) {
      return null;
    }
    return text;
  }

  // Batch text — filter each email section independently
  const kept = [];
  for (let i = 0; i < markers.length; i++) {
    const start = markers[i].index;
    const end = i + 1 < markers.length ? markers[i + 1].index : text.length;
    const section = text.substring(start, end).trim();

    const dates = chrono.parse(section);
    // Keep if no dates found (let Gemini try) or at least one future date
    if (dates.length === 0 || dates.some(d => d.start.date() >= now)) {
      kept.push(section);
    }
  }

  return kept.length > 0 ? kept.join('\n\n') : null;
}

app.post('/api/extract-events', async (req, res) => {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_api_key_here') {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server' });
  }

  const { emailText } = req.body;
  if (!emailText) {
    return res.status(400).json({ error: 'No emailText provided' });
  }

  // Filter out content that only mentions past dates
  const filteredText = filterPastContent(emailText);
  if (!filteredText) {
    // Nothing with future dates — return empty result without calling Gemini
    return res.json({
      candidates: [{ content: { parts: [{ text: '[]' }] } }]
    });
  }

  try {
    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${EXTRACT_PROMPT}\n\n${filteredText}` }]
        }]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err?.error?.message || response.statusText;
      return res.status(response.status).json({ error: `Gemini API error: ${msg}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({ error: `Failed to reach Gemini API: ${err.message}` });
  }
});

app.listen(PORT, () => {});
