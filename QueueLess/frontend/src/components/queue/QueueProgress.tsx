import React from 'react';
import { ArrowRight, Check, User } from 'lucide-react';

interface QueueProgressProps {
  currentServingNum: number;
  userTokenNum: number;
  tokenPrefix?: string;
}

export const QueueProgress: React.FC<QueueProgressProps> = ({
  currentServingNum,
  userTokenNum,
  tokenPrefix = 'A',
}) => {
  // Generate sequence from currentServingNum up to userTokenNum
  // If userTokenNum < currentServingNum, show completed state
  const isPast = userTokenNum < currentServingNum;
  const isCurrent = userTokenNum === currentServingNum;

  // Render at most 6 intermediate steps to prevent overflow on mobile
  const items: { num: number; label: string; isUser: boolean; isServing: boolean }[] = [];

  if (isPast) {
    items.push({ num: userTokenNum, label: `#${tokenPrefix}-${userTokenNum}`, isUser: true, isServing: false });
    items.push({ num: currentServingNum, label: `#${tokenPrefix}-${currentServingNum}`, isUser: false, isServing: true });
  } else {
    const diff = userTokenNum - currentServingNum;
    if (diff <= 6) {
      for (let n = currentServingNum; n <= userTokenNum; n++) {
        items.push({
          num: n,
          label: n === userTokenNum ? 'YOU' : `#${n}`,
          isUser: n === userTokenNum,
          isServing: n === currentServingNum,
        });
      }
    } else {
      // Condensed format: [Serving] -> ... -> [YOU]
      items.push({
        num: currentServingNum,
        label: `#${currentServingNum}`,
        isUser: false,
        isServing: true,
      });
      items.push({
        num: currentServingNum + 1,
        label: `#${currentServingNum + 1}`,
        isUser: false,
        isServing: false,
      });
      items.push({
        num: -1,
        label: `+${diff - 2} more`,
        isUser: false,
        isServing: false,
      });
      items.push({
        num: userTokenNum - 1,
        label: `#${userTokenNum - 1}`,
        isUser: false,
        isServing: false,
      });
      items.push({
        num: userTokenNum,
        label: 'YOU',
        isUser: true,
        isServing: false,
      });
    }
  }

  return (
    <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
      <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center justify-between">
        <span>Queue Progression Pathway</span>
        <span className="text-[10px] text-slate-400 font-normal">Real-time dynamic flow</span>
      </div>

      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
        {items.map((item, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shadow-sm transition-all ${
                  item.isUser
                    ? 'bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-950 scale-105'
                    : item.isServing
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-950'
                    : item.num === -1
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px]'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {item.isUser ? (
                  <User className="w-4 h-4" />
                ) : item.isServing ? (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                ) : (
                  <span>{item.label}</span>
                )}
              </div>
              <span
                className={`mt-1.5 text-[10px] font-semibold ${
                  item.isUser
                    ? 'text-brand-600 dark:text-brand-400 font-bold'
                    : item.isServing
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400'
                }`}
              >
                {item.isUser ? 'YOU' : item.isServing ? 'Serving' : item.label}
              </span>
            </div>

            {idx < items.length - 1 && (
              <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 flex-shrink-0 -mt-4" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
