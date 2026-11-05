import React from 'react';
import { 
  Flame, 
  Sparkles, 
  Crown, 
  Tv, 
  Film, 
  Clock, 
  ShieldCheck, 
  Compass, 
  Play,
  ArrowRight
} from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import { HeroBanner } from '../components/home/HeroBanner';
import { MovieCarousel } from '../components/home/MovieCarousel';

interface HomePageProps {
  setCurrentTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setCurrentTab }) => {
  const { movies, packages, openPaymentModal } = useMovies();
  const { hasActiveSubscription } = useAuth();

  // Filter movie lists for home page carousels
  const featuredMovies = movies.filter((m) => m.isFeatured);
  const trendingMovies = movies.filter((m) => m.isTrending);
  const latestMovies = movies.filter((m) => m.isLatest || m.releaseYear >= 2023);
  const punjabiMovies = movies.filter((m) => m.language === 'Punjabi');
  const hindiMovies = movies.filter((m) => m.language === 'Hindi');
  const englishMovies = movies.filter((m) => m.language === 'English');
  const popularMovies = [...movies].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner with Featured Movies */}
      <HeroBanner featuredMovies={featuredMovies.length > 0 ? featuredMovies : movies.slice(0, 3)} />

      {/* Quick Category Jump Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="bg-[#121318]/90 backdrop-blur-xl border border-neutral-800 rounded-2xl p-2.5 sm:p-3 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
          {[
            { id: 'punjabi', label: 'Punjabi Cinema', count: punjabiMovies.length },
            { id: 'hindi', label: 'Hindi Cinema', count: hindiMovies.length },
            { id: 'english', label: 'English Cinema', count: englishMovies.length },
            { id: 'trending', label: 'Top Trending', count: trendingMovies.length },
            { id: 'latest', label: 'New Releases', count: latestMovies.length }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setCurrentTab(cat.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-neutral-300 hover:text-white bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800/80 hover:border-amber-500/40 shrink-0 transition-all flex items-center gap-2"
            >
              <span>{cat.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-neutral-800 text-amber-400 font-mono">
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. Trending Movies Carousel */}
      <MovieCarousel
        title="Trending in Pakistan"
        subtitle="The most-watched blockbusters across the nation right now"
        movies={trendingMovies}
        icon={Flame}
        badge="TOP 10"
        onViewAll={() => setCurrentTab('trending')}
      />

      {/* 2. Punjabi Cinema Carousel */}
      <MovieCarousel
        title="Punjabi Cinema (پنجابی سنیما)"
        subtitle="Epic action, folk legends, and riotous family comedies"
        movies={punjabiMovies}
        icon={Film}
        badge="DESI HITS"
        onViewAll={() => setCurrentTab('punjabi')}
      />

      {/* Special Promotional Banner (PKR Pricing Teaser) */}
      {!hasActiveSubscription && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-[#14151c] to-black p-6 sm:p-10 shadow-[0_0_40px_rgba(245,158,11,0.15)]">
            <div className="relative z-10 max-w-xl space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Crown className="w-3.5 h-3.5" />
                Unrestricted 4K VIP Access
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-['Cinzel',serif] uppercase">
                Stream Every Blockbuster for just PKR 199/month
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Enjoy unlimited Punjabi, Urdu, Hindi, and English cinema with Dolby Atmos, zero advertisements, and simultaneous streaming across all devices.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => openPaymentModal(packages[1])}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-black gold-gradient-bg shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Subscribe with JazzCash & Easypaisa
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentTab('packages')}
                  className="px-5 py-3 rounded-xl font-semibold text-sm text-neutral-200 bg-neutral-800/80 hover:bg-neutral-700 transition-colors"
                >
                  View All Packages (PKR)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Latest Releases */}
      <MovieCarousel
        title="Latest Releases"
        subtitle="Fresh from the theaters and studio vaults"
        movies={latestMovies}
        icon={Clock}
        onViewAll={() => setCurrentTab('latest')}
      />

      {/* 4. Hindi Cinema */}
      <MovieCarousel
        title="Hindi Cinema (हिंदी सिनेमा)"
        subtitle="High-octane blockbusters, timeless musicals, and romantic thrillers"
        movies={hindiMovies}
        icon={Film}
        onViewAll={() => setCurrentTab('hindi')}
      />

      {/* 5. English Cinema */}
      <MovieCarousel
        title="Hollywood & International"
        subtitle="Global award winners, sci-fi masterpieces, and gripping dramas"
        movies={englishMovies}
        icon={Compass}
        onViewAll={() => setCurrentTab('english')}
      />

      {/* 6. Popular Movies (Backdrop Layout) */}
      <MovieCarousel
        title="All-Time Most Watched"
        subtitle="The highest grossing cinematic masterpieces on CinePak"
        movies={popularMovies}
        layout="backdrop"
        badge="FAN FAVORITES"
        onViewAll={() => setCurrentTab('movies')}
      />
    </div>
  );
};
