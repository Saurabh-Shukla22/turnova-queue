'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '../../../components/common/Navbar';
import { Footer } from '../../../components/common/Footer';
import { ServiceCard } from '../../../components/business/ServiceCard';
import { ReviewCard } from '../../../components/business/ReviewCard';
import { QRCodeModal } from '../../../components/business/QRCodeModal';
import { AppointmentModal } from '../../../components/business/AppointmentModal';
import { JoinSuccessModal } from '../../../components/queue/JoinSuccessModal';
import { Business, Service, Queue } from '../../../types';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { useSocket } from '../../../context/SocketContext';
import { formatWaitTime, formatCurrency } from '../../../lib/utils';
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  QrCode,
  Calendar,
  Navigation,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function BusinessDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user } = useAuth();
  const { socket, joinBusinessRoom, leaveBusinessRoom } = useSocket();

  const [business, setBusiness] = useState<Business | null>(null);
  const [selectedQueue, setSelectedQueue] = useState<Queue | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Guest inputs
  const [guestName, setGuestName] = useState<string>(user?.name || '');
  const [guestPhone, setGuestPhone] = useState<string>(user?.phone || '');

  // Modals
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState<boolean>(false);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Join Success Modal State
  const [successData, setSuccessData] = useState<{
    isOpen: boolean;
    entryId: string;
    tokenCode: string;
    peopleAhead: number;
    estimatedWait: string;
    serviceName: string;
  } | null>(null);

  const fetchBusiness = () => {
    if (!id) return;
    api
      .get<{ success: boolean; business: Business }>(`/businesses/${id}`)
      .then((res) => {
        if (res.success) {
          setBusiness(res.business);
          if (res.business.queues && res.business.queues.length > 0) {
            setSelectedQueue(res.business.queues[0]);
          }
          if (res.business.services && res.business.services.length > 0) {
            setSelectedServiceId(res.business.services[0]._id);
          }
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
    fetchBusiness();
  }, [id]);

  useEffect(() => {
    if (user) {
      if (!guestName) setGuestName(user.name);
      if (!guestPhone) setGuestPhone(user.phone);
    }
  }, [user]);

  // Real-time updates via Socket.IO
  useEffect(() => {
    if (!id) return;
    joinBusinessRoom(id);

    if (socket) {
      const handleUpdate = () => {
        fetchBusiness();
      };
      socket.on('queue:update', handleUpdate);
      socket.on('queue:completed', handleUpdate);
      socket.on('queue:called', handleUpdate);

      return () => {
        socket.off('queue:update', handleUpdate);
        socket.off('queue:completed', handleUpdate);
        socket.off('queue:called', handleUpdate);
        leaveBusinessRoom(id);
      };
    }
  }, [id, socket]);

  const handleJoinQueue = async () => {
    if (!selectedQueue) {
      setErrorMsg('No active queue available for this business.');
      return;
    }
    if (!selectedServiceId) {
      setErrorMsg('Please select a service first.');
      return;
    }

    setIsJoining(true);
    setErrorMsg('');

    try {
      const selectedService = business?.services?.find((s) => s._id === selectedServiceId);

      const res = await api.post<{
        success: boolean;
        message: string;
        entry: {
          id: string;
          tokenNumber: number;
          tokenCode: string;
          peopleAhead: number;
          estimatedWait: string;
        };
      }>(`/queues/${selectedQueue._id}/join`, {
        serviceId: selectedServiceId,
        customerName: user ? user.name : guestName || 'Customer',
        customerPhone: user ? user.phone : guestPhone || '9876543210',
      });

      if (res.success && res.entry) {
        setSuccessData({
          isOpen: true,
          entryId: res.entry.id,
          tokenCode: res.entry.tokenCode,
          peopleAhead: res.entry.peopleAhead,
          estimatedWait: res.entry.estimatedWait,
          serviceName: selectedService?.name || 'General Service',
        });
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to join queue.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleGetDirections = () => {
    if (!business) return;
    const coords = business.location?.coordinates;
    let url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${business.name}, ${business.address.street}, ${business.address.city}`
    )}`;
    if (coords && coords.length === 2) {
      url = `https://www.google.com/maps/dir/?api=1&destination=${coords[1]},${coords[0]}`;
    }
    window.open(url, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
          Loading business details...
        </div>
        <Footer />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Business Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">The requested place is unavailable.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const waitingCount = selectedQueue?.waitingCount ?? 0;
  const estimatedWait = selectedQueue?.estimatedWait ?? 0;
  const isPaused = selectedQueue?.isPaused ?? false;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Business Hero Banner */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm mb-8">
          <div className="h-64 sm:h-72 w-full bg-slate-800 relative">
            {business.banner ? (
              <img
                src={business.banner}
                alt={business.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-brand-900 to-indigo-950" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md">
                    {business.category}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                      business.isOpen ? 'bg-emerald-500/90' : 'bg-slate-700/90'
                    }`}
                  >
                    {business.isOpen ? 'Open Now' : 'Closed'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black">{business.name}</h1>
                <p className="text-xs sm:text-sm text-slate-200 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>
                    {business.address.street}, {business.address.city}, {business.address.state}
                  </span>
                </p>
              </div>

              {/* Action Buttons Top */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleGetDirections}
                  className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Directions</span>
                </button>
                <button
                  onClick={() => setShowQRModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR Poster</span>
                </button>
                <button
                  onClick={() => setShowAppointmentModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick stats strip */}
          <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Rating</div>
              <div className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{business.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal text-xs">
                  ({business.reviewCount})
                </span>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Currently Waiting</div>
              <div className="text-base font-bold text-brand-600 dark:text-brand-400 mt-0.5 flex items-center justify-center gap-1">
                <Users className="w-4 h-4" />
                <span>{waitingCount} people</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Estimated Wait</div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5 flex items-center justify-center gap-1">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{formatWaitTime(estimatedWait)}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Phone Contact</div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 truncate">
                {business.phone}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols): Services & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Business */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                About the Business
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {business.description}
              </p>
            </div>

            {/* Selectable Services */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Available Services
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select a service below to join the virtual queue
                  </p>
                </div>
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-full">
                  {business.services?.length || 0} services
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {business.services?.map((svc) => (
                  <ServiceCard
                    key={svc._id}
                    service={svc}
                    isSelected={selectedServiceId === svc._id}
                    onSelect={() => setSelectedServiceId(svc._id)}
                  />
                ))}
              </div>
            </div>

            {/* Customer Reviews */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Verified Customer Reviews
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Feedback on wait times and service quality
                  </p>
                </div>
                <div className="flex items-center gap-1 font-bold text-sm text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{business.rating.toFixed(1)} / 5</span>
                </div>
              </div>

              <div className="space-y-3">
                {!business.reviews || business.reviews.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    No reviews yet. Be the first to review after your visit!
                  </div>
                ) : (
                  business.reviews.map((rev) => <ReviewCard key={rev._id} review={rev} />)
                )}
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Join Queue Card & Operating Hours */}
          <div className="space-y-6">
            {/* Live Join Queue Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-brand-500/80 dark:border-brand-500/60 shadow-xl space-y-5">
              <div>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Instant Virtual Queue</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Join The Live Line
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Get your digital token now and wait anywhere comfortably.
                </p>
              </div>

              {/* Queue Snapshot */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Queue Name:</span>
                  <strong className="text-slate-900 dark:text-white">
                    {selectedQueue?.name || 'Main Queue'}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Current Serving:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {selectedQueue?.currentNumber ? `#${selectedQueue.prefix}-${selectedQueue.currentNumber}` : 'None'}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">People Waiting:</span>
                  <strong className="text-slate-900 dark:text-white font-bold">
                    {waitingCount} {waitingCount === 1 ? 'customer' : 'customers'}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Estimated Wait:</span>
                  <strong className="text-brand-600 dark:text-brand-400 font-bold">
                    {formatWaitTime(estimatedWait)}
                  </strong>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Guest Inputs if not logged in */}
              {!user && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Yash Sharma"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number (for SMS & Alerts)
                    </label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleJoinQueue}
                disabled={isJoining || isPaused}
                className="w-full py-3.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {isJoining ? (
                  <span>Generating Token...</span>
                ) : isPaused ? (
                  <span>Queue is Paused</span>
                ) : (
                  <>
                    <span>Join Virtual Queue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-[11px] text-center text-slate-400">
                You will receive live token updates & turn notifications.
              </div>
            </div>

            {/* Opening Hours Card */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-500" />
                <span>Operating Hours</span>
              </h4>

              <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
                {business.openingHours?.map((h) => (
                  <div key={h.day} className="pt-2 flex items-center justify-between">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      {h.day}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {h.isOpen ? `${h.open} - ${h.close}` : 'Closed'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* QR Code Poster Modal */}
      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        businessName={business.name}
        qrCodeUrl={business.qrCode}
        targetUrl={typeof window !== 'undefined' ? window.location.href : ''}
      />

      {/* Appointment Booking Modal */}
      <AppointmentModal
        isOpen={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        businessId={business._id}
        businessName={business.name}
        services={business.services || []}
      />

      {/* Join Success Celebration Modal */}
      {successData && (
        <JoinSuccessModal
          isOpen={successData.isOpen}
          entryId={successData.entryId}
          tokenCode={successData.tokenCode}
          peopleAhead={successData.peopleAhead}
          estimatedWait={successData.estimatedWait}
          businessName={business.name}
          serviceName={successData.serviceName}
        />
      )}

      <Footer />
    </div>
  );
}
