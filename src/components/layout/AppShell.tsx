import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { DemoBanner } from '../common/DemoBanner';
import { ScrollProgressBar } from '../common/ScrollProgressBar';
import { PageScrollControls } from '../common/PageScrollControls';
import { ScrollManager } from '../common/ScrollManager';
import { Toaster } from 'sonner';

export const AppShell: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-transparent selection:bg-rose-500 selection:text-white">
      {/* Scroll restoration: top on forward navigation, preserved position on back navigation */}
      <ScrollRestoration getKey={(location) => location.pathname} />
      <ScrollManager />

      {/* Top scroll reading progress line */}
      <ScrollProgressBar />

      <DemoBanner />
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />

      {/* Floating Page Up / Page Down Navigation & Circular Progress Dock */}
      <PageScrollControls />

      <Toaster position="top-right" richColors closeButton />
    </div>
  );
};
