import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Plus, 
  Check, 
  Star, 
  Share2, 
  Film, 
  Clock, 
  Calendar, 
  Globe, 
  Tv, 
  Lock, 
  Sparkles,
  Clapperboard
} from 'lucide-react';
import { Movie } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useMovies } from '../../context/MovieContext';
import { MovieCard } from '../movies/MovieCard';

interface MovieDetailsModalProps {
  movie: Movie;
  onClose: () => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({ movie, onClose }) => {
  const { isInWatchlist, toggleWatchlist, hasActiveSubscription } = useAuth();
  const { openPlayer, openPaymentModal, packages, movies } = useMovies();

  const [copied, setCopied] = useState(false);
  const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

  const inWatchlist = isInWatchlist(movie.id);
  const isLocked = movie.isPremium && !hasActiveSubscription;

  // Find related movies with same language or shared genres
  const relatedMovies = movies
    .filter(
      (m) =>
        m.id !== movie.id &&
        (m.language === movie.language || m.genre.some((g) => movie.genre.includes(g)))
    )
    .slice(0, 6);

  const handlePlay = () => {
    if (isLocked) {
      openPaymentModal(packages[1]);
    } else {
      openPlayer(movie);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#101116] border border-neutral-800 rounded-2xl overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.9)] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/70 text-neutral-300 hover:text-white border border-neutral-700/80 backdrop-blur-md transition-transform hover:scale-105 active:scale-95"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Backdrop Banner / Trailer Preview */}
        <div className="relative aspect-video max-h-[420px] w-full bg-neutral-900 overflow-hidden">
          {isPlayingTrailer ? (
            <video
              src={movie.trailerUrl}
              autoPlay
              controls
              className="w-full h-full object-cover"
            />
          ) : (
            <>
              <img
                src={movie.backdropUrl}
                alt={movie.title}
                className="w-full h-full object-cover filter brightness-[0.75] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101116] via-[#101116]/30 to-black/30" />

              {/* Play overlay button on backdrop */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handlePlay}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full gold-gradient-bg flex items-center justify-center text-black shadow-[0_0_30px_rgba(245,158,11,0.5)] transform hover:scale-110 active:scale-95 transition-all"
                  aria-label="Play Movie"
                >
                  {isLocked ? (
                    <Lock className="w-8 h-8 text-black" />
                  ) : (
                    <Play className="w-8 h-8 fill-black text-black ml-1" />
                  )}
                </button>
              </div>

              {/* Title & Tagline overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-amber-500 text-black">
                    {movie.language}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-neutral-900/90 text-neutral-200 border border-neutral-700">
                    {movie.quality}
                  </span>
                  {movie.isPremium && (
                    <span className="px-2 py-0.5 rounded text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/50">
                      VIP Premium
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-white font-['Cinzel',serif] uppercase leading-tight drop-shadow-md">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-sm sm:text-base text-amber-300/90 italic font-serif mt-1">
                    "{movie.tagline}"
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-neutral-800">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm sm:text-base text-black gold-gradient-bg shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:brightness-110 transition-all active:scale-95"
              >
                {isLocked ? (
                  <>
                    <Lock className="w-5 h-5 text-black" />
                    Unlock Movie (Subscribe)
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-black text-black" />
                    Watch Movie Now
                  </>
                )}
              </button>

              <button
                onClick={() => setIsPlayingTrailer(!isPlayingTrailer)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm text-neutral-200 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition-colors"
              >
                <Clapperboard className="w-4 h-4 text-amber-400" />
                {isPlayingTrailer ? 'Stop Trailer' : 'Official Trailer'}
              </button>

              <button
                onClick={() => toggleWatchlist(movie.id)}
                className={`p-3 rounded-xl border transition-all ${
                  inWatchlist
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500'
                    : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:text-white'
                }`}
                title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 transition-colors relative"
                title="Share Movie Link"
              >
                <Share2 className="w-5 h-5" />
                {copied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    Link Copied!
                  </span>
                )}
              </button>
            </div>

            {/* Spec Badges */}
            <div className="flex items-center gap-4 text-xs font-semibold text-neutral-300">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-base font-bold">{movie.rating.toFixed(1)}</span>
                <span className="text-[10px] text-neutral-400">/ 10</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-neutral-400" />
                <span>{movie.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <span>{movie.releaseYear}</span>
              </div>
            </div>
          </div>

          {/* Details Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Synopsis & Cast */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Storyline
                </h3>
                <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                  {movie.description}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Lead Cast & Crew
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor) => (
                    <span
                      key={actor}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-[#181920] border border-neutral-800 text-neutral-200"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Director
                </h3>
                <p className="text-sm text-amber-300 font-medium">{movie.director}</p>
              </div>
            </div>

            {/* Right 1 Col: Specs & Info */}
            <div className="bg-[#14151c] rounded-xl p-5 border border-neutral-800 space-y-3.5 text-xs text-neutral-300">
              <div>
                <span className="text-neutral-400 block text-[11px] uppercase font-semibold">Genres</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {movie.genre.map((g) => (
                    <span key={g} className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-200">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-800/80 pt-2">
                <span className="text-neutral-400 block text-[11px] uppercase font-semibold">Audio & Subtitles</span>
                <p className="mt-0.5 text-neutral-200">{movie.language} (Dolby 5.1)</p>
                <p className="text-neutral-400 text-[11px]">Subtitles: English [CC]</p>
              </div>

              <div className="border-t border-neutral-800/80 pt-2">
                <span className="text-neutral-400 block text-[11px] uppercase font-semibold">Resolution & HDR</span>
                <p className="mt-0.5 text-neutral-200">{movie.quality} • 60 FPS • Stereo / Atmos</p>
              </div>

              <div className="border-t border-neutral-800/80 pt-2">
                <span className="text-neutral-400 block text-[11px] uppercase font-semibold">Access Tier</span>
                <p className="mt-0.5 text-amber-400 font-semibold">
                  {movie.isPremium ? 'CinePak Premium Subscription' : 'Free with Registration'}
                </p>
              </div>
            </div>
          </div>

          {/* Related Movies Section */}
          {relatedMovies.length > 0 && (
            <div className="pt-6 border-t border-neutral-800">
              <h3 className="text-base sm:text-lg font-bold text-white font-['Cinzel',serif] uppercase mb-4">
                More Like This
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {relatedMovies.map((rel) => (
                  <MovieCard key={rel.id} movie={rel} layout="poster" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
