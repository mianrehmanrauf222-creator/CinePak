import React from 'react';
import { Film, Globe, Sparkles, ShieldCheck, Award, HeartHandshake } from 'lucide-react';
import { Logo } from '../components/common/Logo';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-16">
      
      {/* Hero Brand Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-2">
          <Logo size="xl" showSlogan={true} />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Cinzel',serif] uppercase tracking-wide">
          Your World of Movies
        </h1>
        <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          CinePak is Pakistan's premier cinematic streaming platform, built to bring the magic of Lollywood, Punjabi folklore, Bollywood blockbusters, and Hollywood classics directly to your screens.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121318] border border-neutral-800 rounded-2xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl gold-gradient-bg flex items-center justify-center text-black">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Cinzel',serif]">
            Revitalizing South Asian Cinema
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            From the timeless legends of Sultan Rahi to modern masterworks like The Legend of Maula Jatt, we champion Pakistani & Punjabi cinema with cinema-grade 4K transfers.
          </p>
        </div>

        <div className="bg-[#121318] border border-neutral-800 rounded-2xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center text-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Cinzel',serif]">
            Accessible PKR Pricing
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            World-class streaming should not require international credit cards. With JazzCash, Easypaisa, and Raast integration, CinePak starts at just PKR 199/month.
          </p>
        </div>

        <div className="bg-[#121318] border border-neutral-800 rounded-2xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-300 flex items-center justify-center text-black">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white font-['Cinzel',serif]">
            Global Streaming Infrastructure
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Built on ultra-low latency CDN edge servers, CinePak guarantees zero buffering, high dynamic range (HDR10), and spatial Dolby Atmos across all devices.
          </p>
        </div>
      </div>

      {/* Brand Values Statement */}
      <div className="bg-gradient-to-r from-[#181920] via-[#101116] to-[#0c0d12] border border-amber-500/30 rounded-2xl p-8 sm:p-12 text-center space-y-4">
        <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-2xl sm:text-3xl font-black text-white font-['Cinzel',serif] uppercase">
          Empowering Filmmakers & Storytellers
        </h2>
        <p className="text-sm text-neutral-300 max-w-2xl mx-auto leading-relaxed">
          We believe in direct royalties for directors, screenwriters, and actors who bring our heritage and folklore alive. By subscribing to CinePak, you directly fund future independent cinema productions across Pakistan.
        </p>
      </div>
    </div>
  );
};
