import React, { useState } from 'react';
import { Player, FormationType } from '../../types';
import { Link } from 'react-router-dom';
import { Crown, Shield, User, ArrowRight, X, LayoutGrid, List } from 'lucide-react';

interface PitchSlot {
  slotId: string;
  label: string;
  x: number; // percentage
  y: number; // percentage
}

export const FORMATION_SLOTS: Record<FormationType, PitchSlot[]> = {
  '4-3-3': [
    { slotId: 'GK', label: 'GK', x: 50, y: 88 },
    { slotId: 'LB', label: 'LB', x: 16, y: 70 },
    { slotId: 'CB1', label: 'CB', x: 38, y: 73 },
    { slotId: 'CB2', label: 'CB', x: 62, y: 73 },
    { slotId: 'RB', label: 'RB', x: 84, y: 70 },
    { slotId: 'CDM', label: 'CDM', x: 50, y: 52 },
    { slotId: 'CM1', label: 'CM', x: 30, y: 44 },
    { slotId: 'CAM', label: 'CAM', x: 70, y: 44 },
    { slotId: 'LW', label: 'LW', x: 18, y: 22 },
    { slotId: 'ST', label: 'ST', x: 50, y: 16 },
    { slotId: 'RW', label: 'RW', x: 82, y: 22 },
  ],
  '4-4-2': [
    { slotId: 'GK', label: 'GK', x: 50, y: 88 },
    { slotId: 'LB', label: 'LB', x: 16, y: 70 },
    { slotId: 'CB1', label: 'CB', x: 38, y: 73 },
    { slotId: 'CB2', label: 'CB', x: 62, y: 73 },
    { slotId: 'RB', label: 'RB', x: 84, y: 70 },
    { slotId: 'LM', label: 'LM', x: 16, y: 46 },
    { slotId: 'CM1', label: 'CM', x: 38, y: 48 },
    { slotId: 'CM2', label: 'CM', x: 62, y: 48 },
    { slotId: 'RM', label: 'RM', x: 84, y: 46 },
    { slotId: 'ST1', label: 'ST', x: 38, y: 18 },
    { slotId: 'ST2', label: 'ST', x: 62, y: 18 },
  ],
  '4-2-3-1': [
    { slotId: 'GK', label: 'GK', x: 50, y: 88 },
    { slotId: 'LB', label: 'LB', x: 16, y: 70 },
    { slotId: 'CB1', label: 'CB', x: 38, y: 73 },
    { slotId: 'CB2', label: 'CB', x: 62, y: 73 },
    { slotId: 'RB', label: 'RB', x: 84, y: 70 },
    { slotId: 'CDM1', label: 'CDM', x: 36, y: 55 },
    { slotId: 'CDM2', label: 'CDM', x: 64, y: 55 },
    { slotId: 'LAM', label: 'LAM', x: 20, y: 34 },
    { slotId: 'CAM', label: 'CAM', x: 50, y: 32 },
    { slotId: 'RAM', label: 'RAM', x: 80, y: 34 },
    { slotId: 'ST', label: 'ST', x: 50, y: 16 },
  ],
  '3-5-2': [
    { slotId: 'GK', label: 'GK', x: 50, y: 88 },
    { slotId: 'CB1', label: 'CB', x: 26, y: 73 },
    { slotId: 'CB2', label: 'CB', x: 50, y: 75 },
    { slotId: 'CB3', label: 'CB', x: 74, y: 73 },
    { slotId: 'LWB', label: 'LWB', x: 14, y: 48 },
    { slotId: 'CDM', label: 'CDM', x: 50, y: 54 },
    { slotId: 'CM1', label: 'CM', x: 33, y: 44 },
    { slotId: 'CM2', label: 'CM', x: 67, y: 44 },
    { slotId: 'RWB', label: 'RWB', x: 86, y: 48 },
    { slotId: 'ST1', label: 'ST', x: 38, y: 18 },
    { slotId: 'ST2', label: 'ST', x: 62, y: 18 },
  ],
  '3-4-3': [
    { slotId: 'GK', label: 'GK', x: 50, y: 88 },
    { slotId: 'CB1', label: 'CB', x: 26, y: 73 },
    { slotId: 'CB2', label: 'CB', x: 50, y: 75 },
    { slotId: 'CB3', label: 'CB', x: 74, y: 73 },
    { slotId: 'LM', label: 'LM', x: 16, y: 48 },
    { slotId: 'CM1', label: 'CM', x: 38, y: 50 },
    { slotId: 'CM2', label: 'CM', x: 62, y: 50 },
    { slotId: 'RM', label: 'RM', x: 84, y: 48 },
    { slotId: 'LW', label: 'LW', x: 20, y: 22 },
    { slotId: 'ST', label: 'ST', x: 50, y: 16 },
    { slotId: 'RW', label: 'RW', x: 80, y: 22 },
  ]
};

interface LineupPitchProps {
  formation: FormationType;
  startingXI: Record<string, string>; // slotId -> playerId
  players: Player[];
  interactive?: boolean;
  onSlotClick?: (slotId: string) => void;
}

export const LineupPitch: React.FC<LineupPitchProps> = ({
  formation,
  startingXI,
  players,
  interactive = false,
  onSlotClick
}) => {
  const [selectedPlayerPreview, setSelectedPlayerPreview] = useState<Player | null>(null);
  const [mobileViewMode, setMobileViewMode] = useState<'pitch' | 'roster'>('pitch');

  const slots = FORMATION_SLOTS[formation] || FORMATION_SLOTS['4-3-3'];

  const getPlayer = (playerId?: string): Player | undefined => {
    if (!playerId) return undefined;
    return players.find((p) => p.id === playerId);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Mobile View Toggle Switch (PITCH vs ROSTER LIST) */}
      <div className="flex md:hidden items-center justify-between pb-3 mb-2">
        <span className="text-xs font-mono text-[#8E93A3] uppercase">
          FORMATION: <span className="text-white font-bold">{formation}</span>
        </span>

        <div className="inline-flex rounded bg-[#101217] border border-[#202432] p-0.5">
          <button
            type="button"
            onClick={() => setMobileViewMode('pitch')}
            className={`px-3 py-1 text-[11px] font-heading font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              mobileViewMode === 'pitch'
                ? 'bg-[#E50914] text-white shadow'
                : 'text-[#8E93A3] hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3 h-3" />
            <span>PITCH</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileViewMode('roster')}
            className={`px-3 py-1 text-[11px] font-heading font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
              mobileViewMode === 'roster'
                ? 'bg-[#E50914] text-white shadow'
                : 'text-[#8E93A3] hover:text-white'
            }`}
          >
            <List className="w-3 h-3" />
            <span>LIST</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TACTICAL PITCH BOARD                                                  */}
      {/* ========================================================================= */}
      <div className={`${mobileViewMode === 'roster' ? 'hidden md:block' : 'block'}`}>
        <div className="relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[16/11] w-full bg-[#08120D] rounded-none border-2 border-[#1B2920] overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.85)] select-none card-rim">
          {/* Grass striping pattern */}
          <div className="absolute inset-0 bg-pitch-stripes pointer-events-none" />

          {/* Outer pitch border lines */}
          <div className="absolute inset-3 sm:inset-6 border-2 border-white/20 pointer-events-none" />

          {/* Halfway line */}
          <div className="absolute top-1/2 left-3 sm:left-6 right-3 sm:right-6 h-[2px] bg-white/20 -translate-y-1/2 pointer-events-none" />

          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 w-24 h-24 sm:w-44 sm:h-44 rounded-full border-2 border-white/20 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/40 rounded-full" />
          </div>

          {/* Top Penalty Box (Opponent Side) */}
          <div className="absolute top-3 sm:top-6 left-1/2 -translate-x-1/2 w-40 sm:w-72 h-16 sm:h-28 border-2 border-t-0 border-white/20 pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 sm:w-32 h-6 sm:h-12 border-2 border-t-0 border-white/20" />
          </div>

          {/* Bottom Penalty Box (GHOST FC Defense) */}
          <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 w-40 sm:w-72 h-16 sm:h-28 border-2 border-b-0 border-white/20 pointer-events-none">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 sm:w-32 h-6 sm:h-12 border-2 border-b-0 border-white/20" />
            <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/40" />
          </div>

          {/* Vignette & Pitch Lighting */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/35 to-black/80 pointer-events-none" />

          {/* Watermark Crest in Center Pitch */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05]">
            <img src="/ghost-fc-logo.jpg" alt="" className="w-56 sm:w-72 h-56 sm:h-72 object-contain" />
          </div>

          {/* Player Nodes on Pitch */}
          {slots.map((slot) => {
            const playerId = startingXI[slot.slotId];
            const player = getPlayer(playerId);

            // Determine if slot is near edges to avoid label clipping
            const isLeftEdge = slot.x <= 20;
            const isRightEdge = slot.x >= 80;

            let tagAlignmentClass = 'items-center';
            if (isLeftEdge) tagAlignmentClass = 'items-start pl-1 sm:pl-0 sm:items-center';
            if (isRightEdge) tagAlignmentClass = 'items-end pr-1 sm:pr-0 sm:items-center';

            return (
              <div
                key={slot.slotId}
                style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (interactive && onSlotClick) {
                      onSlotClick(slot.slotId);
                    } else if (player) {
                      setSelectedPlayerPreview(player);
                    }
                  }}
                  className={`relative flex flex-col ${tagAlignmentClass} focus:outline-none transition-transform duration-200 ${
                    interactive ? 'cursor-pointer hover:scale-110' : player ? 'hover:scale-105' : ''
                  }`}
                  title={player ? `${player.name} (#${player.jersey_number})` : `Empty ${slot.label}`}
                >
                  {/* Node Disc */}
                  <div
                    className={`relative w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-xl ${
                      player
                        ? 'bg-gradient-to-b from-[#1C202C] to-[#0A0C11] border-[#E50914] shadow-[0_0_14px_rgba(229,9,20,0.45)]'
                        : 'bg-[#0E1015]/90 border-dashed border-[#444A5E] hover:border-[#E50914]'
                    }`}
                  >
                    {player ? (
                      <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                        {player.photo_url ? (
                          <img
                            src={player.photo_url}
                            alt={player.name}
                            className="w-full h-full object-cover object-top"
                          />
                        ) : (
                          <span className="font-teko text-base sm:text-xl font-black text-white">
                            {player.jersey_number}
                          </span>
                        )}

                        {/* Captain Badge Indicator */}
                        {player.is_captain && (
                          <div className="absolute top-0 right-0 bg-[#E50914] text-white p-0.5 rounded-full shadow-md">
                            <Crown className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-current" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-[9px] sm:text-[10px] font-mono text-[#8E93A3] font-bold">
                        {slot.label}
                      </span>
                    )}
                  </div>

                  {/* Player Tag / Label Under Node */}
                  <div className={`mt-0.5 sm:mt-1 flex flex-col ${tagAlignmentClass} pointer-events-none`}>
                    <div className="bg-[#08090C]/95 backdrop-blur-sm border border-[#232736] px-1.5 py-0.5 rounded-none flex items-center gap-1 shadow-lg max-w-[65px] sm:max-w-[110px] truncate">
                      <span className="text-[8px] sm:text-[10px] font-mono font-bold text-[#E50914]">
                        {player ? `#${player.jersey_number}` : slot.label}
                      </span>
                      <span className="text-[9px] sm:text-xs font-heading font-black text-white tracking-wider truncate">
                        {player ? player.name.split(' ').slice(-1)[0] : 'EMPTY'}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MOBILE TACTICAL ROSTER LIST (Alternative view on mobile)              */}
      {/* ========================================================================= */}
      {mobileViewMode === 'roster' && (
        <div className="md:hidden space-y-2">
          {slots.map((slot) => {
            const playerId = startingXI[slot.slotId];
            const player = getPlayer(playerId);

            if (!player) {
              return (
                <div key={slot.slotId} className="p-3 bg-[#0C0E14] border border-dashed border-[#232734] flex items-center justify-between text-xs font-mono text-[#585D6E]">
                  <span className="font-bold text-[#8E93A3]">{slot.label} POSITION</span>
                  <span>UNASSIGNED</span>
                </div>
              );
            }

            return (
              <div
                key={slot.slotId}
                onClick={() => setSelectedPlayerPreview(player)}
                className="p-3 bg-[#0C0E14] border border-[#1E222E] hover:border-[#E50914] flex items-center justify-between cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded bg-[#141620] overflow-hidden border border-[#2B3042] shrink-0">
                    <img
                      src={player.photo_url || '/ghost-fc-logo.jpg'}
                      alt={player.name}
                      className="w-full h-full object-cover object-top"
                    />
                    {player.is_captain && (
                      <div className="absolute top-0 right-0 bg-[#E50914] text-white p-0.5">
                        <Crown className="w-2.5 h-2.5 fill-current" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-[#E50914]">#{player.jersey_number}</span>
                      <span className="font-heading font-black text-sm text-white">{player.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#8E93A3]">{slot.label} · {player.position_detail}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-[#141720] border border-[#222634] text-white">
                    {slot.label}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E50914]" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Player Quick Dossier Modal / Floating Strip */}
      {selectedPlayerPreview && (
        <div className="mt-4 p-4 bg-[#0C0E14] border border-[#222736] rounded-none flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200 shadow-2xl card-rim">
          <div className="flex items-center gap-3.5 w-full sm:w-auto">
            <div className="w-12 h-12 rounded bg-[#141620] border-2 border-[#E50914] overflow-hidden shrink-0">
              <img
                src={selectedPlayerPreview.photo_url || '/ghost-fc-logo.jpg'}
                alt={selectedPlayerPreview.name}
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-black text-lg sm:text-xl text-white truncate">
                  #{selectedPlayerPreview.jersey_number} {selectedPlayerPreview.name}
                </span>
                {selectedPlayerPreview.is_captain && (
                  <span className="bg-[#E50914] text-white text-[9px] font-heading font-black px-1.5 py-0.5">
                    CAPTAIN
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-[#8E93A3] truncate">
                {selectedPlayerPreview.position_detail} · Age {selectedPlayerPreview.age} · {selectedPlayerPreview.preferred_foot} Footed
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-[#1E222E]">
            <Link
              to={`/player/${selectedPlayerPreview.id}`}
              className="px-4 py-2 bg-[#E50914] hover:bg-[#FF1A24] text-white text-xs font-heading font-black tracking-wider uppercase transition-colors flex items-center gap-1.5 flex-1 sm:flex-initial justify-center"
            >
              <span>FULL DOSSIER</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setSelectedPlayerPreview(null)}
              className="p-2 text-[#8E93A3] hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
