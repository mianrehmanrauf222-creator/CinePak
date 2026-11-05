import React, { useState } from 'react';
import { 
  User, 
  Crown, 
  Clock, 
  Bookmark, 
  Shield, 
  LogOut, 
  Play, 
  Trash2, 
  CreditCard,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from '../components/movies/MovieCard';

interface ProfilePageProps {
  setCurrentTab: (tab: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ setCurrentTab }) => {
  const { 
    user, 
    isAdmin, 
    hasActiveSubscription, 
    cancelSubscription, 
    clearWatchHistory, 
    logout 
  } = useAuth();
  const { movies, openPlayer, setAuthModalOpen, setAuthModalTab } = useMovies();

  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'watchlist'>('overview');

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20 text-center space-y-4">
        <User className="w-16 h-16 text-neutral-600 mx-auto" />
        <h2 className="text-2xl font-black text-white font-['Cinzel',serif]">
          Sign In to View Your Account
        </h2>
        <p className="text-sm text-neutral-400 max-w-sm mx-auto">
          Manage your active subscription, watch history, and saved watchlist.
        </p>
        <button
          onClick={() => {
            setAuthModalTab('login');
            setAuthModalOpen(true);
          }}
          className="px-6 py-3 rounded-xl font-bold text-sm text-black gold-gradient-bg shadow-md"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const savedMovies = movies.filter((m) => user.watchlist.includes(m.id));
  const sub = user.subscription;

  const handleResumeHistory = (movieId: string) => {
    const movie = movies.find((m) => m.id === movieId);
    if (movie) openPlayer(movie);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      
      {/* Profile Header */}
      <div className="bg-[#121318] border border-neutral-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-black font-black text-2xl sm:text-3xl shadow-[0_0_20px_rgba(245,158,11,0.3)] uppercase">
              {user.displayName ? user.displayName[0] : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {user.displayName}
                </h1>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-neutral-900 border border-neutral-700 text-neutral-300">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  {sub?.status === 'active' ? sub.packageName : 'Free Tier'}
                </span>
                <span className="text-xs text-neutral-400">
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {isAdmin && (
              <button
                onClick={() => setCurrentTab('admin')}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </button>
            )}
            <button
              onClick={logout}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-t border-neutral-800/80 mt-6 pt-4 gap-4 sm:gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`text-xs sm:text-sm font-bold pb-2 border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'text-amber-400 border-amber-400'
                : 'text-neutral-400 border-transparent hover:text-white'
            }`}
          >
            Subscription & Details
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`text-xs sm:text-sm font-bold pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'text-amber-400 border-amber-400'
                : 'text-neutral-400 border-transparent hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            Watch History ({user.watchHistory?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`text-xs sm:text-sm font-bold pb-2 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'watchlist'
                ? 'text-amber-400 border-amber-400'
                : 'text-neutral-400 border-transparent hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            My Watchlist ({user.watchlist.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Overview & Subscription Details */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Subscription Box */}
          <div className="lg:col-span-2 bg-[#121318] border border-neutral-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-white font-['Cinzel',serif]">
                  Current Subscription Status
                </h2>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${
                hasActiveSubscription
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-neutral-800 text-neutral-400'
              }`}>
                {sub?.status === 'active' ? 'Active' : sub?.status === 'cancelled' ? 'Cancelled' : 'Free Viewer'}
              </span>
            </div>

            {hasActiveSubscription && sub ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#181920] p-4 rounded-xl border border-neutral-800 text-xs">
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Plan Name</span>
                    <span className="text-base font-bold text-white">{sub.packageName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Recurring Price</span>
                    <span className="text-base font-bold text-amber-400">PKR {sub.pricePKR} / period</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Payment Method</span>
                    <span className="font-semibold text-neutral-200">{sub.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Renewal / Expiry Date</span>
                    <span className="font-semibold text-neutral-200">
                      {new Date(sub.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setCurrentTab('packages')}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-black gold-gradient-bg shadow hover:brightness-110 transition-all"
                  >
                    Change or Upgrade Plan
                  </button>
                  <button
                    onClick={cancelSubscription}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-neutral-400 hover:text-rose-400 bg-neutral-900 hover:bg-rose-500/10 border border-neutral-800 transition-colors"
                  >
                    Cancel Auto-Renewal
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-3">
                <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
                  You are currently on the CinePak Free Tier. Upgrade to access all VIP 4K blockbusters, offline downloads, and Dolby Atmos.
                </p>
                <button
                  onClick={() => setCurrentTab('packages')}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-black gold-gradient-bg shadow-md"
                >
                  View Plans starting at PKR 199/month
                </button>
              </div>
            )}
          </div>

          {/* Quick Account Summary */}
          <div className="bg-[#121318] border border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white font-['Cinzel',serif] uppercase tracking-wide">
              Streaming Settings
            </h3>
            <div className="text-xs space-y-3 text-neutral-300">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Default Quality:</span>
                <span className="font-bold text-amber-400">4K Ultra HD</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Audio Language:</span>
                <span className="font-bold text-white">Original (Punjabi/Urdu/Eng)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Subtitles:</span>
                <span className="font-bold text-white">English [CC]</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Data Saver:</span>
                <span className="font-bold text-neutral-400">Off (Full Bitrate)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Watch History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white font-['Cinzel',serif]">
              Recently Watched Movies
            </h2>
            {user.watchHistory && user.watchHistory.length > 0 && (
              <button
                onClick={clearWatchHistory}
                className="text-xs text-neutral-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear Watch History
              </button>
            )}
          </div>

          {user.watchHistory && user.watchHistory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.watchHistory.map((item) => {
                const percent = item.totalSeconds > 0 ? Math.min(100, Math.floor((item.progressSeconds / item.totalSeconds) * 100)) : 0;
                return (
                  <div
                    key={item.movieId}
                    className="bg-[#121318] border border-neutral-800 rounded-xl overflow-hidden p-3 flex gap-3.5 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="w-24 aspect-[2/3] shrink-0 bg-neutral-900 rounded-lg overflow-hidden relative">
                      <img
                        src={item.posterUrl}
                        alt={item.movieTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-1 py-0.5">
                      <div>
                        <h4 className="font-bold text-sm text-white line-clamp-1">{item.movieTitle}</h4>
                        <p className="text-[11px] text-neutral-400 mt-1">
                          {item.completed ? 'Finished watching' : `Watched ${Math.floor(item.progressSeconds / 60)}m of ${Math.floor(item.totalSeconds / 60)}m`}
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2 mt-2">
                        <div className="w-full bg-neutral-800 h-1 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-400 h-full rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <button
                          onClick={() => handleResumeHistory(item.movieId)}
                          className="w-full py-1.5 px-3 rounded-lg text-xs font-bold text-black gold-gradient-bg flex items-center justify-center gap-1.5 shadow"
                        >
                          <Play className="w-3.5 h-3.5 fill-black" />
                          {item.completed ? 'Watch Again' : 'Resume Play'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#121318] rounded-2xl border border-neutral-800 p-8 space-y-2">
              <Clock className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">No Watch History Yet</p>
              <p className="text-xs text-neutral-400">
                Movies you stream will automatically appear here with your saved timestamp.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Watchlist */}
      {activeTab === 'watchlist' && (
        <div>
          <h2 className="text-lg font-bold text-white font-['Cinzel',serif] mb-4">
            Saved Movies ({savedMovies.length})
          </h2>
          {savedMovies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
              {savedMovies.map((m) => (
                <MovieCard key={m.id} movie={m} layout="poster" />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center bg-[#121318] rounded-2xl border border-neutral-800 p-8 space-y-2">
              <Bookmark className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">Your Watchlist is Empty</p>
              <button
                onClick={() => setCurrentTab('movies')}
                className="px-4 py-2 rounded-xl text-xs font-bold text-black gold-gradient-bg mt-2"
              >
                Browse Movies
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
