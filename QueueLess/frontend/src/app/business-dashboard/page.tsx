'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { WalkInModal } from '../../components/queue/WalkInModal';
import { AnalyticsCharts } from '../../components/analytics/AnalyticsCharts';
import { QRCodeModal } from '../../components/business/QRCodeModal';
import { Business, Queue, QueueEntry, Service, Staff } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { api } from '../../lib/api';
import { formatCurrency, formatWaitTime, formatRelativeTime } from '../../lib/utils';
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  UserPlus,
  QrCode,
  Calendar,
  Layers,
  BarChart3,
  Settings,
  Shield,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';

export default function BusinessDashboardPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { socket, joinBusinessRoom, leaveBusinessRoom } = useSocket();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    'live-queue' | 'services' | 'appointments' | 'staff' | 'analytics' | 'qr' | 'settings'
  >('live-queue');

  const [business, setBusiness] = useState<Business | null>(null);
  const [queues, setQueues] = useState<Queue[]>([]);
  const [activeQueueId, setActiveQueueId] = useState<string>('');

  // Live Queue State
  const [servingEntry, setServingEntry] = useState<any | null>(null);
  const [waitingEntries, setWaitingEntries] = useState<any[]>([]);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [pauseReason, setPauseReason] = useState<string>('');

  // Metrics
  const [metrics, setMetrics] = useState({
    todayCustomers: 84,
    waitingCustomers: 14,
    completedCount: 61,
    cancelledCount: 9,
    averageWaitMin: 18,
  });

  // Analytics datasets
  const [analyticsData, setAnalyticsData] = useState<any | null>(null);

  // Services & Staff & Appointments
  const [services, setServices] = useState<Service[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  // Modals & form state
  const [showWalkInModal, setShowWalkInModal] = useState<boolean>(false);
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);

  // New service state
  const [showAddService, setShowAddService] = useState<boolean>(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('350');
  const [newServiceDuration, setNewServiceDuration] = useState('15');

  // New staff state
  const [showAddStaff, setShowAddStaff] = useState<boolean>(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Token Coordinator');

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login');
    }
  }, [user, isAuthLoading]);

  // Load business data
  const loadBusinessData = async () => {
    try {
      // Find business owned by user or by user.businessId
      let bizId = user?.businessId;
      if (!bizId) {
        const meRes = await api.get<{ success: boolean; user: any }>('/auth/me');
        if (meRes.success && meRes.user.business?._id) {
          bizId = meRes.user.business._id;
        }
      }

      // If still not found, check businesses list fallback
      if (!bizId) {
        const bList = await api.get<{ success: boolean; businesses: Business[] }>('/businesses');
        if (bList.success && bList.businesses.length > 0) {
          bizId = bList.businesses[0]._id;
        }
      }

      if (!bizId) return;

      const [bizRes, qRes, aRes, stRes, appRes] = await Promise.all([
        api.get<{ success: boolean; business: Business }>(`/businesses/${bizId}`),
        api.get<{ success: boolean; queues: Queue[] }>(`/queues/business/${bizId}`),
        api.get<{ success: boolean; metrics: any; charts: any }>(`/analytics/business/${bizId}`),
        api.get<{ success: boolean; staff: Staff[] }>(`/staff/business/${bizId}`),
        api.get<{ success: boolean; appointments: any[] }>(`/appointments?businessId=${bizId}`),
      ]);

      if (bizRes.success) {
        setBusiness(bizRes.business);
        setServices(bizRes.business.services || []);
      }

      if (qRes.success && qRes.queues.length > 0) {
        setQueues(qRes.queues);
        const qId = activeQueueId || qRes.queues[0]._id;
        setActiveQueueId(qId);
        loadLiveQueueState(qId);
      }

      if (aRes.success) {
        setMetrics(aRes.metrics);
        setAnalyticsData(aRes.charts);
      }

      if (stRes.success) setStaffList(stRes.staff);
      if (appRes.success) setAppointments(appRes.appointments);
    } catch (err) {
      console.error('Error loading business dashboard data:', err);
    }
  };

  const loadLiveQueueState = async (queueId: string) => {
    try {
      const res = await api.get<{ success: boolean; liveState: any }>(`/queues/${queueId}/live`);
      if (res.success && res.liveState) {
        setServingEntry(res.liveState.servingEntry);
        setWaitingEntries(res.liveState.nextEntries || []);
        setIsPaused(res.liveState.isPaused || false);
        setPauseReason(res.liveState.pauseReason || '');
        setMetrics((prev) => ({
          ...prev,
          waitingCustomers: res.liveState.waitingCount || 0,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) {
      loadBusinessData();
    }
  }, [user]);

  // Real-time Socket.IO synchronization
  useEffect(() => {
    if (!business?._id) return;
    joinBusinessRoom(business._id);

    if (socket) {
      const handleQueueUpdate = () => {
        if (activeQueueId) {
          loadLiveQueueState(activeQueueId);
        }
      };

      socket.on('queue:update', handleQueueUpdate);
      socket.on('queue:called', handleQueueUpdate);
      socket.on('queue:completed', handleQueueUpdate);
      socket.on('queue:cancelled', handleQueueUpdate);
      socket.on('queue:paused', handleQueueUpdate);
      socket.on('queue:resumed', handleQueueUpdate);

      return () => {
        socket.off('queue:update', handleQueueUpdate);
        socket.off('queue:called', handleQueueUpdate);
        socket.off('queue:completed', handleQueueUpdate);
        socket.off('queue:cancelled', handleQueueUpdate);
        socket.off('queue:paused', handleQueueUpdate);
        socket.off('queue:resumed', handleQueueUpdate);
        leaveBusinessRoom(business._id);
      };
    }
  }, [business?._id, activeQueueId, socket]);

  // LIVE QUEUE ACTIONS
  const handleNextCustomer = async () => {
    if (!activeQueueId) return;
    setIsActionLoading(true);
    try {
      await api.post(`/queues/${activeQueueId}/next`);
      loadLiveQueueState(activeQueueId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleRecall = async () => {
    if (!activeQueueId) return;
    try {
      await api.post(`/queues/${activeQueueId}/recall`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSkip = async () => {
    if (!activeQueueId) return;
    try {
      await api.post(`/queues/${activeQueueId}/skip`);
      loadLiveQueueState(activeQueueId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePause = async () => {
    if (!activeQueueId) return;
    try {
      if (isPaused) {
        await api.post(`/queues/${activeQueueId}/resume`);
        setIsPaused(false);
      } else {
        await api.post(`/queues/${activeQueueId}/pause`, { reason: 'Short 10-minute break' });
        setIsPaused(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // SERVICES CRUD
  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business?._id || !newServiceName) return;
    try {
      const res = await api.post<{ success: boolean; service: Service }>(
        `/services/business/${business._id}`,
        {
          name: newServiceName,
          price: Number(newServicePrice),
          durationMinutes: Number(newServiceDuration),
        }
      );
      if (res.success) {
        setServices((prev) => [...prev, res.service]);
        setNewServiceName('');
        setShowAddService(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteService = async (id: string) => {
    try {
      await api.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // STAFF CRUD
  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business?._id || !newStaffName) return;
    try {
      const res = await api.post<{ success: boolean; staff: Staff }>(
        `/staff/business/${business._id}`,
        {
          name: newStaffName,
          email: newStaffEmail,
          phone: newStaffPhone,
          role: newStaffRole,
          permissions: {
            manageQueue: true,
            callNext: true,
            completeToken: true,
            viewCustomers: true,
          },
        }
      );
      if (res.success) {
        setStaffList((prev) => [...prev, res.staff]);
        setNewStaffName('');
        setNewStaffEmail('');
        setNewStaffPhone('');
        setShowAddStaff(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      await api.delete(`/staff/${id}`);
      setStaffList((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (isAuthLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
          Loading Business Dashboard...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Business Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Business Owner Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {business?.name || 'Business Dashboard'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Live Queue Control Room, walk-ins, services, appointments, and flow analytics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQRModal(true)}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 shadow-sm"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Poster</span>
            </button>
            <button
              onClick={() => setShowWalkInModal(true)}
              className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm shadow-brand-500/20"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Add Walk-in Customer</span>
            </button>
          </div>
        </div>

        {/* 5 KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-400">Today's Customers</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {metrics.todayCustomers}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Processed today</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-400">Currently Waiting</div>
            <div className="text-2xl font-black text-brand-600 dark:text-brand-400 mt-1">
              {metrics.waitingCustomers}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">In virtual line</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-400">Completed</div>
            <div className="text-2xl font-black text-emerald-500 mt-1">
              {metrics.completedCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Successful visits</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-[10px] uppercase font-bold text-slate-400">Cancelled / No-Show</div>
            <div className="text-2xl font-black text-rose-500 mt-1">
              {metrics.cancelledCount}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Resolution rate 91%</div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Average Wait</div>
            <div className="text-2xl font-black text-amber-500 mt-1">
              {metrics.averageWaitMin} min
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Historical running avg</div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
          {[
            { id: 'live-queue', label: 'Live Queue Control Room', icon: Play },
            { id: 'services', label: `Services (${services.length})`, icon: Layers },
            { id: 'appointments', label: `Appointments (${appointments.length})`, icon: Calendar },
            { id: 'staff', label: `Staff Operators (${staffList.length})`, icon: Shield },
            { id: 'analytics', label: 'Flow Analytics', icon: BarChart3 },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: LIVE QUEUE CONTROL ROOM (CORE) */}
        {activeTab === 'live-queue' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CURRENTLY SERVING (Big Prominent Control Panel) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-brand-500/80 dark:border-brand-500/60 shadow-xl space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Now Serving Counter
                    </span>
                  </div>

                  {isPaused && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-300">
                      Queue Paused
                    </span>
                  )}
                </div>

                {servingEntry ? (
                  <div className="text-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                    <div className="text-6xl sm:text-7xl font-black text-brand-600 dark:text-brand-400">
                      #{servingEntry.tokenCode}
                    </div>
                    <div className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                      {servingEntry.customerName}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {servingEntry.serviceId?.name || 'General Service'} • Phone: {servingEntry.customerPhone}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Started {servingEntry.servedAt ? formatRelativeTime(servingEntry.servedAt) : 'just now'}
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    No customer currently at the counter. Click "Next Customer" to call the next in line!
                  </div>
                )}

                {/* CONTROL BUTTONS */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                  <button
                    onClick={handleNextCustomer}
                    disabled={isActionLoading}
                    className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all col-span-2 sm:col-span-1"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Next Customer</span>
                  </button>

                  <button
                    onClick={handleRecall}
                    disabled={!servingEntry}
                    className="py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Recall</span>
                  </button>

                  <button
                    onClick={handleSkip}
                    disabled={!servingEntry}
                    className="py-3 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    <span>Skip / No-Show</span>
                  </button>

                  <button
                    onClick={handleTogglePause}
                    className={`py-3 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      isPaused
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    <span>{isPaused ? 'Resume Queue' : 'Pause Queue'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* UPCOMING WAITING CUSTOMERS (Next in line) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Next Customers Waiting
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {waitingEntries.length} customers in active line
                  </p>
                </div>
                <button
                  onClick={() => setShowWalkInModal(true)}
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  + Walk-in
                </button>
              </div>

              {waitingEntries.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No customers currently waiting.
                </div>
              ) : (
                <div className="space-y-2 max-h-[420px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                  {waitingEntries.map((w, idx) => (
                    <div
                      key={w._id}
                      className="pt-2 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold flex items-center justify-center text-brand-600 dark:text-brand-400 text-xs">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>#{w.tokenCode}</span>
                            <span className="font-normal text-slate-600 dark:text-slate-300">
                              {w.customerName}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {w.serviceId?.name || 'Service'} • {w.isWalkIn ? 'Walk-in' : 'Mobile'}
                          </div>
                        </div>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-500">
                        {w.estimatedWaitMinutes ? `${w.estimatedWaitMinutes}m` : 'Next'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SERVICES MANAGEMENT */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Services Catalog
                </h2>
                <p className="text-xs text-slate-500">
                  Manage the services offered by your business
                </p>
              </div>
              <button
                onClick={() => setShowAddService(!showAddService)}
                className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Service</span>
              </button>
            </div>

            {showAddService && (
              <form
                onSubmit={handleCreateService}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  New Service Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Service Name</label>
                    <input
                      type="text"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      placeholder="e.g. General Consultation"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Price (₹)</label>
                    <input
                      type="number"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Avg Duration (Minutes)</label>
                    <input
                      type="number"
                      value={newServiceDuration}
                      onChange={(e) => setNewServiceDuration(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddService(false)}
                    className="px-3 py-1.5 text-xs text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-semibold"
                  >
                    Save Service
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((svc) => (
                <div
                  key={svc._id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {svc.name}
                    </h3>
                    <div className="text-xs text-brand-600 dark:text-brand-400 font-bold mt-1">
                      {formatCurrency(svc.price)} • {svc.durationMinutes} min
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteService(svc._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: APPOINTMENTS */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Upcoming Scheduled Appointments
            </h2>
            {appointments.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No appointments booked yet.
              </div>
            ) : (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                {appointments.map((a) => (
                  <div key={a._id} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">
                        {a.customerName} ({a.customerPhone})
                      </div>
                      <div className="text-slate-500">
                        {a.serviceId?.name} • {a.date} at {a.timeSlot}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-600 border border-purple-200">
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STAFF MANAGEMENT */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Staff Members & Operators
                </h2>
                <p className="text-xs text-slate-500">
                  Assign counter staff with fine-grained queue call permissions
                </p>
              </div>
              <button
                onClick={() => setShowAddStaff(!showAddStaff)}
                className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Staff</span>
              </button>
            </div>

            {showAddStaff && (
              <form
                onSubmit={handleCreateStaff}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  New Staff Member
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Name</label>
                    <input
                      type="text"
                      value={newStaffName}
                      onChange={(e) => setNewStaffName(e.target.value)}
                      placeholder="e.g. Dr. Sunita Deshmukh"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Email</label>
                    <input
                      type="email"
                      value={newStaffEmail}
                      onChange={(e) => setNewStaffEmail(e.target.value)}
                      placeholder="sunita@example.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newStaffPhone}
                      onChange={(e) => setNewStaffPhone(e.target.value)}
                      placeholder="+91 98888 33301"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Role</label>
                    <input
                      type="text"
                      value={newStaffRole}
                      onChange={(e) => setNewStaffRole(e.target.value)}
                      placeholder="e.g. Counter Operator"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddStaff(false)}
                    className="px-3 py-1.5 text-xs text-slate-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-semibold"
                  >
                    Save Staff
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {staffList.map((st) => (
                <div
                  key={st._id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between"
                >
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{st.name}</h3>
                    <div className="text-xs text-brand-600 dark:text-brand-400 font-semibold mt-0.5">
                      {st.role}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      {st.email} • {st.phone}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteStaff(st._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FLOW ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Queue & Customer Flow Analytics
              </h2>
              <p className="text-xs text-slate-500">
                Data insights powered by completed queue logs and service timing calibrations
              </p>
            </div>

            {analyticsData ? (
              <AnalyticsCharts
                customersPerDay={analyticsData.customersPerDay || []}
                peakHours={analyticsData.peakHours || []}
                servicePopularity={analyticsData.servicePopularity || []}
                statusBreakdown={analyticsData.statusBreakdown || []}
              />
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                Loading analytics charts...
              </div>
            )}
          </div>
        )}
      </main>

      {/* Walk-in Modal */}
      {activeQueueId && (
        <WalkInModal
          isOpen={showWalkInModal}
          onClose={() => setShowWalkInModal(false)}
          queueId={activeQueueId}
          services={services}
          onAdded={() => loadLiveQueueState(activeQueueId)}
        />
      )}

      {/* QR Poster Modal */}
      {business && (
        <QRCodeModal
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
          businessName={business.name}
          qrCodeUrl={business.qrCode}
          targetUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/business/${business._id}`}
        />
      )}

      <Footer />
    </div>
  );
}
