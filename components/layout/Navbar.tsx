import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { GhostLogo } from '../common/GhostLogo';
import { Menu, X, Shield, Users, Calendar, Newspaper, Info, Ticket, ChevronRight, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'HOME', path: '/', icon: Shield },
    { name: 'SQUAD', path: '/squad', icon: Users },
    { name: 'MATCHES', path: '/matches', icon: Calendar },
    { name: 'NEWS', path: '/news', icon: Newspaper },
    { name: 'ABOUT', path: '/about', icon: Info },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Club Notification / Matchday Banner */}
      <div className="bg-[#08090C] border-b border-[#181B24] text-[11px] font-mono text-[#8E93A3] py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-[#E50914] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-ping" />
              MATCHDAY NOTICE
            </span>
            <span className="text-[#3A3F50]" aria-hidden="true">|</span>
            <span className="text-[#C5C9D6] truncate">
              NEXT FIXTURE: GHOST FC vs VALKYRIE UNITED · SAT 20:00 · THE CRYPT ARENA
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link
              to="/matches"
              className="text-[#E50914] hover:text-[#FF2A35] font-semibold tracking-wider flex items-center gap-1 transition-colors"
            >
              <Ticket className="w-3 h-3" />
              MATCH TICKETS
            </Link>
            {isAdmin && (
              <>
                <span className="text-[#2B2F3D]" aria-hidden="true">|</span>
                <Link
                  to="/admin"
                  className="text-[#8E93A3] hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Shield className="w-3 h-3 text-[#E50914]" />
                  STAFF PORTAL
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? 'bg-[#060709]/95 backdrop-blur-xl border-b border-[#1E222D] shadow-[0_10px_30px_rgba(0,0,0,0.85)] py-2.5 sm:py-3'
            : 'bg-gradient-to-b from-[#060709]/90 via-[#060709]/60 to-transparent py-3.5 sm:py-4 border-b border-white/[0.04]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Club Brand Logo */}
            <Link to="/" className="group flex items-center gap-3 py-1">
              <GhostLogo size="md" showText={true} />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative px-3.5 py-2 font-heading text-base lg:text-lg font-bold tracking-wider transition-all duration-200 ${
                      isActive
                        ? 'text-white'
                        : 'text-[#8E93A3] hover:text-white hover:bg-white/[0.03]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{item.name}</span>
                      {isActive && (
                        <div className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#E50914] shadow-[0_0_10px_#E50914]" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Desktop Right Action Buttons */}
            <div className="hidden md:flex items-center gap-3.5">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="text-xs uppercase tracking-wider font-mono text-[#8E93A3] hover:text-white flex items-center gap-1.5 px-3 py-1.5 border border-[#232734] bg-[#0E1015] hover:border-[#E50914]/50 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
                  PORTAL
                </Link>
              )}

              <Link
                to="/squad"
                className="relative inline-flex items-center justify-center font-heading font-black text-sm lg:text-base tracking-wider text-white px-5 py-2.5 overflow-hidden group bg-gradient-to-r from-[#B80710] to-[#E50914] hover:from-[#E50914] hover:to-[#FF1A24] transition-all duration-300 shadow-[0_0_25px_rgba(229,9,20,0.45)] border border-[#FF3333]/30"
                style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  VIEW SQUAD
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            </div>

            {/* Mobile Hamburger / Toggle */}
            <div className="flex md:hidden items-center gap-2.5">
              <Link
                to="/squad"
                className="text-[11px] font-heading font-bold text-white bg-[#E50914] px-2.5 py-1 uppercase tracking-wider"
              >
                SQUAD
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 text-white bg-[#101217] border border-[#222634] hover:border-[#E50914] transition-colors focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {isOpen ? <X className="w-5 h-5 text-[#E50914]" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#0A0B0E]/98 backdrop-blur-2xl border-b border-[#202430] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-2xl">
          {/* Matchday reminder strip on mobile */}
          <div className="p-3 bg-[#12141C] border border-[#232735] flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-[#8E93A3]">NEXT CLASH</span>
            <span className="text-[#E50914] font-bold">vs VALKYRIE UTD</span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 font-heading text-lg font-bold tracking-wider transition-colors ${
                  isActive
                    ? 'text-white bg-[#141720] border-l-4 border-[#E50914]'
                    : 'text-[#8E93A3] hover:text-white hover:bg-[#101217]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#E50914]' : 'text-[#585D6E]'}`} />
                  <span>{item.name}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#3A3F50]" />
              </NavLink>
            );
          })}

          <div className="pt-4 border-t border-[#1C1F2B] flex flex-col gap-2.5">
            <Link
              to="/matches"
              className="w-full text-center py-3 bg-[#E50914] hover:bg-[#FF1A24] font-heading font-black text-white text-base tracking-wider uppercase transition-colors"
              style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
            >
              MATCHDAY TICKETS & FIXTURES
            </Link>

            <Link
              to="/admin"
              className="text-center py-2 text-xs font-mono uppercase tracking-wider text-[#8E93A3] hover:text-[#E50914]"
            >
              Staff Portal Login →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
