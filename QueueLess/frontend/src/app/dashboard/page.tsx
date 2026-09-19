'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { api } from '../../lib/api';
import { QueueEntry, Appointment, Business } from '../../types';
import { formatWaitTime, formatRelativeTime } from '../../lib/utils';
import {
  Users,
  Clock,
  Calendar,
  Heart,
  History,
  Settings,
  Bell,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  Star,
  Compass,
  AlertCircle,
} from 'lucide-react';

export default function UserDashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { socket } = useSocket();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'queues' | 'appointments' | 'history' | 'favorites' | 'settings'
  >('overview');

  const [activeQueues, setActiveQueues] = useState<QueueEntry[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [history, setHistory] = useState<QueueEntry[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Settings form state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading]);

  const loadUserData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [qRes, aRes, hRes, fRes] = await Promise.all([
        api.get<{ success: boolean; activeQueues: QueueEntry[] }>('/queues/entries/my-active'),
        api.get<{ success: boolean; appointments: Appointment[] }>('/appointments'),
        api.get<{ success: boolean; history: QueueEntry[] }>('/queues/entries/my-history'),
        api.get<{ success: boolean; favorites: any[] }>('/favorites'),
      ]);

      if (qRes.success) setActiveQueues(qRes.activeQueues);
      if (aRes.success) setAppointments(aRes.appointments);
      if (hRes.success) setHistory(hRes.history);
      if (fRes.success) setFavorites(fRes.favorites);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserData();
      if (user.notificationSettings) {
        setEmailAlerts(user.notificationSettings.email);
        setPushAlerts(user.notificationSettings.push);
      }
    }
  }, [user]);

  // Real-time updates for active queues
  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => {
      loadUserData();
    };
    socket.on('queue:update', handleUpdate);
    socket.on('queue:called', handleUpdate);
    socket.on('queue:completed', handleUpdate);

    return () => {
      socket.off('queue:update', handleUpdate);
      socket.off('queue:called', handleUpdate);
      socket.off('queue:completed', handleUpdate);
    };
  }, [socket]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch('/notifications/settings', {
        email: emailAlerts,
        push: pushAlerts,
        appointmentReminders: true,
        queueAlerts: true,
      });
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (isAuthLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
          Loading User Dashboard...
        </div>
        <Footer />
      </div>
    );
  }

  const primaryActiveQueue = activeQueues[0];
  const primaryAppointment = appointments.find((a) => a.status === 'CONFIRMED');

  const greeting = (() => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* User Greeting & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {greeting}, {user.name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Track your active virtual tokens, scheduled visits, and favorite places.
            </p>
          </div>

          <Link
            href="/discover"
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm shadow-brand-500/20 transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Discover Queues</span>
          </Link>
        </div>

        {/* Dashboard Horizontal Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 mb-8 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview', icon: Sparkles },
            {
              id: 'queues',
              label: `Active Tokens (${activeQueues.length})`,
              icon: Clock,
            },
            {
              id: 'appointments',
              label: `Appointments (${appointments.length})`,
              icon: Calendar,
            },
            { id: 'history', label: 'History', icon: History },
            { id: 'favorites', label: 'Favorites', icon: Heart },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Top Cards: Active Queue & Upcoming Appointment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Queue Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-brand-500/50 dark:border-brand-500/40 shadow-lg flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                      Live Queue Token
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-500 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </div>

                  {primaryActiveQueue ? (
                    <div className="mt-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {(primaryActiveQueue.businessId as any)?.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {(primaryActiveQueue.serviceId as any)?.name}
                          </p>
                        </div>
                        <div className="text-3xl font-black text-brand-600 dark:text-brand-400">
                          #{primaryActiveQueue.tokenCode}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">
                            People Ahead
                          </div>
                          <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                            {primaryActiveQueue.peopleAhead ?? 0}
                          </div>
                        </div>

                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                          <div className="text-[10px] text-slate-400 font-bold uppercase">
                            Estimated Wait
                          </div>
                          <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                            {primaryActiveQueue.estimatedWait || '15–25 min'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">
                      You are not currently in any virtual queue.
                    </div>
                  )}
                </div>

                {primaryActiveQueue ? (
                  <Link
                    href={`/queue/${primaryActiveQueue._id}`}
                    className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <span>Track Real-Time Position</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href="/discover"
                    className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Browse Queues</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {/* Upcoming Appointment Card */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                      Upcoming Appointment
                    </span>
                    <Calendar className="w-4 h-4 text-purple-500" />
                  </div>

                  {primaryAppointment ? (
                    <div className="mt-4 space-y-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {(primaryAppointment.businessId as any)?.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {(primaryAppointment.serviceId as any)?.name}
                        </p>
                      </div>

                      <div className="p-3 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
                        <div className="text-xs font-bold text-purple-900 dark:text-purple-300">
                          {primaryAppointment.date} • {primaryAppointment.timeSlot}
                        </div>
                        <div className="text-[10px] text-purple-600 dark:text-purple-400 mt-0.5">
                          Status: Confirmed Priority Slot
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No upcoming appointments scheduled.
                    </div>
                  )}
                </div>

                <Link
                  href="/discover"
                  className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book New Appointment</span>
                </Link>
              </div>
            </div>

            {/* Recent History Preview */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Recently Visited Places
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your previous virtual queue visits
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('history')}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  View full history →
                </button>
              </div>

              {history.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No previous visits recorded yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {history.slice(0, 3).map((item) => (
                    <div key={item._id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                          #{item.tokenCode}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {(item.businessId as any)?.name}
                          </h4>
                          <p className="text-[11px] text-slate-500">
                            {(item.serviceId as any)?.name} •{' '}
                            {item.completedAt
                              ? formatRelativeTime(item.completedAt)
                              : 'Completed'}
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                        Completed
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE TOKENS */}
        {activeTab === 'queues' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Your Active Virtual Tokens
            </h2>
            {activeQueues.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-3">
                <Clock className="w-10 h-10 mx-auto text-slate-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No active queues
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse nearby places and join a digital queue from your phone.
                </p>
                <Link
                  href="/discover"
                  className="inline-block mt-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
                >
                  Discover Queues
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeQueues.map((q) => (
                  <div
                    key={q._id}
                    className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-base text-slate-900 dark:text-white">
                          {(q.businessId as any)?.name}
                        </h3>
                        <p className="text-xs text-slate-500">{(q.serviceId as any)?.name}</p>
                      </div>
                      <span className="text-3xl font-black text-brand-600 dark:text-brand-400">
                        #{q.tokenCode}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <div className="text-[10px] text-slate-400">People Ahead</div>
                        <div className="text-base font-bold text-slate-900 dark:text-white">
                          {q.peopleAhead ?? 0}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <div className="text-[10px] text-slate-400">Estimated Wait</div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                          {q.estimatedWait || '15-25 min'}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/queue/${q._id}`}
                      className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <span>Track Live Queue</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Your Booked Appointments
            </h2>
            {appointments.length === 0 ? (
              <div className="py-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 space-y-3">
                <Calendar className="w-10 h-10 mx-auto text-slate-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No appointments found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Reserve a dedicated time slot for clinics, dental checkups, or salons.
                </p>
                <Link
                  href="/discover"
                  className="inline-block mt-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
                >
                  Book an Appointment
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {appointments.map((a) => (
                  <div
                    key={a._id}
                    className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {(a.businessId as any)?.name}
                      </h4>
                      <p className="text-xs text-slate-500">{(a.serviceId as any)?.name}</p>
                      <div className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1">
                        {a.date} at {a.timeSlot}
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        a.status === 'CONFIRMED'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : a.status === 'CANCELLED'
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: QUEUE HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Queue History & Visits
            </h2>
            {history.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No past visit records.
              </div>
            ) : (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {history.map((h) => (
                  <div key={h._id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 font-bold text-xs flex items-center justify-center text-slate-700 dark:text-slate-200">
                        #{h.tokenCode}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {(h.businessId as any)?.name}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {(h.serviceId as any)?.name} • Joined {formatRelativeTime(h.joinedAt)}
                        </p>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {h.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: FAVORITES */}
        {activeTab === 'favorites' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Your Favorite Places
            </h2>
            {favorites.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                You haven't saved any favorite businesses yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favorites.map((fav) => (
                  <div
                    key={fav._id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {fav.business?.name}
                      </h4>
                      <p className="text-xs text-slate-500">{fav.business?.category}</p>
                    </div>
                    <Link
                      href={`/business/${fav.business?._id}`}
                      className="px-3 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-xl space-y-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Notification Preferences
            </h2>

            {settingsSaved && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Preferences saved successfully!</span>
              </div>
            )}

            <form
              onSubmit={handleSaveSettings}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="text-xs font-semibold text-slate-900 dark:text-white">
                    Email Notifications
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Receive confirmation receipts and summary emails
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
              </label>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      Real-Time Push Alerts
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Alerts when your turn is approaching or called
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushAlerts}
                    onChange={(e) => setPushAlerts(e.target.checked)}
                    className="rounded text-brand-600 focus:ring-brand-500"
                  />
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-sm"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
