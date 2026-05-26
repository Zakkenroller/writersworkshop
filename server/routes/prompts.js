const express = require('express');
const router = express.Router();
const { getDb } = require('../db');

const CRAFT_AREAS = ['character', 'sensory', 'dialogue', 'theme'];

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Pick the next unused prompt in the given area (by order_hint).
 * Resets the used pool if exhausted.
 */
function pickNextPrompt(db, area) {
  const allInArea = db
    .prepare('SELECT * FROM prompts WHERE craft_area = ? ORDER BY order_hint ASC')
    .all(area);

  const usedIds = db
    .prepare('SELECT prompt_id FROM used_prompts WHERE craft_area = ?')
    .all(area)
    .map((r) => r.prompt_id);

  let pool = allInArea.filter((p) => !usedIds.includes(p.id));

  if (pool.length === 0) {
    // Pool exhausted — reset and start over
    db.prepare('DELETE FROM used_prompts WHERE craft_area = ?').run(area);
    pool = allInArea;
  }

  return pool[0];
}

// GET /api/prompts/today
router.get('/today', (req, res) => {
  try {
    const db = getDb();
    const today = todayStr();
    const state = db.prepare('SELECT * FROM rotation_state WHERE id = 1').get();

    if (state.last_date === today && state.today_prompt_id) {
      const prompt = db.prepare('SELECT * FROM prompts WHERE id = ?').get(state.today_prompt_id);
      return res.json({ prompt, area_index: state.current_area_index });
    }

    // New day — advance craft area
    let areaIndex = state.current_area_index;
    if (state.last_date && state.last_date !== today) {
      areaIndex = (areaIndex + 1) % CRAFT_AREAS.length;
    }

    const prompt = pickNextPrompt(db, CRAFT_AREAS[areaIndex]);

    db.prepare(
      'INSERT OR REPLACE INTO used_prompts (prompt_id, craft_area) VALUES (?, ?)'
    ).run(prompt.id, prompt.craft_area);

    db.prepare(`
      UPDATE rotation_state
      SET current_area_index = ?, last_date = ?, today_prompt_id = ?
      WHERE id = 1
    `).run(areaIndex, today, prompt.id);

    res.json({ prompt, area_index: areaIndex });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/prompts/swap?exclude=<id>&area=<area>&mode=any
router.get('/swap', (req, res) => {
  try {
    const db = getDb();
    const { exclude, area, mode } = req.query;

    let prompt;
    if (mode === 'any') {
      prompt = db
        .prepare('SELECT * FROM prompts WHERE id != ? ORDER BY RANDOM() LIMIT 1')
        .get(exclude || '');
    } else {
      prompt = db
        .prepare(
          'SELECT * FROM prompts WHERE craft_area = ? AND id != ? ORDER BY RANDOM() LIMIT 1'
        )
        .get(area, exclude || '');
    }

    res.json({ prompt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/prompts/quick  — hard-morning mode
router.get('/quick', (req, res) => {
  try {
    const db = getDb();
    const prompt = db
      .prepare("SELECT * FROM prompts WHERE depth = 'quick' ORDER BY RANDOM() LIMIT 1")
      .get();
    res.json({ prompt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/prompts
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { area } = req.query;
    const prompts = area
      ? db.prepare('SELECT * FROM prompts WHERE craft_area = ? ORDER BY order_hint').all(area)
      : db.prepare('SELECT * FROM prompts ORDER BY craft_area, order_hint').all();
    res.json({ prompts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
