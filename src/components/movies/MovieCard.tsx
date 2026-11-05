import React, { useState } from 'react';
import { 
  Play, 
  Plus, 
  Check, 
  Info, 
  Star, 
  Lock, 
  Sparkles 
} from 'lucide-react';
import { Movie } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useMovies } from '../../context/MovieContext';

interface MovieCardProps {
  movie: Movie;
  layout?: 'poster' | 'backdrop';
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, layout = 'poster' }) => {
  const { isInWatchlist, toggleWatchlist, hasActiveSubscription } = useAuth();
  const { openPlayer, openDetails, openPaymentModal, packages } = useMovies();
  const [imageError, setImageError] = useState(false);

  const inWatchlist = isInWatchlist(movie.id);
  const isLocked = movie.isPremium && !hasActiveSubscription;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLocked) {
      openPaymentModal(packages[1]);
    } else {
      openPlayer(movie);
    }
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWatchlist(movie.id);
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDetails(movie);
  };

  const fallbackPoster = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop';

  return (
    <div 
      onClick={() => openDetails(movie)}
      className="group relative cursor-pointer select-none rounded-xl overflow-hidden bg-[#121318] border border-neutral-800/80 hover:border-amber-500/60 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:-translate-y-1.5 flex flex-col"
    >
      {/* Poster / Backdrop Image */}
      <div className={`relative w-full overflow-hidden ${layout === 'poster' ? 'aspect-[2/3]' : 'aspect-video'} bg-neutral-900`}>
        <img
          src={imageError ? fallbackPoster : (layout === 'poster' ? movie.posterUrl : movie.backdropUrl)}
          alt={movie.title}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-95 group-hover:brightness-105"
          loading="lazy"
        />

        {/* Gradient shadow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121318] via-transparent to-black/40 opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-black/80 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              {movie.language}
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/80 text-neutral-300 border border-neutral-700/60 backdrop-blur-md">
              {movie.quality}
            </span>
          </div>

          {movie.isPremium && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md ${
              isLocked 
                ? 'bg-amber-500 text-black font-extrabold' 
                : 'bg-emerald-500/90 text-white'
            }`}>
              {isLocked ? <Lock className="w-2.5 h-2.5" /> : <Sparkles className="w-2.5 h-2.5" />}
              {isLocked ? 'VIP' : 'UNLOCKED'}
            </span>
          )}
        </div>

        {/* Quick Action Overlay on Hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full gold-gradient-bg flex items-center justify-center text-black shadow-[0_0_20px_rgba(245,158,11,0.5)] transform scale-90 group-hover:scale-100 hover:scale-110 active:scale-95 transition-all"
            title={isLocked ? 'Subscribe to Watch' : 'Play Movie'}
            aria-label="Play Movie"
          >
            {isLocked ? <Lock className="w-5 h-5 text-black" /> : <Play className="w-5 h-5 fill-black text-black ml-0.5" />}
          </button>

          <button
            onClick={handleWatchlistClick}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all active:scale-95 ${
              inWatchlist 
                ? 'bg-amber-500/30 text-amber-300 border-amber-400' 
                : 'bg-neutral-900/90 text-white border-neutral-600 hover:border-amber-400'
            }`}
            title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            aria-label="Add to Watchlist"
          >
            {inWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDetailsClick}
            className="w-9 h-9 rounded-full bg-neutral-900/90 text-white border border-neutral-600 hover:border-amber-400 flex items-center justify-center transition-all active:scale-95"
            title="View Details"
            aria-label="View Details"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Info Section */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between bg-[#101116]">
        <div>
          <div className="flex items-center justify-between gap-1 text-[11px] text-neutral-400 mb-1">
            <span>{movie.releaseYear} • {movie.duration}</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          </div>

          <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-amber-400 transition-colors line-clamp-1 font-sans">
            {movie.title}
          </h3>

          {movie.originalTitle && (
            <p className="text-[11px] text-neutral-400 font-serif line-clamp-1">
              {movie.originalTitle}
            </p>
          )}
        </div>

        <div className="mt-2.5 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
          <span className="truncate max-w-[130px]">
            {movie.genre.slice(0, 2).join(' • ')}
          </span>
          <span className="text-amber-400/90 group-hover:translate-x-0.5 transition-transform font-medium">
            Details →
          </span>
        </div>
      </div>
    </div>
  );
};
