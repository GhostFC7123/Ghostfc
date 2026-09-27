import React from 'react';
import { Player } from '../../types';
import { Link } from 'react-router-dom';
import { Crown, Shield, Instagram, Youtube, ArrowRight, Award, Compass, Zap } from 'lucide-react';
import { PlayerSkillBars } from '../players/PlayerSkillBars';

interface CaptainSectionProps {
  captain?: Player;
  viceCaptain?: Player;
}

export const CaptainSection: React.FC<CaptainSectionProps> = ({ captain, viceCaptain }) => {
  if (!captain) return null;

  return (
    <section className="relative py-20 sm:py-28 bg-[#07080B] border-y border-[#181B24] overflow-hidden">
      {/* Background cinematic lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-[#E50914]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-carbon-mesh pointer-events-none opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section kicker */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-10 border-b border-[#181B24] gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
              <span className="text-xs font-mono text-[#E50914] font-bold tracking-widest uppercase">
                CLUB LEADERSHIP & ON-PITCH AUTHORITY
              </span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide">
              THE CLUB GENERALS
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#8E93A3] uppercase tracking-wider bg-[#101217] border border-[#202432] px-3 py-1.5">
              SEASON 2026/27 APPOINTMENTS
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Captain Portrait Column (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto bg-gradient-to-b from-[#141722] to-[#0A0B0E] border-2 border-[#242938] overflow-hidden group shadow-2xl card-rim">
              {/* Corner crimson athletic accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#E50914] z-20" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#E50914] z-20" />

              {/* Captain Armband Badge Top Left */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-[#E50914] text-white px-3 py-1.5 text-xs font-heading font-black tracking-widest clip-skew-btn shadow-xl">
                <Crown className="w-4 h-4 fill-current" />
                <span className="clip-skew-content inline-block">TEAM CAPTAIN</span>
              </div>

              {/* Photo with dynamic hover */}
              <img
                src={captain.photo_url || '/ghost_fc_captain_1790354267610.jpg'}
                alt={captain.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/ghost_fc_captain_1790354267610.jpg';
                }}
                className="w-full h-full object-cover object-top filter grayscale contrast-115 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
              />

              {/* Shadow gradient for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-[#0A0B0E]/30 to-transparent opacity-90" />

              {/* Giant Jersey Number Watermark */}
              <div className="absolute top-2 right-4 font-teko text-9xl font-black text-white/[0.08] select-none pointer-events-none leading-none">
                #{captain.jersey_number}
              </div>

              {/* Bottom In-Photo Title Plate */}
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="bg-[#0A0C10]/90 backdrop-blur-md border border-[#2B3042] p-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#E50914] font-bold uppercase block">
                      OFFICIAL SQUAD SKIPPER
                    </span>
                    <h3 className="font-heading text-2xl font-black text-white">
                      {captain.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="font-teko text-4xl font-black text-[#E50914] leading-none block">
                      #{captain.jersey_number}
                    </span>
                    <span className="text-[10px] font-mono text-[#8E93A3] uppercase">
                      {captain.position_detail}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vice Captain Sub-Card */}
            {viceCaptain && (
              <div className="mt-4 max-w-md mx-auto bg-[#0E1015] border border-[#202432] p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded bg-[#151821] overflow-hidden border border-[#292E3F] shrink-0">
                    <img
                      src={viceCaptain.photo_url || '/ghost-fc-logo.jpg'}
                      alt={viceCaptain.name}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/ghost-fc-logo.jpg';
                      }}
                      className="w-full h-full object-cover object-top filter grayscale"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-[#8E93A3] font-mono">
                      <Shield className="w-3.5 h-3.5 text-[#E50914]" />
                      <span>VICE CAPTAIN</span>
                    </div>
                    <div className="font-heading font-black text-base text-white">
                      #{viceCaptain.jersey_number} {viceCaptain.name}
                    </div>
                  </div>
                </div>

                <Link
                  to={`/player/${viceCaptain.id}`}
                  className="text-xs font-heading font-black text-[#E50914] hover:text-[#FF1A24] uppercase tracking-wider flex items-center gap-1"
                >
                  <span>PROFILE</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>

          {/* Captain Biography & Statistics Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono text-[#E50914] font-bold tracking-widest uppercase block mb-1">
                FIRST TEAM CAPTAIN DOSSIER
              </span>
              <h2 className="font-heading text-4xl sm:text-5xl font-black text-white tracking-wide">
                {captain.name}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#8E93A3] mt-2">
                <span className="text-white font-semibold">{captain.position_detail}</span>
                <span className="text-[#3A3F50]" aria-hidden="true">•</span>
                <span>Age {captain.age} Years</span>
                <span className="text-[#3A3F50]" aria-hidden="true">•</span>
                <span>Height {captain.height}</span>
                <span className="text-[#3A3F50]" aria-hidden="true">•</span>
                <span className="text-[#FF2A35] font-semibold">{captain.preferred_foot} Footed</span>
              </div>
            </div>

            {/* Editorial Bio Quote */}
            <div className="relative p-5 bg-[#0D0F14] border-l-4 border-[#E50914] text-sm text-[#D1D5E0] italic leading-relaxed shadow-lg">
              <span className="text-3xl text-[#E50914]/40 font-serif leading-none absolute top-2 left-2">“</span>
              <p className="relative z-10 pl-3">
                {captain.short_description ||
                  'Leading GHOST FC with uncompromising discipline and unmatched vision on the pitch. We play to dominate every blade of grass.'}
              </p>
            </div>

            {/* Tactical Style */}
            <div className="space-y-2">
              <h4 className="font-heading text-base font-bold text-white tracking-wider uppercase flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#E50914]" />
                TACTICAL PROFILE & LEADERSHIP MENTALITY
              </h4>
              <p className="text-xs sm:text-sm text-[#8E93A3] leading-relaxed">
                {captain.playing_style ||
                  'Commands the midfield tempo with surgical passing, explosive transition triggers, and lethal finishing when arriving inside the 18-yard box.'}
              </p>
            </div>

            {/* Key Skill Ratings Matrix */}
            <div className="pt-2">
              <PlayerSkillBars skills={captain.skills} showOverall={true} />
            </div>

            {/* CTAs & Socials */}
            <div className="pt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#181B24]">
              <div className="flex items-center gap-2.5">
                {captain.socials?.instagram && (
                  <a
                    href={captain.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded bg-[#12141C] border border-[#232734] hover:border-[#E50914] text-[#8E93A3] hover:text-[#E50914] flex items-center justify-center transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {captain.socials?.youtube && (
                  <a
                    href={captain.socials.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded bg-[#12141C] border border-[#232734] hover:border-[#E50914] text-[#8E93A3] hover:text-[#E50914] flex items-center justify-center transition-colors"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
              </div>

              <Link
                to={`/player/${captain.id}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#FF1A24] text-white font-heading font-black text-sm tracking-wider uppercase transition-colors shadow-[0_0_20px_rgba(229,9,20,0.4)]"
                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
              >
                <span>VIEW COMPLETE DOSSIER</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
