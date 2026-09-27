import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GhostLogo } from '../common/GhostLogo';
import { clubService } from '../../services/clubService';
import {
  LayoutDashboard,
  Users,
  Shield,
  Calendar,
  Newspaper,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sliders,
  Database,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Film,
  Share2,
  ShieldCheck
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'players'
  | 'lineup'
  | 'matches'
  | 'news'
  | 'settings'
  | 'videos'
  | 'socials'
  | 'captain'
  | 'admin-settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  children
}) => {
  const { user, logout, isDemoAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const isLive = clubService.isLiveSupabase();

  const navItems: Array<{ id: AdminTab; label: string; icon: React.ElementType }> = [
    { id: 'overview', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'players', label: 'PLAYERS', icon: Users },
    { id: 'lineup', label: 'LINEUP & PITCH', icon: Sliders },
    { id: 'matches', label: 'MATCHES', icon: Calendar },
    { id: 'news', label: 'NEWS & PRESS', icon: Newspaper },
    { id: 'settings', label: 'TEAM SETTINGS', icon: Settings },
    { id: 'videos', label: 'VIDEOS', icon: Film },
    { id: 'socials', label: 'SOCIAL LINKS', icon: Share2 },
    { id: 'captain', label: 'CAPTAINCY', icon: Shield },
    { id: 'admin-settings', label: 'ADMIN SETTINGS', icon: ShieldCheck },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#070707] text-[#F3F3F3] flex flex-col md:flex-row">
      {/* ========================================================================= */}
      {/* DESKTOP SIDEBAR                                                           */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex w-64 lg:w-72 bg-[#0B0B0B] border-r border-[#1C1C1C] flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
        <div>
          {/* Top Brand Header */}
          <div className="p-5 border-b border-[#1A1A1A] flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <GhostLogo size="sm" showText={true} />
            </Link>
          </div>

          {/* Mode & Admin Badge */}
          <div className="p-3.5 mx-3 my-3 bg-[#111111] border border-[#222222] rounded space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#888888]">OPERATIONS MODE</span>
              <span className={`flex items-center gap-1 font-bold ${isLive ? 'text-emerald-400' : 'text-[#E50914]'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-400' : 'bg-[#E50914]'} animate-pulse`} />
                {isLive ? 'SUPABASE LIVE' : 'LOCAL CACHE'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-[#AAAAAA] truncate">
              {user?.email || (isDemoAdmin ? 'khaledarahman93@gmail.com' : 'admin@ghostfc.com')}
            </div>
          </div>

          {/* Navigation Tab Links */}
          <nav className="px-3 space-y-1 pb-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 font-heading text-xs font-black tracking-wider uppercase transition-colors text-left ${
                    isActive
                      ? 'bg-[#E50914] text-white shadow-[0_0_12px_rgba(229,9,20,0.3)]'
                      : 'text-[#9A9A9A] hover:text-white hover:bg-[#141414]'
                  }`}
                  style={isActive ? { clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' } : {}}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#777777]'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#1A1A1A] space-y-2 shrink-0 bg-[#0B0B0B]">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-heading font-bold text-[#AAAAAA] hover:text-white hover:bg-[#141414] border border-[#222222] transition-colors"
          >
            <span>VIEW PUBLIC PORTAL</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-heading font-bold text-red-400 hover:text-white hover:bg-red-950/40 border border-red-900/40 transition-colors uppercase"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>TERMINATE SESSION</span>
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MOBILE HEADER & NAVIGATION BAR                                            */}
      {/* ========================================================================= */}
      <header className="md:hidden bg-[#0A0B0E] border-b border-[#202432] p-3.5 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <Link to="/" className="flex items-center gap-2">
          <GhostLogo size="xs" showText={true} />
        </Link>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
            isLive ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40' : 'bg-red-950/60 text-red-400 border border-red-800/40'
          }`}>
            {isLive ? 'LIVE' : 'OFFLINE'}
          </span>

          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2.5 bg-[#12141C] border border-[#262B3A] text-white hover:border-[#E50914] transition-colors"
            aria-label="Toggle Admin Navigation"
          >
            {mobileNavOpen ? <X className="w-5 h-5 text-[#E50914]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileNavOpen && (
        <div className="md:hidden bg-[#0A0B0E]/98 backdrop-blur-xl border-b border-[#202432] p-4 space-y-2 z-30 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="text-[11px] font-mono text-[#8E93A3] pb-2 border-b border-[#181B24] flex items-center justify-between">
            <span>OPERATOR: {user?.email || 'admin@ghostfc.com'}</span>
            <span className="text-[#E50914] font-bold">STAFF</span>
          </div>

          <div className="grid grid-cols-1 gap-1 py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileNavOpen(false);
                  }}
                  className={`w-full min-h-[44px] flex items-center justify-between px-3.5 py-2.5 font-heading text-xs font-black tracking-wider uppercase text-left transition-colors ${
                    isActive
                      ? 'bg-[#E50914] text-white border-l-4 border-white'
                      : 'text-[#8E93A3] hover:text-white hover:bg-[#12141C]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#585D6E]'}`} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#3A3F50]" />
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#181B24] flex gap-2">
            <Link
              to="/"
              className="flex-1 py-2.5 text-center text-xs font-heading font-black tracking-wider uppercase bg-[#141620] hover:bg-[#1E222E] text-white border border-[#262B3A]"
            >
              Public Site →
            </Link>
            <button
              onClick={handleLogout}
              className="flex-1 py-2.5 text-center text-xs font-heading font-black tracking-wider uppercase bg-red-950/60 hover:bg-red-950/80 text-red-300 border border-red-900/40"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT WORKSPACE                                                    */}
      {/* ========================================================================= */}
      <main className="flex-1 min-w-0 p-3.5 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};
