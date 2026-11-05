import React from 'react';
import { 
  Crown, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Smartphone, 
  Tv, 
  Laptop, 
  Zap, 
  HelpCircle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMovies } from '../context/MovieContext';
import { SubscriptionPackage } from '../types';

export const SubscriptionPage: React.FC = () => {
  const { user, hasActiveSubscription } = useAuth();
  const { packages, openPaymentModal } = useMovies();

  const currentPackageId = user?.subscription?.status === 'active' ? user.subscription.packageId : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      {/* Title & Slogan */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
          <Crown className="w-3.5 h-3.5" />
          Affordable Entertainment in Pakistan
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Cinzel',serif] uppercase tracking-wide">
          CinePak Subscription Plans
        </h1>

        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          Choose the plan that fits your viewing habits. Upgrade or cancel anytime. All prices are in <span className="text-amber-400 font-bold">Pakistani Rupees (PKR)</span> with zero hidden taxes.
        </p>

        {/* Local Payment Badges */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-neutral-400">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> JazzCash
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Easypaisa
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Visa / Mastercard
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Raast IBAN
          </span>
        </div>
      </div>

      {/* Package Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {packages.map((pkg) => {
          const isCurrentPlan = currentPackageId === pkg.id;
          const isPopular = pkg.isPopular;

          return (
            <div
              key={pkg.id}
              className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                isPopular
                  ? 'bg-gradient-to-b from-[#181920] to-[#0e0f14] border-2 border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.25)] lg:-translate-y-2'
                  : 'bg-[#121318] border border-neutral-800 hover:border-neutral-700'
              } p-6 sm:p-7`}
            >
              {/* Badge */}
              {pkg.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-400 text-black shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {pkg.badge}
                  </span>
                </div>
              )}

              <div>
                {/* Plan Name */}
                <h3 className="text-xl font-bold text-white font-['Cinzel',serif] mb-2">
                  {pkg.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-xs text-neutral-400 uppercase font-semibold">PKR </span>
                  <span className="text-4xl font-black text-amber-400 font-sans tracking-tight">
                    {pkg.pricePKR}
                  </span>
                  <span className="text-xs text-neutral-400">/{pkg.billingCycle}</span>
                </div>

                {/* Quick specs pill */}
                <div className="space-y-1.5 text-xs text-neutral-300 pb-5 mb-5 border-b border-neutral-800">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Resolution:</span>
                    <span className="font-semibold text-white">{pkg.resolution}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Screens:</span>
                    <span className="font-semibold text-white">{pkg.screens} simultaneous</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-400">Audio:</span>
                    <span className="font-semibold text-white">{pkg.audioQuality}</span>
                  </div>
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 text-xs text-neutral-300">
                  {pkg.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                {isCurrentPlan ? (
                  <button
                    disabled
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    Current Active Plan
                  </button>
                ) : (
                  <button
                    onClick={() => openPaymentModal(pkg)}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow ${
                      isPopular
                        ? 'text-black gold-gradient-bg hover:brightness-110 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                        : 'text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700'
                    }`}
                  >
                    Subscribe with JazzCash / Card
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="bg-[#121318] border border-neutral-800 rounded-2xl p-6 sm:p-8 mb-16 overflow-x-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white font-['Cinzel',serif] uppercase mb-6 text-center">
          Compare All Features
        </h2>

        <table className="w-full text-left text-xs text-neutral-300 min-w-[600px]">
          <thead>
            <tr className="border-b border-neutral-800 text-neutral-400 uppercase tracking-wider">
              <th className="py-3 px-4">Plan Benefits</th>
              <th className="py-3 px-4">Basic (PKR 199)</th>
              <th className="py-3 px-4">Standard (PKR 299)</th>
              <th className="py-3 px-4 text-amber-400 font-bold">Premium (PKR 399)</th>
              <th className="py-3 px-4 text-yellow-300 font-bold">Yearly (PKR 2999)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-850">
            <tr>
              <td className="py-3 px-4 font-semibold text-white">Monthly Cost</td>
              <td className="py-3 px-4">PKR 199</td>
              <td className="py-3 px-4">PKR 299</td>
              <td className="py-3 px-4 font-bold text-amber-400">PKR 399</td>
              <td className="py-3 px-4 font-bold text-yellow-300">PKR 249/mo eq.</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-white">Video Quality</td>
              <td className="py-3 px-4">720p HD</td>
              <td className="py-3 px-4">1080p FHD</td>
              <td className="py-3 px-4 font-bold text-amber-400">4K Ultra HD + HDR</td>
              <td className="py-3 px-4 font-bold text-yellow-300">4K Ultra HD + HDR</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-white">Simultaneous Screens</td>
              <td className="py-3 px-4">1 Device</td>
              <td className="py-3 px-4">2 Devices</td>
              <td className="py-3 px-4 font-bold text-amber-400">4 Devices</td>
              <td className="py-3 px-4 font-bold text-yellow-300">4 Devices</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-white">Audio Quality</td>
              <td className="py-3 px-4">Stereo</td>
              <td className="py-3 px-4">5.1 Surround</td>
              <td className="py-3 px-4 font-bold text-amber-400">Dolby Atmos</td>
              <td className="py-3 px-4 font-bold text-yellow-300">Dolby Atmos</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-white">Supported Devices</td>
              <td className="py-3 px-4">Phone, Tablet</td>
              <td className="py-3 px-4">TV, PC, Phone, Tablet</td>
              <td className="py-3 px-4 font-bold text-amber-400">All Devices</td>
              <td className="py-3 px-4 font-bold text-yellow-300">All Devices</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-white">Offline Downloads</td>
              <td className="py-3 px-4 text-neutral-500">—</td>
              <td className="py-3 px-4 text-emerald-400">Included (2 devices)</td>
              <td className="py-3 px-4 font-bold text-emerald-400">Included (4 devices)</td>
              <td className="py-3 px-4 font-bold text-emerald-400">Included (4 devices)</td>
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-white">VIP Premieres</td>
              <td className="py-3 px-4 text-neutral-500">—</td>
              <td className="py-3 px-4 text-neutral-500">—</td>
              <td className="py-3 px-4 text-amber-400 font-bold">Priority Access</td>
              <td className="py-3 px-4 text-yellow-300 font-bold">Exclusive Invitations</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Frequently Asked Questions */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h3 className="text-xl font-bold text-white font-['Cinzel',serif] uppercase text-center mb-6">
          Frequently Asked Questions
        </h3>

        {[
          {
            q: 'How does payment with JazzCash or Easypaisa work?',
            a: 'Simply select your package and choose JazzCash or Easypaisa. In our sandbox test mode, you can verify your simulated payment in seconds without real deductions.'
          },
          {
            q: 'Can I cancel my subscription anytime?',
            a: 'Yes, CinePak subscriptions can be paused or cancelled at any time from your User Profile page with no penalty or cancellation fees.'
          },
          {
            q: 'Can I watch on my Smart TV and Android phone?',
            a: 'Yes! CinePak runs smoothly on modern Smart TVs (via browser or cast), Android phones, iPads, tablets, Windows PCs, and Macs in 1080p and 4K UHD.'
          },
          {
            q: 'Are Pakistani movies available with English subtitles?',
            a: 'Yes, our Pakistani Urdu and Punjabi movies feature verified English subtitles so international and diaspora viewers can enjoy the stories.'
          }
        ].map((faq, idx) => (
          <div key={idx} className="bg-[#121318] border border-neutral-800 rounded-xl p-4 space-y-1.5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
              {faq.q}
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed pl-6">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
