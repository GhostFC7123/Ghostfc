import React from 'react';
import { PlayerSkills } from '../../types';

interface PlayerSkillBarsProps {
  skills: PlayerSkills;
  showOverall?: boolean;
}

export const PlayerSkillBars: React.FC<PlayerSkillBarsProps> = ({ skills, showOverall = true }) => {
  const stats = [
    { label: 'PACE', value: skills.pace, code: 'PAC' },
    { label: 'SHOOTING', value: skills.shooting, code: 'SHO' },
    { label: 'PASSING', value: skills.passing, code: 'PAS' },
    { label: 'DRIBBLING', value: skills.dribbling, code: 'DRI' },
    { label: 'DEFENDING', value: skills.defending, code: 'DEF' },
    { label: 'PHYSICAL', value: skills.physical, code: 'PHY' },
  ];

  const overall = Math.round(
    stats.reduce((acc, curr) => acc + curr.value, 0) / stats.length
  );

  return (
    <div className="space-y-4">
      {showOverall && (
        <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
          <div>
            <span className="text-[11px] font-mono tracking-widest text-[#9A9A9A] uppercase block">
              PERFORMANCE INDEX
            </span>
            <span className="font-heading text-lg font-bold text-white">
              ATTRIBUTE MATRIX
            </span>
          </div>
          <div className="flex items-baseline gap-1 bg-[#1A1A1A] border border-[#333333] px-3.5 py-1.5 rounded-sm">
            <span className="font-teko text-3xl font-black text-[#E50914] leading-none">
              {overall}
            </span>
            <span className="text-[10px] font-mono text-[#888888] uppercase">OVR</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
        {stats.map((stat) => (
          <div key={stat.label} className="group">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-heading font-bold tracking-wider text-[#CCCCCC] group-hover:text-white transition-colors">
                {stat.label}
              </span>
              <span className="font-mono font-bold text-white group-hover:text-[#E50914] transition-colors">
                {stat.value}
                <span className="text-[10px] text-[#666666]">/100</span>
              </span>
            </div>
            {/* Visual Bar */}
            <div className="h-2 w-full bg-[#181818] border border-[#262626] overflow-hidden p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-[#990000] via-[#E50914] to-[#FF3333] transition-all duration-700 ease-out shadow-[0_0_8px_rgba(229,9,20,0.5)]"
                style={{ width: `${Math.min(Math.max(stat.value, 0), 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
