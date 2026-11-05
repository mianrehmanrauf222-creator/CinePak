import React from 'react';
import { Flame, Trophy } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from '../components/movies/MovieCard';

export const TrendingPage: React.FC = () => {
  const { movies } = useMovies();

  // Trending ranked by popularity/views
  const trendingMovies = [...movies]
    .filter((m) => m.isTrending || (m.viewsCount || 0) > 200000)
    .sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Pakistan Top Charts
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-['Cinzel',serif] uppercase tracking-wide">
          Trending Movies
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          The most streamed and talked-about cinema across Lahore, Karachi, Islamabad, and globally.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
        {trendingMovies.map((movie, index) => (
          <div key={movie.id} className="relative">
            {/* Rank badge */}
            <div className="absolute -top-2 -left-2 z-20 w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-300 text-black font-black text-xs flex items-center justify-center shadow-lg border-2 border-black">
              #{index + 1}
            </div>
            <MovieCard movie={movie} layout="poster" />
          </div>
        ))}
      </div>
    </div>
  );
};
