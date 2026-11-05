import React from 'react';
import { Bookmark, Film, Trash2, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from '../components/movies/MovieCard';

interface WatchlistPageProps {
  setCurrentTab: (tab: string) => void;
}

export const WatchlistPage: React.FC<WatchlistPageProps> = ({ setCurrentTab }) => {
  const { user } = useAuth();
  const { movies, setAuthModalOpen, setAuthModalTab } = useMovies();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20 text-center space-y-4">
        <Bookmark className="w-16 h-16 text-neutral-600 mx-auto" />
        <h2 className="text-2xl font-black text-white font-['Cinzel',serif]">
          Sign In to Access Your Watchlist
        </h2>
        <p className="text-sm text-neutral-400 max-w-sm mx-auto">
          Save your favorite Pakistani, Punjabi, Hindi, and Hollywood movies to watch anytime.
        </p>
        <button
          onClick={() => {
            setAuthModalTab('login');
            setAuthModalOpen(true);
          }}
          className="px-6 py-3 rounded-xl font-bold text-sm text-black gold-gradient-bg shadow-md"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const savedMovies = movies.filter((m) => user.watchlist.includes(m.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Personal Collection
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-['Cinzel',serif] uppercase tracking-wide">
            My Watchlist
          </h1>
          <p className="text-sm text-neutral-400 mt-1">
            {savedMovies.length} {savedMovies.length === 1 ? 'movie' : 'movies'} saved to your library
          </p>
        </div>
      </div>

      {savedMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {savedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} layout="poster" />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#121318] rounded-2xl border border-neutral-800 p-8 space-y-4">
          <Bookmark className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">Your Watchlist is Empty</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Browse through our movies and click the "+" icon to add them to your watchlist.
          </p>
          <button
            onClick={() => setCurrentTab('movies')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-black gold-gradient-bg shadow"
          >
            Explore Cinema Vault
          </button>
        </div>
      )}
    </div>
  );
};
