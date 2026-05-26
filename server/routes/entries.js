const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

// POST /api/entries
router.post('/', (req, res) => {
  try {
    const db = getDb();
    const { date, prompt_id, craft_area, google_doc_url, project_label, word_count, completed } =
      req.body;

    if (!date || !prompt_id || !craft_area) {
      return res.status(400).json({ error: 'date, prompt_id, and craft_area are required' });
    }

    const existing = db
      .prepare('SELECT id FROM entries WHERE date = ? AND prompt_id = ?')
      .get(date, prompt_id);

    if (existing) {
      db.prepare(`
        UPDATE entries SET
          google_doc_url  = COALESCE(?, google_doc_url),
          project_label   = COALESCE(?, project_label),
          word_count      = COALESCE(?, word_count),
          completed       = COALESCE(?, completed)
        WHERE id = ?
      `).run(
        google_doc_url ?? null,
        project_label ?? null,
        word_count ?? null,
        completed != null ? (completed ? 1 : 0) : null,
        existing.id
      );

      const entry = db.prepare('SELECT * FROM entries WHERE id = ?').get(existing.id);
      return res.json({ entry });
    }

    const result = db
      .prepare(`
        INSERT INTO entries (date, prompt_id, craft_area, google_doc_url, project_label, word_count, completed)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        date,
        prompt_id,
        craft_area,
        google_doc_url ?? null,
        project_label ?? null,
        word_count ?? null,
        completed ? 1 : 0
      );

    const entry = db.prepare('SELECT * FROM entries WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/entries/today
router.get('/today', (req, res) => {
  try {
    const db = getDb();
    const today = new Date().toISOString().split('T')[0];
    const entry = db
      .prepare(`
        SELECT e.*, p.text as prompt_text, p.trains as prompt_trains, p.depth as prompt_depth
        FROM entries e
        JOIN prompts p ON e.prompt_id = p.id
        WHERE e.date = ?
        ORDER BY e.created_at DESC
        LIMIT 1
      `)
      .get(today);
    res.json({ entry: entry ?? null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/entries?area=character&limit=50
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { area, limit = 50 } = req.query;

    let sql = `
      SELECT e.*, p.text as prompt_text, p.trains as prompt_trains, p.depth as prompt_depth
      FROM entries e
      JOIN prompts p ON e.prompt_id = p.id
      WHERE 1=1
    `;
    const params = [];

    if (area) {
      sql += ' AND e.craft_area = ?';
      params.push(area);
    }

    sql += ' ORDER BY e.date DESC LIMIT ?';
    params.push(parseInt(limit, 10));

    const entries = db.prepare(sql).all(...params);
    res.json({ entries });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/entries/:id
router.patch('/:id', (req, res) => {
  try {
    const db = getDb();
    const { google_doc_url, project_label, word_count, completed } = req.body;

    db.prepare(`
      UPDATE entries SET
        google_doc_url  = COALESCE(?, google_doc_url),
        project_label   = COALESCE(?, project_label),
        word_count      = COALESCE(?, word_count),
        completed       = COALESCE(?, completed)
      WHERE id = ?
    `).run(
      google_doc_url ?? null,
      project_label ?? null,
      word_count ?? null,
      completed != null ? (completed ? 1 : 0) : null,
      req.params.id
    );

    const entry = db.prepare('SELECT * FROM entries WHERE id = ?').get(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json({ entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
