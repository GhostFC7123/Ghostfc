import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Database,
  ExternalLink,
  ShieldCheck,
  Zap,
  Clock
} from 'lucide-react';
import { useSupabaseConnection } from '../../lib/supabaseHelper';
import { supabaseUrl } from '../../lib/supabaseClient';

export const SupabaseConnectionTester: React.FC = () => {
  const { isLoading, result, status, testConnection, missingEnv } = useSupabaseConnection(true);
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    await testConnection();
    setTesting(false);
  };

  const getStatusBadge = () => {
    if (isLoading || testing) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold bg-amber-950/50 text-amber-300 border border-amber-800/60 rounded">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
          TESTING CONNECTION...
        </span>
      );
    }

    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-700/60 rounded">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            CONNECTED (READY)
          </span>
        );
      case 'connected_tables_pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold bg-sky-950/60 text-sky-300 border border-sky-700/60 rounded">
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            CONNECTED (TABLES PENDING)
          </span>
        );
      case 'unconfigured':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold bg-amber-950/50 text-amber-400 border border-amber-800/60 rounded">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            MISSING CONFIGURATION
          </span>
        );
      case 'auth_error':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold bg-red-950/50 text-red-400 border border-red-800/60 rounded">
            <XCircle className="w-3.5 h-3.5 text-[#E50914]" />
            AUTHENTICATION REJECTED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold bg-red-950/50 text-red-400 border border-red-800/60 rounded">
            <XCircle className="w-3.5 h-3.5 text-[#E50914]" />
            DISCONNECTED
          </span>
        );
    }
  };

  return (
    <div className="bg-[#0A0C10] border border-[#1E222E] p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#181B24] gap-3">
        <div className="flex items-center gap-2.5">
          <Database className="w-5 h-5 text-[#E50914]" />
          <div>
            <h4 className="font-heading text-sm font-black text-white uppercase tracking-wider">
              TEMPORARY SUPABASE CONNECTION TEST
            </h4>
            <span className="text-[10px] font-mono text-[#8E93A3]">
              Safe client-side connectivity diagnostic without exposing secrets
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <button
            onClick={handleTest}
            disabled={isLoading || testing}
            className="px-3 py-1.5 bg-[#161822] hover:bg-[#202434] active:bg-[#272C3E] disabled:opacity-50 text-xs font-heading font-bold text-white uppercase tracking-wider border border-[#2B3044] transition-colors flex items-center gap-1.5"
            title="Re-run connection check"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#E50914] ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Testing...' : 'Test Now'}</span>
          </button>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div
          className={`p-3.5 border text-xs space-y-2 ${
            result.status === 'connected'
              ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
              : result.status === 'connected_tables_pending'
              ? 'bg-sky-950/20 border-sky-800/40 text-sky-200'
              : result.status === 'unconfigured'
              ? 'bg-amber-950/20 border-amber-800/40 text-amber-200'
              : 'bg-red-950/20 border-red-800/40 text-red-200'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <span className="font-heading font-black uppercase tracking-wider block">
                {result.message}
              </span>
              {result.details && (
                <p className="text-[11px] opacity-90 leading-relaxed font-mono">
                  {result.details}
                </p>
              )}
            </div>

            {result.latency !== null && (
              <span className="shrink-0 flex items-center gap-1 text-[10px] font-mono bg-black/40 px-2 py-0.5 border border-white/10">
                <Clock className="w-3 h-3" />
                {result.latency}ms
              </span>
            )}
          </div>
        </div>
      )}

      {/* Environment Variables Verification Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <div className="p-3 bg-[#11131A] border border-[#1D212E] space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[#A0A4B8] font-bold">VITE_SUPABASE_URL</span>
            {!missingEnv.includes('VITE_SUPABASE_URL') ? (
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> CONFIGURED
              </span>
            ) : (
              <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> MISSING
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-[#6E7385] block truncate">
            {supabaseUrl ? `Target: ${supabaseUrl.replace(/https?:\/\//, '').split('.')[0]}.supabase.co` : 'Required: https://<project-ref>.supabase.co'}
          </span>
        </div>

        <div className="p-3 bg-[#11131A] border border-[#1D212E] space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-mono text-[#A0A4B8] font-bold">VITE_SUPABASE_PUBLISHABLE_KEY</span>
            {!missingEnv.includes('VITE_SUPABASE_PUBLISHABLE_KEY') ? (
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> CONFIGURED
              </span>
            ) : (
              <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> MISSING
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-[#6E7385] block">
            Public client-side publishable key (anon) · Secret key is never used
          </span>
        </div>
      </div>

      {/* Target Tables Checklist for Supabase */}
      <div className="pt-2 border-t border-[#181B24]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase text-[#8E93A3] font-bold">
            PREPARED SUPABASE TABLES FOR INTEGRATION (9 TOTAL):
          </span>
          <span className="text-[10px] font-mono text-[#E50914]">
            Schema file: /supabase-schema.sql
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 text-[10px] font-mono">
          {[
            'players',
            'player_skills',
            'player_socials',
            'player_videos',
            'lineup',
            'matches',
            'news',
            'team_settings',
            'admin_profiles'
          ].map((t) => (
            <div
              key={t}
              className="px-2 py-1 bg-[#12141C] border border-[#1E222E] text-[#B0B4C8] text-center truncate"
            >
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
