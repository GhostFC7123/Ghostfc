import React, { useState } from 'react';

interface GhostLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  variant?: 'default' | 'shield' | 'minimal';
}

export const GhostLogo: React.FC<GhostLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  variant = 'default'
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-24 h-24 sm:w-32 sm:h-32'
  };

  return (
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      <div className={`relative ${sizeClasses[size]} shrink-0 transition-transform duration-300 group-hover:scale-105`}>
        {/* Subtle crimson rim glow */}
        <div className="absolute inset-0 bg-[#E50914]/20 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {!imgError ? (
          <img
            src="/ghost-fc-logo.jpg"
            alt="GHOST FC Official Crest"
            onError={() => setImgError(true)}
            className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(229,9,20,0.45)]"
          />
        ) : (
          /* Geometric shield crest fallback */
          <div className="relative z-10 w-full h-full bg-gradient-to-b from-[#181A20] via-[#101217] to-[#08090C] border-2 border-[#E50914] flex flex-col items-center justify-center p-1 clip-badge shadow-[0_0_20px_rgba(229,9,20,0.4)]">
            <span className="font-teko text-[#E50914] font-black text-sm tracking-wider leading-none">GHOST</span>
            <span className="font-mono text-[9px] text-white tracking-widest leading-none">FC</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#E50914] mt-0.5 animate-pulse" />
          </div>
        )}
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-none select-none">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-black tracking-tight text-xl sm:text-2xl text-white">
              GHOST
            </span>
            <span className="font-heading font-black tracking-tight text-xl sm:text-2xl text-[#E50914]">
              FC
            </span>
          </div>
          <span className="text-[9px] sm:text-[10px] tracking-[0.28em] text-[#8E93A3] font-bold uppercase mt-0.5 font-mono">
            BORN TO DOMINATE
          </span>
        </div>
      )}
    </div>
  );
};
