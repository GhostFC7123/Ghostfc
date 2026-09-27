import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { clubService } from '../services/clubService';
import { Player } from '../types';
import { PlayerSkillBars } from '../components/players/PlayerSkillBars';
import { YouTubeEmbed } from '../components/common/YouTubeEmbed';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import {
  Crown,
  Shield,
  Instagram,
  Facebook,
  Youtube,
  Video,
  ArrowLeft,
  Calendar,
  Ruler,
  Footprints,
  Flame,
  CheckCircle2,
  Share2,
  Trophy,
  Zap,
  Activity
} from 'lucide-react';

export const PlayerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPlayer() {
      if (!id) return;
      try {
        const found = await clubService.getPlayerById(id);
        setPlayer(found);
      } catch (err) {
        console.error('Error loading player profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadPlayer();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <LoadingState message="Retrieving Official Athlete Dossier..." className="min-h-screen" />;
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-[#050507] text-[#F0F1F5] pt-32 px-4">
        <div className="max-w-xl mx-auto">
          <EmptyState
            title="Player Dossier Not Found"
            description="The requested player profile does not exist or may have been transferred."
            actionLabel="Return to Squad Directory"
            onAction={() => navigate('/squad')}
          />
        </div>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socials = player.socials || {};
  const hasSocials = Boolean(
    socials.instagram || socials.facebook || socials.tiktok || socials.youtube
  );

  const nameParts = player.name.trim().split(' ');
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : '';
  const lastName = nameParts[nameParts.length - 1];

  return (
    <div className="min-h-screen bg-[#050507] text-[#F0F1F5] pt-24 pb-28">
      {/* Breadcrumb & Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between border-b border-[#181B24] pb-4">
          <Link
            to="/squad"
            className="inline-flex items-center gap-2 text-xs font-heading font-black tracking-wider text-[#8E93A3] hover:text-[#E50914] uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO SQUAD DIRECTORY
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8E93A3] hover:text-white bg-[#101217] border border-[#232735] hover:border-[#E50914] px-3.5 py-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-[#E50914]" />
            <span>{copied ? 'LINK COPIED TO CLIPBOARD' : 'SHARE DOSSIER'}</span>
          </button>
        </div>
      </div>

      {/* Main Profile Hero Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="relative bg-[#0C0E14] border border-[#202432] overflow-hidden shadow-2xl p-6 sm:p-10 md:p-12 card-rim">
          {/* Subtle cinematic spotlight */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E50914]/12 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute inset-0 bg-carbon-mesh pointer-events-none opacity-30" />

          {/* Huge jersey watermark */}
          <div className="absolute -bottom-10 right-4 font-teko text-[180px] sm:text-[260px] font-black text-white/[0.03] select-none pointer-events-none leading-none">
            #{player.jersey_number}
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Player Photo Column (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative aspect-[3/4] w-full max-w-sm bg-gradient-to-b from-[#141722] to-[#0A0C10] border-2 border-[#262B3A] overflow-hidden shadow-2xl group card-rim">
                {/* Corner red accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#E50914] z-20" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#E50914] z-20" />

                <img
                  src={player.photo_url || '/ghost-fc-logo.jpg'}
                  alt={player.name}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/ghost-fc-logo.jpg';
                  }}
                  className="w-full h-full object-cover object-top filter grayscale contrast-115 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-[#0A0C10]/20 to-transparent" />

                {/* Kit Tag inside Photo */}
                <div className="absolute bottom-4 left-4 z-20 bg-black/90 backdrop-blur-md border border-[#2B3042] px-3.5 py-1.5 flex items-baseline gap-1.5 shadow-xl">
                  <span className="text-[10px] font-mono text-[#8E93A3] font-semibold">KIT</span>
                  <span className="font-teko text-3xl font-black text-[#E50914] leading-none">
                    #{player.jersey_number}
                  </span>
                </div>
              </div>
            </div>

            {/* Core Dossier Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {player.is_captain && (
                    <div className="flex items-center gap-1.5 bg-[#E50914] text-white px-3 py-1 text-xs font-heading font-black tracking-widest clip-skew-btn shadow">
                      <Crown className="w-3.5 h-3.5 fill-current" />
                      <span className="clip-skew-content inline-block">CLUB CAPTAIN</span>
                    </div>
                  )}
                  {player.is_vice_captain && !player.is_captain && (
                    <div className="flex items-center gap-1.5 bg-[#141620] border border-[#E50914] text-white px-3 py-1 text-xs font-heading font-black tracking-widest clip-skew-btn shadow">
                      <Shield className="w-3.5 h-3.5 text-[#E50914]" />
                      <span className="clip-skew-content inline-block">VICE CAPTAIN</span>
                    </div>
                  )}
                  <span className="bg-[#12141C] border border-[#262B3A] text-white px-3 py-1 text-xs font-mono tracking-wider uppercase font-bold">
                    {player.position} · {player.role}
                  </span>
                </div>

                {firstName && (
                  <span className="text-base font-mono text-[#8E93A3] tracking-widest uppercase block -mb-1">
                    {firstName}
                  </span>
                )}
                <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-wide">
                  {lastName}
                </h1>
                <p className="text-xs sm:text-sm font-mono text-[#E50914] uppercase tracking-wider mt-1 font-bold">
                  {player.position_detail} · FIRST TEAM ROSTER
                </p>
              </div>

              {/* Bio summary */}
              {player.short_description && (
                <div className="p-4 bg-[#0A0C11] border-l-4 border-[#E50914] text-xs sm:text-sm text-[#C5C9D6] leading-relaxed italic shadow-inner">
                  "{player.short_description}"
                </div>
              )}

              {/* Physical Attributes Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-[#101217] border border-[#202432]">
                  <span className="text-[10px] font-mono text-[#585D6E] uppercase block font-bold">AGE</span>
                  <span className="font-heading text-2xl font-black text-white mt-0.5 block leading-none">
                    {player.age} <span className="text-xs font-normal text-[#8E93A3]">YRS</span>
                  </span>
                </div>

                <div className="p-3.5 bg-[#101217] border border-[#202432]">
                  <span className="text-[10px] font-mono text-[#585D6E] uppercase block font-bold">HEIGHT</span>
                  <span className="font-heading text-2xl font-black text-white mt-0.5 block leading-none">
                    {player.height}
                  </span>
                </div>

                <div className="p-3.5 bg-[#101217] border border-[#202432]">
                  <span className="text-[10px] font-mono text-[#585D6E] uppercase block font-bold">PREF. FOOT</span>
                  <span className="font-heading text-2xl font-black text-[#E50914] mt-0.5 block leading-none">
                    {player.preferred_foot}
                  </span>
                </div>

                <div className="p-3.5 bg-[#101217] border border-[#202432]">
                  <span className="text-[10px] font-mono text-[#585D6E] uppercase block font-bold">STATUS</span>
                  <span className={`font-heading text-2xl font-black mt-0.5 block leading-none ${player.is_active ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {player.is_active ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
              </div>

              {/* Social Channels */}
              {hasSocials && (
                <div className="pt-2 flex items-center gap-3">
                  <span className="text-xs font-mono text-[#585D6E] uppercase tracking-wider font-bold">OFFICIAL MEDIA:</span>
                  <div className="flex items-center gap-2">
                    {socials.instagram && (
                      <a
                        href={socials.instagram}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded bg-[#12141C] border border-[#242838] hover:border-[#E50914] text-[#8E93A3] hover:text-[#E50914] flex items-center justify-center transition-colors"
                        title="Instagram"
                      >
                        <Instagram className="w-4 h-4" />
                      </a>
                    )}
                    {socials.facebook && (
                      <a
                        href={socials.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded bg-[#12141C] border border-[#242838] hover:border-[#E50914] text-[#8E93A3] hover:text-[#E50914] flex items-center justify-center transition-colors"
                        title="Facebook"
                      >
                        <Facebook className="w-4 h-4" />
                      </a>
                    )}
                    {socials.tiktok && (
                      <a
                        href={socials.tiktok}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded bg-[#12141C] border border-[#242838] hover:border-[#E50914] text-[#8E93A3] hover:text-[#E50914] flex items-center justify-center transition-colors"
                        title="TikTok"
                      >
                        <Video className="w-4 h-4" />
                      </a>
                    )}
                    {socials.youtube && (
                      <a
                        href={socials.youtube}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded bg-[#12141C] border border-[#242838] hover:border-[#E50914] text-[#8E93A3] hover:text-[#E50914] flex items-center justify-center transition-colors"
                        title="YouTube"
                      >
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Playing Style & Tactical Metric Matrix */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tactical Profile Details (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0C0E14] border border-[#1E222E] p-6 sm:p-8 space-y-6 card-rim">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-4 bg-[#E50914]" />
                <h3 className="font-heading text-2xl font-black tracking-wider text-white uppercase">
                  PLAYING STYLE & COACHING ASSESSMENT
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#8E93A3] leading-relaxed mt-3">
                {player.playing_style ||
                  'Specialized player operating within GHOST FC dynamic transition system. Displays elite aerobic conditioning, rapid anticipation, and exceptional decision-making under high-pressure scenarios.'}
              </p>
            </div>

            {/* Tactical Strengths Checklist */}
            <div className="pt-4 border-t border-[#181B24]">
              <h4 className="font-heading text-base font-bold text-white uppercase tracking-wider mb-4">
                KEY TACTICAL ADVANTAGES
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#C5C9D6]">
                <div className="flex items-center gap-2.5 p-3 bg-[#101217] border border-[#202432]">
                  <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0" />
                  <span>High-pressure recovery acceleration</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 bg-[#101217] border border-[#202432]">
                  <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0" />
                  <span>Spatial vision in congested zones</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 bg-[#101217] border border-[#202432]">
                  <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0" />
                  <span>Relentless duel commitment</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 bg-[#101217] border border-[#202432]">
                  <CheckCircle2 className="w-4 h-4 text-[#E50914] shrink-0" />
                  <span>Rapid vertical transition execution</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Index Matrix (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0C0E14] border border-[#1E222E] p-6 sm:p-8 card-rim">
            <h3 className="font-heading text-2xl font-black tracking-wider text-white uppercase mb-6 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#E50914]" />
              PERFORMANCE INDEX MATRIX
            </h3>
            <PlayerSkillBars skills={player.skills} showOverall={true} />
          </div>
        </div>
      </div>

      {/* Official Match Footage & Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
        <div className="pb-4 border-b border-[#181B24] mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-mono text-[#E50914] uppercase tracking-widest block mb-1 font-bold">
              OFFICIAL BROADCAST FOOTAGE
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-white tracking-wide">
              BEST MOMENTS & MATCH REPLAYS
            </h2>
          </div>
          <span className="text-xs font-mono text-[#8E93A3]">
            {player.videos?.length || 0} CLIPS IN ARCHIVE
          </span>
        </div>

        {player.videos && player.videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {player.videos.map((vid) => (
              <YouTubeEmbed
                key={vid.id}
                url={vid.youtube_url}
                title={vid.title}
                category={vid.category || 'HIGHLIGHT'}
                description={vid.description}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-[#0C0E14] border border-[#1E222E]">
            <p className="text-xs sm:text-sm text-[#585D6E] font-mono">
              No video moments uploaded yet for this player.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
