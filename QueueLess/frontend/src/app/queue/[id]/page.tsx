'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '../../../components/common/Navbar';
import { Footer } from '../../../components/common/Footer';
import { TokenDisplay } from '../../../components/queue/TokenDisplay';
import { QueueProgress } from '../../../components/queue/QueueProgress';
import { LeaveConfirmDialog } from '../../../components/queue/LeaveConfirmDialog';
import { QueueEntry, Business, Service, Queue } from '../../../types';
import { api } from '../../../lib/api';
import { useSocket } from '../../../context/SocketContext';
import {
  ArrowLeft,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  LogOut,
  MapPin,
  Phone,
  Sparkles,
  Share2,
} from 'lucide-react';

export default function LiveQueueTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const entryId = params?.id as string;
  const { socket, joinQueueRoom, leaveQueueRoom, playChime } = useSocket();

  const [entry, setEntry] = useState<QueueEntry | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [queue, setQueue] = useState<Queue | null>(null);

  const [peopleAhead, setPeopleAhead] = useState<number>(0);
  const [estimatedWaitRange, setEstimatedWaitRange] = useState<string>('15-25 min');
  const [nowServingToken, setNowServingToken] = useState<string | number>('');

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLeaveDialog, setShowLeaveDialog] = useState<boolean>(false);
  const [isLeaving, setIsLeaving] = useState<boolean>(false);

  const fetchEntry = () => {
    if (!entryId) return;
    api
      .get<{ success: boolean; entry: any }>(`/queues/entries/${entryId}`)
      .then((res) => {
        if (res.success && res.entry) {
          const e = res.entry;
          setEntry(e);
          setBusiness(e.businessId);
          setService(e.serviceId);
          setQueue(e.queueId);
          setPeopleAhead(e.peopleAhead ?? 0);
          setEstimatedWaitRange(e.estimatedWait ?? `${e.estimatedWaitMinutes || 15} min`);
          setNowServingToken(e.currentServing || e.queueId?.currentNumber || '');
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchEntry();
  }, [entryId]);

  // Real-time Socket.IO Listeners
  useEffect(() => {
    if (!queue?._id) return;
    const queueId = queue._id.toString();
    joinQueueRoom(queueId);

    if (socket) {
      // 1. Queue update broadcast when business advances queue
      const handleQueueUpdate = (payload: any) => {
        if (payload.queueId === queueId) {
          // Re-fetch our precise user entry data
          fetchEntry();
        }
      };

      // 2. Direct event when called
      const handleCalled = (payload: any) => {
        if (payload.entryId === entryId) {
          playChime();
          fetchEntry();
        }
      };

      // 3. Completed event
      const handleCompleted = (payload: any) => {
        if (payload.entryId === entryId) {
          fetchEntry();
        }
      };

      socket.on('queue:update', handleQueueUpdate);
      socket.on('queue:called', handleCalled);
      socket.on('queue:completed', handleCompleted);
      socket.on('queue:paused', handleQueueUpdate);
      socket.on('queue:resumed', handleQueueUpdate);

      return () => {
        socket.off('queue:update', handleQueueUpdate);
        socket.off('queue:called', handleCalled);
        socket.off('queue:completed', handleCompleted);
        socket.off('queue:paused', handleQueueUpdate);
        socket.off('queue:resumed', handleQueueUpdate);
        leaveQueueRoom(queueId);
      };
    }
  }, [queue?._id, socket, entryId]);

  const handleConfirmLeave = async () => {
    setIsLeaving(true);
    try {
      await api.post(`/queues/entries/${entryId}/leave`);
      setShowLeaveDialog(false);
      router.push(business ? `/business/${business._id}` : '/discover');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLeaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
          Loading live queue tracking...
        </div>
        <Footer />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Token Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">This digital token is invalid or has expired.</p>
          <Link
            href="/discover"
            className="mt-4 px-4 py-2 rounded-xl bg-brand-600 text-white font-semibold text-xs"
          >
            Find Another Place
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const currentServingNum = typeof nowServingToken === 'string' && nowServingToken.includes('-')
    ? parseInt(nowServingToken.split('-')[1]) || 1
    : Number(nowServingToken) || 1;

  const userTokenNum = entry.tokenNumber || 1;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href={business ? `/business/${business._id}` : '/discover'}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to {business?.name || 'Business'}</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Connected
            </span>
          </div>
        </div>

        {/* Business Summary Header Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 font-bold text-base flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-bold text-slate-900 dark:text-white truncate">
                {business?.name}
              </h1>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span className="font-semibold text-brand-600 dark:text-brand-400">
                  {service?.name}
                </span>
                <span>•</span>
                <span className="truncate">{business?.address?.street}</span>
              </div>
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-[10px] uppercase font-bold text-slate-400">Queue</div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {queue?.name || 'General'}
            </div>
          </div>
        </div>

        {/* PRIMARY REAL-TIME TOKEN DISPLAY */}
        <TokenDisplay
          entry={entry}
          peopleAhead={peopleAhead}
          nowServingToken={nowServingToken}
          estimatedWaitRange={estimatedWaitRange}
          isPaused={queue?.isPaused}
          pauseReason={queue?.pauseReason}
        />

        {/* VISUAL QUEUE PROGRESSION TIMELINE */}
        <QueueProgress
          currentServingNum={currentServingNum}
          userTokenNum={userTokenNum}
          tokenPrefix={queue?.prefix || 'A'}
        />

        {/* Helpful Tips While Waiting */}
        <div className="p-5 rounded-2xl bg-gradient-to-tr from-brand-50/60 to-indigo-50/60 dark:from-slate-900 dark:to-slate-800/80 border border-brand-200/60 dark:border-slate-700/60 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-700 dark:text-brand-300">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Queue Less, Live More</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            You don't have to keep staring at this screen! Feel free to grab coffee or browse nearby
            shops. Keep your phone volume up — we will ping you when you are 2 customers away and
            sound a chime when it's your turn.
          </p>
        </div>

        {/* Bottom Actions */}
        {entry.status === 'WAITING' && (
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setShowLeaveDialog(true)}
              className="text-xs font-semibold text-rose-500 hover:text-rose-600 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Leave Queue</span>
            </button>

            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `Turnova Token #${entry.tokenCode}`,
                    url: window.location.href,
                  });
                }
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Token Link</span>
            </button>
          </div>
        )}
      </main>

      {/* Leave Queue Warning Dialog */}
      <LeaveConfirmDialog
        isOpen={showLeaveDialog}
        onClose={() => setShowLeaveDialog(false)}
        onConfirm={handleConfirmLeave}
        tokenCode={entry.tokenCode}
        isLeaving={isLeaving}
      />

      <Footer />
    </div>
  );
}
