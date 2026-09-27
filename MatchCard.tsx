import React, { useState } from 'react';
import { Match } from '../../types';
import { Calendar, Clock, MapPin, Trophy, Ticket, ArrowRight, Shield } from 'lucide-react';
import { GhostLogo } from '../common/GhostLogo';
import { Link } from 'react-router-dom';

interface MatchCardProps {
  match: Match;
  featured?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, featured = false }) => {
  const [oppLogoError, setOppLogoError] = useState(false);

  const isCompleted = match.status === 'Completed';
  const isUpcoming = match.status === 'Upcoming';

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const ghostScore = match.ghost_score ?? 0;
  const oppScore = match.opponent_score ?? 0;
  const ghostWon = isCompleted && ghostScore > oppScore;
  const isDraw = isCompleted && ghostScore === oppScore;

  if (featured) {
    // =========================================================================
    // FEATURED MATCH CENTER GRAPHIC (Responsive Broadcast Standard)
    // =========================================================================
    return (
      <div className="relative bg-[#0C0E14] border border-[#222634] hover:border-[#E50914]/60 transition-all duration-300 overflow-hidden shadow-2xl p-4 sm:p-8 card-rim">
        {/* Ambient Stadium Lighting Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#E50914]/12 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 bg-carbon-mesh pointer-events-none opacity-40" />

        {/* Competition Header Strip */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-[#1A1E29]">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded bg-[#141722] border border-[#2B3042] flex items-center justify-center text-[#E50914]">
              <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <div>
              <span className="font-heading font-black text-xs sm:text-sm tracking-wider text-white uppercase block leading-tight truncate max-w-[200px] sm:max-w-none">
                {match.competition}
              </span>
              {match.round_info && (
                <span className="text-[10px] sm:text-[11px] font-mono text-[#8E93A3] block leading-tight">
                  {match.round_info}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] sm:text-xs font-heading font-black tracking-widest px-2.5 sm:px-3 py-0.5 sm:py-1 uppercase shadow-md ${
                isUpcoming
                  ? 'bg-gradient-to-r from-[#B80710] to-[#E50914] text-white clip-skew-btn'
                  : isCompleted
                  ? 'bg-[#151821] text-[#A2A6B5] border border-[#292E3F]'
                  : 'bg-yellow-900/40 text-yellow-400 border border-yellow-700/50'
              }`}
            >
              <span className={isUpcoming ? 'clip-skew-content inline-block' : ''}>
                {isUpcoming ? 'OFFICIAL FIXTURE' : match.status}
              </span>
            </span>
          </div>
        </div>

        {/* Head-to-Head Clash Layout - 3 Cols on Mobile, 7 Cols on Desktop */}
        <div className="relative z-10 py-6 sm:py-8 grid grid-cols-3 md:grid-cols-7 items-center gap-2 sm:gap-6 md:gap-8 text-center">
          {/* GHOST FC */}
          <div className="md:col-span-3 flex flex-col items-center justify-center space-y-2 sm:space-y-3">
            <div className="relative p-1.5 sm:p-2 rounded-full bg-[#12151F] border border-[#282D3D] shadow-xl">
              <GhostLogo size="md" />
            </div>
            <div>
              <h3 className="font-heading text-lg sm:text-2xl md:text-3xl font-black text-white tracking-wider">
                GHOST <span className="text-[#E50914]">FC</span>
              </h3>
              <span className="inline-block mt-0.5 sm:mt-1 px-1.5 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase bg-[#141720] border border-[#242938] text-[#8E93A3]">
                {match.is_home ? 'HOME' : 'AWAY'}
              </span>
            </div>
          </div>

          {/* VS / SCOREBOARD CENTER */}
          <div className="md:col-span-1 flex flex-col items-center justify-center py-1">
            {isCompleted ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 py-1 sm:py-2 bg-[#090A0E] border border-[#202432] shadow-inner">
                  <span className={`font-teko text-3xl sm:text-5xl md:text-6xl font-black leading-none ${ghostWon ? 'text-[#E50914]' : 'text-white'}`}>
                    {ghostScore}
                  </span>
                  <span className="font-mono text-base sm:text-xl text-[#4A4F60]">-</span>
                  <span className={`font-teko text-3xl sm:text-5xl md:text-6xl font-black leading-none ${!ghostWon && !isDraw ? 'text-[#E50914]' : 'text-white'}`}>
                    {oppScore}
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#8E93A3] uppercase mt-1 font-bold">
                  {ghostWon ? 'VICTORY' : isDraw ? 'DRAW' : 'FULL TIME'}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-b from-[#1E222D] to-[#101217] border-2 border-[#E50914]/60 flex items-center justify-center font-heading font-black text-sm sm:text-xl text-white tracking-widest shadow-[0_0_20px_rgba(229,9,20,0.35)]">
                    VS
                  </div>
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-[#E50914] uppercase mt-1 font-bold">
                  MATCHDAY
                </span>
              </div>
            )}
          </div>

          {/* OPPONENT */}
          <div className="md:col-span-3 flex flex-col items-center justify-center space-y-2 sm:space-y-3">
            <div className="w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-[#12151F] border border-[#282D3D] p-2 sm:p-3 flex items-center justify-center overflow-hidden shadow-xl">
              {match.opponent_logo_url && !oppLogoError ? (
                <img
                  src={match.opponent_logo_url}
                  alt={match.opponent}
                  onError={() => setOppLogoError(true)}
                  className="w-full h-full object-contain filter contrast-110"
                />
              ) : (
                <div className="font-heading font-black text-base sm:text-2xl text-[#8E93A3]">
                  {match.opponent.substring(0, 3).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-heading text-lg sm:text-2xl md:text-3xl font-black text-white tracking-wider truncate max-w-[100px] sm:max-w-[220px]">
                {match.opponent}
              </h3>
              <span className="inline-block mt-0.5 sm:mt-1 px-1.5 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase bg-[#141720] border border-[#242938] text-[#8E93A3]">
                {!match.is_home ? 'HOME' : 'AWAY'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Details: Date, Kickoff Time, Stadium Venue */}
        <div className="relative z-10 pt-4 sm:pt-6 border-t border-[#1A1E29] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs font-mono text-[#8E93A3]">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5 text-white">
              <Calendar className="w-3.5 h-3.5 text-[#E50914]" />
              <span>{formatDate(match.date)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white">
              <Clock className="w-3.5 h-3.5 text-[#E50914]" />
              <span>{match.time} KICKOFF</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#C5C9D6]">
              <MapPin className="w-3.5 h-3.5 text-[#E50914]" />
              <span className="truncate max-w-[150px] sm:max-w-none">{match.venue}</span>
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <Link
              to="/matches"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#E50914] hover:bg-[#FF1A24] text-white font-heading font-black text-xs tracking-wider uppercase transition-colors"
            >
              <span>{isUpcoming ? 'TICKET & FIXTURE INFO' : 'VIEW MATCH REPORT'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // STANDARD MATCH CARD (Grid/List View)
  // =========================================================================
  return (
    <div className="group bg-[#0C0E14] border border-[#1E222E] hover:border-[#E50914]/60 transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between card-rim transform-gpu hover:-translate-y-1">
      {/* Top Competition & Status */}
      <div className="flex items-center justify-between pb-3 border-b border-[#181B24] text-xs">
        <span className="font-heading font-black tracking-wider text-white uppercase truncate max-w-[160px] sm:max-w-[180px]">
          {match.competition}
        </span>
        <span
          className={`text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 uppercase ${
            isUpcoming
              ? 'text-[#FF2A35] bg-[#E50914]/15 border border-[#E50914]/30'
              : 'text-[#8E93A3] bg-[#12141C] border border-[#232734]'
          }`}
        >
          {match.status}
        </span>
      </div>

      {/* Matchup Rows */}
      <div className="py-4 space-y-3.5">
        {/* GHOST FC Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <GhostLogo size="xs" />
            <span className="font-heading text-base sm:text-lg font-black text-white group-hover:text-[#E50914] transition-colors">
              GHOST FC
            </span>
          </div>
          {isCompleted ? (
            <span className={`font-teko text-2xl sm:text-3xl font-black leading-none ${ghostWon ? 'text-[#E50914]' : 'text-white'}`}>
              {ghostScore}
            </span>
          ) : (
            <span className="text-[10px] sm:text-[11px] font-mono text-[#585D6E] font-semibold">{match.is_home ? 'HOME' : 'AWAY'}</span>
          )}
        </div>

        {/* Opponent Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded bg-[#12141C] border border-[#232734] p-0.5 flex items-center justify-center shrink-0">
              {match.opponent_logo_url && !oppLogoError ? (
                <img
                  src={match.opponent_logo_url}
                  alt={match.opponent}
                  onError={() => setOppLogoError(true)}
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="font-mono text-[9px] font-bold text-[#8E93A3]">OPP</span>
              )}
            </div>
            <span className="font-heading text-base sm:text-lg font-black text-white truncate max-w-[130px] sm:max-w-[160px]">
              {match.opponent}
            </span>
          </div>
          {isCompleted ? (
            <span className={`font-teko text-2xl sm:text-3xl font-black leading-none ${!ghostWon && !isDraw ? 'text-[#E50914]' : 'text-white'}`}>
              {oppScore}
            </span>
          ) : (
            <span className="text-[10px] sm:text-[11px] font-mono text-[#585D6E] font-semibold">{!match.is_home ? 'HOME' : 'AWAY'}</span>
          )}
        </div>
      </div>

      {/* Footer Info: Date & Venue */}
      <div className="pt-3 border-t border-[#181B24] flex items-center justify-between text-[11px] font-mono text-[#8E93A3]">
        <div className="flex items-center gap-1.5 text-white">
          <Calendar className="w-3.5 h-3.5 text-[#E50914]" />
          <span>{match.date}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate max-w-[140px] sm:max-w-[160px]">
          <MapPin className="w-3.5 h-3.5 text-[#585D6E]" />
          <span className="truncate">{match.venue}</span>
        </div>
      </div>
    </div>
  );
};
