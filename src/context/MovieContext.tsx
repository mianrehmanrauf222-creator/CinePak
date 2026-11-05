import React, { createContext, useContext, useState, useEffect } from 'react';
import { Movie, SubscriptionPackage, PaymentTransaction, HomepageBanner, Language, Genre, VideoQuality } from '../types';
import { INITIAL_MOVIES, INITIAL_PACKAGES, INITIAL_BANNERS, INITIAL_TRANSACTIONS } from '../data/initialData';

interface MovieContextType {
  movies: Movie[];
  packages: SubscriptionPackage[];
  banners: HomepageBanner[];
  transactions: PaymentTransaction[];
  
  // Search & Filter state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedLanguage: Language | 'All';
  setSelectedLanguage: (lang: Language | 'All') => void;
  selectedGenre: Genre | 'All';
  setSelectedGenre: (g: Genre | 'All') => void;
  selectedQuality: VideoQuality | 'All';
  setSelectedQuality: (q: VideoQuality | 'All') => void;
  selectedYear: string | 'All';
  setSelectedYear: (y: string | 'All') => void;
  sortBy: 'rating' | 'latest' | 'popular' | 'title';
  setSortBy: (s: 'rating' | 'latest' | 'popular' | 'title') => void;
  resetFilters: () => void;
  
  // Active Modals & Player
  playingMovie: Movie | null;
  openPlayer: (movie: Movie) => void;
  closePlayer: () => void;
  
  detailsMovie: Movie | null;
  openDetails: (movie: Movie) => void;
  closeDetails: () => void;
  
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'signup' | 'forgot';
  setAuthModalTab: (tab: 'login' | 'signup' | 'forgot') => void;

  paymentModalOpen: boolean;
  setPaymentModalOpen: (open: boolean) => void;
  selectedPackageForPayment: SubscriptionPackage | null;
  openPaymentModal: (pkg: SubscriptionPackage) => void;

  // Admin Actions
  addMovie: (movieData: Omit<Movie, 'id'>) => Movie;
  updateMovie: (id: string, updates: Partial<Movie>) => void;
  deleteMovie: (id: string) => void;
  updatePackage: (id: string, updates: Partial<SubscriptionPackage>) => void;
  addTransaction: (tx: PaymentTransaction) => void;
  toggleBannerStatus: (bannerId: string) => void;
}

const STORAGE_MOVIES_KEY = 'cinepak_movies_v1';
const STORAGE_PACKAGES_KEY = 'cinepak_packages_v1';
const STORAGE_TRANSACTIONS_KEY = 'cinepak_transactions_v1';
const STORAGE_BANNERS_KEY = 'cinepak_banners_v1';

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [movies, setMovies] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MOVIES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_MOVIES;
  });

  const [packages, setPackages] = useState<SubscriptionPackage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PACKAGES_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_PACKAGES;
  });

  const [banners, setBanners] = useState<HomepageBanner[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BANNERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_BANNERS;
  });

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TRANSACTIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_TRANSACTIONS;
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MOVIES_KEY, JSON.stringify(movies));
    } catch {}
  }, [movies]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PACKAGES_KEY, JSON.stringify(packages));
    } catch {}
  }, [packages]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TRANSACTIONS_KEY, JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BANNERS_KEY, JSON.stringify(banners));
    } catch {}
  }, [banners]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | 'All'>('All');
  const [selectedGenre, setSelectedGenre] = useState<Genre | 'All'>('All');
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality | 'All'>('All');
  const [selectedYear, setSelectedYear] = useState<string | 'All'>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'latest' | 'popular' | 'title'>('popular');

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLanguage('All');
    setSelectedGenre('All');
    setSelectedQuality('All');
    setSelectedYear('All');
    setSortBy('popular');
  };

  // Player & Details Modal states
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [detailsMovie, setDetailsMovie] = useState<Movie | null>(null);

  const openPlayer = (movie: Movie) => {
    setPlayingMovie(movie);
  };

  const closePlayer = () => {
    setPlayingMovie(null);
  };

  const openDetails = (movie: Movie) => {
    setDetailsMovie(movie);
  };

  const closeDetails = () => {
    setDetailsMovie(null);
  };

  // Auth Modal State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup' | 'forgot'>('login');

  // Payment Modal State
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedPackageForPayment, setSelectedPackageForPayment] = useState<SubscriptionPackage | null>(null);

  const openPaymentModal = (pkg: SubscriptionPackage) => {
    setSelectedPackageForPayment(pkg);
    setPaymentModalOpen(true);
  };

  // Admin Actions
  const addMovie = (movieData: Omit<Movie, 'id'>): Movie => {
    const newMovie: Movie = {
      ...movieData,
      id: `movie-${Date.now()}`
    };
    setMovies((prev) => [newMovie, ...prev]);
    return newMovie;
  };

  const updateMovie = (id: string, updates: Partial<Movie>) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    if (detailsMovie?.id === id) {
      setDetailsMovie((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const deleteMovie = (id: string) => {
    setMovies((prev) => prev.filter((m) => m.id !== id));
    if (detailsMovie?.id === id) setDetailsMovie(null);
    if (playingMovie?.id === id) setPlayingMovie(null);
  };

  const updatePackage = (id: string, updates: Partial<SubscriptionPackage>) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const addTransaction = (tx: PaymentTransaction) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  const toggleBannerStatus = (bannerId: string) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === bannerId ? { ...b, isActive: !b.isActive } : b))
    );
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        packages,
        banners,
        transactions,
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
        resetFilters,
        playingMovie,
        openPlayer,
        closePlayer,
        detailsMovie,
        openDetails,
        closeDetails,
        authModalOpen,
        setAuthModalOpen,
        authModalTab,
        setAuthModalTab,
        paymentModalOpen,
        setPaymentModalOpen,
        selectedPackageForPayment,
        openPaymentModal,
        addMovie,
        updateMovie,
        deleteMovie,
        updatePackage,
        addTransaction,
        toggleBannerStatus
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MovieContext);
  if (!context) throw new Error('useMovies must be used within a MovieProvider');
  return context;
};
