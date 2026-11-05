import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Smartphone, 
  Sparkles, 
  ArrowRight,
  Info,
  Lock,
  Receipt
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMovies } from '../../context/MovieContext';
import { PaymentTransaction } from '../../types';

export const PaymentModal: React.FC = () => {
  const { user, upgradeSubscription } = useAuth();
  const { 
    paymentModalOpen, 
    setPaymentModalOpen, 
    selectedPackageForPayment, 
    addTransaction 
  } = useMovies();

  const [paymentMethod, setPaymentMethod] = useState<'JazzCash' | 'Easypaisa' | 'Credit/Debit Card' | 'Bank Transfer'>('JazzCash');
  const [accountNumber, setAccountNumber] = useState('03001234567');
  const [pinOrOtp, setPinOrOtp] = useState('1234');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successResult, setSuccessResult] = useState<{ transactionRef: string; packageName: string; amountPKR: number } | null>(null);

  if (!paymentModalOpen || !selectedPackageForPayment) return null;

  const pkg = selectedPackageForPayment;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate sandbox verification delay
    await new Promise((r) => setTimeout(r, 1400));

    const result = upgradeSubscription(
      pkg.id,
      paymentMethod,
      paymentMethod === 'Credit/Debit Card' ? cardNumber : accountNumber
    );

    // Record in global transaction history for admin visibility
    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      transactionRef: result.transactionRef,
      userId: user?.uid || 'guest-001',
      userEmail: user?.email || 'customer@cinepak.tv',
      packageId: pkg.id,
      packageName: pkg.name,
      amountPKR: pkg.pricePKR,
      paymentMethod,
      accountOrCardNumber: paymentMethod === 'Credit/Debit Card' ? '•••• 4242' : accountNumber,
      status: 'completed',
      createdAt: new Date().toISOString()
    };
    addTransaction(newTx);

    setIsProcessing(false);
    setSuccessResult({
      transactionRef: result.transactionRef,
      packageName: pkg.name,
      amountPKR: pkg.pricePKR
    });

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  const handleClose = () => {
    setPaymentModalOpen(false);
    setSuccessResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-xl bg-[#121318] border border-amber-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_20px_70px_rgba(245,158,11,0.2)] my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-full bg-neutral-900 border border-neutral-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {successResult ? (
          /* Payment Success Confirmation View */
          <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                Sandbox Payment Verified
              </span>
              <h2 className="text-2xl font-black text-white font-['Cinzel',serif] mt-2">
                Subscription Activated!
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 mt-1">
                You now have unlimited access to {successResult.packageName} on CinePak.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#181920] border border-neutral-800 rounded-xl p-4 text-xs text-left space-y-2.5 max-w-sm mx-auto">
              <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                <span className="text-neutral-400">Transaction Ref:</span>
                <span className="font-mono font-bold text-amber-400">{successResult.transactionRef}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Package:</span>
                <span className="font-bold text-white">{successResult.packageName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Amount Paid:</span>
                <span className="font-bold text-emerald-400">PKR {successResult.amountPKR}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Payment Gateway:</span>
                <span className="font-medium text-neutral-200">{paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-neutral-800 text-[11px]">
                <span className="text-neutral-500">Status:</span>
                <span className="text-emerald-400 font-bold uppercase">Active • Instant Access</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleClose}
                className="py-3 px-8 rounded-xl font-bold text-sm text-black gold-gradient-bg shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:brightness-110 transition-all"
              >
                Start Watching Now
              </button>
            </div>
          </div>
        ) : (
          /* Payment Checkout Form */
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-neutral-800">
              <div className="w-10 h-10 rounded-xl gold-gradient-bg flex items-center justify-center text-black shadow">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white font-['Cinzel',serif]">
                    Secure Checkout
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    Test Sandbox Mode
                  </span>
                </div>
                <p className="text-xs text-neutral-400">
                  Select your preferred Pakistani payment gateway to subscribe.
                </p>
              </div>
            </div>

            {/* Selected Package Banner */}
            <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-500/40 rounded-xl p-3.5 mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">Selected Plan</p>
                <h3 className="text-base font-bold text-white">{pkg.name}</h3>
                <p className="text-xs text-neutral-300">{pkg.resolution} • {pkg.screens} Simultaneous Screens</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-amber-400 font-sans">
                  PKR {pkg.pricePKR}
                </span>
                <span className="text-xs text-neutral-400 block">
                  /{pkg.billingCycle}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                Choose Payment Method (Pakistan)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('JazzCash')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'JazzCash'
                      ? 'bg-rose-500/15 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                      : 'bg-[#181920] border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-rose-500 mb-1" />
                  <p className="text-xs font-bold">JazzCash</p>
                  <p className="text-[10px] text-neutral-400">Mobile Wallet</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Easypaisa')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'Easypaisa'
                      ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-[#181920] border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-500 mb-1" />
                  <p className="text-xs font-bold">Easypaisa</p>
                  <p className="text-[10px] text-neutral-400">Account / App</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Credit/Debit Card')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'Credit/Debit Card'
                      ? 'bg-sky-500/15 border-sky-500 text-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.2)]'
                      : 'bg-[#181920] border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-sky-500 mb-1" />
                  <p className="text-xs font-bold">Card</p>
                  <p className="text-[10px] text-neutral-400">Visa / Mastercard</p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Bank Transfer')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    paymentMethod === 'Bank Transfer'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-[#181920] border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 text-amber-500 mb-1" />
                  <p className="text-xs font-bold">Raast / Bank</p>
                  <p className="text-[10px] text-neutral-400">Direct Transfer</p>
                </button>
              </div>
            </div>

            {/* Input Details Form */}
            <form onSubmit={handlePay} className="space-y-3.5">
              {(paymentMethod === 'JazzCash' || paymentMethod === 'Easypaisa') && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      {paymentMethod} Mobile Account Number
                    </label>
                    <input
                      type="text"
                      required
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="0300 1234567"
                      className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Sandbox MPIN / OTP (Enter any 4 digits)
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={pinOrOtp}
                      onChange={(e) => setPinOrOtp(e.target.value)}
                      placeholder="••••"
                      className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-mono tracking-widest"
                    />
                  </div>
                </>
              )}

              {paymentMethod === 'Credit/Debit Card' && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        required
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentMethod === 'Bank Transfer' && (
                <div className="p-3 bg-[#181920] rounded-xl border border-neutral-700 text-xs space-y-2 text-neutral-300">
                  <p><span className="text-neutral-400">Bank:</span> Habib Bank Limited (HBL) / Raast ID</p>
                  <p><span className="text-neutral-400">Account Title:</span> CinePak Entertainment (Pvt) Ltd</p>
                  <p><span className="text-neutral-400">IBAN:</span> PK36 HABB 0001 2345 6789 0101</p>
                  <p className="text-[11px] text-amber-400">Sandbox verification will simulate instant Raast settlement.</p>
                </div>
              )}

              {/* Sandbox notice */}
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  Testing Mode: Simulated secure Pakistani payment pipeline. No real charges are made to your card or account.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-black gold-gradient-bg shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    Pay PKR {pkg.pricePKR} & Activate Plan
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
