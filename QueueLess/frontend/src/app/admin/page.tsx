'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import {
  ShieldCheck,
  Users,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flag,
  Trash2,
  Search,
  Sparkles,
} from 'lucide-react';

export default function AdminPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'businesses' | 'reports'>('stats');

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    activeQueues: 0,
    todayTokens: 0,
    completedTokens: 0,
    pendingReports: 0,
  });

  const [usersList, setUsersList] = useState<any[]>([]);
  const [businessesList, setBusinessesList] = useState<any[]>([]);
  const [reportsList, setReportsList] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [user, isAuthLoading]);

  const loadAdminData = async () => {
    try {
      const [sRes, uRes, bRes, rRes] = await Promise.all([
        api.get<{ success: boolean; stats: any }>('/admin/stats'),
        api.get<{ success: boolean; users: any[] }>('/admin/users'),
        api.get<{ success: boolean; businesses: any[] }>('/admin/businesses'),
        api.get<{ success: boolean; reports: any[] }>('/admin/reports'),
      ]);

      if (sRes.success) setStats(sRes.stats);
      if (uRes.success) setUsersList(uRes.users);
      if (bRes.success) setBusinessesList(bRes.businesses);
      if (rRes.success) setReportsList(rRes.reports);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadAdminData();
    }
  }, [user]);

  const handleToggleUserStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
      setUsersList((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleBusinessStatus = async (businessId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      await api.patch(`/admin/businesses/${businessId}/status`, { status: newStatus });
      setBusinessesList((prev) =>
        prev.map((b) => (b._id === businessId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (isAuthLoading || !user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
          Checking administrator credentials...
        </div>
        <Footer />
      </div>
    );
  }

  const filteredUsers = usersList.filter(
    (u) =>
      u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>Platform Governance & Supervision</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Turnova Admin Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Global metrics, business approvals, user moderation, and reports overview.
          </p>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Users</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats.totalUsers}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-400">Businesses</div>
            <div className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">
              {stats.totalBusinesses}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-400">Active Queues</div>
            <div className="text-2xl font-black text-emerald-500 mt-1">{stats.activeQueues}</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-400">Today's Tokens</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {stats.todayTokens}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-400">Completed Visits</div>
            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
              {stats.completedTokens}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-400">Flagged Reports</div>
            <div className="text-2xl font-black text-rose-500 mt-1">{stats.pendingReports}</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 pb-2 text-xs font-semibold">
          {[
            { id: 'stats', label: 'Platform Summary', icon: Sparkles },
            { id: 'users', label: `Users (${usersList.length})`, icon: Users },
            { id: 'businesses', label: `Businesses (${businessesList.length})`, icon: Building2 },
            { id: 'reports', label: `User Reports (${reportsList.length})`, icon: Flag },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: SUMMARY */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Platform Health & Live Engine
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Turnova real-time infrastructure is running on Node.js, Express, Socket.IO, and
                MongoDB. All queue rooms are active and broadcasting state updates with zero latency.
              </p>
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Database Engine</span>
                  <strong className="text-emerald-600">MongoDB 8.0 (Connected)</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Real-Time Server</span>
                  <strong className="text-emerald-600">Socket.IO (Active)</strong>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Token Algorithm</span>
                  <strong className="text-slate-800 dark:text-slate-200">Historical Calibrated Queue Engine</strong>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Admin Demo Quick Switcher
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You can switch between any demo persona at any time:
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs space-y-2 font-mono">
                <div>User: user@queueless.demo (Yash Sharma)</div>
                <div>Business: business@queueless.demo (Dr. Arjun Mehta)</div>
                <div>Admin: admin@queueless.demo (System Admin)</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Registered Users & Roles
              </h3>
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user name or email..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs"
                />
              </div>
            </div>

            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredUsers.map((u) => (
                <div key={u._id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{u.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {u.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {u.email} • {u.phone}
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleUserStatus(u._id, u.status || 'active')}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                      u.status === 'suspended'
                        ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                        : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-rose-50 hover:text-rose-600'
                    }`}
                  >
                    {u.status === 'suspended' ? 'Suspended (Click to Unban)' : 'Active (Click to Suspend)'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BUSINESSES MANAGEMENT */}
        {activeTab === 'businesses' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Business Directory & Status
            </h3>

            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {businessesList.map((b) => (
                <div key={b._id} className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{b.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 font-semibold">
                        {b.category}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Owner: {b.ownerId?.name || 'Owner'} ({b.ownerId?.email || b.email}) • {b.phone}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleBusinessStatus(b._id, b.status || 'active')}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold ${
                        b.status === 'suspended'
                          ? 'bg-rose-100 text-rose-600'
                          : 'bg-emerald-50 text-emerald-600 hover:bg-rose-50 hover:text-rose-600'
                      }`}
                    >
                      {b.status === 'suspended' ? 'Suspended' : 'Approved & Active'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REPORTS MODERATION */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Customer Reports & Moderation
            </h3>
            {reportsList.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                Zero active complaints! All queues and businesses are operating safely.
              </div>
            ) : (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {reportsList.map((rep) => (
                  <div key={rep._id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        Reason: {rep.reason}
                      </div>
                      <div className="text-slate-500 mt-0.5">
                        Target: {rep.businessId?.name} • Reporter: {rep.reporterUserId?.name}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                      {rep.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
