import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { clubService } from '../services/clubService';
import { Player, Match, NewsArticle, TeamSettings, LineupConfig } from '../types';
import { GhostLogo } from '../components/common/GhostLogo';
import { CaptainSection } from '../components/captain/CaptainSection';
import { PlayerCard } from '../components/players/PlayerCard';
import { LineupPitch } from '../components/pitch/LineupPitch';
import { SubstituteBench } from '../components/pitch/SubstituteBench';
import { YouTubeEmbed } from '../components/common/YouTubeEmbed';
import { NewsCard } from '../components/news/NewsCard';
import { LoadingState } from '../components/common/LoadingState';
import {
  ArrowRight,
  Shield,
  ChevronRight,
  Calendar
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [lineup, setLineup] = useState<LineupConfig | null>(null);
  const [settings, setSettings] = useState<TeamSettings | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [playersData, matchesData, newsData, lineupData, settingsData] = await Promise.all([
          clubService.getPlayers(),
          clubService.getMatches(),
          clubService.getNews(),
          clubService.getLineup(),
          clubService.getTeamSettings()
        ]);
        setPlayers(playersData);
        setMatches(matchesData);
        setNews(newsData);
        setLineup(lineupData);
        setSettings(settingsData);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return <LoadingState message="Summoning GHOST FC Matchday Data..." className="min-h-screen" />;
  }

  const nextMatch = matches.find((m) => m.status === 'Upcoming') || matches[0];
  const captain = players.find((p) => p.is_captain) || players[0];
  const viceCaptain = players.find((p) => p.is_vice_captain && !p.is_captain);
  const featuredPlayers = players.filter((p) => p.is_active).slice(0, 4);
  const featuredNews = news.slice(0, 3);

  // Collect player highlight videos
  const allVideos = players.flatMap((p) =>
    (p.videos || []).map((v) => ({ ...v, playerName: p.name }))
  );
  const showcaseVideos = allVideos.slice(0, 3);

  const tagline = settings?.tagline || 'BORN TO DOMINATE.';

  return (
    <div className="min-h-screen bg-[#050507] text-[#F0F1F5] selection:bg-[#E50914] selection:text-white">
      {/* ========================================================================= */}
      {/* 1. CINEMATIC STADIUM MATCHDAY HERO SECTION                                */}
      {/* ========================================================================= */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-24 pb-16 sm:pb-24">
        {/* Stadium Photography Backdrop with Multi-Layer Lighting */}
        <div className="absolute inset-0 z-0">
          <img
            src="/stadium_atmosphere_1790354254462.jpg"
            alt="The Crypt Arena Under Floodlights"
            className="w-full h-full object-cover object-center filter brightness-45 contrast-125 scale-105"
          />
          {/* Subtle diagonal texture overlay */}
          <div className="absolute inset-0 bg-carbon-mesh opacity-30" />
          {/* Depth gradient vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050507] via-[#050507]/65 to-[#050507]/40" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#050507]/70 to-[#050507]" />
          {/* Top-down crimson stadium aura */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#E50914]/15 rounded-full blur-[160px] pointer-events-none" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8">
          {/* Official Crest Badge with Stadium Rim Glow */}
          <div className="flex justify-center">
            <div className="relative p-2.5 rounded-full border border-white/10 bg-[#090A0E]/80 backdrop-blur-md shadow-[0_0_60px_rgba(229,9,20,0.4)] group transition-transform duration-500 hover:scale-105">
              <GhostLogo size="xl" showText={false} />
            </div>
          </div>

          {/* Athletic Typography Title Block */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#090A0E]/90 border border-[#E50914]/40 text-xs font-mono tracking-widest text-[#E50914] uppercase shadow-md">
              <span className="w-1.5 h-1.5 bg-[#E50914] rounded-full animate-ping" />
              OFFICIAL FOOTBALL CLUB PORTAL · LONDON / GLOBAL
            </div>

            <h1 className="font-heading text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight text-white uppercase select-none leading-none drop-shadow-2xl">
              GHOST <span className="text-[#E50914]">FC</span>
            </h1>

            <p className="font-teko text-2xl sm:text-3xl md:text-4xl text-[#E50914] font-bold tracking-[0.25em] uppercase">
              "{tagline}"
            </p>
          </div>

          {/* Core Philosophy Statement */}
          <p className="text-sm sm:text-base md:text-lg text-[#9A9EB0] max-w-2xl mx-auto leading-relaxed font-normal">
            A modern football powerhouse forged in speed, tactical discipline, and unyielding aggression.
            We leave everything on the pitch and claim victory from every challenge.
          </p>

          {/* High-Impact Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/squad"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#B80710] to-[#E50914] hover:from-[#E50914] hover:to-[#FF1A24] text-white font-heading font-black text-lg tracking-wider uppercase transition-all duration-300 shadow-[0_0_35px_rgba(229,9,20,0.55)] border border-[#FF3333]/40 flex items-center justify-center gap-2"
              style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
              <span>EXPLORE FIRST TEAM SQUAD</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/matches"
              className="w-full sm:w-auto px-8 py-4 bg-[#101217]/90 hover:bg-[#181B24] text-white font-heading font-black text-lg tracking-wider uppercase transition-all duration-300 border border-[#262B3A] hover:border-[#E50914] flex items-center justify-center gap-2"
              style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
              <Calendar className="w-5 h-5 text-[#E50914]" />
              <span>MATCH CENTER & FIXTURES</span>
            </Link>
          </div>

          {/* Live Matchday Teaser Strip */}
          {nextMatch && (
            <div className="pt-4 max-w-2xl mx-auto">
              <Link
                to="/matches"
                className="group block p-3.5 bg-[#0A0C11]/85 backdrop-blur-md border border-[#202432] hover:border-[#E50914] transition-all duration-300 shadow-xl"
              >
                <div className="flex items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-[#E50914] font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
                    <span>NEXT MATCHDAY</span>
                  </div>
                  <div className="text-white truncate font-bold font-heading text-sm">
                    GHOST FC vs {nextMatch.opponent}
                  </div>
                  <div className="text-[#8E93A3] hidden sm:flex items-center gap-1 group-hover:text-white transition-colors">
                    <span>{nextMatch.date} · {nextMatch.venue}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#E50914]" />
                  </div>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TEAM CAPTAIN SECTION                                                  */}
      {/* ========================================================================= */}
      <CaptainSection captain={captain} viceCaptain={viceCaptain} />

      {/* ========================================================================= */}
      {/* 5. FEATURED SQUAD MEMBERS                                                */}
      {/* ========================================================================= */}
      <section className="relative py-20 sm:py-28 bg-[#050507]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-3 bg-[#E50914]" />
                <span className="text-xs font-mono text-[#E50914] font-bold tracking-widest uppercase">
                  FIRST TEAM SQUAD
                </span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide">
                FEATURED SQUAD MEMBERS
              </h2>
            </div>
            <Link
              to="/squad"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#101217] hover:bg-[#181B24] border border-[#232735] hover:border-[#E50914] text-xs font-heading font-black tracking-wider text-white uppercase transition-colors"
            >
              EXPLORE FULL 25-MAN ROSTER
              <ArrowRight className="w-3.5 h-3.5 text-[#E50914]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. STARTING XI & TACTICAL PITCH VISUALIZATION                            */}
      {/* ========================================================================= */}
      <section className="relative py-20 sm:py-28 bg-[#08090C] border-t border-[#181B24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#E50914] font-bold tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-ping" />
              MATCHDAY TACTICAL SETUP
            </div>
            <h2 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-wide">
              STARTING XI ({lineup?.formation || '4-3-3'})
            </h2>
            <p className="text-xs sm:text-sm text-[#8E93A3]">
              Official team selection chosen for our upcoming clash. Interactive tactical pitch visualization with on-pitch player roles.
            </p>
          </div>

          {/* Tactical Pitch Visualizer */}
          <div className="mb-12">
            <LineupPitch
              formation={lineup?.formation || '4-3-3'}
              startingXI={lineup?.starting_xi || {}}
              players={players}
              interactive={false}
            />
          </div>

          {/* Substitute Bench */}
          {lineup && (
            <div className="max-w-4xl mx-auto">
              <SubstituteBench substituteIds={lineup.substitutes} players={players} />
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. LATEST MATCH HIGHLIGHTS (YOUTUBE EMBEDS)                              */}
      {/* ========================================================================= */}
      {showcaseVideos.length > 0 && (
        <section className="relative py-20 sm:py-28 bg-[#050507] border-t border-[#181B24]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-3 bg-[#E50914]" />
                  <span className="text-xs font-mono text-[#E50914] font-bold tracking-widest uppercase">
                    OFFICIAL BROADCAST CLIPS
                  </span>
                </div>
                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide">
                  LATEST MATCH HIGHLIGHTS
                </h2>
              </div>
              <div className="text-xs font-mono text-[#8E93A3]">
                OFFICIAL MATCHDAY MEDIA ARCHIVE
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {showcaseVideos.map((video) => (
                <YouTubeEmbed
                  key={video.id}
                  url={video.youtube_url}
                  title={video.title}
                  category={video.category || 'HIGHLIGHT'}
                  description={video.description}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* 8. LATEST NEWS & REPORTS                                                 */}
      {/* ========================================================================= */}
      <section className="relative py-20 sm:py-28 bg-[#08090C] border-t border-[#181B24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-1.5 h-3 bg-[#E50914]" />
                <span className="text-xs font-mono text-[#E50914] font-bold tracking-widest uppercase">
                  CLUB MEDIA & PRESS RELEASES
                </span>
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide">
                LATEST NEWS & REPORTS
              </h2>
            </div>
            <Link
              to="/news"
              className="inline-flex items-center gap-1.5 text-xs font-heading font-black tracking-wider text-[#8E93A3] hover:text-[#E50914] uppercase transition-colors"
            >
              ALL ARTICLES <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {featuredNews[0] && (
              <div className="lg:col-span-7">
                <NewsCard article={featuredNews[0]} featured={true} />
              </div>
            )}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {featuredNews.slice(1).map((art) => (
                <NewsCard key={art.id} article={art} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. TEAM STATISTICS MATRIX                                                */}
      {/* ========================================================================= */}
      <section className="relative py-16 bg-[#0B0C10] border-y border-[#1C202C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 border-r border-[#181B24] last:border-0">
              <span className="font-teko text-6xl sm:text-7xl font-black text-[#E50914] block leading-none">
                1ST
              </span>
              <span className="font-heading text-xs sm:text-sm font-black text-white uppercase tracking-wider mt-1 block">
                LEAGUE POSITION
              </span>
              <span className="text-[11px] font-mono text-[#8E93A3]">Champions League Seed</span>
            </div>

            <div className="p-4 border-r border-[#181B24] last:border-0">
              <span className="font-teko text-6xl sm:text-7xl font-black text-white block leading-none">
                +28
              </span>
              <span className="font-heading text-xs sm:text-sm font-black text-white uppercase tracking-wider mt-1 block">
                GOAL DIFFERENCE
              </span>
              <span className="text-[11px] font-mono text-[#8E93A3]">42 Scored · 14 Conceded</span>
            </div>

            <div className="p-4 border-r border-[#181B24] last:border-0">
              <span className="font-teko text-6xl sm:text-7xl font-black text-[#E50914] block leading-none">
                83%
              </span>
              <span className="font-heading text-xs sm:text-sm font-black text-white uppercase tracking-wider mt-1 block">
                HOME WIN RATE
              </span>
              <span className="text-[11px] font-mono text-[#8E93A3]">Fortress The Crypt</span>
            </div>

            <div className="p-4">
              <span className="font-teko text-6xl sm:text-7xl font-black text-white block leading-none">
                4
              </span>
              <span className="font-heading text-xs sm:text-sm font-black text-white uppercase tracking-wider mt-1 block">
                CLEAN SHEETS
              </span>
              <span className="text-[11px] font-mono text-[#8E93A3]">Consecutive Matches</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. CLUB IDENTITY / PHILOSOPHY                                            */}
      {/* ========================================================================= */}
      <section className="relative py-20 sm:py-28 bg-[#050507]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#101217] border border-[#232735] text-xs font-mono text-[#E50914] uppercase">
                <Shield className="w-3.5 h-3.5" />
                THE GHOST FC PHILOSOPHY
              </div>

              <h2 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-wide leading-tight">
                DOMINANCE FROM SHADOWS. <br />
                <span className="text-[#E50914]">INTENSITY UNMATCHED.</span>
              </h2>

              <p className="text-sm sm:text-base text-[#9A9EB0] leading-relaxed">
                GHOST FC is defined by tactical minimalism, high-speed transitions, and suffocating pressing traps.
                Our players are conditioned to maintain ruthless energy across the full 90 minutes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 bg-[#0C0E14] border border-[#1E222E]">
                  <h4 className="font-heading text-base font-bold text-white uppercase flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#E50914]" />
                    THE HOME FORTRESS
                  </h4>
                  <p className="text-xs text-[#8E93A3] mt-2 leading-relaxed">
                    The Crypt Arena — 52,000 roaring supporters under blinding floodlights and crimson smoke.
                  </p>
                </div>

                <div className="p-5 bg-[#0C0E14] border border-[#1E222E]">
                  <h4 className="font-heading text-base font-bold text-white uppercase flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#E50914]" />
                    TACTICAL SUPREMACY
                  </h4>
                  <p className="text-xs text-[#8E93A3] mt-2 leading-relaxed">
                    Engineered passing geometry, instant recovery sprints, and lethal finishing.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-heading font-black tracking-wider text-[#E50914] hover:text-[#FF1A24] uppercase transition-colors"
                >
                  LEARN MORE ABOUT CLUB HERITAGE & IDENTITY →
                </Link>
              </div>
            </div>

            {/* Visual Crest / Atmosphere Banner */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md aspect-square bg-gradient-to-b from-[#141620] via-[#0E1016] to-[#08090C] border border-[#222736] flex flex-col items-center justify-center p-8 shadow-2xl overflow-hidden group card-rim">
                <div className="absolute inset-0 bg-radial from-[#E50914]/15 via-transparent to-transparent group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
                <GhostLogo size="xl" showText={true} />
                <div className="mt-8 text-center space-y-1">
                  <span className="text-[11px] font-mono tracking-widest text-[#8E93A3] uppercase block">
                    FOUNDED 2024 · LONDON / GLOBAL
                  </span>
                  <span className="font-heading text-base font-black text-white tracking-widest">
                    HONOR · PRIDE · INTENSITY
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
