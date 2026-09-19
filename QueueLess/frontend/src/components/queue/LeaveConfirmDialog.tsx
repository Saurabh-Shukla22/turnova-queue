import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface LeaveConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  tokenCode: string;
  isLeaving?: boolean;
}

export const LeaveConfirmDialog: React.FC<LeaveConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  tokenCode,
  isLeaving = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center space-y-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 mx-auto rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Leave Queue?
        </h3>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Are you sure you want to surrender Token <strong>#{tokenCode}</strong>? You will lose your
          current spot in line and will have to request a new token if you wish to join again.
        </p>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={onClose}
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            Stay in Line
          </button>
          <button
            onClick={onConfirm}
            disabled={isLeaving}
            className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-semibold text-xs shadow-sm transition-colors"
          >
            {isLeaving ? 'Leaving...' : 'Yes, Leave Queue'}
          </button>
        </div>
      </div>
    </div>
  );
};
