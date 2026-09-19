'use client';

import React from 'react';
import { X, Download, Printer, QrCode } from 'lucide-react';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName: string;
  qrCodeUrl?: string;
  targetUrl?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  businessName,
  qrCodeUrl,
  targetUrl,
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    if (!qrCodeUrl) return;
    const a = document.createElement('a');
    a.href = qrCodeUrl;
    a.download = `${businessName.toLowerCase().replace(/\s+/g, '-')}-queue-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Turnova QR Poster
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Scan to join the live virtual queue for <strong>{businessName}</strong>
        </p>

        {/* QR Code Container */}
        <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center justify-center">
          {qrCodeUrl ? (
            <img
              src={qrCodeUrl}
              alt={`${businessName} Queue QR Code`}
              className="w-56 h-56 rounded-xl bg-white p-2 shadow-sm"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-slate-400 text-xs">
              Loading QR code...
            </div>
          )}

          <div className="mt-3 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            Scan with smartphone camera
          </div>
          <div className="text-[10px] text-slate-400 truncate max-w-[240px] mt-0.5">
            {targetUrl}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            onClick={handleDownload}
            className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            Download QR
          </button>
          <button
            onClick={handlePrint}
            className="py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Poster
          </button>
        </div>
      </div>
    </div>
  );
};
