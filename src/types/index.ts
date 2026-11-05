export type Language = 'Punjabi' | 'Urdu' | 'Hindi' | 'English';

export type Genre = 
  | 'Action' 
  | 'Comedy' 
  | 'Drama' 
  | 'Romance' 
  | 'Thriller' 
  | 'Sci-Fi' 
  | 'Horror' 
  | 'Crime' 
  | 'Historical'
  | 'Family';

export type VideoQuality = '4K UHD' | '1080p FHD' | '720p HD';

export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  tagline?: string;
  description: string;
  language: Language;
  genre: Genre[];
  releaseYear: number;
  duration: string; // e.g. "2h 15m"
  durationMinutes: number; // e.g. 135
  rating: number; // e.g. 8.4
  quality: VideoQuality;
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string; // authorized stream url
  trailerUrl: string;
  cast: string[];
  director: string;
  isPremium: boolean;
  isFeatured?: boolean;
  isTrending?: boolean;
  isLatest?: boolean;
  viewsCount?: number;
  createdAt?: string;
}

export type SubscriptionTier = 'Free' | 'Basic Monthly' | 'Standard Monthly' | 'Premium Monthly' | 'Premium Yearly';

export interface SubscriptionPackage {
  id: string;
  name: SubscriptionTier;
  pricePKR: number;
  billingCycle: 'monthly' | 'yearly';
  resolution: string;
  videoQuality: string;
  screens: number;
  downloadSupported: boolean;
  audioQuality: string;
  features: string[];
  isPopular?: boolean;
  badge?: string;
}

export interface UserSubscription {
  packageId: string;
  packageName: SubscriptionTier;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: string;
  endDate: string;
  pricePKR: number;
  paymentMethod: 'JazzCash' | 'Easypaisa' | 'Credit/Debit Card' | 'Bank Transfer';
  autoRenew: boolean;
}

export interface WatchHistoryItem {
  movieId: string;
  movieTitle: string;
  posterUrl: string;
  backdropUrl: string;
  progressSeconds: number;
  totalSeconds: number;
  lastWatchedAt: string;
  completed: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  subscription?: UserSubscription;
  watchlist: string[]; // movie IDs
  watchHistory: WatchHistoryItem[];
  createdAt: string;
  phoneNumber?: string;
}

export interface PaymentTransaction {
  id: string;
  transactionRef: string;
  userId: string;
  userEmail: string;
  packageId: string;
  packageName: string;
  amountPKR: number;
  paymentMethod: 'JazzCash' | 'Easypaisa' | 'Credit/Debit Card' | 'Bank Transfer';
  accountOrCardNumber?: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  createdAt: string;
}

export interface HomepageBanner {
  id: string;
  movieId: string;
  customHeading?: string;
  customSubtitle?: string;
  badge?: string;
  order: number;
  isActive: boolean;
}
