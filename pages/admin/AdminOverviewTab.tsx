import React, { useState, useEffect } from 'react';
import { Player, Match, NewsArticle, LineupConfig, TeamSettings, ActivityLogItem } from '../../types';
import { clubService } from '../../services/clubService';
import {
  Users,
  Calendar,
  Newspaper,
  Shield,
  Layers,
  Database,
  ArrowUpRight,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Film,
  Activity,
  History,
  CheckCircle
} from 'lucide-react';
import { AdminTab } from '../../components/admin/AdminLayout';

interface AdminOverviewTabProps {
  players: Player[];
  matches: Match[];
  news: NewsArticle[];
  lineup: LineupConfig | null;
  settings: TeamSettings | null;
  onNavigateTab: (tab: AdminTab) => void;
  onRefreshData: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  players,
  matches,
  news,
  lineup,
  settings,
  onNavigateTab,
  onRefreshData
}) => {
  const isLive = clubService.isLiveSupabase();
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);

  useEffect(() => {
    clubService.getActivityLogs().then((logs) => setActivityLogs(logs.slice(0, 6)));
  }, []);

  const captain = players.find((p) => p.is_captain);
  const viceCaptain = players.find((p) => p.is_vice_captain && !p.is_captain);

  const activePlayers = players.filter((p) => p.is_active);
  const inactivePlayers = players.filter((p) => !p.is_active);

  const upcomingMatches = matches.filter((m) => m.status === 'Upcoming');
  const completedMatches = matches.filter((m) => m.status === 'Completed');

  const publishedNews = news.filter((n) => n.is_published);

  // Count total player videos
  const totalVideos = players.reduce((sum, p) => sum + (p.videos?.length || 0), 0);

  // Starting XI slots assigned
  const startingXICount = Object.values(lineup?.starting_xi || {}).filter(Boolean).length;
  const subsCount = lineup?.substitutes?.length || 0;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1E1E1E] gap-4">
        <div>
          <span className="text-[11px] font-mono text-[#E50914] font-bold tracking-widest uppercase block mb-1">
            GHOST FC OPERATIONS CENTER
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-white tracking-wide">
            CLUB MANAGEMENT OVERVIEW
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefreshData}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#141414] hover:bg-[#1F1F1F] border border-[#2B2B2B] text-xs font-heading font-bold text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#E50914]" />
            <span>SYNC DATA</span>
          </button>
        </div>
      </div>

      {/* Database Connection Notice */}
      <div
        className={`p-4 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isLive ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200' : 'bg-[#121212] border-[#222222] text-[#CCCCCC]'
        }`}
      >
        <div className="flex items-start gap-3">
          <Database className={`w-5 h-5 shrink-0 mt-0.5 ${isLive ? 'text-emerald-400' : 'text-[#E50914]'}`} />
          <div>
            <div className="font-heading font-bold text-sm tracking-wide text-white flex items-center gap-2">
              <span>{isLive ? 'SUPABASE POSTGRESQL CONNECTED' : 'LOCAL CACHE MODE ACTIVE'}</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  isLive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}
              >
                {isLive ? 'LIVE CLOUD' : 'LOCAL CACHE'}
              </span>
            </div>
            <p className="text-xs text-[#888888] mt-0.5 leading-relaxed">
              {isLive
                ? 'Your GHOST FC management portal is actively synchronizing with live Supabase tables and RLS authentication.'
                : 'All changes are stored locally in browser storage. Enter your Supabase credentials to synchronize live with PostgreSQL.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('settings')}
          className="text-xs font-heading font-bold text-[#E50914] hover:underline uppercase shrink-0"
        >
          Database Settings →
        </button>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => onNavigateTab('players')}
          className="p-3 bg-[#11131A] hover:bg-[#181B24] border border-[#222738] hover:border-[#E50914] text-left transition-colors flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] font-mono text-[#8E93A3] uppercase block">ROSTER</span>
            <span className="text-xs font-heading font-bold text-white group-hover:text-[#E50914]">
              + ADD PLAYER
            </span>
          </div>
          <Plus className="w-4 h-4 text-[#8E93A3] group-hover:text-[#E50914]" />
        </button>

        <button
          onClick={() => onNavigateTab('matches')}
          className="p-3 bg-[#11131A] hover:bg-[#181B24] border border-[#222738] hover:border-[#E50914] text-left transition-colors flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] font-mono text-[#8E93A3] uppercase block">FIXTURES</span>
            <span className="text-xs font-heading font-bold text-white group-hover:text-[#E50914]">
              + SCHEDULE MATCH
            </span>
          </div>
          <Plus className="w-4 h-4 text-[#8E93A3] group-hover:text-[#E50914]" />
        </button>

        <button
          onClick={() => onNavigateTab('news')}
          className="p-3 bg-[#11131A] hover:bg-[#181B24] border border-[#222738] hover:border-[#E50914] text-left transition-colors flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] font-mono text-[#8E93A3] uppercase block">PRESS</span>
            <span className="text-xs font-heading font-bold text-white group-hover:text-[#E50914]">
              + PUBLISH NEWS
            </span>
          </div>
          <Plus className="w-4 h-4 text-[#8E93A3] group-hover:text-[#E50914]" />
        </button>

        <button
          onClick={() => onNavigateTab('lineup')}
          className="p-3 bg-[#11131A] hover:bg-[#181B24] border border-[#222738] hover:border-[#E50914] text-left transition-colors flex items-center justify-between group"
        >
          <div>
            <span className="text-[10px] font-mono text-[#8E93A3] uppercase block">TACTICS</span>
            <span className="text-xs font-heading font-bold text-white group-hover:text-[#E50914]">
              EDIT STARTING XI
            </span>
          </div>
          <Layers className="w-4 h-4 text-[#8E93A3] group-hover:text-[#E50914]" />
        </button>
      </div>

      {/* Metrics Row: 7 Cards Required by Spec */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Total Players */}
        <div
          onClick={() => onNavigateTab('players')}
          className="p-4 sm:p-5 bg-[#0D0D0D] border border-[#202020] hover:border-[#E50914] transition-all cursor-pointer group space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#888888] uppercase">TOTAL PLAYERS</span>
            <Users className="w-4 h-4 text-[#E50914]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-teko text-4xl sm:text-5xl font-black text-white group-hover:text-[#E50914] transition-colors">
              {players.length}
            </span>
            <span className="text-xs font-mono text-emerald-400">
              {activePlayers.length} Active
            </span>
          </div>
          <span className="text-[10px] text-[#777777] block font-mono">
            {inactivePlayers.length} Inactive reserves
          </span>
        </div>

        {/* Starting XI */}
        <div
          onClick={() => onNavigateTab('lineup')}
          className="p-4 sm:p-5 bg-[#0D0D0D] border border-[#202020] hover:border-[#E50914] transition-all cursor-pointer group space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#888888] uppercase">STARTING XI</span>
            <Layers className="w-4 h-4 text-[#E50914]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-teko text-4xl sm:text-5xl font-black text-white group-hover:text-[#E50914] transition-colors">
              {startingXICount} / 11
            </span>
            <span className="text-xs font-mono text-[#E50914]">
              {lineup?.formation || '4-3-3'}
            </span>
          </div>
          <span className="text-[10px] text-[#777777] block font-mono">
            {11 - startingXICount === 0 ? 'Full pitch lineup deployed' : `${11 - startingXICount} open slots`}
          </span>
        </div>

        {/* Substitutes */}
        <div
          onClick={() => onNavigateTab('lineup')}
          className="p-4 sm:p-5 bg-[#0D0D0D] border border-[#202020] hover:border-[#E50914] transition-all cursor-pointer group space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#888888] uppercase">SUBSTITUTES</span>
            <Shield className="w-4 h-4 text-[#E50914]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-teko text-4xl sm:text-5xl font-black text-white group-hover:text-[#E50914] transition-colors">
              {subsCount} / 9
            </span>
            <span className="text-xs font-mono text-zinc-400">
              Bench
            </span>
          </div>
          <span className="text-[10px] text-[#777777] block font-mono">
            Tactical reserves on standby
          </span>
        </div>

        {/* Upcoming Matches */}
        <div
          onClick={() => onNavigateTab('matches')}
          className="p-4 sm:p-5 bg-[#0D0D0D] border border-[#202020] hover:border-[#E50914] transition-all cursor-pointer group space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#888888] uppercase">UPCOMING MATCHES</span>
            <Calendar className="w-4 h-4 text-[#E50914]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-teko text-4xl sm:text-5xl font-black text-white group-hover:text-[#E50914] transition-colors">
              {upcomingMatches.length}
            </span>
            <span className="text-xs font-mono text-[#E50914]">
              Fixtures
            </span>
          </div>
          <span className="text-[10px] text-[#777777] block font-mono">
            Next: {upcomingMatches[0]?.opponent || 'None scheduled'}
          </span>
        </div>

        {/* Completed Matches */}
        <div
          onClick={() => onNavigateTab('matches')}
          className="p-4 sm:p-5 bg-[#0D0D0D] border border-[#202020] hover:border-[#E50914] transition-all cursor-pointer group space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#888888] uppercase">COMPLETED MATCHES</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-teko text-4xl sm:text-5xl font-black text-white group-hover:text-[#E50914] transition-colors">
              {completedMatches.length}
            </span>
            <span className="text-xs font-mono text-emerald-400">
              Results
            </span>
          </div>
          <span className="text-[10px] text-[#777777] block font-mono">
            Archive & score records
          </span>
        </div>

        {/* Published News */}
        <div
          onClick={() => onNavigateTab('news')}
          className="p-4 sm:p-5 bg-[#0D0D0D] border border-[#202020] hover:border-[#E50914] transition-all cursor-pointer group space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#888888] uppercase">PUBLISHED NEWS</span>
            <Newspaper className="w-4 h-4 text-[#E50914]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-teko text-4xl sm:text-5xl font-black text-white group-hover:text-[#E50914] transition-colors">
              {publishedNews.length}
            </span>
            <span className="text-xs font-mono text-[#888888]">
              {news.length - publishedNews.length} Drafts
            </span>
          </div>
          <span className="text-[10px] text-[#777777] block font-mono">
            Active public bulletins
          </span>
        </div>

        {/* Player Videos */}
        <div
          onClick={() => onNavigateTab('videos')}
          className="p-4 sm:p-5 bg-[#0D0D0D] border border-[#202020] hover:border-[#E50914] transition-all cursor-pointer group space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#888888] uppercase">PLAYER VIDEOS</span>
            <Film className="w-4 h-4 text-[#E50914]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-teko text-4xl sm:text-5xl font-black text-white group-hover:text-[#E50914] transition-colors">
              {totalVideos}
            </span>
            <span className="text-xs font-mono text-[#E50914]">
              Clips
            </span>
          </div>
          <span className="text-[10px] text-[#777777] block font-mono">
            Goals, assists, highlights
          </span>
        </div>

        {/* Club Formation Spotlight */}
        <div
          onClick={() => onNavigateTab('lineup')}
          className="p-4 sm:p-5 bg-[#0D0D0D] border border-[#202020] hover:border-[#E50914] transition-all cursor-pointer group space-y-1.5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#888888] uppercase">ACTIVE FORMATION</span>
            <Layers className="w-4 h-4 text-[#E50914]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-teko text-4xl sm:text-5xl font-black text-white group-hover:text-[#E50914] transition-colors">
              {lineup?.formation || '4-3-3'}
            </span>
            <span className="text-xs font-mono text-emerald-400">
              Tactical
            </span>
          </div>
          <span className="text-[10px] text-[#777777] block font-mono">
            Interactive pitch visualization
          </span>
        </div>
      </div>

      {/* Leadership & Fixture Spotlight */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* On-Pitch Leadership */}
        <div className="lg:col-span-6 bg-[#0E0E0E] border border-[#202020] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#E50914]" />
              ACTIVE SQUAD LEADERSHIP
            </h3>
            <button
              onClick={() => onNavigateTab('captain')}
              className="text-xs font-heading font-bold text-[#E50914] hover:underline uppercase"
            >
              Modify Hierarchy →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Captain */}
            <div className="p-4 bg-[#141414] border border-[#242424] space-y-2">
              <span className="text-[10px] font-mono text-[#E50914] font-bold uppercase">
                FIRST TEAM CAPTAIN
              </span>
              {captain ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#1B1B1B] overflow-hidden border border-[#333333]">
                    <img src={captain.photo_url || '/ghost-fc-logo.jpg'} alt={captain.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-bold text-white leading-tight">
                      #{captain.jersey_number} {captain.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#888888]">
                      {captain.position_detail}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#777777]">No Captain Assigned</div>
              )}
            </div>

            {/* Vice Captain */}
            <div className="p-4 bg-[#141414] border border-[#242424] space-y-2">
              <span className="text-[10px] font-mono text-[#AAAAAA] font-bold uppercase">
                VICE CAPTAIN
              </span>
              {viceCaptain ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#1B1B1B] overflow-hidden border border-[#333333]">
                    <img src={viceCaptain.photo_url || '/ghost-fc-logo.jpg'} alt={viceCaptain.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-heading text-base font-bold text-white leading-tight">
                      #{viceCaptain.jersey_number} {viceCaptain.name}
                    </h4>
                    <span className="text-[11px] font-mono text-[#888888]">
                      {viceCaptain.position_detail}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#777777]">No Vice Captain Assigned</div>
              )}
            </div>
          </div>
        </div>

        {/* Next Match Overview */}
        <div className="lg:col-span-6 bg-[#0E0E0E] border border-[#202020] p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
            <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#E50914]" />
              NEXT SCHEDULED FIXTURE
            </h3>
            <button
              onClick={() => onNavigateTab('matches')}
              className="text-xs font-heading font-bold text-[#E50914] hover:underline uppercase"
            >
              Match Center →
            </button>
          </div>

          {upcomingMatches[0] ? (
            <div className="p-4 bg-[#141414] border border-[#242424] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-heading font-bold text-white">{upcomingMatches[0].competition}</span>
                <span className="font-mono text-[#E50914]">{upcomingMatches[0].date} · {upcomingMatches[0].time}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="font-heading text-xl font-black text-white">GHOST FC</span>
                <span className="text-sm font-mono text-[#E50914] font-bold">VS</span>
                <span className="font-heading text-xl font-black text-white">{upcomingMatches[0].opponent}</span>
              </div>
              <div className="text-xs text-[#888888] font-mono">
                Venue: {upcomingMatches[0].venue} ({upcomingMatches[0].is_home ? 'HOME' : 'AWAY'})
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#777777] bg-[#141414] border border-[#242424]">
              No upcoming fixtures configured. Click "+ SCHEDULE MATCH" to set up next fixture.
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Audit Section */}
      <div className="bg-[#0C0E14] border border-[#1E222E] p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#181B24]">
          <div className="flex items-center gap-2.5">
            <History className="w-5 h-5 text-[#E50914]" />
            <div>
              <h3 className="font-heading text-base font-black text-white uppercase">
                RECENT ADMINISTRATIVE ACTIONS
              </h3>
              <span className="text-[10px] font-mono text-[#8E93A3]">
                Latest operations performed in this management session
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('admin-settings')}
            className="text-xs font-heading font-bold text-[#E50914] hover:underline uppercase"
          >
            Full Audit Log →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activityLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 bg-[#11131A] border border-[#1D212E] space-y-1.5 text-xs font-mono"
            >
              <div className="flex items-center justify-between text-[10px] text-[#8E93A3]">
                <span className="px-1.5 py-0.5 bg-[#171A24] border border-[#222738] text-[#E50914] font-bold">
                  {log.entity}
                </span>
                <span>{log.timestamp}</span>
              </div>
              <p className="text-white font-bold line-clamp-2">
                {log.action}
              </p>
              <span className="text-[10px] text-[#6E7385] truncate block">
                by {log.admin}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
