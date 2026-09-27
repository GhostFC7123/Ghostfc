import React, { useState } from 'react';
import { TeamSettings } from '../../types';
import { clubService } from '../../services/clubService';
import { Database, Save, Check, AlertCircle, Copy, CheckCheck, ExternalLink, ShieldCheck } from 'lucide-react';
import { AUTHORIZED_ADMIN_EMAILS } from '../../lib/supabase';
import { SupabaseConnectionTester } from '../../components/admin/SupabaseConnectionTester';

interface AdminSettingsTabProps {
  settings: TeamSettings | null;
  onRefresh: () => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState<Partial<TeamSettings>>(settings || {});
  const [saving, setSaving] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const isLive = clubService.isLiveSupabase();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      await clubService.saveTeamSettings(formData);
      setMessage({ text: 'Team identity settings saved successfully.' });
      onRefresh();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to save settings', error: true });
    } finally {
      setSaving(false);
    }
  };

  const handleCopySql = () => {
    const sqlScript = `-- Run this in your Supabase SQL Editor:
-- Find the complete schema in /supabase-schema.sql
-- Includes RLS security policies for khaledarahman93@gmail.com and admin@ghostfc.com`;
    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl">
      <div className="pb-4 border-b border-[#1E1E1E]">
        <span className="text-[11px] font-mono text-[#E50914] font-bold uppercase tracking-widest block mb-1">
          CLUB IDENTITY & SYSTEM CONFIGURATION
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
          TEAM SETTINGS
        </h2>
        <p className="text-xs text-[#8E93A3] mt-1">
          Configure official brand metadata, stadium grounds, social platforms, and database connectivity.
        </p>
      </div>

      {message && (
        <div
          className={`p-3.5 border flex items-center gap-2.5 text-xs font-heading font-black uppercase tracking-wider ${
            message.error
              ? 'bg-red-950/40 border-[#E50914] text-red-200'
              : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
          }`}
        >
          {message.error ? <AlertCircle className="w-4 h-4 text-[#E50914]" /> : <Check className="w-4 h-4 text-emerald-400" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Supabase Integration Card */}
      <div className="bg-[#0C0E14] border border-[#1E222E] p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#181B24] gap-2">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-[#E50914]" />
            <div>
              <h3 className="font-heading text-lg font-black text-white uppercase">
                SUPABASE POSTGRESQL & AUTH STATUS
              </h3>
              <span className="text-[10px] font-mono text-[#8E93A3]">
                Persistent Cloud Database & RLS Security
              </span>
            </div>
          </div>

          <span
            className={`self-start sm:self-auto px-3 py-1 text-xs font-mono font-bold uppercase rounded ${
              isLive
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                : 'bg-red-950/40 text-red-400 border border-red-800/50'
            }`}
          >
            {isLive ? 'CONNECTED' : 'LOCAL CACHE MODE'}
          </span>
        </div>

        <p className="text-xs text-[#8E93A3] leading-relaxed">
          {isLive
            ? 'GHOST FC is actively synchronizing data with Supabase. RLS policies restrict database modifications to authorized administrator emails.'
            : 'The application is running in fully interactive Local Mode using browser storage. To connect to your Supabase PostgreSQL instance, set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env or Netlify environment variables.'}
        </p>

        <div className="p-3.5 bg-[#101217] border border-[#202432] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-black text-white uppercase">
              SQL SCHEMA & ROW LEVEL SECURITY FILE
            </span>
            <span className="text-[10px] font-mono text-[#E50914]">/supabase-schema.sql</span>
          </div>
          <p className="text-xs text-[#8E93A3]">
            Execute the schema file located at <code className="text-white">supabase-schema.sql</code> in the Supabase SQL editor to create all tables, indexes, triggers, and authorized RLS policies.
          </p>
        </div>

        <div className="text-xs font-mono text-[#8E93A3] space-y-1">
          <span className="font-bold text-white block">AUTHORIZED ADMIN ACCOUNTS (RLS ENFORCED):</span>
          {AUTHORIZED_ADMIN_EMAILS.map((em) => (
            <div key={em} className="text-[#E50914] flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{em}</span>
            </div>
          ))}
        </div>

        {/* Temporary Supabase Live Connection Tester */}
        <div className="pt-2">
          <SupabaseConnectionTester />
        </div>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[#0C0E14] border border-[#1E222E] p-4 sm:p-6 space-y-4">
          <h3 className="font-heading text-lg font-black text-white uppercase pb-3 border-b border-[#181B24]">
            CLUB BRANDING
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                Official Team Name
              </label>
              <input
                type="text"
                value={formData.team_name || ''}
                onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                Club Motto / Tagline
              </label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                Founded Year
              </label>
              <input
                type="number"
                value={formData.founded_year || 2024}
                onChange={(e) => setFormData({ ...formData, founded_year: parseInt(e.target.value) || 2024 })}
                className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                Home Ground Arena
              </label>
              <input
                type="text"
                value={formData.home_ground || ''}
                onChange={(e) => setFormData({ ...formData, home_ground: e.target.value })}
                className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                City / Region
              </label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                Club Logo URL
              </label>
              <input
                type="text"
                value={formData.logo_url || ''}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
              Club Philosophy & Description
            </label>
            <textarea
              rows={3}
              value={formData.club_description || ''}
              onChange={(e) => setFormData({ ...formData, club_description: e.target.value })}
              className="w-full bg-[#12141C] border border-[#242938] text-white text-xs p-3 outline-none"
            />
          </div>
        </div>

        {/* Club Social Media Channels */}
        <div className="bg-[#0C0E14] border border-[#1E222E] p-4 sm:p-6 space-y-4">
          <h3 className="font-heading text-lg font-black text-white uppercase pb-3 border-b border-[#181B24]">
            OFFICIAL DIGITAL & SOCIAL CHANNELS
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                Official Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagram_url || ''}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                placeholder="https://instagram.com/ghostfc_official"
                className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                Official Facebook URL
              </label>
              <input
                type="url"
                value={formData.facebook_url || ''}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                placeholder="https://facebook.com/ghostfcofficial"
                className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                Official TikTok Channel URL
              </label>
              <input
                type="url"
                value={formData.tiktok_url || ''}
                onChange={(e) => setFormData({ ...formData, tiktok_url: e.target.value })}
                placeholder="https://tiktok.com/@ghostfc"
                className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                Official YouTube Channel URL
              </label>
              <input
                type="url"
                value={formData.youtube_url || ''}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                placeholder="https://youtube.com/@ghostfc"
                className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="bg-[#0C0E14] border border-[#1E222E] p-4 sm:p-6 space-y-4">
          <h3 className="font-heading text-lg font-black text-white uppercase pb-3 border-b border-[#181B24]">
            HEADQUARTERS & CONTACT
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                Official Contact Email
              </label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                Headquarters Phone
              </label>
              <input
                type="text"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-8 py-3.5 bg-[#E50914] hover:bg-[#FF1A24] disabled:opacity-50 text-white font-heading font-black text-sm tracking-wider uppercase transition-colors shadow flex items-center justify-center gap-2 min-h-[44px]"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'UPDATING SETTINGS...' : 'SAVE ALL TEAM SETTINGS'}</span>
        </button>
      </form>
    </div>
  );
};
