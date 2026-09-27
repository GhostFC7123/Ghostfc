import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'CONFIRM',
  cancelLabel = 'CANCEL',
  isDestructive = true,
  onConfirm,
  onCancel,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#0D0E12] border border-[#262B3A] p-6 shadow-2xl relative space-y-5"
        style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
      >
        {/* Top accent */}
        <div
          className={`absolute top-0 left-0 right-0 h-[2px] ${
            isDestructive ? 'bg-[#E50914]' : 'bg-emerald-500'
          }`}
        />

        <div className="flex items-start gap-3.5">
          <div
            className={`p-2.5 rounded-none border shrink-0 ${
              isDestructive
                ? 'bg-red-950/40 border-[#E50914] text-[#E50914]'
                : 'bg-emerald-950/40 border-emerald-500 text-emerald-400'
            }`}
          >
            {isDestructive ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1">
            <h3 className="font-heading text-lg font-black text-white uppercase tracking-wider">
              {title}
            </h3>
            <p className="text-xs text-[#8E93A3] leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1C202C]">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-xs font-heading font-black text-[#A0A4B8] hover:text-white bg-[#141722] hover:bg-[#1C202E] border border-[#272C3E] uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2 text-xs font-heading font-black text-white uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-1.5 ${
              isDestructive
                ? 'bg-[#E50914] hover:bg-[#FF1A24] shadow-[0_0_15px_rgba(229,9,20,0.4)]'
                : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {loading ? 'PROCESSING...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
