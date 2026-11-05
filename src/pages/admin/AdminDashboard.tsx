import React, { useState } from 'react';
import { 
  Shield, 
  Film, 
  Users, 
  CreditCard, 
  DollarSign, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Check, 
  X, 
  Sparkles, 
  Crown, 
  Lock, 
  Tv, 
  BarChart3,
  Flame,
  ArrowUpRight,
  ExternalLink,
  Layers,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMovies } from '../../context/MovieContext';
import { Movie, SubscriptionPackage, Language, Genre, VideoQuality, PaymentTransaction } from '../../types';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { 
    movies, 
    addMovie, 
    updateMovie, 
    deleteMovie, 
    packages, 
    updatePackage, 
    transactions,
    banners,
    toggleBannerStatus
  } = useMovies();

  // Admin tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'movies' | 'packages' | 'transactions' | 'users'>('overview');

  // Search in admin movie table
  const [movieSearch, setMovieSearch] = useState('');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState<string>('All');

  // Movie Add / Edit Modal state
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);

  // Package Edit Modal state
  const [editingPackage, setEditingPackage] = useState<SubscriptionPackage | null>(null);
  const [packageSaveToast, setPackageSaveToast] = useState(false);

  // Movie form data state
  const initialMovieForm: Omit<Movie, 'id'> = {
    title: '',
    originalTitle: '',
    tagline: '',
    description: '',
    language: 'Punjabi',
    genre: ['Action', 'Drama'],
    releaseYear: 2024,
    duration: '2h 15m',
    durationMinutes: 135,
    rating: 8.5,
    quality: '4K UHD',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1920&auto=format&fit=crop',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    trailerUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    cast: ['Fawad Khan', 'Mahira Khan'],
    director: 'Bilal Lashari',
    isPremium: true,
    isFeatured: false,
    isTrending: true,
    isLatest: true,
    viewsCount: 1000
  };

  const [movieForm, setMovieForm] = useState<Omit<Movie, 'id'>>(initialMovieForm);

  // If user is not admin, deny access
  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-white font-['Cinzel',serif]">
          Restricted Admin Portal
        </h2>
        <p className="text-sm text-neutral-400 max-w-sm mx-auto">
          You do not have administrative privileges to view this portal. Access is strictly audited.
        </p>
      </div>
    );
  }

  // Analytics Metrics
  const totalMovies = movies.length;
  const totalUsers = 14820 + transactions.length;
  const activeSubs = 8450 + transactions.filter(t => t.status === 'completed').length;
  const totalRevenuePKR = 2845900 + transactions.reduce((acc, t) => acc + (t.status === 'completed' ? t.amountPKR : 0), 0);

  // Filter movies for admin table
  const filteredAdminMovies = movies.filter((m) => {
    const matchQuery = m.title.toLowerCase().includes(movieSearch.toLowerCase()) || m.director.toLowerCase().includes(movieSearch.toLowerCase());
    const matchLang = selectedLanguageFilter === 'All' || m.language === selectedLanguageFilter;
    return matchQuery && matchLang;
  });

  const handleOpenAddModal = () => {
    setEditingMovieId(null);
    setMovieForm(initialMovieForm);
    setIsMovieModalOpen(true);
  };

  const handleOpenEditModal = (movie: Movie) => {
    setEditingMovieId(movie.id);
    setMovieForm({
      title: movie.title,
      originalTitle: movie.originalTitle || '',
      tagline: movie.tagline || '',
      description: movie.description,
      language: movie.language,
      genre: movie.genre,
      releaseYear: movie.releaseYear,
      duration: movie.duration,
      durationMinutes: movie.durationMinutes,
      rating: movie.rating,
      quality: movie.quality,
      posterUrl: movie.posterUrl,
      backdropUrl: movie.backdropUrl,
      videoUrl: movie.videoUrl,
      trailerUrl: movie.trailerUrl,
      cast: movie.cast,
      director: movie.director,
      isPremium: movie.isPremium,
      isFeatured: movie.isFeatured,
      isTrending: movie.isTrending,
      isLatest: movie.isLatest,
      viewsCount: movie.viewsCount
    });
    setIsMovieModalOpen(true);
  };

  const handleSaveMovie = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMovieId) {
      updateMovie(editingMovieId, movieForm);
    } else {
      addMovie(movieForm);
    }
    setIsMovieModalOpen(false);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPackage) {
      updatePackage(editingPackage.id, editingPackage);
      setEditingPackage(null);
      setPackageSaveToast(true);
      setTimeout(() => setPackageSaveToast(false), 2500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500 text-black">
              System Console
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Authenticated: {user?.email}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-['Cinzel',serif] uppercase">
            CinePak Admin Dashboard
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Oversee catalogue, configure PKR pricing packages, inspect transactions, and monitor subscribers.
          </p>
        </div>

        {/* Quick action: Add Movie button */}
        <button
          onClick={handleOpenAddModal}
          className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black gold-gradient-bg shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Movie
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-6 border-b border-neutral-800">
        {[
          { id: 'overview', label: 'Analytics & Overview', icon: BarChart3 },
          { id: 'movies', label: `Manage Movies (${movies.length})`, icon: Film },
          { id: 'packages', label: 'Subscription Packages (PKR)', icon: Crown },
          { id: 'transactions', label: `Payment Records (${transactions.length})`, icon: CreditCard },
          { id: 'users', label: 'Users & Subscriptions', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
                isActive
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-[#121318] text-neutral-300 hover:text-white border border-neutral-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. OVERVIEW & ANALYTICS TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#121318] border border-neutral-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Registered Users</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white font-sans">{totalUsers.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-400 font-medium">↑ +14.2% this month</span>
            </div>

            <div className="bg-[#121318] border border-neutral-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Paid Subs</span>
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white font-sans">{activeSubs.toLocaleString()}</div>
              <span className="text-[11px] text-emerald-400 font-medium">57% Paid Conversion Rate</span>
            </div>

            <div className="bg-[#121318] border border-neutral-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Monthly Revenue (PKR)</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-black text-amber-400 font-sans">
                PKR {totalRevenuePKR.toLocaleString()}
              </div>
              <span className="text-[11px] text-neutral-400">Avg. PKR 336 / user</span>
            </div>

            <div className="bg-[#121318] border border-neutral-800 rounded-2xl p-5 space-y-2">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Movies in Library</span>
                <Film className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-black text-white font-sans">{totalMovies} Titles</div>
              <span className="text-[11px] text-amber-300 font-medium">4K Remastered Catalogue</span>
            </div>
          </div>

          {/* Revenue by Gateway Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#121318] border border-neutral-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white font-['Cinzel',serif] uppercase tracking-wider">
                Pakistani Payment Methods Breakdown
              </h3>
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-300 font-semibold">JazzCash Mobile Wallet (48%)</span>
                    <span className="text-amber-400 font-bold">PKR 1,366,032</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: '48%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-300 font-semibold">Easypaisa Account (34%)</span>
                    <span className="text-amber-400 font-bold">PKR 967,606</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '34%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-300 font-semibold">Credit / Debit Card (Visa/MC) (14%)</span>
                    <span className="text-amber-400 font-bold">PKR 398,426</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full" style={{ width: '14%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-300 font-semibold">Raast IBAN & Bank Transfer (4%)</span>
                    <span className="text-amber-400 font-bold">PKR 113,836</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '4%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Language Distribution */}
            <div className="bg-[#121318] border border-neutral-800 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white font-['Cinzel',serif] uppercase tracking-wider">
                Language Distribution
              </h3>
              <div className="space-y-2.5 text-xs text-neutral-300">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                  <span>Punjabi Cinema:</span>
                  <span className="font-bold text-amber-400">
                    {movies.filter(m => m.language === 'Punjabi').length} titles
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                  <span>Urdu / Lollywood:</span>
                  <span className="font-bold text-amber-400">
                    {movies.filter(m => m.language === 'Urdu').length} titles
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                  <span>Hindi / Bollywood:</span>
                  <span className="font-bold text-amber-400">
                    {movies.filter(m => m.language === 'Hindi').length} titles
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                  <span>English / Hollywood:</span>
                  <span className="font-bold text-amber-400">
                    {movies.filter(m => m.language === 'English').length} titles
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span>VIP Premium Gated:</span>
                  <span className="font-bold text-emerald-400">
                    {movies.filter(m => m.isPremium).length} titles
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MANAGE MOVIES TAB */}
      {activeTab === 'movies' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-[#121318] border border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-amber-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by title or director..."
                value={movieSearch}
                onChange={(e) => setMovieSearch(e.target.value)}
                className="w-full bg-[#181920] border border-neutral-700 text-xs text-white placeholder-neutral-400 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedLanguageFilter}
                onChange={(e) => setSelectedLanguageFilter(e.target.value)}
                className="bg-[#181920] border border-neutral-700 text-xs text-neutral-300 px-3 py-2 rounded-xl focus:outline-none"
              >
                <option value="All">All Languages</option>
                <option value="Punjabi">Punjabi</option>
                <option value="Urdu">Urdu</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
              </select>

              <button
                onClick={handleOpenAddModal}
                className="py-2 px-4 rounded-xl text-xs font-bold text-black gold-gradient-bg whitespace-nowrap flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" /> Add Movie
              </button>
            </div>
          </div>

          {/* Movies Data Table */}
          <div className="bg-[#121318] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300 min-w-[700px]">
                <thead className="bg-[#0e0f14] border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Movie</th>
                    <th className="py-3 px-4">Language</th>
                    <th className="py-3 px-4">Genre</th>
                    <th className="py-3 px-4">Year</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Access Tier</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {filteredAdminMovies.map((movie) => (
                    <tr key={movie.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-10 h-14 object-cover rounded bg-neutral-900 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-sm line-clamp-1">{movie.title}</p>
                          <p className="text-[11px] text-neutral-400 line-clamp-1">{movie.director} • {movie.duration}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-amber-300">
                          {movie.language}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="line-clamp-1">{movie.genre.slice(0, 2).join(', ')}</span>
                      </td>
                      <td className="py-3 px-4 font-mono">{movie.releaseYear}</td>
                      <td className="py-3 px-4 text-amber-400 font-bold">{movie.rating.toFixed(1)} ★</td>
                      <td className="py-3 px-4">
                        {movie.isPremium ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                            VIP Premium
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Free Tier
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(movie)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 transition-colors"
                            title="Edit Movie"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${movie.title}"?`)) {
                                deleteMovie(movie.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                            title="Delete Movie"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. MANAGE SUBSCRIPTION PACKAGES TAB (PKR) */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white font-['Cinzel',serif] uppercase">
                Configure Subscription Packages (PKR)
              </h2>
              <p className="text-xs text-neutral-400">
                Admins can change package pricing, simultaneous screens, and features in real-time.
              </p>
            </div>

            {packageSaveToast && (
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300 text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4" /> Package Updated!
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-[#121318] border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-white font-['Cinzel',serif] text-base">{pkg.name}</h3>
                    {pkg.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">
                        {pkg.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-sans mt-2">
                    PKR {pkg.pricePKR} <span className="text-xs text-neutral-400 font-normal">/{pkg.billingCycle}</span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-800 text-xs space-y-1.5 text-neutral-300">
                    <p><span className="text-neutral-400">Screens:</span> {pkg.screens} simultaneous</p>
                    <p><span className="text-neutral-400">Quality:</span> {pkg.resolution}</p>
                    <p><span className="text-neutral-400">Audio:</span> {pkg.audioQuality}</p>
                  </div>
                </div>

                <button
                  onClick={() => setEditingPackage(pkg)}
                  className="w-full py-2 px-3 rounded-xl text-xs font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Package Price & Perks
                </button>
              </div>
            ))}
          </div>

          {/* Edit Package Modal */}
          {editingPackage && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#121318] border border-amber-500/40 rounded-2xl p-6 sm:p-8 max-w-md w-full space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                  <h3 className="font-bold text-white font-['Cinzel',serif] text-base">
                    Edit {editingPackage.name}
                  </h3>
                  <button onClick={() => setEditingPackage(null)} className="text-neutral-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSavePackage} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                      Price in Pakistani Rupees (PKR)
                    </label>
                    <input
                      type="number"
                      required
                      value={editingPackage.pricePKR}
                      onChange={(e) => setEditingPackage({ ...editingPackage, pricePKR: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3 py-2 rounded-xl focus:outline-none font-bold text-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                      Resolution
                    </label>
                    <input
                      type="text"
                      required
                      value={editingPackage.resolution}
                      onChange={(e) => setEditingPackage({ ...editingPackage, resolution: e.target.value })}
                      className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3 py-2 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                      Simultaneous Screens
                    </label>
                    <input
                      type="number"
                      required
                      value={editingPackage.screens}
                      onChange={(e) => setEditingPackage({ ...editingPackage, screens: parseInt(e.target.value) || 1 })}
                      className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3 py-2 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingPackage(null)}
                      className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl font-bold text-black gold-gradient-bg shadow flex items-center gap-1.5"
                    >
                      <Save className="w-4 h-4" /> Save Package
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. PAYMENT TRANSACTIONS TAB */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-['Cinzel',serif] uppercase">
              All Payment Transactions (JazzCash / Easypaisa / Cards)
            </h2>
            <span className="text-xs text-neutral-400">
              Total {transactions.length} verified sandbox records
            </span>
          </div>

          <div className="bg-[#121318] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300 min-w-[700px]">
                <thead className="bg-[#0e0f14] border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Transaction Ref</th>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Package</th>
                    <th className="py-3 px-4">Gateway</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/80">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-amber-400">{tx.transactionRef}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-white">{tx.userEmail}</p>
                        <p className="text-[10px] text-neutral-400">{tx.accountOrCardNumber || 'Direct'}</p>
                      </td>
                      <td className="py-3 px-4 font-medium">{tx.packageName}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          tx.paymentMethod === 'JazzCash' ? 'bg-rose-500/20 text-rose-300' :
                          tx.paymentMethod === 'Easypaisa' ? 'bg-emerald-500/20 text-emerald-300' :
                          'bg-sky-500/20 text-sky-300'
                        }`}>
                          {tx.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-white">PKR {tx.amountPKR}</td>
                      <td className="py-3 px-4 text-neutral-400">
                        {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. USERS TAB */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-['Cinzel',serif] uppercase">
              Registered Users & Roles
            </h2>
            <span className="text-xs text-neutral-400">
              Role validation enforced server-side
            </span>
          </div>

          <div className="bg-[#121318] border border-neutral-800 rounded-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#181920] border border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gold-gradient-bg flex items-center justify-center text-black font-bold text-sm uppercase">
                  A
                </div>
                <div>
                  <p className="font-bold text-white text-sm">mianrehmanrauf222@gmail.com</p>
                  <p className="text-xs text-amber-400">System Super Admin • Premium Yearly Subscriber</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-bold uppercase bg-amber-500 text-black">
                Primary Admin
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#181920] border border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-white font-bold text-sm uppercase">
                  H
                </div>
                <div>
                  <p className="font-bold text-white text-sm">viewer.cinepak@gmail.com</p>
                  <p className="text-xs text-neutral-400">Standard Monthly Subscriber • JazzCash</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded text-xs font-bold uppercase bg-neutral-800 text-neutral-300">
                User
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MOVIE MODAL */}
      {isMovieModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#121318] border border-amber-500/40 rounded-2xl p-6 sm:p-8 max-w-3xl w-full my-8 space-y-5">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="font-bold text-white font-['Cinzel',serif] text-lg">
                {editingMovieId ? 'Edit Movie Details' : 'Add New Movie to CinePak'}
              </h3>
              <button onClick={() => setIsMovieModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Movie Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={movieForm.title}
                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                    className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3 py-2 rounded-xl focus:outline-none"
                    placeholder="e.g. The Legend of Maula Jatt"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Original / Urdu Title
                  </label>
                  <input
                    type="text"
                    value={movieForm.originalTitle || ''}
                    onChange={(e) => setMovieForm({ ...movieForm, originalTitle: e.target.value })}
                    className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3 py-2 rounded-xl focus:outline-none"
                    placeholder="e.g. دی لیجنڈ آف مولا جٹ"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Language *
                  </label>
                  <select
                    value={movieForm.language}
                    onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value as any })}
                    className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3 py-2 rounded-xl focus:outline-none"
                  >
                    <option value="Punjabi">Punjabi</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Release Year *
                  </label>
                  <input
                    type="number"
                    required
                    value={movieForm.releaseYear}
                    onChange={(e) => setMovieForm({ ...movieForm, releaseYear: parseInt(e.target.value) || 2024 })}
                    className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3 py-2 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Duration (e.g. 2h 20m)
                  </label>
                  <input
                    type="text"
                    required
                    value={movieForm.duration}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                    className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3 py-2 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  Storyline / Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={movieForm.description}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3 py-2 rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Authorized Streaming Video URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={movieForm.videoUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, videoUrl: e.target.value })}
                    className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3 py-2 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Trailer Video URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={movieForm.trailerUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, trailerUrl: e.target.value })}
                    className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3 py-2 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Poster Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={movieForm.posterUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                    className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3 py-2 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Backdrop Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={movieForm.backdropUrl}
                    onChange={(e) => setMovieForm({ ...movieForm, backdropUrl: e.target.value })}
                    className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3 py-2 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Director *
                  </label>
                  <input
                    type="text"
                    required
                    value={movieForm.director}
                    onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                    className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3 py-2 rounded-xl focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    IMDb Rating (e.g. 8.5)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    required
                    value={movieForm.rating}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: parseFloat(e.target.value) || 8.0 })}
                    className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3 py-2 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-neutral-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={movieForm.isPremium}
                    onChange={(e) => setMovieForm({ ...movieForm, isPremium: e.target.checked })}
                    className="rounded bg-neutral-800 border-neutral-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-neutral-300">VIP Premium</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={movieForm.isFeatured}
                    onChange={(e) => setMovieForm({ ...movieForm, isFeatured: e.target.checked })}
                    className="rounded bg-neutral-800 border-neutral-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-neutral-300">Hero Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={movieForm.isTrending}
                    onChange={(e) => setMovieForm({ ...movieForm, isTrending: e.target.checked })}
                    className="rounded bg-neutral-800 border-neutral-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-neutral-300">Top Trending</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={movieForm.isLatest}
                    onChange={(e) => setMovieForm({ ...movieForm, isLatest: e.target.checked })}
                    className="rounded bg-neutral-800 border-neutral-700 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="font-semibold text-neutral-300">Latest Release</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsMovieModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-bold text-black gold-gradient-bg shadow flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {editingMovieId ? 'Save Movie Changes' : 'Publish Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
