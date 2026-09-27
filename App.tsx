import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { SquadPage } from './pages/SquadPage';
import { PlayerProfilePage } from './pages/PlayerProfilePage';
import { MatchesPage } from './pages/MatchesPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { AboutPage } from './pages/AboutPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { clubService } from './services/clubService';
import { TeamSettings } from './types';

// Scroll to top automatically when route changes
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper for public pages with Navbar & Footer
function PublicLayout({ settings }: { settings?: TeamSettings }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-[#F3F3F3]">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/squad" element={<SquadPage />} />
          <Route path="/player/:id" element={<PlayerProfilePage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          {/* Catch all unmatched public routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer settings={settings} />
    </div>
  );
}

export default function App() {
  const [settings, setSettings] = useState<TeamSettings | undefined>(undefined);

  useEffect(() => {
    clubService.getTeamSettings().then(setSettings).catch(console.error);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Protected / Dedicated Admin Routes (Without Public Header/Footer) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/*" element={<AdminDashboardPage />} />

          {/* Public Website Routes */}
          <Route path="/*" element={<PublicLayout settings={settings} />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
