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

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const { 
    playingMovie, 
    closePlayer, 
    detailsMovie, 
    closeDetails 
  } = useMovies();

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  return (
    <div className="min-h-screen bg-[#08080a] text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Navbar Header */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentTab === 'home' && <HomePage setCurrentTab={setCurrentTab} />}
        {currentTab === 'movies' && <MoviesPage />}
        {currentTab === 'punjabi' && <PunjabiMoviesPage />}
        {currentTab === 'hindi' && <HindiMoviesPage />}
        {currentTab === 'english' && <EnglishMoviesPage />}
        {currentTab === 'latest' && <LatestPage />}
        {currentTab === 'trending' && <TrendingPage />}
        {currentTab === 'watchlist' && <WatchlistPage setCurrentTab={setCurrentTab} />}
        {currentTab === 'packages' && <SubscriptionPage />}
        {currentTab === 'profile' && <ProfilePage setCurrentTab={setCurrentTab} />}
        {currentTab === 'contact' && <ContactPage />}
        {currentTab === 'about' && <AboutPage />}
        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer setCurrentTab={setCurrentTab} />

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
