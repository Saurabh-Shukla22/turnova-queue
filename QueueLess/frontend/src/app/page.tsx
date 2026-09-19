'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { BusinessCard } from '../components/business/BusinessCard';
import { Business } from '../types';
import { api } from '../lib/api';
import {
  Search,
  ArrowRight,
  Clock,
  Smartphone,
  ShieldCheck,
  Zap,
  Users,
  Star,
  CheckCircle,
  Building2,
  Sparkles,
  Bell,
  Play,
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Clinics', icon: '🏥', count: '14 queues' },
  { name: 'Salons', icon: '💇', count: '28 queues' },
  { name: 'Barbers', icon: '✂️', count: '19 queues' },
  { name: 'Restaurants', icon: '🍽️', count: '32 queues' },
  { name: 'Diagnostic Centers', icon: '🔬', count: '9 queues' },
  { name: 'Repair Shops', icon: '📱', count: '12 queues' },
  { name: 'Banks', icon: '🏦', count: '8 queues' },
  { name: 'Government Services', icon: '🏛️', count: '6 queues' },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ success: boolean; businesses: Business[] }>('/businesses?limit=6')
      .then((res) => {
        if (res.success) {
          setFeaturedBusinesses(res.businesses);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/discover?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/discover');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fbff] dark:bg-[#090d16]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden">
          {/* Subtle Ambient Background - classical soft blue gradient aura */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-blue-100/60 via-indigo-50/40 to-transparent dark:from-brand-600/10 dark:via-brand-900/5 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-sky-200/30 dark:bg-brand-500/5 blur-[130px] rounded-full pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Headline, Subtitle, CTAs */}
              <div className="lg:col-span-7 text-left">
                {/* Tagline Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-brand-950/60 border border-blue-200/80 dark:border-brand-800/80 text-brand-600 dark:text-brand-400 text-xs font-semibold mb-6 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                  <span>Skip the Wait, Live More</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.08]">
                  Your Turn, <br />
                  <span className="text-brand-600 dark:text-brand-400">
                    Your Time.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
                  Turnova helps you join virtual queues, book appointments, and track your turn in real-time. No more long waits. Just a smarter way to move ahead.
                </p>

                {/* CTA Buttons */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link
                    href="/register"
                    className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="/#how-it-works"
                    className="px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-sm transition-colors flex items-center gap-2"
                  >
                    <div className="w-5 h-5 rounded-full bg-brand-50 dark:bg-brand-950/80 flex items-center justify-center text-brand-600">
                      <Play className="w-2.5 h-2.5 fill-current" />
                    </div>
                    <span>Watch Demo</span>
                  </Link>
                </div>

                {/* Live Search Bar */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="mt-8 max-w-xl p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg flex items-center gap-2"
                >
                  <div className="relative flex-1 flex items-center pl-3">
                    <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search clinics, salons, restaurants..."
                      className="w-full px-3 py-1.5 bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white hover:bg-brand-600 dark:hover:bg-brand-500 text-white dark:text-slate-900 hover:text-white text-xs font-medium transition-colors flex-shrink-0 flex items-center gap-1.5"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </form>

                {/* Quick Metrics */}
                <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg pt-6 border-t border-slate-200/60 dark:border-slate-800/60">
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      10K+
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      Happy Users
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-brand-600 dark:text-brand-400">
                      500+
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      Businesses
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      50K+
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      Queues Managed
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Reference Visual with Floating Notification Card */}
              <div className="lg:col-span-5 relative flex justify-center items-center">
                <div className="relative w-full max-w-lg lg:max-w-none">
                  {/* Floating Notification Card matching screenshot */}
                  <div className="absolute top-6 left-2 sm:left-6 z-30 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-blue-600/10 flex items-center gap-3.5 backdrop-blur-md transition-all hover:scale-105 duration-300">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/30">
                      <Bell className="w-5 h-5 sm:w-6 sm:h-6 fill-current animate-pulse" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        Your turn is near!
                      </div>
                      <div className="text-[11px] sm:text-xs font-semibold text-brand-600 dark:text-brand-400">
                        Token #A12
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">
                        2 minutes left
                      </div>
                    </div>
                  </div>

                  {/* Main Hero Graphic: Crystal Clear HD with gentle Left Outer Blur Fade */}
                  <div className="relative flex justify-end overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl shadow-blue-500/5">
                    <Image
                      src="/hero-person.png?v=3"
                      alt="Turnova Smart Real-Time Virtual Queuing"
                      width={620}
                      height={700}
                      priority
                      unoptimized
                      className="w-full h-auto max-h-[580px] object-cover object-center rounded-2xl sm:rounded-3xl shadow-sm"
                    />

                    {/* Left side outer soft blur & gradient mask for natural seamless look */}
                    <div className="absolute inset-y-0 left-0 w-20 sm:w-28 bg-gradient-to-r from-[#f8fbff] via-[#f8fbff]/50 dark:from-[#090d16] dark:via-[#090d16]/50 to-transparent backdrop-blur-[2px] pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR CATEGORIES */}
        <section className="py-12 border-y border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Popular Categories
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Discover places with active digital queues
                </p>
              </div>
              <Link
                href="/discover"
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/discover?category=${encodeURIComponent(cat.name)}`}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-brand-50/50 dark:hover:bg-brand-950/30 border border-slate-200/60 dark:border-slate-700/60 hover:border-brand-300 dark:hover:border-brand-700 text-center transition-all group shadow-sm flex flex-col items-center justify-center"
                >
                  <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{cat.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* HOW QUEUELESS WORKS */}
        <section id="how-it-works" className="py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Simple & Seamless
              </span>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                How Turnova Works
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                Join from anywhere, spend your waiting time however you wish, and step in right on
                cue.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Step 1 */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-black text-lg flex items-center justify-center mb-4">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Discover & Join
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Search nearby clinics, salons, or restaurants. Select the service and join the
                  virtual queue in one tap. Or scan their in-store QR code.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-black text-lg flex items-center justify-center mb-4">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Track Live Position
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Watch the counter advance in real time via Socket.IO without refreshing. Get smart
                  wait-time forecasts calibrated from historical flow.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-black text-lg flex items-center justify-center mb-4">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Arrive & Be Served
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  Receive an alert when you are 2 customers away, and a pleasant chime when it's your
                  turn. Walk right up to the counter without waiting!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE & FEATURED QUEUES */}
        <section className="py-16 bg-slate-100/60 dark:bg-slate-900/30 border-y border-slate-200/60 dark:border-slate-800/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Virtual Queues
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  Explore Active Places
                </h2>
              </div>
              <Link
                href="/discover"
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                Browse all businesses <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-80 rounded-2xl bg-white dark:bg-slate-900 animate-pulse border border-slate-200 dark:border-slate-800"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredBusinesses.map((biz) => (
                  <BusinessCard key={biz._id} business={biz} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* WHY QUEUELESS (VALUE PROPS) */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Built For Speed & Ease
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
                  The modern standard for customer flow
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                  Physical waiting rooms cause friction, overcrowding, and lost customers. Turnova
                  transforms queuing into an effortless, transparent digital experience.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Instant Socket.IO Real-Time Sync
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Whenever the counter clicks "Next Customer", everyone's screen updates
                        instantly with zero lag or page reloads.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Smart Wait-Time Forecasting
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Estimates are dynamically calibrated using real completed service durations
                        today, displayed as realistic ranges (e.g. 25–35 min).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        Scan-to-Join QR Posters
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Walk-in customers can scan your business QR code at the door to join the queue
                        on their own devices immediately.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual preview card */}
              <div className="rounded-3xl bg-gradient-to-tr from-brand-600 to-indigo-700 p-1 shadow-2xl">
                <div className="rounded-[22px] bg-slate-950 p-6 sm:p-8 text-white">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold">City Care Clinic • Live Queue</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                      ONLINE
                    </span>
                  </div>

                  <div className="py-8 text-center">
                    <div className="text-xs uppercase tracking-widest text-slate-400">
                      Currently Serving
                    </div>
                    <div className="text-6xl font-black text-emerald-400 mt-2">#A-20</div>
                    <div className="text-xs text-slate-400 mt-1">Rahul Sharma • General Consultation</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-center">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Next in Line</div>
                      <div className="text-base font-bold text-white mt-0.5">#A-21 Aman V.</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-[10px] text-slate-400">Waiting Ahead</div>
                      <div className="text-base font-bold text-brand-400 mt-0.5">6 Customers</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CUSTOMER TESTIMONIALS */}
        <section className="py-16 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                User Stories
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Loved by patients, clients, and diners
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex text-amber-400">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  "I was able to sit at Starbucks working on my laptop until token #19 was called at
                  City Care Clinic. Walked in and was seen right away. Saved over an hour!"
                </p>
                <div className="text-xs font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                  Priya Patel <span className="font-normal text-slate-400">• Clinic Patient</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex text-amber-400">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  "As a salon owner, our waiting area used to be crowded and stressful on weekends.
                  Now clients browse nearby shops and arrive peacefully when alerted."
                </p>
                <div className="text-xs font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                  Style Studio Owner <span className="font-normal text-slate-400">• Business Partner</span>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex text-amber-400">
                  {'★'.repeat(5)}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  "The live position indicator is ridiculously smooth. You can literally see people
                  ahead tick down from 7 to 0 with a pleasant sound chime when it's your turn."
                </p>
                <div className="text-xs font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                  Yash Sharma <span className="font-normal text-slate-400">• Turnova User</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BUSINESS CTA BANNER */}
        <section className="py-16 md:py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-indigo-700 p-8 sm:p-12 text-center text-white shadow-xl relative overflow-hidden">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                Ready to eliminate waiting lines at your business?
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-brand-100 max-w-xl mx-auto leading-relaxed">
                Set up your business queue in under 2 minutes. Generate printable QR posters, manage
                walk-ins, book appointments, and delight your customers.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-slate-900 hover:bg-brand-50 font-bold text-xs shadow-md transition-colors"
                >
                  Register Your Business Free
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-brand-700 hover:bg-brand-800 border border-brand-500 text-white font-bold text-xs transition-colors"
                >
                  Try Demo Business Account
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
