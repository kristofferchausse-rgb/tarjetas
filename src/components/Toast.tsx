import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-11/12 transition-all duration-300 animate-in fade-in slide-in-from-top-4"
    >
      <div className="bg-[#2f3130] text-[#f1f1f0] px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-stone-700/60">
        <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
        <p className="text-[13px] font-medium flex-1 leading-snug">{message}</p>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white text-xs px-1.5 py-0.5 rounded cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
