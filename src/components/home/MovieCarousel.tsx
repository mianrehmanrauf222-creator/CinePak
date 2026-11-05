import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, LucideIcon } from 'lucide-react';
import { Movie } from '../../types';
import { MovieCard } from '../movies/MovieCard';

interface MovieCarouselProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  icon?: LucideIcon;
  badge?: string;
  onViewAll?: () => void;
  layout?: 'poster' | 'backdrop';
}

export const MovieCarousel: React.FC<MovieCarouselProps> = ({
  title,
  subtitle,
  movies,
  icon: Icon,
  badge,
  onViewAll,
  layout = 'poster'
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
      scrollContainerRef.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (movies.length === 0) return null;

  return (
    <div className="py-6 sm:py-8 relative group/row">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row */}
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {Icon && <Icon className="w-5 h-5 text-amber-400" />}
              {badge && (
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {badge}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-['Cinzel',serif] tracking-wide uppercase">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right: View All & Carousel Arrows */}
          <div className="flex items-center gap-2">
            {onViewAll && (
              <button
                onClick={onViewAll}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors mr-2 px-2.5 py-1 rounded-md hover:bg-neutral-800/60"
              >
                View All ({movies.length}) →
              </button>
            )}

            <button
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-amber-500/50 hover:bg-neutral-800 transition-all shadow-md active:scale-95"
              aria-label="Scroll Left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-neutral-900/90 border border-neutral-800 text-neutral-300 hover:text-white hover:border-amber-500/50 hover:bg-neutral-800 transition-all shadow-md active:scale-95"
              aria-label="Scroll Right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Area */}
        <div
          ref={scrollContainerRef}
          className="flex items-stretch gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-3 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className={`shrink-0 ${
                layout === 'poster' 
                  ? 'w-[160px] sm:w-[200px] md:w-[220px]' 
                  : 'w-[260px] sm:w-[320px] md:w-[360px]'
              }`}
            >
              <MovieCard movie={movie} layout={layout} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
