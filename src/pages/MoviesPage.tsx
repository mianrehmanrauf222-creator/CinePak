import React from 'react';
import { Film, Sparkles, RotateCcw } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from '../components/movies/MovieCard';
import { MovieFilters } from '../components/movies/MovieFilters';

export const MoviesPage: React.FC = () => {
  const {
    movies,
    searchQuery,
    selectedLanguage,
    selectedGenre,
    selectedQuality,
    selectedYear,
    sortBy,
    resetFilters
  } = useMovies();

  // Filter and sort movies
  const filteredMovies = movies
    .filter((movie) => {
      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = movie.title.toLowerCase().includes(q);
        const matchDirector = movie.director.toLowerCase().includes(q);
        const matchCast = movie.cast.some((c) => c.toLowerCase().includes(q));
        const matchDesc = movie.description.toLowerCase().includes(q);
        if (!matchTitle && !matchDirector && !matchCast && !matchDesc) return false;
      }

      // Language filter
      if (selectedLanguage !== 'All' && movie.language !== selectedLanguage) {
        return false;
      }

      // Genre filter
      if (selectedGenre !== 'All' && !movie.genre.includes(selectedGenre as any)) {
        return false;
      }

      // Quality filter
      if (selectedQuality !== 'All' && movie.quality !== selectedQuality) {
        return false;
      }

      // Year filter
      if (selectedYear !== 'All' && movie.releaseYear.toString() !== selectedYear) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'latest') return b.releaseYear - a.releaseYear;
      if (sortBy === 'popular') return (b.viewsCount || 0) - (a.viewsCount || 0);
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Page Title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Film className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            Cinema Vault
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-['Cinzel',serif] tracking-wide uppercase">
          Explore All Movies
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Browse our complete catalog of South Asian and international cinema in 4K UHD.
        </p>
      </div>

      {/* Interactive Filters Bar */}
      <MovieFilters />

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6 text-xs text-neutral-400">
        <span>
          Showing <span className="text-amber-400 font-bold">{filteredMovies.length}</span> of {movies.length} movies
        </span>
      </div>

      {/* Movies Grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} layout="poster" />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[#121318] rounded-2xl border border-neutral-800 p-8 space-y-4">
          <Film className="w-12 h-12 text-neutral-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Movies Found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            We couldn't find any movie matching your current filters and search keywords.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl text-xs font-bold text-black gold-gradient-bg shadow inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
