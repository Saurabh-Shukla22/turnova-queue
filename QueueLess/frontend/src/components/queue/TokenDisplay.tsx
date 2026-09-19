import React from 'react';
import { QueueEntry } from '../../types';
import { Clock, Users, Sparkles, AlertCircle, CheckCircle2, PauseCircle } from 'lucide-react';

interface TokenDisplayProps {
  entry: QueueEntry;
  peopleAhead: number;
  nowServingToken?: string | number;
  estimatedWaitRange?: string;
  isPaused?: boolean;
  pauseReason?: string;
}

export const TokenDisplay: React.FC<TokenDisplayProps> = ({
  entry,
  peopleAhead,
  nowServingToken,
  estimatedWaitRange,
  isPaused = false,
  pauseReason,
}) => {
  const isMyTurn = entry.status === 'SERVING' || peopleAhead === 0;
  const isApproaching = peopleAhead > 0 && peopleAhead <= 2;
  const isCompleted = entry.status === 'COMPLETED';
  const isCancelled = entry.status === 'CANCELLED';

  return (
    <div className="w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
      {/* Dynamic Status Alert Banner */}
      {isPaused ? (
        <div className="bg-amber-500 text-white px-6 py-2.5 text-xs font-semibold flex items-center justify-center gap-2">
          <PauseCircle className="w-4 h-4" />
          <span>Queue is temporarily paused{pauseReason ? `: ${pauseReason}` : ''}</span>
        </div>
      ) : isMyTurn ? (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>🎉 It's your turn! Please proceed to the service counter immediately.</span>
        </div>
      ) : isApproaching ? (
        <div className="bg-amber-500 text-white px-6 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 animate-pulse">
          <AlertCircle className="w-4 h-4" />
          <span>Your turn is approaching! Only {peopleAhead} customer{peopleAhead > 1 ? 's' : ''} ahead of you.</span>
        </div>
      ) : isCompleted ? (
        <div className="bg-slate-800 text-white px-6 py-2.5 text-xs font-semibold flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>This visit is completed. Thank you for using Turnova!</span>
        </div>
      ) : null}

      <div className="p-6 sm:p-8">
        {/* Main Token Big Card */}
        <div className="text-center py-4">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">
            Your Digital Token
          </div>
          <div className="text-5xl sm:text-6xl font-black tracking-tight text-brand-600 dark:text-brand-400 drop-shadow-sm">
            #{entry.tokenCode}
          </div>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <span
              className={`w-2 h-2 rounded-full ${
                isMyTurn
                  ? 'bg-emerald-500 animate-ping'
                  : isApproaching
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-brand-500'
              }`}
            />
            {entry.status}
          </div>
        </div>

        {/* Live Counters Grid */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          {/* NOW SERVING */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Now Serving
            </div>
            <div className="mt-1 text-2xl font-black text-slate-900 dark:text-white">
              {nowServingToken ? `#${nowServingToken}` : '—'}
            </div>
            <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
              Live Counter
            </div>
          </div>

          {/* PEOPLE AHEAD */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              People Ahead
            </div>
            <div
              className={`mt-1 text-2xl font-black ${
                peopleAhead === 0
                  ? 'text-emerald-500'
                  : peopleAhead <= 2
                  ? 'text-amber-500'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {peopleAhead}
            </div>
            <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
              {peopleAhead === 0 ? 'Next in line!' : 'Waiting customers'}
            </div>
          </div>

          {/* ESTIMATED WAIT */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Estimated Wait
            </div>
            <div className="mt-1 text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {estimatedWaitRange || `${entry.estimatedWaitMinutes || 15} min`}
            </div>
            <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
              Smart Forecast
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
