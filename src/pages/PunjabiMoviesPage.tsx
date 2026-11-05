import React, { useState } from 'react';
import { Film, Star, Sparkles, Filter } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { MovieCard } from '../components/movies/MovieCard';
import { Genre } from '../types';

export const PunjabiMoviesPage: React.FC = () => {
  const { movies } = useMovies();
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');

  const punjabiMovies = movies.filter(
    (m) => m.language === 'Punjabi' && (selectedGenre === 'All' || m.genre.includes(selectedGenre))
  );

  const genres: (Genre | 'All')[] = ['All', 'Action', 'Comedy', 'Drama', 'Romance', 'Historical'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 border border-amber-500/30 bg-gradient-to-r from-amber-950/60 via-[#121318] to-black p-6 sm:p-10">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500 text-black">
              ਪੰਜਾਬੀ ਸਿਨੇਮਾ
            </span>
            <span className="text-xs text-amber-400 font-semibold tracking-wide">
              Lollywood & Pollywood Blockbusters
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white font-['Cinzel',serif] uppercase tracking-wide">
            Punjabi Cinema
          </h1>

          <p className="text-sm text-neutral-300 leading-relaxed">
            From the historic record-breaking triumphs like <span className="text-amber-400 font-semibold">The Legend of Maula Jatt</span> and <span className="text-amber-400 font-semibold">Carry On Jatta 3</span> to heartwarming cross-border classics like <span className="text-amber-400 font-semibold">Chal Mera Putt</span>. Stream in 4K UHD.
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
        {punjabiMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} layout="poster" />
        ))}
      </div>
    </div>
  );
};
