import React from 'react';
import Link from 'next/link';
import { Business } from '../../types';
import { Star, Clock, Users, MapPin, ArrowRight } from 'lucide-react';
import { formatWaitTime } from '../../lib/utils';

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const waitingCount = business.waitingCount ?? 0;
  const estimatedWait = business.estimatedWait ?? 0;
  const isOpen = business.isOpen ?? true;

  return (
    <div className="group rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
      <div>
        {/* Banner / Header Image */}
        <div className="relative h-44 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          {business.banner || business.logo ? (
            <img
              src={business.banner || business.logo}
              alt={business.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">
              {business.name}
            </div>
          )}

          {/* Open/Closed Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${
                isOpen
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-slate-800/90 text-slate-300'
              }`}
            >
              {isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>

          {/* Category Chip */}
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-md">
              {business.category}
            </span>
          </div>
        </div>

        {/* Info Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
              {business.name}
            </h3>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800/60 flex-shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{business.rating ? business.rating.toFixed(1) : '4.8'}</span>
              <span className="text-slate-400 text-[10px] font-normal">
                ({business.reviewCount ?? 0})
              </span>
            </div>
          </div>

          <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {business.description}
          </p>

          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">
              {business.address.street}, {business.address.city}
            </span>
            {business.distanceKm !== null && business.distanceKm !== undefined && (
              <span className="ml-auto font-medium text-slate-700 dark:text-slate-300 text-[11px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                {business.distanceKm} km
              </span>
            )}
          </div>

          {/* Queue Snapshot Indicator */}
          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <Users className="w-4 h-4 text-brand-500" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Waiting</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {waitingCount} {waitingCount === 1 ? 'person' : 'people'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <Clock className="w-4 h-4 text-amber-500" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Est. Wait</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {formatWaitTime(estimatedWait)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="px-5 pb-5">
        <Link
          href={`/business/${business._id}`}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white hover:bg-brand-600 dark:hover:bg-brand-500 text-white dark:text-slate-900 hover:text-white dark:hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm group-hover:bg-brand-600 group-hover:text-white"
        >
          <span>View Queue & Join</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
