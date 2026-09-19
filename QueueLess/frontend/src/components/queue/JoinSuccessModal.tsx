'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Clock, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface JoinSuccessModalProps {
  isOpen: boolean;
  entryId: string;
  tokenCode: string;
  peopleAhead: number;
  estimatedWait: string;
  businessName: string;
  serviceName: string;
}

export const JoinSuccessModal: React.FC<JoinSuccessModalProps> = ({
  isOpen,
  entryId,
  tokenCode,
  peopleAhead,
  estimatedWait,
  businessName,
  serviceName,
}) => {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#6366f1', '#10b981', '#f59e0b'],
        });
      } catch {
        // Confetti optional
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTrack = () => {
    router.push(`/queue/${entryId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-brand-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 scale-110">
          <Sparkles className="w-8 h-8 animate-pulse" />
        </div>

        <div>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Confirmed Virtual Queue Entry
          </span>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            You're in!
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {businessName} • {serviceName}
          </p>
        </div>

        {/* Token Highlights */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Your Token
          </div>
          <div className="text-4xl font-black text-brand-600 dark:text-brand-400 mt-1">
            #{tokenCode}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                People Ahead
              </span>
              <strong className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {peopleAhead}
              </strong>
            </div>

            <div className="flex flex-col items-center">
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Estimated Wait
              </span>
              <strong className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {estimatedWait}
              </strong>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          You don't need to wait in line physically! We will send you real-time alerts as your turn
          approaches.
        </p>

        <button
          onClick={handleTrack}
          className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Track Live Position</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
