const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');
const promptsRouter = require('./routes/prompts');
const entriesRouter = require('./routes/entries');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

initDb();

app.use('/api/prompts', promptsRouter);
app.use('/api/entries', entriesRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`Longhand server running on http://localhost:${PORT}`);
});
