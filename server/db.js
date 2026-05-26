const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// DB_PATH can be overridden by env var — useful when Railway mounts a persistent volume
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'workshop.db');
const SEED_PATH = path.join(__dirname, '..', 'prompt_library_seed.json');

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function initDb() {
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS prompts (
      id          TEXT PRIMARY KEY,
      craft_area  TEXT NOT NULL,
      text        TEXT NOT NULL,
      trains      TEXT NOT NULL,
      depth       TEXT NOT NULL,
      order_hint  INTEGER NOT NULL,
      lineage     TEXT,
      context     TEXT
    );

    CREATE TABLE IF NOT EXISTS entries (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      date            TEXT NOT NULL,
      prompt_id       TEXT NOT NULL,
      craft_area      TEXT NOT NULL,
      google_doc_id   TEXT,
      google_doc_url  TEXT,
      project_label   TEXT,
      word_count      INTEGER,
      completed       INTEGER DEFAULT 0,
      created_at      TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS rotation_state (
      id                  INTEGER PRIMARY KEY DEFAULT 1,
      current_area_index  INTEGER DEFAULT 0,
      last_date           TEXT,
      today_prompt_id     TEXT
    );

    CREATE TABLE IF NOT EXISTS used_prompts (
      prompt_id   TEXT NOT NULL,
      craft_area  TEXT NOT NULL,
      used_at     TEXT DEFAULT (datetime('now')),
      PRIMARY KEY (prompt_id)
    );
  `);

  const { cnt } = db.prepare('SELECT COUNT(*) as cnt FROM prompts').get();
  if (cnt === 0) {
    seedPrompts(db);
  }

  const state = db.prepare('SELECT id FROM rotation_state WHERE id = 1').get();
  if (!state) {
    db.prepare('INSERT INTO rotation_state (id, current_area_index, last_date) VALUES (1, 0, NULL)').run();
  }

  console.log('DB initialised at', DB_PATH);
}

function seedPrompts(db) {
  const data = JSON.parse(fs.readFileSync(SEED_PATH, 'utf-8'));
  const insert = db.prepare(`
    INSERT OR REPLACE INTO prompts (id, craft_area, text, trains, depth, order_hint, lineage, context)
    VALUES (@id, @craft_area, @text, @trains, @depth, @order_hint, @lineage, @context)
  `);
  const insertAll = db.transaction((prompts) => {
    for (const p of prompts) insert.run(p);
  });
  insertAll(data.prompts);
  console.log(`Seeded ${data.prompts.length} prompts`);
}

module.exports = { getDb, initDb };
