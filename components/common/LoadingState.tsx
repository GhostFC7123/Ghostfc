import React from 'react';

export const LoadingState: React.FC<{ message?: string; className?: string }> = ({
  message = 'Loading GHOST FC data...',
  className = 'py-20'
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${className}`}>
      <div className="relative w-14 h-14 mb-4">
        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#E50914] border-r-[#E50914] animate-spin"></div>
        {/* Inner pulsing logo placeholder */}
        <div className="absolute inset-2 rounded-full bg-[#111111] flex items-center justify-center border border-[#222222]">
          <span className="font-heading font-black text-xs text-[#E50914] tracking-tighter">GFC</span>
        </div>
      </div>
      <p className="font-heading text-sm uppercase tracking-widest text-[#9A9A9A] animate-pulse">
        {message}
      </p>
    </div>
  );
};
