import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Player } from '../../types';
import { Crown, Shield, Instagram, Youtube, ArrowRight } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const [imgError, setImgError] = useState(false);

  // Position badge styling with official sports color hierarchy
  const positionBadgeConfig = {
    GK: {
      color: 'text-amber-400',
      bg: 'bg-amber-500/15',
      border: 'border-amber-500/30',
      label: 'GK'
    },
    DEF: {
      color: 'text-sky-400',
      bg: 'bg-sky-500/15',
      border: 'border-sky-500/30',
      label: 'DEF'
    },
    MID: {
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/15',
      border: 'border-emerald-500/30',
      label: 'MID'
    },
    FWD: {
      color: 'text-[#FF2A35]',
      bg: 'bg-[#E50914]/15',
      border: 'border-[#E50914]/35',
      label: 'FWD'
    }
  }[player.position] || {
    color: 'text-[#FF2A35]',
    bg: 'bg-[#E50914]/15',
    border: 'border-[#E50914]/35',
    label: player.position
  };

  // Split name for dramatic athletic typography (First Name / SURNAME)
  const nameParts = player.name.trim().split(' ');
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : '';
  const lastName = nameParts[nameParts.length - 1];

  return (
    <div className="group relative bg-[#0C0E13] border border-[#1E222E] hover:border-[#E50914] transition-all duration-300 flex flex-col h-full overflow-hidden card-rim card-rim-hover transform-gpu hover:-translate-y-1.5">
      {/* Top red laser highlight on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30" />

      {/* Badges Overlay (Captain / Vice Captain) */}
      <div className="absolute top-3 left-3 z-30 flex flex-col gap-1.5">
        {player.is_captain && (
          <div className="flex items-center gap-1.5 bg-[#E50914] text-white px-2.5 py-1 text-[10px] font-heading font-black tracking-wider shadow-lg clip-skew-btn">
            <Crown className="w-3.5 h-3.5 fill-current" />
            <span className="clip-skew-content inline-block">CAPTAIN</span>
          </div>
        )}
        {player.is_vice_captain && !player.is_captain && (
          <div className="flex items-center gap-1.5 bg-[#141620] border border-[#E50914]/70 text-white px-2 py-0.5 text-[10px] font-heading font-black tracking-wider shadow clip-skew-btn">
            <Shield className="w-3 h-3 text-[#E50914]" />
            <span className="clip-skew-content inline-block">VICE CAPTAIN</span>
          </div>
        )}
      </div>

      {/* Jersey Number watermark background */}
      <div className="absolute top-0 right-2 text-7xl sm:text-8xl font-teko font-black text-white/[0.04] group-hover:text-[#E50914]/[0.08] select-none transition-colors duration-300 pointer-events-none z-10 leading-none">
        #{player.jersey_number}
      </div>

      {/* Image Area */}
      <Link
        to={`/player/${player.id}`}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-gradient-to-b from-[#141620] to-[#0A0B0E]"
      >
        {/* Subtle red stadium halo behind player on hover */}
        <div className="absolute inset-0 bg-radial from-[#E50914]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {!imgError ? (
          <img
            src={player.photo_url || '/ghost-fc-logo.jpg'}
            alt={player.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-top filter grayscale contrast-115 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#0E1015]">
            <img src="/ghost-fc-logo.jpg" alt="Ghost FC" className="w-16 h-16 opacity-30 object-contain mb-2" />
            <span className="font-heading font-bold text-xs text-[#585D6E]">GHOST FC</span>
          </div>
        )}

        {/* Cinematic gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E13] via-transparent to-transparent opacity-95" />

        {/* Kit Number Tag at Bottom Right of Image */}
        <div className="absolute bottom-3 right-3 z-20 bg-black/85 backdrop-blur-md border border-[#2B2F3E] group-hover:border-[#E50914]/80 px-2.5 py-1 flex items-baseline gap-1 transition-colors shadow-lg">
          <span className="text-[10px] text-[#8E93A3] font-mono font-semibold">KIT</span>
          <span className="font-teko text-2xl font-black text-white group-hover:text-[#E50914] leading-none transition-colors">
            #{player.jersey_number}
          </span>
        </div>
      </Link>

      {/* Player Information & Editorial Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between bg-[#0C0E13] relative z-20">
        <div>
          {/* Position & Role pill */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2 py-0.5 text-[10px] font-mono font-bold tracking-wider border rounded-none uppercase ${positionBadgeConfig.color} ${positionBadgeConfig.bg} ${positionBadgeConfig.border}`}
            >
              {positionBadgeConfig.label}
            </span>
            <span className="text-[11px] font-mono text-[#8E93A3] truncate">
              {player.position_detail}
            </span>
          </div>

          {/* Player Name with Athletic Hierarchy */}
          <Link to={`/player/${player.id}`} className="block group/link">
            {firstName && (
              <span className="text-xs font-mono font-medium tracking-wider text-[#8E93A3] uppercase block truncate -mb-0.5">
                {firstName}
              </span>
            )}
            <h3 className="font-heading text-2xl font-black text-white tracking-wide group-hover/link:text-[#E50914] transition-colors truncate">
              {lastName}
            </h3>
          </Link>

          {/* Bio Snippet */}
          {player.short_description && (
            <p className="text-xs text-[#8E93A3] line-clamp-2 mt-2 leading-relaxed">
              {player.short_description}
            </p>
          )}

          {/* Player quick physical attributes */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#181B24] text-[11px] font-mono text-[#8E93A3]">
            <div>
              <span className="text-[9px] text-[#585D6E] block uppercase">AGE</span>
              <span className="text-white font-semibold">{player.age} YRS</span>
            </div>
            <div>
              <span className="text-[9px] text-[#585D6E] block uppercase">HEIGHT</span>
              <span className="text-white font-semibold">{player.height}</span>
            </div>
            <div>
              <span className="text-[9px] text-[#585D6E] block uppercase">FOOT</span>
              <span className="text-[#E50914] font-semibold uppercase">{player.preferred_foot}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions & Socials */}
        <div className="mt-4 pt-3 border-t border-[#181B24] flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {player.socials?.instagram && (
              <a
                href={player.socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label={`${player.name} Instagram`}
                className="text-[#6B7280] hover:text-[#E50914] transition-colors p-1"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
            )}
            {player.socials?.youtube && (
              <a
                href={player.socials.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label={`${player.name} YouTube`}
                className="text-[#6B7280] hover:text-[#E50914] transition-colors p-1"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            )}
            {!player.is_active && (
              <span className="text-[9px] font-mono text-amber-500/90 font-bold">INACTIVE</span>
            )}
          </div>

          <Link
            to={`/player/${player.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-heading font-black tracking-wider text-white hover:text-[#E50914] transition-colors"
          >
            <span>DOSSIER</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E50914] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
