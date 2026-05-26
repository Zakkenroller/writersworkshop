# Deployment Guide — Longhand

Two services: **Railway** (backend + database) and **Netlify** (frontend).
Do Railway first — you need its URL before finishing the Netlify setup.

---

## Step 1 — Deploy the backend to Railway

### 1a. Create a Railway account
Go to [railway.app](https://railway.app) and sign up (free; GitHub login is easiest).

### 1b. Create a new project
- Click **New Project → Deploy from GitHub repo**
- Select your `writersworkshop` repository
- Railway will detect it automatically

### 1c. Set the root directory to `server`
In Railway, open your service → **Settings → Source → Root Directory** → type `server`.
This tells Railway to install and run from the `server/` folder.

### 1d. Add a persistent volume (keeps your database across deploys)
In Railway, open your service → **Volumes → Add Volume**
- Mount path: `/app/data`
- Then set one environment variable:
  - `DB_PATH` = `/app/data/workshop.db`

### 1e. Confirm Railway deploys successfully
Railway auto-deploys on every push. Once it's green, click **Copy URL** — it will look like
`https://writersworkshop-production-xxxx.up.railway.app`. Save this for Step 2.

---

## Step 2 — Deploy the frontend to Netlify

### 2a. Create a new Netlify site
- Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
- Connect your GitHub account and select `writersworkshop`
- Netlify will auto-detect the `netlify.toml` — build settings are already configured

### 2b. Add the Railway URL as an environment variable
In Netlify: **Site configuration → Environment variables → Add variable**

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-railway-url.up.railway.app` (no trailing slash) |

### 2c. Trigger a deploy
Go to **Deploys → Trigger deploy → Deploy site**. Netlify will build the React app using
your Railway URL. Once green, your Netlify URL (e.g. `https://longhand.netlify.app`) is live.

---

## Step 3 — Tell Railway where Netlify lives (CORS)

Back in Railway, add one more environment variable to your service:

| Key | Value |
|-----|-------|
| `CLIENT_ORIGIN` | `https://your-app.netlify.app` (your Netlify URL) |

Railway will redeploy automatically. After that, your Netlify frontend can talk to your
Railway backend and everything is connected.

---

## Updating the app later

Just push to your GitHub branch — both services auto-deploy on push. No manual steps needed.

## Local development (unchanged)

```bash
npm run dev   # runs both server (:3001) and client (:5173)
```

---

## Adding Google Docs (Phase 2 — do this later)

When you're ready:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project called "Longhand"
3. Enable: **Google Docs API** and **Google Drive API**
4. Create an **OAuth 2.0 Client ID** (type: Web Application)
5. Add your Netlify URL as an authorized redirect URI:
   `https://your-app.netlify.app/auth/callback`
6. Copy the **Client ID** and **Client Secret**
7. Add them to Railway as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
8. Then ask Claude Code to implement the Google OAuth + Docs integration
