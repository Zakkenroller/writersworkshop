# Longhand — Morning Craft Prompt App

A quiet, daily writing tool that delivers one curated craft exercise each morning and gives you a frictionless place to record the session. **Zero AI in the creative loop** — prompts are human-authored, and no model ever reads your words.

## Phase 1 MVP (current)

- Daily prompt served by deterministic craft-area rotation (Character → Sensory → Dialogue → Theme, cycling)
- Swap to a different prompt (same area or any area)
- Hard-morning mode — an extra-gentle quick exercise with explicit permission to stop
- Manual session capture: paste your Google Doc link + optional project label
- History view with craft-area filtering
- Fully responsive (mobile + desktop)
- Zero AI at runtime

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node + Express |
| DB | SQLite via better-sqlite3 |
| Fonts | Lora (serif) + Inter (sans) via Google Fonts |

## Quick start

```bash
# 1. Install all dependencies
npm install
npm install --prefix server
npm install --prefix client

# 2. Run both server + client in watch mode
npm run dev

# Server: http://localhost:3001
# Client: http://localhost:5173
```

The SQLite database is created automatically at `data/workshop.db` on first run, seeded from `prompt_library_seed.json`.

## Project structure

```
writersworkshop/
├── prompt_library_seed.json   # 48 human-authored prompts (edit freely)
├── server/
│   ├── index.js               # Express entry point
│   ├── db.js                  # SQLite init + seeding
│   └── routes/
│       ├── prompts.js         # /api/prompts/* (today, swap, quick)
│       └── entries.js         # /api/entries/* (CRUD)
├── client/
│   └── src/
│       ├── App.jsx            # Shell + nav
│       ├── api.js             # fetch helpers
│       └── components/
│           ├── TodayView.jsx       # Main daily screen
│           ├── PromptCard.jsx      # Prompt display
│           ├── HardMorningMode.jsx # Quick on-ramp
│           ├── EntryCapture.jsx    # Doc link + label form
│           ├── HistoryView.jsx     # Past sessions
│           └── CraftBadge.jsx      # Area + depth badges
└── data/
    └── workshop.db            # SQLite (git-ignored)
```

## Adding prompts

Edit `prompt_library_seed.json` and delete `data/workshop.db` — the DB will re-seed on next start. Or use `INSERT` directly in SQLite.

## Roadmap (from PRD)

- **Phase 2:** Google OAuth + auto-create/seed the daily Google Doc
- **Phase 3:** Hard-morning mode polish, project labels, in-app search/filter
- **Phase 4 (optional):** Drive folder placement, word-count sync, library editor UI
