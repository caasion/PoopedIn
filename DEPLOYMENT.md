# Deploying PoopedIn

Two things to set up before deploying: **Cloudflare R2** (image storage) and **Railway** (app hosting). Takes about 20 minutes.

---

## Part 1 — Cloudflare R2 (image storage)

### 1. Create a Cloudflare account
Go to [cloudflare.com](https://cloudflare.com) and sign up (free).

### 2. Create an R2 bucket
1. In the Cloudflare dashboard, click **R2** in the left sidebar
2. Click **Create bucket**
3. Name it `poopedin-uploads`, leave region as default → **Create bucket**

### 3. Enable public access
1. Open your new bucket → **Settings** tab
2. Under **Public access**, click **Allow Access**
3. Copy the **Public bucket URL** — it looks like:
   `https://pub-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.r2.dev`
   → This is your `R2_PUBLIC_URL`

### 4. Create an API token
1. Go to **R2** → **Manage R2 API Tokens** → **Create API Token**
2. Token name: `poopedin`
3. Permissions: **Object Read & Write**
4. Scope: **Specific bucket** → select `poopedin-uploads`
5. Click **Create API Token**
6. Copy the **Access Key ID** and **Secret Access Key** — you won't see them again

### 5. Find your Account ID
In the Cloudflare dashboard right sidebar, copy your **Account ID**.

You now have all 5 R2 values:
| Variable | Where to find it |
|----------|-----------------|
| `R2_ACCOUNT_ID` | Cloudflare dashboard right sidebar |
| `R2_ACCESS_KEY_ID` | API token page |
| `R2_SECRET_ACCESS_KEY` | API token page |
| `R2_BUCKET_NAME` | `poopedin-uploads` |
| `R2_PUBLIC_URL` | Bucket → Settings → Public Access |

---

## Part 2 — Railway (app hosting)

### 1. Push your code to GitHub
```bash
# On GitHub, create a new repo called "poopedin" (leave it empty)
git remote add origin https://github.com/YOUR_USERNAME/poopedin.git
git push -u origin master
git push origin deployment
```

### 2. Create a Railway account
Go to [railway.app](https://railway.app) and sign up with GitHub (free tier available).

### 3. Create a new project
1. Click **New Project** → **Deploy from GitHub repo**
2. Select your `poopedin` repo
3. Railway will detect it as a Next.js app — click **Deploy Now**
4. Go to **Settings** → **Environment** → change the **Branch** to `deployment`

### 4. Add a persistent volume (for SQLite)
1. In your Railway project, click **+ New** → **Volume**
2. Mount path: `/data`
3. Click **Add**
4. Railway will restart your deployment with the volume attached

### 5. Set environment variables
In your Railway project → **Variables** tab, add all of these:

```
DATABASE_URL=file:/data/dev.db
ROBOFLOW_API_KEY=<your roboflow key>
R2_ACCOUNT_ID=<from cloudflare>
R2_ACCESS_KEY_ID=<from cloudflare>
R2_SECRET_ACCESS_KEY=<from cloudflare>
R2_BUCKET_NAME=poopedin-uploads
R2_PUBLIC_URL=<your r2 public url>
```

### 6. Deploy
Railway will automatically redeploy when you save the variables. Watch the **Deploy Logs** tab — you should see:
```
🔄 Syncing database schema...
🌱 Empty database — seeding for the first time...
🚀 Starting PoopedIn...
```

### 7. Get your public URL
In Railway, click **Settings** → **Networking** → **Generate Domain**.
Your app is live at `https://poopedin-xxxx.up.railway.app` 🎉

---

## Updating the app

Push to the `deployment` branch and Railway auto-deploys:
```bash
git checkout deployment
# make changes
git push origin deployment
```

---

## Local development

Local dev still uses local SQLite + local file storage. The `.env` file (not committed) controls which mode you're in. Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
# Fill in ROBOFLOW_API_KEY at minimum; leave R2_* empty for local dev
```

> **Note:** In local dev, uploaded images are saved to `/public/uploads/`. When R2 env vars are missing, the upload will fail with a clear error. You can temporarily revert `upload.ts` to the local version for local testing if needed.
