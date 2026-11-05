import React from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from '../components/movies/MovieCard';

export const LatestPage: React.FC = () => {
  const { movies } = useMovies();

  // Sort by release year desc and latest flag
  const latestMovies = [...movies].sort((a, b) => b.releaseYear - a.releaseYear);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Fresh Arrivals
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-['Cinzel',serif] uppercase tracking-wide">
          Latest Releases
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Stay ahead with newly added cinematic releases, freshly remastered in 4K HDR.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
        {latestMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} layout="poster" />
        ))}
      </div>
    </div>
  );
};
