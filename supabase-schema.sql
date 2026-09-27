-- ==============================================================================
-- GHOST FC - Official Supabase PostgreSQL Database Schema & Security Rules (RLS)
-- Run this entire script in the Supabase SQL Editor to set up tables and security rules.
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PLAYERS TABLE
CREATE TABLE IF NOT EXISTS public.players (
  id TEXT PRIMARY KEY DEFAULT ('p-' || uuid_generate_v4()),
  name TEXT NOT NULL,
  jersey_number INT NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('GK', 'DEF', 'MID', 'FWD')),
  position_detail TEXT NOT NULL DEFAULT 'Player',
  role TEXT NOT NULL DEFAULT 'First Team',
  is_captain BOOLEAN DEFAULT false,
  is_vice_captain BOOLEAN DEFAULT false,
  age INT NOT NULL DEFAULT 22,
  height TEXT DEFAULT '182 cm',
  preferred_foot TEXT NOT NULL DEFAULT 'Right' CHECK (preferred_foot IN ('Right', 'Left', 'Both')),
  photo_url TEXT DEFAULT '/ghost-fc-logo.jpg',
  short_description TEXT DEFAULT '',
  playing_style TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PLAYER SKILLS (1:1 with players)
CREATE TABLE IF NOT EXISTS public.player_skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id TEXT NOT NULL REFERENCES public.players(id) ON DELETE CASCADE UNIQUE,
  pace INT NOT NULL DEFAULT 75 CHECK (pace >= 0 AND pace <= 100),
  shooting INT NOT NULL DEFAULT 75 CHECK (shooting >= 0 AND shooting <= 100),
  passing INT NOT NULL DEFAULT 75 CHECK (passing >= 0 AND passing <= 100),
  dribbling INT NOT NULL DEFAULT 75 CHECK (dribbling >= 0 AND dribbling <= 100),
  defending INT NOT NULL DEFAULT 75 CHECK (defending >= 0 AND defending <= 100),
  physical INT NOT NULL DEFAULT 75 CHECK (physical >= 0 AND physical <= 100)
);

-- 3. PLAYER SOCIALS (1:1 with players)
CREATE TABLE IF NOT EXISTS public.player_socials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id TEXT NOT NULL REFERENCES public.players(id) ON DELETE CASCADE UNIQUE,
  instagram TEXT DEFAULT '',
  facebook TEXT DEFAULT '',
  tiktok TEXT DEFAULT '',
  youtube TEXT DEFAULT ''
);

-- 4. PLAYER VIDEOS (1:N with players)
CREATE TABLE IF NOT EXISTS public.player_videos (
  id TEXT PRIMARY KEY DEFAULT ('v-' || uuid_generate_v4()),
  player_id TEXT NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  youtube_url TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'HIGHLIGHT',
  order_num INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. MATCHES TABLE
CREATE TABLE IF NOT EXISTS public.matches (
  id TEXT PRIMARY KEY DEFAULT ('m-' || uuid_generate_v4()),
  opponent TEXT NOT NULL,
  opponent_logo_url TEXT DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time TEXT NOT NULL DEFAULT '20:00',
  venue TEXT NOT NULL DEFAULT 'The Crypt Arena',
  competition TEXT NOT NULL DEFAULT 'Elite Super League',
  is_home BOOLEAN DEFAULT true,
  ghost_score INT DEFAULT NULL,
  opponent_score INT DEFAULT NULL,
  status TEXT NOT NULL DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Completed', 'Cancelled')),
  round_info TEXT DEFAULT 'Matchday'
);

-- 6. NEWS ARTICLES TABLE
CREATE TABLE IF NOT EXISTS public.news (
  id TEXT PRIMARY KEY DEFAULT ('news-' || uuid_generate_v4()),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT DEFAULT '',
  content TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  category TEXT DEFAULT 'CLUB NEWS',
  published_date DATE DEFAULT CURRENT_DATE,
  is_published BOOLEAN DEFAULT true,
  author TEXT DEFAULT 'GHOST FC Media',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. LINEUP CONFIG TABLE (Single record)
CREATE TABLE IF NOT EXISTS public.lineup (
  id TEXT PRIMARY KEY DEFAULT 'default_lineup',
  formation TEXT NOT NULL DEFAULT '4-3-3',
  starting_xi JSONB NOT NULL DEFAULT '{}'::jsonb,
  substitutes JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. TEAM SETTINGS TABLE (Single record)
CREATE TABLE IF NOT EXISTS public.team_settings (
  id TEXT PRIMARY KEY DEFAULT 'default_settings',
  team_name TEXT NOT NULL DEFAULT 'GHOST FC',
  logo_url TEXT DEFAULT '/ghost-fc-logo.jpg',
  tagline TEXT DEFAULT 'BORN TO DOMINATE.',
  founded_year INT DEFAULT 2024,
  home_ground TEXT DEFAULT 'The Crypt Arena',
  city TEXT DEFAULT 'London / Global',
  club_description TEXT DEFAULT 'Official football club portal of GHOST FC. Tactical supremacy and athletic dominance.',
  instagram_url TEXT DEFAULT 'https://instagram.com/ghostfc_official',
  facebook_url TEXT DEFAULT 'https://facebook.com/ghostfcofficial',
  tiktok_url TEXT DEFAULT 'https://tiktok.com/@ghostfc',
  youtube_url TEXT DEFAULT 'https://youtube.com/@ghostfc',
  email TEXT DEFAULT 'contact@ghostfc.com',
  phone TEXT DEFAULT '+44 20 7946 0912',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. ADMIN PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  full_name TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. ACTIVITY LOGS AUDIT TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY DEFAULT ('log-' || uuid_generate_v4()),
  admin TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==============================================================================
-- PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_players_jersey ON public.players(jersey_number);
CREATE INDEX IF NOT EXISTS idx_players_position ON public.players(position);
CREATE INDEX IF NOT EXISTS idx_matches_date ON public.matches(date DESC);
CREATE INDEX IF NOT EXISTS idx_news_published ON public.news(published_date DESC);
CREATE INDEX IF NOT EXISTS idx_videos_player ON public.player_videos(player_id);
CREATE INDEX IF NOT EXISTS idx_logs_created ON public.activity_logs(created_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_socials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lineup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Security check function for authorized administrative callers
CREATE OR REPLACE FUNCTION public.is_authorized_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'authenticated' AND (
      lower(auth.jwt() ->> 'email') IN ('khaledarahman93@gmail.com', 'admin@ghostfc.com')
      OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Public SELECT policies (Anyone can read public club data)
DROP POLICY IF EXISTS "Public players view" ON public.players;
CREATE POLICY "Public players view" ON public.players FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public skills view" ON public.player_skills;
CREATE POLICY "Public skills view" ON public.player_skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public socials view" ON public.player_socials;
CREATE POLICY "Public socials view" ON public.player_socials FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public videos view" ON public.player_videos;
CREATE POLICY "Public videos view" ON public.player_videos FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public matches view" ON public.matches;
CREATE POLICY "Public matches view" ON public.matches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public news view" ON public.news;
CREATE POLICY "Public news view" ON public.news FOR SELECT USING (is_published = true OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Public lineup view" ON public.lineup;
CREATE POLICY "Public lineup view" ON public.lineup FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public settings view" ON public.team_settings;
CREATE POLICY "Public settings view" ON public.team_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public admin profiles view" ON public.admin_profiles;
CREATE POLICY "Public admin profiles view" ON public.admin_profiles FOR SELECT USING (public.is_authorized_admin());

DROP POLICY IF EXISTS "Public activity logs view" ON public.activity_logs;
CREATE POLICY "Public activity logs view" ON public.activity_logs FOR SELECT USING (public.is_authorized_admin());

-- Admin Full Access policies (Only authorized admins can modify data)
DROP POLICY IF EXISTS "Admins full access players" ON public.players;
CREATE POLICY "Admins full access players" ON public.players FOR ALL USING (public.is_authorized_admin()) WITH CHECK (public.is_authorized_admin());

DROP POLICY IF EXISTS "Admins full access skills" ON public.player_skills;
CREATE POLICY "Admins full access skills" ON public.player_skills FOR ALL USING (public.is_authorized_admin()) WITH CHECK (public.is_authorized_admin());

DROP POLICY IF EXISTS "Admins full access socials" ON public.player_socials;
CREATE POLICY "Admins full access socials" ON public.player_socials FOR ALL USING (public.is_authorized_admin()) WITH CHECK (public.is_authorized_admin());

DROP POLICY IF EXISTS "Admins full access videos" ON public.player_videos;
CREATE POLICY "Admins full access videos" ON public.player_videos FOR ALL USING (public.is_authorized_admin()) WITH CHECK (public.is_authorized_admin());

DROP POLICY IF EXISTS "Admins full access matches" ON public.matches;
CREATE POLICY "Admins full access matches" ON public.matches FOR ALL USING (public.is_authorized_admin()) WITH CHECK (public.is_authorized_admin());

DROP POLICY IF EXISTS "Admins full access news" ON public.news;
CREATE POLICY "Admins full access news" ON public.news FOR ALL USING (public.is_authorized_admin()) WITH CHECK (public.is_authorized_admin());

DROP POLICY IF EXISTS "Admins full access lineup" ON public.lineup;
CREATE POLICY "Admins full access lineup" ON public.lineup FOR ALL USING (public.is_authorized_admin()) WITH CHECK (public.is_authorized_admin());

DROP POLICY IF EXISTS "Admins full access settings" ON public.team_settings;
CREATE POLICY "Admins full access settings" ON public.team_settings FOR ALL USING (public.is_authorized_admin()) WITH CHECK (public.is_authorized_admin());

DROP POLICY IF EXISTS "Admins full access admin_profiles" ON public.admin_profiles;
CREATE POLICY "Admins full access admin_profiles" ON public.admin_profiles FOR ALL USING (public.is_authorized_admin()) WITH CHECK (public.is_authorized_admin());

DROP POLICY IF EXISTS "Admins full access activity_logs" ON public.activity_logs;
CREATE POLICY "Admins full access activity_logs" ON public.activity_logs FOR ALL USING (public.is_authorized_admin()) WITH CHECK (public.is_authorized_admin());

-- ==============================================================================
-- INITIAL SEED RECORDS
-- ==============================================================================
INSERT INTO public.team_settings (
  id, team_name, logo_url, tagline, founded_year, home_ground, city, club_description
) VALUES (
  'default_settings',
  'GHOST FC',
  '/ghost-fc-logo.jpg',
  'BORN TO DOMINATE.',
  2024,
  'The Crypt Arena',
  'London / Global',
  'Official football club portal of GHOST FC. Tactical supremacy, ferocious pace, and unyielding athletic dominance.'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.lineup (
  id, formation, starting_xi, substitutes
) VALUES (
  'default_lineup',
  '4-3-3',
  '{"GK":"p-4","LB":"p-10","CB1":"p-3","CB2":"p-11","RB":"p-9","CDM":"p-7","CM1":"p-8","CAM":"p-1","LW":"p-6","ST":"p-2","RW":"p-5"}'::jsonb,
  '["p-12","p-13","p-14","p-15","p-16","p-17","p-18","p-19","p-20"]'::jsonb
) ON CONFLICT (id) DO NOTHING;
