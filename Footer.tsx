import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GhostLogo } from '../common/GhostLogo';
import {
  Instagram,
  Facebook,
  Youtube,
  Video,
  MapPin,
  Mail,
  Phone,
  Shield,
  ArrowUpRight,
  Send,
  CheckCircle,
  Trophy,
  ExternalLink
} from 'lucide-react';
import { TeamSettings } from '../../types';

interface FooterProps {
  settings?: TeamSettings;
}

export const Footer: React.FC<FooterProps> = ({ settings }) => {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const clubName = settings?.team_name || 'GHOST FC';
  const tagline = settings?.tagline || 'BORN TO DOMINATE.';
  const ground = settings?.home_ground || 'The Crypt Arena';
  const email = settings?.email || 'contact@ghostfc.com';
  const phone = settings?.phone || '+44 20 7946 0912';

  const instagramUrl = settings?.instagram_url || 'https://instagram.com';
  const facebookUrl = settings?.facebook_url || 'https://facebook.com';
  const tiktokUrl = settings?.tiktok_url || 'https://tiktok.com';
  const youtubeUrl = settings?.youtube_url || 'https://youtube.com';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const clubPartners = [
    { name: 'TITAN ATHLETICS', category: 'TECHNICAL KIT PARTNER' },
    { name: 'KINETIC ENERGY', category: 'OFFICIAL HYDRATION' },
    { name: 'AERO PRECISION', category: 'DATA & TELEMETRY' },
    { name: 'VORTEX MOTORS', category: 'GLOBAL MOBILITY' },
  ];

  return (
    <footer className="relative bg-[#050608] border-t border-[#181B24] overflow-hidden">
      {/* Top red laser line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent shadow-[0_0_16px_#E50914]" />

      {/* ========================================================================= */}
      {/* TIER 1: OFFICIAL TECHNICAL PARTNERS STRIP                                 */}
      {/* ========================================================================= */}
      <div className="border-b border-[#14161F] py-6 bg-[#08090C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-[11px] font-mono tracking-widest text-[#585D6E] uppercase">
              OFFICIAL CLUB PRINCIPAL PARTNERS
            </span>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {clubPartners.map((partner) => (
                <div key={partner.name} className="flex flex-col items-center sm:items-start group cursor-default">
                  <span className="font-heading font-black text-sm tracking-wider text-[#8E93A3] group-hover:text-white transition-colors">
                    {partner.name}
                  </span>
                  <span className="text-[9px] font-mono text-[#4A4F60] tracking-widest">
                    {partner.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TIER 2: NEWSLETTER & FAN CLUB BANNER                                      */}
      {/* ========================================================================= */}
      <div className="border-b border-[#14161F] py-10 bg-gradient-to-b from-[#0A0B0F] to-[#07080B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#E50914] font-bold uppercase tracking-widest">
                <Trophy className="w-3.5 h-3.5" />
                JOIN THE GHOST NATION
              </div>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-wide">
                BE FIRST FOR SQUAD RELEASES, TICKETS & EXCLUSIVE DROPS
              </h3>
              <p className="text-xs sm:text-sm text-[#8E93A3] max-w-xl">
                Get verified matchday line-ups 60 minutes before kickoff, priority ticketing windows, and official merchandise alerts.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="p-3.5 bg-[#0F1418] border border-emerald-500/50 text-emerald-400 text-xs font-mono flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>WELCOME TO THE GHOST NATION. CONFIRMATION SENT.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1 bg-[#101217] border border-[#232734] focus:border-[#E50914] px-4 py-2.5 text-xs text-white placeholder:text-[#585D6E] outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#E50914] hover:bg-[#FF1A24] text-white font-heading font-black text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 shrink-0 shadow-[0_0_15px_rgba(229,9,20,0.4)]"
                  >
                    <span>SIGN UP</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TIER 3: MAIN NAVIGATION DIRECTORY                                         */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand & Socials (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block">
              <GhostLogo size="lg" showText={true} />
            </Link>

            <p className="text-xs sm:text-sm text-[#8E93A3] leading-relaxed max-w-sm">
              {settings?.club_description ||
                'Founded on tactical dominance, relentless speed, and fearless ambition. GHOST FC is a modern football organization built to compete at the pinnacle of the beautiful game.'}
            </p>

            <div className="pt-2">
              <span className="text-[10px] font-mono text-[#585D6E] uppercase tracking-wider block mb-2.5">
                OFFICIAL SOCIAL BROADCASTS
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded bg-[#101217] border border-[#1E222D] hover:border-[#E50914] hover:text-[#E50914] text-[#8E93A3] flex items-center justify-center transition-all duration-200"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded bg-[#101217] border border-[#1E222D] hover:border-[#E50914] hover:text-[#E50914] text-[#8E93A3] flex items-center justify-center transition-all duration-200"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="TikTok"
                  className="w-9 h-9 rounded bg-[#101217] border border-[#1E222D] hover:border-[#E50914] hover:text-[#E50914] text-[#8E93A3] flex items-center justify-center transition-all duration-200"
                >
                  <Video className="w-4 h-4" />
                </a>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded bg-[#101217] border border-[#1E222D] hover:border-[#E50914] hover:text-[#E50914] text-[#8E93A3] flex items-center justify-center transition-all duration-200"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-base font-bold tracking-wider text-white uppercase flex items-center gap-2">
              <span className="w-1.5 h-3 bg-[#E50914]" />
              CLUB DIRECTORY
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#8E93A3]">
              <li>
                <Link to="/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[#E50914]">›</span> Home / Match Center
                </Link>
              </li>
              <li>
                <Link to="/squad" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[#E50914]">›</span> First Team Squad (25-Man)
                </Link>
              </li>
              <li>
                <Link to="/matches" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[#E50914]">›</span> Season Fixtures & Scores
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[#E50914]">›</span> Press Releases & Media
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-[#E50914]">›</span> Club Heritage & Crest
                </Link>
              </li>
            </ul>
          </div>

          {/* Stadium / Headquarters (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading text-base font-bold tracking-wider text-white uppercase flex items-center gap-2">
              <span className="w-1.5 h-3 bg-[#E50914]" />
              HEADQUARTERS & ARENA
            </h4>
            <div className="space-y-2.5 text-xs text-[#8E93A3]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
                <div>
                  <div className="text-white font-semibold">{ground}</div>
                  <div className="text-[#585D6E] text-[11px] font-mono">
                    52,000 Capacity · Hybrid Turf Pitch
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#E50914] shrink-0" />
                <span>{email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E50914] shrink-0" />
                <span>{phone}</span>
              </div>
            </div>
          </div>

          {/* Club Operations / Staff (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading text-base font-bold tracking-wider text-white uppercase flex items-center gap-2">
              <span className="w-1.5 h-3 bg-[#E50914]" />
              STAFF PORTAL
            </h4>
            <p className="text-[11px] text-[#585D6E] leading-relaxed">
              Authorized coaches & squad management portal.
            </p>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white bg-[#101217] hover:bg-[#181B23] border border-[#232735] hover:border-[#E50914] px-3 py-2 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-[#E50914]" />
              <span>STAFF ACCESS</span>
              <ArrowUpRight className="w-3 h-3 text-[#585D6E]" />
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TIER 4: COPYRIGHT & OFFICIAL MARKS                                        */}
      {/* ========================================================================= */}
      <div className="border-t border-[#12141A] py-6 bg-[#040507]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#585D6E]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white font-heading tracking-wider">{clubName}</span>
            <span>·</span>
            <span>© {currentYear} All Rights Reserved.</span>
            <span>·</span>
            <span className="text-[#8E93A3] font-mono">{tagline}</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>OFFICIAL CLUB PORTAL</span>
            <span className="text-[#2B2F3D]">·</span>
            <span className="text-[#E50914] font-semibold">PREMIER ELITE</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
