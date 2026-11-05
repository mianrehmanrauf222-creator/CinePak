import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Technical Support',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          Support & Inquiries
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Cinzel',serif] uppercase">
          Contact CinePak
        </h1>
        <p className="text-sm text-neutral-300">
          Have questions about your subscription, movie requests, or streaming issues? Our Lahore & Karachi support teams are ready to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact info cards */}
        <div className="space-y-4">
          <div className="bg-[#121318] border border-neutral-800 rounded-2xl p-5 space-y-2">
            <Mail className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Email Support</h3>
            <p className="text-xs text-neutral-400">Direct response within 2 hours</p>
            <p className="text-xs text-amber-300 font-semibold pt-1">support@cinepak.tv</p>
          </div>

          <div className="bg-[#121318] border border-neutral-800 rounded-2xl p-5 space-y-2">
            <Phone className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Helpline & WhatsApp</h3>
            <p className="text-xs text-neutral-400">Available 9 AM – 11 PM PKT</p>
            <p className="text-xs text-amber-300 font-semibold pt-1">+92 (042) 3578-9000</p>
          </div>

          <div className="bg-[#121318] border border-neutral-800 rounded-2xl p-5 space-y-2">
            <MapPin className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Headquarters</h3>
            <p className="text-xs text-neutral-400">
              CinePak Digital Media Network, MM Alam Road, Gulberg III, Lahore, Pakistan
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-[#121318] border border-neutral-800 rounded-2xl p-6 sm:p-8">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Message Received!</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Thank you for contacting CinePak. Our support team has logged your ticket and will email you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-black gold-gradient-bg"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Mian Rehman"
                    className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="Technical Support">Technical & Streaming Support</option>
                  <option value="Billing & JazzCash">Billing / JazzCash / Easypaisa Issues</option>
                  <option value="Movie Request">Suggest a Punjabi or Pakistani Movie</option>
                  <option value="Content Licensing">Content Distribution & Partnerships</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you today?"
                  className="w-full bg-[#181920] border border-neutral-700 text-sm text-white px-3.5 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl font-bold text-sm text-black gold-gradient-bg shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:brightness-110 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
