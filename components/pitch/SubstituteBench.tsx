import React from 'react';
import { Player } from '../../types';
import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';

interface SubstituteBenchProps {
  substituteIds: string[];
  players: Player[];
}

export const SubstituteBench: React.FC<SubstituteBenchProps> = ({ substituteIds, players }) => {
  const subs = substituteIds
    .map((id) => players.find((p) => p.id === id))
    .filter((p): p is Player => p !== undefined);

  if (subs.length === 0) {
    return (
      <div className="text-center py-6 border border-[#1A1D27] bg-[#0A0C11] text-xs font-mono text-[#585D6E]">
        No substitutes registered for the current matchday selection.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#181B24]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-[#E50914]" />
          <h4 className="font-heading text-lg font-black tracking-wider text-white uppercase">
            MATCHDAY SUBSTITUTES BENCH
          </h4>
        </div>
        <span className="text-xs font-mono text-[#8E93A3]">
          {subs.length} PLAYERS AVAILABLE FOR SELECTION
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {subs.map((player) => (
          <Link
            key={player.id}
            to={`/player/${player.id}`}
            className="group bg-[#0C0E14] border border-[#1E222E] hover:border-[#E50914] p-3 flex items-center gap-3 transition-all duration-200 card-rim transform-gpu hover:-translate-y-0.5"
          >
            <div className="relative w-11 h-11 rounded bg-[#141620] overflow-hidden shrink-0 border border-[#262B3A] group-hover:border-[#E50914] transition-colors">
              <img
                src={player.photo_url || '/ghost-fc-logo.jpg'}
                alt={player.name}
                className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xs font-mono font-bold text-[#E50914]">
                  #{player.jersey_number}
                </span>
                <span className="text-[10px] font-mono text-[#8E93A3] uppercase">
                  {player.position}
                </span>
              </div>
              <h5 className="font-heading text-sm font-black text-white group-hover:text-[#E50914] truncate transition-colors">
                {player.name}
              </h5>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
