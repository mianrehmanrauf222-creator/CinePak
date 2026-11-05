import React from 'react';
import { Logo } from './Logo';
import { 
  ShieldCheck, 
  Film, 
  Globe, 
  CreditCard, 
  PhoneCall, 
  Mail, 
  MapPin,
  Sparkles
} from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const handleLink = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#060608] border-t border-neutral-900 text-neutral-400 pt-16 pb-12 mt-20 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-amber-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-neutral-800/60">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="lg" showSlogan={true} />
            <p className="text-sm text-neutral-400 max-w-sm leading-relaxed mt-3">
              CinePak is the premier streaming destination celebrating the finest South Asian & international cinema. Experience Punjabi classics, Lollywood hits, Hindi blockbusters, and Hollywood epics in crisp 4K Ultra HD.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                Worldwide Streaming
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
                <Film className="w-3.5 h-3.5 text-amber-400" />
                4K UHD & Dolby Atmos
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Encrypted & Secure
              </span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 font-['Cinzel',serif]">
              Movie Hubs
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => handleLink('punjabi')} className="hover:text-amber-400 transition-colors">
                  Punjabi Cinema
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('hindi')} className="hover:text-amber-400 transition-colors">
                  Hindi Blockbusters
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('english')} className="hover:text-amber-400 transition-colors">
                  English Cinema
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('trending')} className="hover:text-amber-400 transition-colors">
                  Trending in Pakistan
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('latest')} className="hover:text-amber-400 transition-colors">
                  Latest Releases
                </button>
              </li>
            </ul>
          </div>

          {/* Subscription & Account */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 font-['Cinzel',serif]">
              Subscriptions (PKR)
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => handleLink('packages')} className="text-amber-400 hover:text-amber-300 font-medium transition-colors flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Plans from PKR 199/mo
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('profile')} className="hover:text-amber-400 transition-colors">
                  Manage Subscription
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('watchlist')} className="hover:text-amber-400 transition-colors">
                  My Watchlist
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('about')} className="hover:text-amber-400 transition-colors">
                  About CinePak
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('contact')} className="hover:text-amber-400 transition-colors">
                  Customer Support
                </button>
              </li>
            </ul>
          </div>

          {/* Payment & Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4 font-['Cinzel',serif]">
              Local Payments
            </h4>
            <p className="text-xs text-neutral-400 mb-3 leading-relaxed">
              Seamlessly pay in Pakistani Rupees (PKR) with mobile wallets and debit cards.
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold mb-4">
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-neutral-900/90 border border-neutral-800 text-rose-300">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                JazzCash
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-neutral-900/90 border border-neutral-800 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Easypaisa
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-neutral-900/90 border border-neutral-800 text-sky-300">
                <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                Visa / MC
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-neutral-900/90 border border-neutral-800 text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                PayPak / Raast
              </div>
            </div>

            <div className="text-xs space-y-1.5 text-neutral-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>support@cinepak.tv</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Gulberg III, Lahore, Pakistan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} CinePak Entertainment Network. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => handleLink('about')} className="hover:text-amber-400 transition-colors">Privacy Policy</button>
            <button onClick={() => handleLink('about')} className="hover:text-amber-400 transition-colors">Terms of Service</button>
            <button onClick={() => handleLink('contact')} className="hover:text-amber-400 transition-colors">Help Center</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
