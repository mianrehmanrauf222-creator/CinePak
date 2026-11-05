import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Info, 
  Plus, 
  Check, 
  Star, 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Lock
} from 'lucide-react';
import { Movie } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useMovies } from '../../context/MovieContext';

interface HeroBannerProps {
  featuredMovies: Movie[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ featuredMovies }) => {
  const { isInWatchlist, toggleWatchlist, hasActiveSubscription } = useAuth();
  const { openPlayer, openDetails, openPaymentModal, packages } = useMovies();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  const movies = featuredMovies.length > 0 ? featuredMovies : [];
  const currentMovie = movies[currentIndex] || movies[0];

  // Auto rotate banners every 8 seconds
  useEffect(() => {
    if (movies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [movies.length]);

  if (!currentMovie) return null;

  const inWatchlist = isInWatchlist(currentMovie.id);

  const handlePlayClick = () => {
    if (currentMovie.isPremium && !hasActiveSubscription) {
      openPaymentModal(packages[1]); // open standard package modal
    } else {
      openPlayer(currentMovie);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  };

  return (
    <div className="relative w-full h-[75vh] min-h-[580px] max-h-[820px] overflow-hidden select-none">
      {/* Background Backdrop Image with layered cinematic gradients */}
      <div className="absolute inset-0">
        <img
          key={currentMovie.id}
          src={currentMovie.backdropUrl}
          alt={currentMovie.title}
          className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.1] transition-all duration-1000 scale-100 hover:scale-[1.02]"
        />
        {/* Cinematic Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-[#08080a]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-[#08080a]/70 to-transparent max-w-4xl" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Hero Content Container */}
      <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-24 z-10">
        <div className="max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Badges: Featured Tag & Quality */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              <Sparkles className="w-3.5 h-3.5" />
              Featured Premiere
            </span>

            <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-neutral-900/80 text-amber-300 border border-amber-500/30">
              {currentMovie.language}
            </span>

            <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-neutral-900/80 text-neutral-200 border border-neutral-700">
              {currentMovie.quality}
            </span>

            <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-neutral-900/80 px-2.5 py-0.5 rounded border border-neutral-800">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{currentMovie.rating.toFixed(1)}</span>
            </div>

            <span className="text-xs text-neutral-400 font-medium">
              {currentMovie.releaseYear} • {currentMovie.duration}
            </span>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-['Cinzel',serif] uppercase leading-[1.05] drop-shadow-md">
              {currentMovie.title}
            </h1>
            {currentMovie.originalTitle && (
              <p className="text-lg sm:text-xl text-amber-400/90 font-serif mt-1 tracking-wide">
                {currentMovie.originalTitle}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-neutral-300 line-clamp-3 leading-relaxed max-w-xl text-shadow">
            {currentMovie.description}
          </p>

          {/* Cast Preview */}
          <p className="text-xs text-neutral-400">
            <span className="text-neutral-500 font-semibold uppercase tracking-wider">Starring: </span>
            {currentMovie.cast.slice(0, 4).join(', ')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <button
              onClick={handlePlayClick}
              className="flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-xl font-bold text-sm sm:text-base text-black gold-gradient-bg shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:brightness-110 active:scale-95 transition-all"
            >
              {currentMovie.isPremium && !hasActiveSubscription ? (
                <>
                  <Lock className="w-5 h-5 text-black" />
                  Unlock & Play
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-black text-black" />
                  Play Movie
                </>
              )}
            </button>

            <button
              onClick={() => openDetails(currentMovie)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm sm:text-base text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 active:scale-95 transition-all shadow-md backdrop-blur-sm"
            >
              <Info className="w-5 h-5 text-neutral-300" />
              Movie Details
            </button>

            <button
              onClick={() => toggleWatchlist(currentMovie.id)}
              className={`p-3 rounded-xl border transition-all active:scale-95 ${
                inWatchlist
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-neutral-900/80 text-white border-neutral-700/80 hover:border-neutral-500'
              }`}
              title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              aria-label="Toggle Watchlist"
            >
              {inWatchlist ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Floating Controls: Audio toggle & Carousel controls */}
      <div className="absolute bottom-16 right-4 sm:right-8 z-20 flex items-center gap-3">
        {/* Sound toggle button */}
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2.5 rounded-full bg-neutral-900/80 border border-neutral-700/70 text-neutral-300 hover:text-white hover:border-amber-500/50 backdrop-blur-md transition-all shadow-lg"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          aria-label="Toggle Audio"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
        </button>

        {/* Carousel Prev/Next */}
        {movies.length > 1 && (
          <div className="flex items-center gap-1.5 bg-neutral-900/80 p-1 rounded-full border border-neutral-700/70 backdrop-blur-md">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-1 px-1">
              {movies.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentIndex === i ? 'w-5 bg-amber-400' : 'w-1.5 bg-neutral-600'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
