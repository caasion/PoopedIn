# PoopedIn

> LinkedIn, but for poop.

PoopedIn is a full-stack LinkedIn parody where professionals share photos of their bowel movements. The entire UI is designed to look and feel exactly like LinkedIn — the comedy comes entirely from the contrast between the sincere corporate presentation and the absurd content. Every button, notification, and system message is written as if by a LinkedIn product manager.

![PoopedIn Feed](public/uploads/seed-poop-1.svg)

---

## Features

### Core Social Features
- **Feed** — Chronological feed of posts (Poops) from users you follow (Sniff), with repoops mixed in
- **Reactions** — 5 LinkedIn-style reactions: 💩 Poop, 🎉 Celebrate, 🧠 Insightful, 🤔 Curious, ❤️ Love. Hover to pick, click to toggle
- **Comments** — Flat comment threads per post; top 2 shown inline, expandable
- **Repoops** — Repost any post; appears in the feed attributed to the repooper
- **Follow system** — Follow (Sniff) and unfollow (Unsniff) other users
- **Profiles** — Per-user profile page with stats, post grid, and Sniff/Unsniff button

### The LinkedIn Parody Layer
| LinkedIn term | PoopedIn term |
|--------------|---------------|
| Post | Poop |
| Followers | Sniffers |
| Following | Sniffing |
| Repost | Repoop |
| Post button | Drop a Poop |
| Profile tagline | Professional Summary |

### Streak & Gamification
- **Streaks** — A streak is a consecutive run of days with at least one post. Missing a day resets it to zero
- **Leaderboard** — All users ranked by current streak length with 🥇🥈🥉 medals
- **Constipated badge** 🚽 — Shown on profiles of users who haven't posted in 3+ days
- **Streak milestone cards** — Automatically generated feed cards when a user hits 3, 5, 7, 14, or 30 days (e.g. *"🔥 Tyler Brooks is on a 14-day poop streak! Consistency is the foundation of every great professional."*)
- **Constipation alerts** — Auto-generated feed cards for users in your network who haven't posted in 3+ days

### Upload & AI Verification
- **Image upload** — Required for every post; uploads saved to Cloudflare R2 (or local disk in dev)
- **AI poop detection** — Every upload is verified by the [Roboflow Bristol Stool Chart classifier](https://universe.roboflow.com/project-ap1yb/bristol-stool-slqqx/model/2) before the post is saved. Non-poop images are rejected with: *"No poop detected. This is PoopedIn, not LinkedIn."*
- **Bristol Stool type badge** — Verified posts show a `🔬 Type 4 · Smooth sausage · 94% confidence · Verified Professional Content ✓` badge

### UI/UX
- **Safe Mode** 🙈 — Blurs all poop images (default ON). Persisted in localStorage. Hover any image to peek
- **User Switcher** — No real auth. A navbar dropdown lets you switch between 6 seed users. Persisted in localStorage
- **3-column layout** — Left sidebar (profile card, nav, suggestions), main feed, right sidebar (leaderboard preview, trending)
- **LinkedIn color palette** — `#0A66C2` blue throughout, white cards, `#f3f2ef` background

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 14](https://nextjs.org) (App Router) |
| Language | TypeScript |
| Database | SQLite via [Prisma ORM](https://prisma.io) |
| Styling | [Tailwind CSS v3](https://tailwindcss.com) |
| Image storage | Local filesystem (dev) / [Cloudflare R2](https://developers.cloudflare.com/r2/) (prod) |
| AI detection | [Roboflow](https://roboflow.com) Bristol Stool Chart model |
| Avatars | [DiceBear Avataaars](https://dicebear.com) |
| Deployment | [Railway](https://railway.app) |

---

## Project Structure

```
PoopedIn/
├── prisma/
│   ├── schema.prisma        # Database schema (6 models)
│   └── seed.ts              # Seed script — 6 users, 35 posts, reactions, comments, follows
│
├── public/
│   └── uploads/             # Local dev image storage (SVG placeholders for seed data)
│
├── scripts/
│   └── start.js             # Production startup script (migrate → seed if empty → start)
│
├── src/
│   ├── app/                 # Next.js App Router pages and API routes
│   │   ├── page.tsx                     # Feed (home page)
│   │   ├── leaderboard/page.tsx         # Full streak leaderboard
│   │   ├── profile/[userId]/page.tsx    # User profile
│   │   └── api/
│   │       ├── users/route.ts           # GET all users
│   │       ├── feed/route.ts            # GET composed feed (posts + repoops + system posts)
│   │       ├── posts/route.ts           # POST create post (with AI verification)
│   │       ├── reactions/route.ts       # POST toggle reaction
│   │       ├── comments/route.ts        # POST add comment
│   │       ├── comments/[postId]/route.ts # GET comments for a post
│   │       ├── follows/route.ts         # POST follow/unfollow toggle
│   │       ├── follows/check/route.ts   # GET check if following
│   │       ├── repoops/route.ts         # POST repoop/un-repoop toggle
│   │       ├── leaderboard/route.ts     # GET streak leaderboard
│   │       └── profile/[userId]/route.ts # GET user profile with stats
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx         # 3-column grid wrapper
│   │   │   ├── Navbar.tsx           # Top nav: logo, Safe Mode toggle, user switcher
│   │   │   ├── LeftSidebar.tsx      # Mini profile, navigation, "People to sniff"
│   │   │   └── RightSidebar.tsx     # Leaderboard preview, trending post
│   │   ├── feed/
│   │   │   ├── FeedList.tsx         # Fetches and renders the feed; owns CreatePostModal
│   │   │   └── SystemPostCard.tsx   # Streak milestone and constipation alert cards
│   │   ├── post/
│   │   │   ├── PostCard.tsx         # Full post card with image, reactions, comments
│   │   │   ├── ReactionsBar.tsx     # Hover picker + action buttons (React/Comment/Repoop)
│   │   │   └── CommentSection.tsx   # Inline comments with expand/collapse
│   │   ├── modals/
│   │   │   └── CreatePostModal.tsx  # Image upload + caption form
│   │   ├── profile/
│   │   │   ├── ProfileHeader.tsx    # Avatar, stats, Sniff button, Constipated badge
│   │   │   └── PostGrid.tsx         # Responsive 3-column image grid
│   │   └── shared/
│   │       └── UserSwitcher.tsx     # User dropdown in navbar
│   │
│   ├── context/
│   │   └── UserContext.tsx          # React context: current user + Safe Mode state
│   │
│   ├── lib/
│   │   ├── prisma.ts                # Prisma client singleton (dev hot-reload safe)
│   │   ├── streak.ts                # Streak calculation logic (pure function)
│   │   ├── systemPosts.ts           # Generates streak milestone + constipation posts
│   │   ├── poopDetector.ts          # Roboflow API client for Bristol Stool detection
│   │   ├── upload.ts                # Image upload (local disk in dev, R2 in prod)
│   │   └── timeago.ts               # "2h", "3d" relative time formatting
│   │
│   └── types/
│       └── index.ts                 # Shared TypeScript interfaces and constants
│
├── .env.example             # Template for all required environment variables
├── railway.json             # Railway deployment config (start command, healthcheck)
└── DEPLOYMENT.md            # Step-by-step Cloudflare R2 + Railway setup guide
```

---

## Database Schema

```prisma
User       id, name, avatarUrl, bio, title, createdAt
Post       id, userId, imageUrl, caption, bristolType?, confidence?, createdAt
Reaction   id, postId, userId, type (POOP|CELEBRATE|INSIGHTFUL|CURIOUS|LOVE)
Comment    id, postId, userId, content, createdAt
Follows    id, followerId, followingId          ── unique(followerId, followingId)
Repoop     id, postId, userId, createdAt        ── unique(postId, userId)
```

Key constraints:
- One reaction per user per post (switching type updates in place, clicking same type removes it)
- One repoop per user per post
- One follow relationship per pair
- `bristolType` and `confidence` are nullable — seed posts and any posts where AI was skipped show no badge

---

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/users` | All users (for the user switcher) |
| `GET` | `/api/feed?userId=X` | Composed feed for user X — posts + repoops + system posts, sorted by date |
| `POST` | `/api/posts` | Create a post. Runs AI poop detection first; returns `422` if no poop detected |
| `POST` | `/api/reactions` | Toggle reaction. Body: `{ postId, userId, type }` |
| `POST` | `/api/comments` | Add a comment |
| `GET` | `/api/comments/[postId]` | All comments for a post |
| `POST` | `/api/follows` | Toggle follow. Body: `{ followerId, followingId }` |
| `GET` | `/api/follows/check?followerId=X&followingId=Y` | Check if X follows Y |
| `POST` | `/api/repoops` | Toggle repoop. Body: `{ postId, userId }` |
| `GET` | `/api/leaderboard` | All users sorted by current streak descending |
| `GET` | `/api/profile/[userId]` | Profile data including streak, post grid, follower counts |

### Feed composition (`GET /api/feed`)

The feed merges three sources and sorts them by `createdAt` descending:

1. **Posts** from the current user's network (followed users + self)
2. **Repoops** from the network (the repoop's timestamp, not the original post's)
3. **System posts** — generated dynamically from all users' post histories:
   - Streak milestone cards for anyone whose current streak is 3, 5, 7, 14, or 30 days
   - Constipation alerts for network members who haven't posted in 3+ days

---

## Streak Logic

Defined in `src/lib/streak.ts`. The function takes an array of post dates and today's date and returns `{ currentStreak, isConstipated, lastPostDate, daysSinceLast }`.

**Rules:**
- Dates are normalized to midnight UTC before comparison (multiple posts in a day = 1 streak day)
- A streak is only "active" if the most recent post was **today or yesterday** — gaps reset to 0
- `isConstipated` is true when `daysSinceLast >= 3`

```
Example — today is March 28:
Posts on: Mar 22, 23, 24, 25, 26, 27, 28 → streak = 7 ✅
Posts on: Mar 22, 23, 24, 25, 26, 27     → streak = 6 ✅ (posted yesterday)
Posts on: Mar 22, 23, 24, 25             → streak = 0 ❌ (gap > 1 day)
No posts in 4 days                       → streak = 0, constipated = true 🚽
```

---

## Seed Data

Running `npm run db:seed` populates the database with 6 users designed to demonstrate every feature:

| User | Title | Streak | Notes |
|------|-------|--------|-------|
| Tyler Brooks | Poop Products Manager | 🔥 14 days | #1 on leaderboard; triggers 14-day milestone card |
| David Chen | Senior Defecation Analyst | 🔥 7 days | Triggers 7-day milestone card |
| Sarah Mitchell | VP of Bowel Operations | 🔥 5 days | Triggers 5-day milestone card |
| Jennifer Park | Director of Waste Management | 🔥 3 days | Triggers 3-day milestone card |
| Amanda Foster | Head of Elimination Strategy | 🔥 2 days | Active, no milestone yet |
| Marcus Webb | Chief Excrement Officer | 🚽 Constipated | Last post 4 days ago; triggers constipation alert |

The seed also creates ~80 reactions, ~20 comments, and a follow graph so every user has a populated feed.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone <repo-url>
cd PoopedIn
npm install
```

### Environment setup

```bash
cp .env.example .env
```

Edit `.env` and fill in at minimum:

```env
DATABASE_URL="file:./dev.db"
ROBOFLOW_API_KEY=your_key_here   # Get from app.roboflow.com → Settings → API
```

For local development, R2 variables are not needed — but the upload will fail without them. If you want to test uploads locally, either add R2 credentials or temporarily swap `upload.ts` back to the local filesystem version (see the `master` branch history).

### Database setup

```bash
npx prisma db push    # Create the SQLite database
npm run db:seed       # Populate with the 6 seed users and demo data
```

### Run

```bash
npm run dev           # Starts at http://localhost:3000
```

### Useful scripts

```bash
npm run db:reset      # Wipe and re-seed the database
npm run db:studio     # Open Prisma Studio (visual DB browser)
npx prisma db push    # Apply schema changes without re-seeding
```

---

## Authentication

There is no real authentication. The app uses a **user switcher** — a dropdown in the navbar lets you choose which of the 6 users you're "logged in" as. The selection is stored in `localStorage` and read by `UserContext` on mount. All API routes accept a `userId` in the request body or query string and trust it without verification.

This is intentional for a demo/parody app. Adding real auth (e.g. NextAuth) would require:
1. Replacing the user switcher with a login flow
2. Reading `session.user.id` in API routes instead of trusting the request body

---

## Key Patterns

### Prisma singleton (`src/lib/prisma.ts`)
Next.js hot-reloading in development creates multiple module instances. Without the singleton pattern, each reload would open a new database connection, eventually exhausting the SQLite connection limit. The global singleton pattern (`globalThis.prisma`) prevents this.

### Client/server split
All pages are thin server components that render a single `'use client'` component which owns data fetching via `fetch()`. This keeps the shell (Navbar, sidebars) server-rendered while interactive parts (feed, reactions, comments) run entirely on the client.

### Optimistic updates
`ReactionsBar` updates local state immediately when a reaction is clicked, fires the API in the background, and reverts on error. This makes the UI feel instant.

### System posts
System posts are not stored in the database — they are generated fresh on every `/api/feed` request by computing streaks from post history. Each system post has a deterministic ID (`system-streak-${userId}-${streak}`) so React can use it as a stable key without duplication.

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full guide. The `deployment` branch contains all production-specific changes (R2 image uploads, Railway startup script).

**Branch strategy:**
- `master` — local development (images saved to `/public/uploads`, SQLite at `./prisma/dev.db`)
- `deployment` — production (images to Cloudflare R2, SQLite on Railway volume at `/data/dev.db`)
