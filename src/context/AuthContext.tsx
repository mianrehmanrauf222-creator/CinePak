import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserSubscription, WatchHistoryItem } from '../types';
import { INITIAL_PACKAGES } from '../data/initialData';

interface AuthContextType {
  user: UserProfile | null;
  isAdmin: boolean;
  hasActiveSubscription: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, pass: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginAsDemoUser: () => void;
  loginAsDemoAdmin: () => void;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  toggleWatchlist: (movieId: string) => void;
  isInWatchlist: (movieId: string) => boolean;
  saveWatchProgress: (movieId: string, progressSeconds: number, totalSeconds: number, title?: string, posterUrl?: string, backdropUrl?: string) => void;
  clearWatchHistory: () => void;
  upgradeSubscription: (packageId: string, paymentMethod: UserSubscription['paymentMethod'], accountOrCardNumber?: string) => { success: boolean; transactionRef: string };
  cancelSubscription: () => void;
}

const STORAGE_KEY = 'cinepak_user_profile_v1';

// Seed demo admin profile
const DEMO_ADMIN: UserProfile = {
  uid: 'admin-001',
  email: 'mianrehmanrauf222@gmail.com',
  displayName: 'Mian Rehman (Admin)',
  role: 'admin',
  createdAt: '2025-01-01T00:00:00Z',
  watchlist: ['movie-1', 'movie-4', 'movie-5', 'movie-3'],
  watchHistory: [
    {
      movieId: 'movie-1',
      movieTitle: 'The Legend of Maula Jatt',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1920&auto=format&fit=crop',
      progressSeconds: 3820,
      totalSeconds: 9180,
      lastWatchedAt: new Date().toISOString(),
      completed: false
    },
    {
      movieId: 'movie-5',
      movieTitle: 'Dune: Part Two',
      posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1920&auto=format&fit=crop',
      progressSeconds: 9960,
      totalSeconds: 9960,
      lastWatchedAt: new Date(Date.now() - 86400000).toISOString(),
      completed: true
    }
  ],
  subscription: {
    packageId: 'pkg-premium-yearly',
    packageName: 'Premium Yearly',
    status: 'active',
    startDate: '2026-01-01T00:00:00Z',
    endDate: '2027-01-01T00:00:00Z',
    pricePKR: 2999,
    paymentMethod: 'JazzCash',
    autoRenew: true
  }
};

// Seed demo regular user profile
const DEMO_USER: UserProfile = {
  uid: 'user-001',
  email: 'viewer.cinepak@gmail.com',
  displayName: 'Hamza Malik',
  role: 'user',
  createdAt: '2025-06-15T00:00:00Z',
  watchlist: ['movie-2', 'movie-6', 'movie-8'],
  watchHistory: [
    {
      movieId: 'movie-2',
      movieTitle: 'Carry On Jatta 3',
      posterUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=800&auto=format&fit=crop',
      backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1920&auto=format&fit=crop',
      progressSeconds: 2400,
      totalSeconds: 8280,
      lastWatchedAt: new Date().toISOString(),
      completed: false
    }
  ],
  subscription: {
    packageId: 'pkg-standard',
    packageName: 'Standard Monthly',
    status: 'active',
    startDate: '2026-10-15T00:00:00Z',
    endDate: '2026-11-15T00:00:00Z',
    pricePKR: 299,
    paymentMethod: 'Easypaisa',
    autoRenew: true
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    // Default to DEMO_ADMIN so the user can immediately experience the entire platform seamlessly
    return DEMO_ADMIN;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // storage error
    }
  }, [user]);

  const isAdmin = user?.role === 'admin';
  const hasActiveSubscription = !!(user?.subscription && user.subscription.status === 'active');

  const login = async (email: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);

    // If it's the admin email or contains admin
    const isTargetAdmin = email.toLowerCase().includes('admin') || email.toLowerCase() === 'mianrehmanrauf222@gmail.com';
    const loggedUser: UserProfile = {
      uid: 'user-' + Date.now(),
      email,
      displayName: isTargetAdmin ? 'Admin CinePak' : email.split('@')[0],
      role: isTargetAdmin ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      watchlist: ['movie-1', 'movie-5'],
      watchHistory: [],
      subscription: {
        packageId: 'pkg-standard',
        packageName: 'Standard Monthly',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
        pricePKR: 299,
        paymentMethod: 'JazzCash',
        autoRenew: true
      }
    };
    setUser(loggedUser);
    return { success: true };
  };

  const signup = async (name: string, email: string, _pass: string, phone?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsLoading(false);

    const newUser: UserProfile = {
      uid: 'user-' + Date.now(),
      email,
      displayName: name,
      phoneNumber: phone,
      role: email.toLowerCase() === 'mianrehmanrauf222@gmail.com' ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      watchlist: [],
      watchHistory: []
    };
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const loginAsDemoUser = () => {
    setUser(DEMO_USER);
  };

  const loginAsDemoAdmin = () => {
    setUser(DEMO_ADMIN);
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    setUser(DEMO_ADMIN);
    return { success: true };
  };

  const toggleWatchlist = (movieId: string) => {
    if (!user) return;
    const exists = user.watchlist.includes(movieId);
    const updatedWatchlist = exists
      ? user.watchlist.filter((id) => id !== movieId)
      : [...user.watchlist, movieId];
    setUser({ ...user, watchlist: updatedWatchlist });
  };

  const isInWatchlist = (movieId: string): boolean => {
    return !!user?.watchlist.includes(movieId);
  };

  const saveWatchProgress = (
    movieId: string,
    progressSeconds: number,
    totalSeconds: number,
    title = 'Movie',
    posterUrl = '',
    backdropUrl = ''
  ) => {
    if (!user) return;
    const existingHistory = user.watchHistory || [];
    const index = existingHistory.findIndex((h) => h.movieId === movieId);
    const completed = totalSeconds > 0 && progressSeconds / totalSeconds > 0.92;

    const newItem: WatchHistoryItem = {
      movieId,
      movieTitle: title,
      posterUrl,
      backdropUrl,
      progressSeconds: Math.floor(progressSeconds),
      totalSeconds: Math.floor(totalSeconds),
      lastWatchedAt: new Date().toISOString(),
      completed
    };

    let updatedHistory: WatchHistoryItem[];
    if (index >= 0) {
      updatedHistory = [...existingHistory];
      updatedHistory[index] = newItem;
    } else {
      updatedHistory = [newItem, ...existingHistory];
    }

    setUser({ ...user, watchHistory: updatedHistory });
  };

  const clearWatchHistory = () => {
    if (!user) return;
    setUser({ ...user, watchHistory: [] });
  };

  const upgradeSubscription = (
    packageId: string,
    paymentMethod: UserSubscription['paymentMethod'],
    _accountOrCardNumber?: string
  ): { success: boolean; transactionRef: string } => {
    const pkg = INITIAL_PACKAGES.find((p) => p.id === packageId) || INITIAL_PACKAGES[1];
    const durationDays = pkg.billingCycle === 'yearly' ? 365 : 30;
    const now = new Date();
    const expiry = new Date(Date.now() + durationDays * 86400000);

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const prefix = paymentMethod === 'JazzCash' ? 'JC' : paymentMethod === 'Easypaisa' ? 'EP' : 'CC';
    const transactionRef = `CPK-${prefix}-${randomSuffix}`;

    const newSub: UserSubscription = {
      packageId: pkg.id,
      packageName: pkg.name,
      status: 'active',
      startDate: now.toISOString(),
      endDate: expiry.toISOString(),
      pricePKR: pkg.pricePKR,
      paymentMethod,
      autoRenew: true
    };

    if (user) {
      setUser({ ...user, subscription: newSub });
    }

    return { success: true, transactionRef };
  };

  const cancelSubscription = () => {
    if (!user || !user.subscription) return;
    setUser({
      ...user,
      subscription: {
        ...user.subscription,
        status: 'cancelled',
        autoRenew: false
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        hasActiveSubscription,
        isLoading,
        login,
        signup,
        logout,
        loginAsDemoUser,
        loginAsDemoAdmin,
        loginWithGoogle,
        toggleWatchlist,
        isInWatchlist,
        saveWatchProgress,
        clearWatchHistory,
        upgradeSubscription,
        cancelSubscription
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
