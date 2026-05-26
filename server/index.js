const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');
const promptsRouter = require('./routes/prompts');
const entriesRouter = require('./routes/entries');

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_ORIGIN,   // set to your Netlify URL in Railway env vars
].filter(Boolean)

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow server-to-server calls (no origin) and listed origins
      if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) cb(null, true)
      else cb(new Error(`CORS: origin ${origin} not allowed`))
    },
  })
);
app.use(express.json());

initDb();

app.use('/api/prompts', promptsRouter);
app.use('/api/entries', entriesRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`Longhand server running on http://localhost:${PORT}`);
});
