import React, { useState } from 'react';
import { Film, Filter } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from '../components/movies/MovieCard';
import { Genre } from '../types';

export const HindiMoviesPage: React.FC = () => {
  const { movies } = useMovies();
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');

  const hindiMovies = movies.filter(
    (m) => m.language === 'Hindi' && (selectedGenre === 'All' || m.genre.includes(selectedGenre))
  );

  const genres: (Genre | 'All')[] = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 border border-neutral-800 bg-gradient-to-r from-red-950/40 via-[#121318] to-black p-6 sm:p-10">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-600 text-white">
              हिंदी सिनेमा
            </span>
            <span className="text-xs text-neutral-400 font-semibold tracking-wide">
              Bollywood Superstars & Epics
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Cinzel',serif] uppercase tracking-wide">
            Hindi Cinema
          </h1>

          <p className="text-sm text-neutral-300 leading-relaxed">
            Experience the thunderous action of Shah Rukh Khan in Jawan, chilling laughter in Stree 2, and evergreen classics like 3 Idiots. High definition streaming with Dolby surround audio.
          </p>
        </div>
      </div>

      {/* Genre Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-amber-400" /> Genre:
        </span>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              selectedGenre === g
                ? 'bg-amber-500 text-black font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-[#14151c] text-neutral-300 hover:text-white border border-neutral-800'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
        {hindiMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} layout="poster" />
        ))}
      </div>
    </div>
  );
};
