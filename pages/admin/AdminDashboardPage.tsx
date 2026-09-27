import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { clubService } from '../../services/clubService';
import { Player, Match, NewsArticle, LineupConfig, TeamSettings } from '../../types';
import { AdminLayout, AdminTab } from '../../components/admin/AdminLayout';
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminPlayersTab } from './AdminPlayersTab';
import { AdminCaptainTab } from './AdminCaptainTab';
import { AdminLineupTab } from './AdminLineupTab';
import { AdminMatchesTab } from './AdminMatchesTab';
import { AdminNewsTab } from './AdminNewsTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { AdminVideosTab } from './AdminVideosTab';
import { AdminSocialsTab } from './AdminSocialsTab';
import { AdminSecurityTab } from './AdminSecurityTab';
import { LoadingState } from '../../components/common/LoadingState';

export const AdminDashboardPage: React.FC = () => {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [dataLoading, setDataLoading] = useState(true);

  // Global Club Data
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [lineup, setLineup] = useState<LineupConfig | null>(null);
  const [settings, setSettings] = useState<TeamSettings | null>(null);

  // Route protection
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, authLoading, navigate]);

  const loadAllData = async () => {
    try {
      const [p, m, n, l, s] = await Promise.all([
        clubService.getPlayers(),
        clubService.getMatches(),
        clubService.getNews(),
        clubService.getLineup(),
        clubService.getTeamSettings()
      ]);
      setPlayers(p);
      setMatches(m);
      setNews(n);
      setLineup(l);
      setSettings(s);
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin]);

  if (authLoading || (!isAdmin && authLoading)) {
    return <LoadingState message="Authenticating Administrative Clearance..." className="min-h-screen" />;
  }

  if (!isAdmin) {
    return null; // Will redirect via useEffect
  }

  if (dataLoading) {
    return <LoadingState message="Accessing GHOST FC Management System..." className="min-h-screen" />;
  }

  return (
    <AdminLayout currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === 'overview' && (
        <AdminOverviewTab
          players={players}
          matches={matches}
          news={news}
          lineup={lineup}
          settings={settings}
          onNavigateTab={setCurrentTab}
          onRefreshData={loadAllData}
        />
      )}

      {currentTab === 'players' && (
        <AdminPlayersTab
          players={players}
          onRefresh={loadAllData}
        />
      )}

      {currentTab === 'captain' && (
        <AdminCaptainTab
          players={players}
          onRefresh={loadAllData}
        />
      )}

      {currentTab === 'lineup' && (
        <AdminLineupTab
          lineup={lineup}
          players={players}
          onRefresh={loadAllData}
        />
      )}

      {currentTab === 'matches' && (
        <AdminMatchesTab
          matches={matches}
          onRefresh={loadAllData}
        />
      )}

      {currentTab === 'news' && (
        <AdminNewsTab
          news={news}
          onRefresh={loadAllData}
        />
      )}

      {currentTab === 'settings' && (
        <AdminSettingsTab
          settings={settings}
          onRefresh={loadAllData}
        />
      )}

      {currentTab === 'videos' && (
        <AdminVideosTab
          players={players}
          onRefresh={loadAllData}
        />
      )}

      {currentTab === 'socials' && (
        <AdminSocialsTab
          players={players}
          onRefresh={loadAllData}
        />
      )}

      {currentTab === 'admin-settings' && (
        <AdminSecurityTab />
      )}
    </AdminLayout>
  );
};
