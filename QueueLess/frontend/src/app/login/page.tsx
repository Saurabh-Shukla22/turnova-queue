'use client';

import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { SwappingAuthCard } from '../../components/auth/SwappingAuthCard';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
        <SwappingAuthCard initialMode="login" />
      </main>

      <Footer />
    </div>
  );
}
