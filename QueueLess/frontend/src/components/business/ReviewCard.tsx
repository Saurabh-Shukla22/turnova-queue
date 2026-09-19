import React from 'react';
import { Review } from '../../types';
import { Star, ThumbsUp, Clock, CheckCircle } from 'lucide-react';
import { formatRelativeTime } from '../../lib/utils';

export const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-700 dark:text-brand-300 font-bold text-xs flex items-center justify-center">
            {review.userId?.name ? review.userId.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <span>{review.userId?.name || 'Verified Customer'}</span>
              <CheckCircle className="w-3 h-3 text-emerald-500 fill-emerald-500/20" />
            </div>
            <div className="text-[10px] text-slate-400">
              {review.createdAt ? formatRelativeTime(review.createdAt) : 'Recently'}
            </div>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3.5 h-3.5 ${
                star <= review.rating
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-200 dark:text-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {review.comment && (
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {review.comment}
        </p>
      )}

      {/* Sub-ratings */}
      <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>Wait Time: <strong className="text-slate-700 dark:text-slate-200">{review.waitTimeRating}/5</strong></span>
        </div>
        <div className="flex items-center gap-1">
          <ThumbsUp className="w-3 h-3 text-slate-400" />
          <span>Service: <strong className="text-slate-700 dark:text-slate-200">{review.serviceRating}/5</strong></span>
        </div>
      </div>
    </div>
  );
};
