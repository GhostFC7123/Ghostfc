import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { GhostLogo } from '../../components/common/GhostLogo';
import { Shield, Lock, Mail, AlertTriangle, CheckCircle2, Database, Key } from 'lucide-react';
import { AUTHORIZED_ADMIN_EMAILS } from '../../lib/supabase';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isSupabaseLive } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/admin');
      } else {
        setError(res.error || 'Invalid credentials or unauthorized account.');
      }
    } catch (err: any) {
      setError(err.message || 'Login attempt failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmail = (selectedEmail: string) => {
    setEmail(selectedEmail);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 selection:bg-[#E50914] selection:text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#E50914]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#0D0D0D] border border-[#222222] p-6 sm:p-10 shadow-2xl">
        {/* Top laser accent */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E50914] to-transparent shadow-[0_0_12px_#E50914]" />

        <div className="text-center mb-8 space-y-3">
          <div className="flex justify-center">
            <GhostLogo size="lg" showText={false} />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest text-[#E50914] font-bold uppercase block">
              RESTRICTED ACCESS
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-wide">
              ADMINISTRATIVE PORTAL
            </h1>
          </div>
          <p className="text-xs text-[#888888] leading-relaxed">
            Authorized management system for GHOST FC club operations, tactical lineups, matches, and squad rosters.
          </p>

          {/* Database / Auth connection status indicator */}
          <div className="pt-2 flex items-center justify-center">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono border ${
                isSupabaseLive
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-700/50'
              }`}
            >
              <Database className="w-3 h-3" />
              <span>
                {isSupabaseLive
                  ? 'SUPABASE AUTH: LIVE PRODUCTION'
                  : 'SECURITY: LOCAL DEV REGISTRY'}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-950/40 border border-[#E50914]/50 flex items-start gap-2.5 text-xs text-red-200">
            <AlertTriangle className="w-4 h-4 text-[#E50914] shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-[#CCCCCC] uppercase mb-1.5">
              Authorized Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="e.g. admin@ghostfc.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#E50914] text-white text-xs pl-10 pr-4 py-3 outline-none transition-colors placeholder:text-[#555555]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#CCCCCC] uppercase mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#777777] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Enter administrator password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#E50914] text-white text-xs pl-10 pr-4 py-3 outline-none transition-colors placeholder:text-[#555555]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 bg-[#E50914] hover:bg-[#FF1A1A] disabled:opacity-50 text-white font-heading font-black text-sm tracking-wider uppercase transition-all duration-200 shadow-[0_0_20px_rgba(229,9,20,0.4)] flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>VERIFYING CREDENTIALS...</span>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>AUTHENTICATE & ENTER</span>
              </>
            )}
          </button>
        </form>

        {/* Authorized Accounts Reference */}
        <div className="mt-8 pt-6 border-t border-[#1C1C1C] space-y-3">
          <div className="text-[11px] font-mono text-[#888888] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Key className="w-3 h-3 text-[#E50914]" />
              AUTHORIZED ADMIN IDENTIFIERS:
            </span>
            <span className="text-[#E50914] text-[10px]">RLS ENFORCED</span>
          </div>

          <div className="space-y-1.5">
            {AUTHORIZED_ADMIN_EMAILS.map((adminEmail) => (
              <div
                key={adminEmail}
                onClick={() => handleSelectEmail(adminEmail)}
                className="w-full p-2 bg-[#121212] hover:bg-[#1A1A1A] border border-[#242424] hover:border-[#E50914]/50 flex items-center justify-between text-left text-xs text-[#AAAAAA] hover:text-white transition-colors cursor-pointer group"
                title="Click to insert email into login field"
              >
                <div className="flex items-center gap-2 truncate">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E50914]" />
                  <span className="font-mono text-xs truncate">{adminEmail}</span>
                </div>
                <span className="text-[10px] font-mono text-[#666666] group-hover:text-[#E50914] transition-colors shrink-0">
                  Select
                </span>
              </div>
            ))}
          </div>

          <p className="text-[10px] font-mono text-[#666666] text-center leading-normal pt-1">
            {isSupabaseLive
              ? 'Secured with Supabase Auth & PostgreSQL Row Level Security (RLS).'
              : 'Development mode active. Passwords must be at least 6 characters.'}
          </p>
        </div>
      </div>
    </div>
  );
};
