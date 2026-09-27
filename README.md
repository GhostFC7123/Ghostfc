# GHOST FC — Official Football Club Website & Management Portal

> **"BORN TO DOMINATE."**  
> Official modern, cinematic, high-performance football club portal and administrative management system for GHOST FC.

---

## 🏆 Project Overview

**GHOST FC** is a full-featured, dark-themed football club platform engineered with:
- **Public Club Portal**:
  - **Cinematic Hero**: Official GHOST FC crest, aggressive athletic typography, floodlight atmosphere, and quick actions.
  - **Match Center**: Next match countdown banner, completed results, and full fixtures schedule.
  - **First Team Squad Directory**: Position categorization (Goalkeepers, Defenders, Midfielders, Forwards), instant search by player name or kit number.
  - **Individual Player Dossiers**: Complete statistics, 6-attribute performance matrix (Pace, Shooting, Passing, Dribbling, Defending, Physical), playing style analysis, verified socials, and official YouTube highlight reels.
  - **Tactical Pitch Visualizer**: Interactive football pitch supporting formations (**4-3-3**, **4-4-2**, **4-2-3-1**, **3-5-2**, **3-4-3**) and matchday substitutes bench.
  - **Club Leadership**: Dedicated Team Captain & Vice Captain spotlights.
  - **Club Newsroom**: Published press releases, match reports, and tactical dissections.
  - **About GHOST FC**: Official history, crest anatomy breakdown, color livery, and The Crypt Arena fortress.
- **Protected Admin Portal (`/admin`)**:
  - Secure authentication via **Supabase Auth** with authorized administrator email controls (`khaledarahman93@gmail.com` and `admin@ghostfc.com`).
  - **Player Management**: Add, edit, delete, activate/deactivate players, edit 0-100 skill ratings, and manage social media links.
  - **Video Archive**: Attach, edit, and delete YouTube highlight clips with instant embed validation.
  - **Captain & Vice Captain**: Select and update on-pitch leaders with mutual exclusivity.
  - **Tactical Lineup & Bench**: Change formations, assign players to pitch slots with duplicate prevention, and configure bench reserves.
  - **Match Management**: Schedule fixtures, record full-time scores, and update competition status.
  - **Newsroom CMS**: Compose, edit, and publish/unpublish articles.
  - **Team Settings**: Update club metadata, stadium name, and live Supabase synchronization.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS v4, Custom sports typography (`Barlow Condensed`, `Teko`, `Inter`)
- **Routing**: React Router DOM (v7) with Netlify SPA redirects
- **Database & Auth**: Supabase PostgreSQL client (`@supabase/supabase-js`) with complete SQL Schema & Row Level Security (RLS) policies
- **Icons**: Lucide React
- **Hosting**: Netlify & GitHub Ready

---

## 📁 Project Architecture

```text
├── index.html                   # HTML entry point with fonts, OpenGraph, favicon
├── metadata.json                # Project branding metadata
├── supabase-schema.sql          # Supabase PostgreSQL DDL, indexes, and RLS policies
├── public/
│   ├── _redirects               # Netlify SPA redirect rules (/* /index.html 200)
│   ├── ghost-fc-logo.jpg        # Official GHOST FC team crest
│   └── ...                      # Static imagery & icons
├── src/
│   ├── assets/images/           # High-resolution generated sports assets
│   ├── components/
│   │   ├── common/              # GhostLogo, YouTubeEmbed, LoadingState, EmptyState
│   │   ├── layout/              # Navbar, Footer
│   │   ├── players/             # PlayerCard, PlayerSkillBars
│   │   ├── matches/             # MatchCard
│   │   ├── pitch/               # LineupPitch, SubstituteBench
│   │   ├── captain/             # CaptainSection
│   │   ├── news/                # NewsCard
│   │   └── admin/               # AdminLayout
│   ├── contexts/
│   │   └── AuthContext.tsx      # Supabase Auth provider & admin authorization
│   ├── lib/
│   │   └── supabase.ts          # Supabase client initializer & config checks
│   ├── pages/
│   │   ├── HomePage.tsx         # Complete cinematic homepage
│   │   ├── SquadPage.tsx        # Squad directory with search & filters
│   │   ├── PlayerProfilePage.tsx# Player profile with skills & video clips
│   │   ├── MatchesPage.tsx      # Match schedule & results
│   │   ├── NewsPage.tsx         # Club newsroom
│   │   ├── NewsDetailPage.tsx   # Individual article view
│   │   ├── AboutPage.tsx        # History, crest breakdown, and stadium
│   │   └── admin/               # Admin dashboard & modular tabs
│   ├── services/
│   │   ├── clubService.ts       # Unified data repository (Supabase + local cache)
│   │   └── sampleData.ts        # Realistic default GHOST FC roster & fixtures
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── utils/
│   │   └── youtube.ts           # Safe YouTube embed converter
│   ├── App.tsx                  # Router & navigation layout
│   ├── main.tsx                 # React DOM root
│   └── index.css                # Global Tailwind styling & sports utilities
```

---

## 🚀 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ghost-fc.git
cd ghost-fc
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase project credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```
*(Note: If you launch without Supabase credentials, the application automatically runs in standalone interactive mode with realistic sample data and persistent browser storage!)*

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Database & Security (RLS) Setup

1. Log into your [Supabase Dashboard](https://supabase.com).
2. Create a new project.
3. Open the **SQL Editor** in the left sidebar.
4. Copy the entire contents of `supabase-schema.sql` located in this repository.
5. Paste it into the SQL editor and click **Run**.
6. The script creates:
   - `players` (with cascading skills, socials, and video clips)
   - `matches`
   - `news`
   - `lineup`
   - `team_settings`
   - Row Level Security (RLS) policies allowing public read access (`SELECT`) and restricting write actions (`INSERT`, `UPDATE`, `DELETE`) to authorized administrator accounts.

---

## 🌐 Netlify Deployment Instructions

1. Push your repository to **GitHub**.
2. Log into [Netlify](https://netlify.com) and click **"Add new site"** -> **"Import an existing project"**.
3. Select your GitHub repository.
4. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. In **Site configuration** -> **Environment variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
6. Click **Deploy**. The `public/_redirects` rule ensures React Router URLs (e.g. `/squad`, `/player/p-1`, `/matches`, `/admin`) resolve seamlessly without 404 errors.

---

## 🔐 Administrative Access

The admin portal is accessible at `/admin`.  
Authorized administrator accounts:
- `khaledarahman93@gmail.com`
- `admin@ghostfc.com`

---

## 📄 License
© GHOST FC. All rights reserved. Built for athletic excellence.
