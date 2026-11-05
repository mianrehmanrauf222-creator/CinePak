/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { MovieProvider, useMovies } from './context/MovieContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { PunjabiMoviesPage } from './pages/PunjabiMoviesPage';
import { HindiMoviesPage } from './pages/HindiMoviesPage';
import { EnglishMoviesPage } from './pages/EnglishMoviesPage';
import { LatestPage } from './pages/LatestPage';
import { TrendingPage } from './pages/TrendingPage';
import { WatchlistPage } from './pages/WatchlistPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { ProfilePage } from './pages/ProfilePage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { VideoPlayer } from './components/player/VideoPlayer';
import { MovieDetailsModal } from './components/modals/MovieDetailsModal';
import { AuthModal } from './components/modals/AuthModal';
import { PaymentModal } from './components/modals/PaymentModal';

const VALID_TABS = [
  'home',
  'movies',
  'punjabi',
  'hindi',
  'english',
  'latest',
  'trending',
  'watchlist',
  'packages',
  'profile',
  'contact',
  'about',
  'admin'
];

function getInitialTab(): string {
  try {
    // 1. Check hash e.g. #/movies or #movies
    const hash = window.location.hash.replace(/^#\/?/, '').toLowerCase().trim();
    if (VALID_TABS.includes(hash)) return hash;

    // 2. Check query param e.g. ?tab=movies or ?page=movies
    const params = new URLSearchParams(window.location.search);
    const paramTab = (params.get('tab') || params.get('page') || '').toLowerCase().trim();
    if (VALID_TABS.includes(paramTab)) return paramTab;

    // 3. Check pathname (e.g. /CinePak/movies -> movies)
    const path = window.location.pathname.replace(/^\/CinePak\/?/i, '').replace(/^\//, '').split('/')[0].toLowerCase().trim();
    if (VALID_TABS.includes(path)) return path;
  } catch {
    // fallback
  }
  return 'home';
}

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTabState] = useState<string>(getInitialTab);
  const { 
    playingMovie, 
    closePlayer, 
    detailsMovie, 
    closeDetails 
  } = useMovies();

  const handleTabChange = (tab: string) => {
    setCurrentTabState(tab);
    try {
      if (tab === 'home') {
        const cleanUrl = window.location.pathname.endsWith('/') ? window.location.pathname : `${window.location.pathname}/`;
        window.history.replaceState(null, '', cleanUrl);
      } else {
        window.location.hash = `#${tab}`;
      }
    } catch {}
  };

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const tab = getInitialTab();
      setCurrentTabState(tab);
    };
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, []);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  return (
    <div className="min-h-screen bg-[#08080a] text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Navbar Header */}
      <Navbar currentTab={currentTab} setCurrentTab={handleTabChange} />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentTab === 'home' && <HomePage setCurrentTab={handleTabChange} />}
        {currentTab === 'movies' && <MoviesPage />}
        {currentTab === 'punjabi' && <PunjabiMoviesPage />}
        {currentTab === 'hindi' && <HindiMoviesPage />}
        {currentTab === 'english' && <EnglishMoviesPage />}
        {currentTab === 'latest' && <LatestPage />}
        {currentTab === 'trending' && <TrendingPage />}
        {currentTab === 'watchlist' && <WatchlistPage setCurrentTab={handleTabChange} />}
        {currentTab === 'packages' && <SubscriptionPage />}
        {currentTab === 'profile' && <ProfilePage setCurrentTab={handleTabChange} />}
        {currentTab === 'contact' && <ContactPage />}
        {currentTab === 'about' && <AboutPage />}
        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer setCurrentTab={handleTabChange} />

      {/* Global Interactive Video Player */}
      {playingMovie && (
        <VideoPlayer movie={playingMovie} onClose={closePlayer} />
      )}

      {/* Movie Details Modal */}
      {detailsMovie && (
        <MovieDetailsModal movie={detailsMovie} onClose={closeDetails} />
      )}

      {/* Auth Modal (Sign In / Sign Up / Forgot Password) */}
      <AuthModal />

      {/* Payment Checkout Modal (PKR / JazzCash / Easypaisa / Cards) */}
      <PaymentModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MovieProvider>
        <AppContent />
      </MovieProvider>
    </AuthProvider>
  );
}
