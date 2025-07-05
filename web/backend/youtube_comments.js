const express = require('express');
const onnx = require('onnxruntime-node');
const path = require('path');
const cookieParser = require('cookie-parser');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()
const app = express();
app.use(express.json());

const COOKIE_SECRET = "YOUR SECRET KEY GOES HERE"; //DONT FORGET UR SECRET KEY <-----
app.use(cookieParser(COOKIE_SECRET));
app.use((req, res, next) => {
  let sessionId = req.signedCookies.session_id;

  if (!sessionId || !sessions[sessionId]) {
    sessionId = uuidv4();
    sessions[sessionId] = { requests: 1 };

    // 🧠 Signed cookie: the signature helps detect tampering
    res.cookie('session_id', sessionId, { httpOnly: true, signed: true });

    console.log(`🔐 New signed session: ${sessionId}`);
  } else {
    sessions[sessionId].requests += 1;
    console.log(`📈 Signed session ${sessionId} - Request #${sessions[sessionId].requests}`);
  }

  req.sessionData = sessions[sessionId];
  next();
});

const modelPath = path.join(__dirname, '../../python/models/youtube_sentiment_logistic.onnx');
let session;

// In-memory store
const sessions = {};

onnx.InferenceSession.create(modelPath).then((s) => {
  session = s;

app.post('/predict', async (req, res) => {
  console.log("🛬 /predict hit from session:", req.signedCookies.session_id);
  try {
    const { comments } = req.body;
    if (!Array.isArray(comments) || comments.length === 0) {
      return res.status(400).json({ error: 'Array of comments is required' });
    }

    // 🔒 Rate limit per batch
    if (req.sessionData.requests >= 20) {
      return res.status(429).json({ error: 'Request limit reached (10 maximum).' });
    }

    // Mark this batch as 1 request
    req.sessionData.requests++;

    const predictions = [];

    for (const comment of comments) {
      const input = new onnx.Tensor('string', [comment], [1, 1]);
      const feeds = { string_input: input };
      const results = await session.run(feeds);
      const rawData = results[session.outputNames[0]].data;
      const predictionNum = Array.from(rawData).map(v => (typeof v === 'bigint' ? Number(v) : v))[0];

      let sentiment;
      if (predictionNum == 2) sentiment = 'positive';
      else if (predictionNum == 1) sentiment = 'neutral';
      else if (predictionNum == 0) sentiment = 'negative';
      else sentiment = 'unknown';

      predictions.push({ comment, sentiment });
    }

    res.json({ predictions, requests: req.sessionData.requests });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
}).catch(err => {
  console.error('Failed to load model:', err);
});
