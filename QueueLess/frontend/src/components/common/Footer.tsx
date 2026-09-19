import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <Logo size="md" showTagline={true} />
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Turnova empowers users to skip physical lines and gives businesses real-time virtual
              queue management, smart wait-time forecasting, and seamless customer flow.
            </p>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              Built for speed, real-time sync, and delightful customer experiences.
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/discover" className="hover:text-brand-600 dark:hover:text-brand-400">
                  Discover Queues
                </Link>
              </li>
              <li>
                <Link href="/discover?category=Clinics" className="hover:text-brand-600 dark:hover:text-brand-400">
                  Clinics & Healthcare
                </Link>
              </li>
              <li>
                <Link href="/discover?category=Salons" className="hover:text-brand-600 dark:hover:text-brand-400">
                  Salons & Spas
                </Link>
              </li>
              <li>
                <Link href="/discover?category=Restaurants" className="hover:text-brand-600 dark:hover:text-brand-400">
                  Restaurants & Cafes
                </Link>
              </li>
              <li>
                <Link href="/discover?category=Repair+Shops" className="hover:text-brand-600 dark:hover:text-brand-400">
                  Electronics & Repair
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              For Business
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/register" className="hover:text-brand-600 dark:hover:text-brand-400">
                  Register Your Business
                </Link>
              </li>
              <li>
                <Link href="/business-dashboard" className="hover:text-brand-600 dark:hover:text-brand-400">
                  Live Queue Control Room
                </Link>
              </li>
              <li>
                <Link href="/business-dashboard" className="hover:text-brand-600 dark:hover:text-brand-400">
                  QR Poster Studio
                </Link>
              </li>
              <li>
                <Link href="/business-dashboard" className="hover:text-brand-600 dark:hover:text-brand-400">
                  Flow Analytics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-white mb-4">
              Platform & Trust
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  All Systems Operational
                </span>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-600 dark:hover:text-brand-400">
                  Demo Accounts
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand-600 dark:hover:text-brand-400">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Turnova Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/security" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
