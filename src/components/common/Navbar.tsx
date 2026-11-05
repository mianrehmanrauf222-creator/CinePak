import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bookmark, 
  User, 
  Crown, 
  Shield, 
  LogOut, 
  Menu, 
  X, 
  Tv, 
  Clock, 
  Flame, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../../context/AuthContext';
import { useMovies } from '../../context/MovieContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, isAdmin, hasActiveSubscription, logout } = useAuth();
  const { 
    searchQuery, 
    setSearchQuery, 
    setAuthModalOpen, 
    setAuthModalTab 
  } = useMovies();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'movies', label: 'All Movies' },
    { id: 'punjabi', label: 'Punjabi Cinema' },
    { id: 'hindi', label: 'Hindi Cinema' },
    { id: 'english', label: 'English Cinema' },
    { id: 'latest', label: 'Latest' },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'packages', label: 'Plans & Pricing', highlight: true }
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentTab('movies');
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#08080a]/95 backdrop-blur-xl border-b border-neutral-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.8)] py-3' 
          : 'bg-gradient-to-b from-black/90 via-[#08080a]/60 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Logo & Desktop Navigation */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => handleNavClick('home')}
              className="focus:outline-none transition-transform hover:scale-[1.02]"
              aria-label="CinePak Home"
            >
              <Logo size="md" />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = currentTab === link.id;
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                      isActive 
                        ? 'text-amber-400 font-semibold bg-amber-400/10 shadow-[0_0_12px_rgba(245,158,11,0.15)]' 
                        : link.highlight
                        ? 'text-amber-300/90 hover:text-amber-200 hover:bg-neutral-800/50'
                        : 'text-neutral-300 hover:text-white hover:bg-neutral-800/40'
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 text-amber-500" />}
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-amber-500 to-yellow-300 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Search, Watchlist, Subscriptions, User Profile */}
          <div className="flex items-center gap-3">
            
            {/* Search Bar */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search movies, actors, genres..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (currentTab !== 'movies') setCurrentTab('movies');
                      }}
                      className="w-48 sm:w-64 bg-neutral-900/90 text-sm text-neutral-100 placeholder-neutral-400 pl-9 pr-8 py-1.5 rounded-full border border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-inner"
                    />
                    <Search className="w-4 h-4 text-amber-400 absolute left-3 pointer-events-none" />
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="absolute right-2.5 text-neutral-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-full text-neutral-300 hover:text-amber-400 hover:bg-neutral-800/60 transition-colors"
                  aria-label="Search movies"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Watchlist Quick Button */}
            <button
              onClick={() => handleNavClick('watchlist')}
              className={`p-2 rounded-full relative transition-colors ${
                currentTab === 'watchlist'
                  ? 'text-amber-400 bg-amber-500/10'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
              title="My Watchlist"
              aria-label="My Watchlist"
            >
              <Bookmark className="w-5 h-5" />
              {user && user.watchlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                  {user.watchlist.length}
                </span>
              )}
            </button>

            {/* Admin Dashboard Quick Access (If admin) */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  currentTab === 'admin'
                    ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-neutral-800/80 text-amber-400 border border-amber-500/30 hover:bg-amber-500/10'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Panel
              </button>
            )}

            {/* User Account / Sign In */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full bg-neutral-900/80 border border-neutral-700/60 hover:border-amber-500/40 transition-all focus:outline-none"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-black font-bold text-xs uppercase shadow">
                    {user.displayName ? user.displayName[0] : 'U'}
                  </div>
                  <span className="hidden sm:inline-block text-xs font-medium text-neutral-200 max-w-[100px] truncate">
                    {user.displayName || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 pr-1" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 rounded-xl bg-[#121318] border border-neutral-800 shadow-[0_10px_35px_rgba(0,0,0,0.9)] py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    {/* User Info Header */}
                    <div className="px-4 py-2.5 border-b border-neutral-800/80">
                      <p className="text-sm font-semibold text-white truncate">{user.displayName}</p>
                      <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
                          <Crown className="w-3 h-3" />
                          {user.subscription?.packageName || 'Free Tier'}
                        </span>
                        {hasActiveSubscription ? (
                          <span className="text-[11px] text-emerald-400 font-medium">Active</span>
                        ) : (
                          <button
                            onClick={() => {
                              setUserDropdownOpen(false);
                              handleNavClick('packages');
                            }}
                            className="text-[11px] text-amber-400 hover:underline font-semibold"
                          >
                            Upgrade
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('profile');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800/60 flex items-center gap-2.5"
                      >
                        <User className="w-4 h-4 text-neutral-400" />
                        My Account & Profile
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('watchlist');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800/60 flex items-center gap-2.5"
                      >
                        <Bookmark className="w-4 h-4 text-neutral-400" />
                        My Watchlist ({user.watchlist.length})
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('profile');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800/60 flex items-center gap-2.5"
                      >
                        <Clock className="w-4 h-4 text-neutral-400" />
                        Watch History
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('packages');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800/60 flex items-center gap-2.5"
                      >
                        <Tv className="w-4 h-4 text-amber-400" />
                        Subscription Plans (PKR)
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            handleNavClick('admin');
                          }}
                          className="w-full text-left px-4 py-2 text-xs text-amber-400 font-semibold hover:bg-amber-500/10 flex items-center gap-2.5"
                        >
                          <Shield className="w-4 h-4 text-amber-400" />
                          Admin Dashboard
                        </button>
                      )}
                    </div>

                    <div className="border-t border-neutral-800/80 pt-1 mt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalTab('login');
                    setAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-neutral-200 hover:text-white bg-neutral-800/80 hover:bg-neutral-700/80 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setAuthModalTab('signup');
                    setAuthModalOpen(true);
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-black gold-gradient-bg rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:brightness-110 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Join Free
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-300 hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0d12]/98 border-b border-neutral-800 px-4 pt-3 pb-6 space-y-2 backdrop-blur-2xl">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-neutral-800">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTab === link.id
                    ? 'bg-amber-500/20 text-amber-400 font-semibold'
                    : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('watchlist')}
              className="flex items-center justify-between px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800/50 rounded-lg"
            >
              <span className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-400" />
                My Watchlist
              </span>
              <span className="text-xs bg-neutral-800 px-2 py-0.5 rounded text-neutral-400">
                {user?.watchlist.length || 0}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-300 hover:bg-neutral-800/50 rounded-lg"
            >
              <User className="w-4 h-4 text-amber-400" />
              Account & Profile
            </button>

            <button
              onClick={() => handleNavClick('packages')}
              className="flex items-center justify-between px-3 py-2 text-sm text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg"
            >
              <span className="flex items-center gap-2 font-semibold">
                <Crown className="w-4 h-4 text-amber-400" />
                Subscription Plans (PKR)
              </span>
              <span className="text-xs text-amber-400 font-bold">From PKR 199</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-2 px-3 py-2 text-sm text-amber-400 font-bold bg-amber-500/15 border border-amber-500/40 rounded-lg"
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </button>
            )}

            {!user && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAuthModalTab('login');
                  setAuthModalOpen(true);
                }}
                className="w-full py-2.5 mt-2 text-center text-sm font-bold text-black gold-gradient-bg rounded-lg shadow"
              >
                Sign In / Join CinePak
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
