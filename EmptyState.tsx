import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  className = 'py-16'
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 bg-[#0D0D0D] border border-[#1E1E1E] ${className}`}>
      <div className="w-14 h-14 mb-4 rounded-full bg-[#151515] border border-[#2B2B2B] flex items-center justify-center text-[#E50914]">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h3 className="font-heading text-xl font-bold tracking-wider text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-[#9A9A9A] max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-[#E50914] hover:bg-[#FF1A1A] text-white font-heading font-bold text-sm tracking-wider uppercase transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
