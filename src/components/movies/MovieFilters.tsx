import React from 'react';
import { Search, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { Language, Genre, VideoQuality } from '../../types';
import { useMovies } from '../../context/MovieContext';

export const MovieFilters: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedLanguage,
    setSelectedLanguage,
    selectedGenre,
    setSelectedGenre,
    selectedQuality,
    setSelectedQuality,
    selectedYear,
    setSelectedYear,
    sortBy,
    setSortBy,
    resetFilters
  } = useMovies();

  const languages: (Language | 'All')[] = ['All', 'Punjabi', 'Urdu', 'Hindi', 'English'];
  const genres: (Genre | 'All')[] = [
    'All',
    'Action',
    'Comedy',
    'Drama',
    'Romance',
    'Thriller',
    'Sci-Fi',
    'Horror',
    'Historical'
  ];
  const qualities: (VideoQuality | 'All')[] = ['All', '4K UHD', '1080p FHD', '720p HD'];
  const years: string[] = ['All', '2024', '2023', '2022', '2021', '2019', '2018', '2014', '2009'];

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedLanguage !== 'All' || 
    selectedGenre !== 'All' || 
    selectedQuality !== 'All' || 
    selectedYear !== 'All';

  return (
    <div className="bg-[#101116] border border-neutral-800/80 rounded-2xl p-4 sm:p-6 shadow-xl mb-8 space-y-4">
      {/* Top Bar: Search and Sort */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by title, director, actors, keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181920] border border-neutral-700/80 text-sm text-white placeholder-neutral-400 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/80 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort Order */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Sort:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#181920] border border-neutral-700/80 text-xs font-semibold text-neutral-200 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
          >
            <option value="popular">Most Popular</option>
            <option value="rating">Highest Rating</option>
            <option value="latest">Release Year (Newest)</option>
            <option value="title">Title (A-Z)</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl border border-amber-500/30 transition-all"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs & Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-neutral-800/80">
        
        {/* Language Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
            Language
          </label>
          <div className="flex flex-wrap gap-1">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  selectedLanguage === lang
                    ? 'bg-amber-500 text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'bg-[#181920] text-neutral-300 hover:text-white hover:bg-neutral-850 border border-neutral-700/60'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Genre Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
            Genre
          </label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value as any)}
            className="w-full bg-[#181920] border border-neutral-700/80 text-xs font-medium text-neutral-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
          >
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Quality Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
            Streaming Quality
          </label>
          <div className="flex flex-wrap gap-1">
            {qualities.map((q) => (
              <button
                key={q}
                onClick={() => setSelectedQuality(q)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                  selectedQuality === q
                    ? 'bg-amber-500 text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                    : 'bg-[#181920] text-neutral-300 hover:text-white border border-neutral-700/60'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Release Year Filter */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
            Release Year
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full bg-[#181920] border border-neutral-700/80 text-xs font-medium text-neutral-200 px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer"
          >
            {years.map((y) => (
              <option key={y} value={y}>{y === 'All' ? 'All Years' : y}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
