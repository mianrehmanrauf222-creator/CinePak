import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useMovies } from '../../context/MovieContext';

export const AuthModal: React.FC = () => {
  const { 
    login, 
    signup, 
    loginWithGoogle, 
    loginAsDemoUser, 
    loginAsDemoAdmin, 
    isLoading 
  } = useAuth();
  
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authModalTab, 
    setAuthModalTab 
  } = useMovies();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (authModalTab === 'login') {
      if (!email || !password) {
        setError('Please enter both email and password.');
        return;
      }
      const res = await login(email, password);
      if (res.success) {
        setAuthModalOpen(false);
      } else {
        setError(res.error || 'Invalid credentials.');
      }
    } else if (authModalTab === 'signup') {
      if (!name || !email || !password) {
        setError('Please fill in all required fields.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      const res = await signup(name, email, password, phone);
      if (res.success) {
        setAuthModalOpen(false);
      } else {
        setError(res.error || 'Could not complete registration.');
      }
    } else if (authModalTab === 'forgot') {
      if (!email) {
        setError('Please enter your registered email address.');
        return;
      }
      setForgotSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-md bg-[#121318] border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900 border border-neutral-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="flex justify-center">
            <Logo size="md" showSlogan={false} />
          </div>
          <h2 className="text-xl font-bold text-white font-['Cinzel',serif] tracking-wide">
            {authModalTab === 'login' && 'Sign In to CinePak'}
            {authModalTab === 'signup' && 'Create Your CinePak Account'}
            {authModalTab === 'forgot' && 'Reset Your Password'}
          </h2>
          <p className="text-xs text-neutral-400">
            {authModalTab === 'login' && 'Enter your credentials to stream your favorite movies.'}
            {authModalTab === 'signup' && 'Join millions of movie lovers across Pakistan & worldwide.'}
            {authModalTab === 'forgot' && 'We will send a secure password reset link to your email.'}
          </p>
        </div>

        {/* Demo Fast Login Shortcuts */}
        {authModalTab !== 'forgot' && (
          <div className="mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Quick 1-Click Demo Logins
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  loginAsDemoAdmin();
                  setAuthModalOpen(false);
                }}
                className="py-1.5 px-2.5 rounded-lg text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Account
              </button>
              <button
                type="button"
                onClick={() => {
                  loginAsDemoUser();
                  setAuthModalOpen(false);
                }}
                className="py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-neutral-800 text-neutral-200 hover:bg-neutral-700 transition-all"
              >
                Standard Viewer
              </button>
            </div>
          </div>
        )}

        {/* Tab switcher */}
        {authModalTab !== 'forgot' && (
          <div className="flex border-b border-neutral-800 mb-5">
            <button
              onClick={() => {
                setAuthModalTab('login');
                setError(null);
              }}
              className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                authModalTab === 'login'
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthModalTab('signup');
                setError(null);
              }}
              className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                authModalTab === 'signup'
                  ? 'text-amber-400 border-b-2 border-amber-400'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Forgot Password Success */}
        {forgotSuccess ? (
          <div className="py-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-white">Reset Link Sent!</h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
                We sent instructions to <span className="text-amber-400 font-semibold">{email}</span>. Please check your inbox.
              </p>
            </div>
            <button
              onClick={() => {
                setForgotSuccess(false);
                setAuthModalTab('login');
              }}
              className="py-2.5 px-5 rounded-xl text-xs font-bold text-black gold-gradient-bg"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authModalTab === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mian Rehman"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#181920] border border-neutral-700 text-sm text-white placeholder-neutral-500 pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#181920] border border-neutral-700 text-sm text-white placeholder-neutral-500 pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>

            {authModalTab === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Mobile Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    placeholder="0300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#181920] border border-neutral-700 text-sm text-white placeholder-neutral-500 pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>
            )}

            {authModalTab !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Password
                  </label>
                  {authModalTab === 'login' && (
                    <button
                      type="button"
                      onClick={() => setAuthModalTab('forgot')}
                      className="text-[11px] text-amber-400 hover:underline"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#181920] border border-neutral-700 text-sm text-white placeholder-neutral-500 pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm text-black gold-gradient-bg shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {authModalTab === 'login' && 'Sign In'}
                  {authModalTab === 'signup' && 'Create Account'}
                  {authModalTab === 'forgot' && 'Send Reset Link'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {authModalTab !== 'forgot' && (
              <>
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-neutral-800" />
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                    <span className="bg-[#121318] px-2 text-neutral-500">Or continue with</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    await loginWithGoogle();
                    setAuthModalOpen(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 flex items-center justify-center gap-2.5 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  Google Account
                </button>
              </>
            )}

            {authModalTab === 'forgot' && (
              <button
                type="button"
                onClick={() => setAuthModalTab('login')}
                className="w-full text-center text-xs text-neutral-400 hover:text-white pt-2"
              >
                Back to Sign In
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
