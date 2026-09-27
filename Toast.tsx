import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-3.5 border shadow-2xl flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-2 ${
            toast.type === 'success'
              ? 'bg-[#0A1A12] border-emerald-500/70 text-emerald-200'
              : toast.type === 'error'
              ? 'bg-[#1F0A0D] border-[#E50914] text-red-200'
              : 'bg-[#0E1118] border-sky-500/70 text-sky-200'
          }`}
          style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#E50914]" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400" />}
          </div>

          <div className="flex-1 min-w-0">
            {toast.title && (
              <h4 className="font-heading font-black text-xs uppercase tracking-wider text-white">
                {toast.title}
              </h4>
            )}
            <p className="text-xs leading-relaxed font-mono opacity-90 break-words">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-white/60 hover:text-white transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
