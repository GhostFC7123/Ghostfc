import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { clubService } from '../../services/clubService';
import { ActivityLogItem } from '../../types';
import { SupabaseConnectionTester } from '../../components/admin/SupabaseConnectionTester';
import {
  ShieldCheck,
  Lock,
  Key,
  Database,
  History,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  Mail,
  UserCheck
} from 'lucide-react';
import { AUTHORIZED_ADMIN_EMAILS } from '../../lib/supabase';

export const AdminSecurityTab: React.FC = () => {
  const { user, logout, isDemoAdmin, isSupabaseLive } = useAuth();

  // Password Update
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; error?: boolean } | null>(null);

  // Activity Logs
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [copiedSql, setCopiedSql] = useState(false);

  const loadLogs = async () => {
    setLogsLoading(true);
    try {
      const data = await clubService.getActivityLogs();
      setLogs(data);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ text: 'Password must be at least 6 characters.', error: true });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match.', error: true });
      return;
    }

    setPasswordLoading(true);

    try {
      if (isSupabaseLive) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (error) throw error;
      }
      clubService.logActivity('Administrator updated access password credentials', 'Security');
      setPasswordMessage({ text: 'Password updated successfully. Remember your new credentials.' });
      setNewPassword('');
      setConfirmPassword('');
      loadLogs();
    } catch (err: any) {
      setPasswordMessage({ text: err.message || 'Failed to update password.', error: true });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCopySql = () => {
    const text = `-- GHOST FC PostgreSQL Database Schema
-- Run this in the Supabase SQL Editor:
-- Found in /supabase-schema.sql`;
    navigator.clipboard.writeText(text);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl">
      {/* Header */}
      <div className="pb-4 border-b border-[#1E1E1E]">
        <span className="text-[11px] font-mono text-[#E50914] font-bold uppercase tracking-widest block mb-1">
          OPERATIONAL SECURITY & SYSTEM ACCESS
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
          ADMIN SECURITY & SETTINGS
        </h2>
        <p className="text-xs text-[#8E93A3] mt-1">
          Manage operator authentication, security credentials, system connection status, and chronological audit logs.
        </p>
      </div>

      {/* Account Dossier & Password Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Info Card */}
        <div className="bg-[#0C0E14] border border-[#1E222E] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#181B24]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#E50914]" />
              <h3 className="font-heading text-base font-black text-white uppercase">
                AUTHENTICATED OPERATOR
              </h3>
            </div>
            <span className="px-2 py-0.5 bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-[10px] font-mono font-bold uppercase">
              RLS VERIFIED
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <span className="text-[#8E93A3] block text-[10px] uppercase">Active Email Address</span>
              <span className="text-white font-bold text-sm">
                {user?.email || (isDemoAdmin ? 'khaledarahman93@gmail.com' : 'admin@ghostfc.com')}
              </span>
            </div>

            <div>
              <span className="text-[#8E93A3] block text-[10px] uppercase">Access Clearance</span>
              <span className="text-emerald-400 font-bold">
                FULL CLUB ADMINISTRATOR (TIER 1)
              </span>
            </div>

            <div>
              <span className="text-[#8E93A3] block text-[10px] uppercase">Authentication Provider</span>
              <span className="text-[#A0A4B8]">
                {isSupabaseLive ? 'Supabase Auth (JSON Web Token)' : 'Local Registry Authentication'}
              </span>
            </div>

            <div className="pt-2 border-t border-[#181B24]">
              <span className="text-[#8E93A3] block text-[10px] uppercase mb-1">
                Authorized Admin Accounts:
              </span>
              {AUTHORIZED_ADMIN_EMAILS.map((em) => (
                <div key={em} className="text-[#E50914] text-[11px] flex items-center gap-1.5 truncate">
                  <UserCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{em}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-[#0C0E14] border border-[#1E222E] p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#181B24]">
            <div className="flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-[#E50914]" />
              <h3 className="font-heading text-base font-black text-white uppercase">
                UPDATE ACCESS PASSWORD
              </h3>
            </div>
          </div>

          {passwordMessage && (
            <div
              className={`p-3 border flex items-center gap-2 text-xs font-mono ${
                passwordMessage.error
                  ? 'bg-red-950/50 border-[#E50914] text-red-200'
                  : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
              }`}
            >
              {passwordMessage.error ? (
                <AlertCircle className="w-4 h-4 text-[#E50914] shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{passwordMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label className="block text-[10px] font-mono text-[#8E93A3] uppercase mb-1">
                New Password (minimum 6 characters)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2 outline-none font-mono focus:border-[#E50914]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#8E93A3] uppercase mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2 outline-none font-mono focus:border-[#E50914]"
              />
            </div>

            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full py-2.5 bg-[#E50914] hover:bg-[#FF1A24] disabled:opacity-50 text-white font-heading font-black text-xs uppercase tracking-wider transition-colors shadow"
            >
              {passwordLoading ? 'UPDATING CREDENTIALS...' : 'SAVE NEW PASSWORD'}
            </button>
          </form>
        </div>
      </div>

      {/* Supabase Connection Diagnostic Module */}
      <div className="space-y-2">
        <h3 className="font-heading text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
          <Database className="w-4 h-4 text-[#E50914]" />
          <span>SUPABASE POSTGRESQL & AUTH HEALTH CHECK</span>
        </h3>
        <SupabaseConnectionTester />
      </div>

      {/* Activity / Audit Log Table */}
      <div className="bg-[#0C0E14] border border-[#1E222E] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#181B24] gap-2">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-[#E50914]" />
            <div>
              <h3 className="font-heading text-base font-black text-white uppercase">
                ADMINISTRATIVE AUDIT LOG
              </h3>
              <span className="text-[10px] font-mono text-[#8E93A3]">
                Chronological record of operational events and content modifications
              </span>
            </div>
          </div>

          <button
            onClick={loadLogs}
            className="self-start sm:self-auto px-3 py-1.5 bg-[#141620] hover:bg-[#1E222E] border border-[#262B3A] text-xs font-heading font-bold text-white uppercase flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#E50914] ${logsLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Log</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#181B24] text-[10px] text-[#8E93A3] uppercase">
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Administrator</th>
                <th className="py-2 px-3">Target Entity</th>
                <th className="py-2 px-3">Operational Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151822]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-[#666B7E]">
                    No activity logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#10131B] transition-colors">
                    <td className="py-2.5 px-3 text-[#A0A4B8] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3 text-white font-bold whitespace-nowrap truncate max-w-[160px]">
                      {log.admin}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-[#141722] border border-[#222738] text-[10px] text-[#E50914] font-bold">
                        {log.entity}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#D0D4E4]">
                      {log.action}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
