import React from 'react';
import { Service } from '../../types';
import { Clock, Tag } from 'lucide-react';
import { formatCurrency, formatWaitTime } from '../../lib/utils';

interface ServiceCardProps {
  service: Service;
  isSelected?: boolean;
  onSelect?: () => void;
  actionButtonLabel?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  isSelected = false,
  onSelect,
  actionButtonLabel = 'Select Service',
}) => {
  return (
    <div
      onClick={onSelect}
      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
        isSelected
          ? 'bg-brand-50/50 dark:bg-brand-950/30 border-brand-500 ring-2 ring-brand-500/20 shadow-sm'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            {service.name}
          </h4>
          <span className="font-bold text-xs text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2 py-0.5 rounded-lg border border-brand-200/60 dark:border-brand-900/60">
            {formatCurrency(service.price)}
          </span>
        </div>

        {service.description && (
          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {service.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Avg. {formatWaitTime(service.durationMinutes)}</span>
        </div>

        <button
          type="button"
          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
            isSelected
              ? 'bg-brand-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-brand-50 hover:text-brand-600'
          }`}
        >
          {isSelected ? 'Selected' : actionButtonLabel}
        </button>
      </div>
    </div>
  );
};
