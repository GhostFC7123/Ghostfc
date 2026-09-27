import React, { useState } from 'react';
import { Player, PlayerSocials } from '../../types';
import { clubService } from '../../services/clubService';
import {
  Share2,
  Instagram,
  Facebook,
  Youtube,
  Save,
  Check,
  Search,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

interface AdminSocialsTabProps {
  players: Player[];
  onRefresh: () => void;
}

export const AdminSocialsTab: React.FC<AdminSocialsTabProps> = ({ players, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [socialsForm, setSocialsForm] = useState<PlayerSocials>({});
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ text: string; error?: boolean } | null>(null);

  const showNotification = (text: string, error = false) => {
    setNotification({ text, error });
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredPlayers = players.filter((p) => {
    const q = search.toLowerCase().trim();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.jersey_number.toString() === q ||
      p.position_detail.toLowerCase().includes(q)
    );
  });

  const handleSelectPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setSocialsForm({
      instagram: player.socials?.instagram || '',
      facebook: player.socials?.facebook || '',
      tiktok: player.socials?.tiktok || '',
      youtube: player.socials?.youtube || ''
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;

    setSaving(true);
    try {
      await clubService.updatePlayerSocials(selectedPlayer.id, socialsForm);
      showNotification(`Social media channels for ${selectedPlayer.name} updated.`);
      onRefresh();
    } catch (err: any) {
      showNotification(err.message || 'Failed to update social profiles', true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-3.5 border flex items-center justify-between gap-3 text-xs font-heading font-black uppercase tracking-wider ${
            notification.error
              ? 'bg-red-950/50 border-[#E50914] text-red-200'
              : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
          }`}
        >
          <span>{notification.text}</span>
          <button onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E1E1E] gap-4">
        <div>
          <span className="text-[11px] font-mono text-[#E50914] font-bold uppercase tracking-widest block mb-1">
            DIGITAL PRESENCE & VERIFIED CHANNELS
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
            PLAYER SOCIAL MEDIA
          </h2>
          <p className="text-xs text-[#8E93A3] mt-1">
            Configure verified Instagram, Facebook, TikTok, and YouTube profile links for each squad player.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Player Selection List (5 cols) */}
        <div className="lg:col-span-5 bg-[#0C0E14] border border-[#1E222E] p-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#181B24]">
            <span className="text-xs font-heading font-black text-white uppercase tracking-wider">
              SELECT PLAYER ({filteredPlayers.length})
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#666B7E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search squad..."
              className="w-full bg-[#12141C] border border-[#242938] text-white text-xs pl-9 pr-3 py-2 outline-none font-mono focus:border-[#E50914]"
            />
          </div>

          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredPlayers.map((player) => {
              const isSelected = selectedPlayer?.id === player.id;
              const hasSocials = Boolean(
                player.socials?.instagram ||
                player.socials?.facebook ||
                player.socials?.tiktok ||
                player.socials?.youtube
              );

              return (
                <div
                  key={player.id}
                  onClick={() => handleSelectPlayer(player)}
                  className={`p-2.5 border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#181C28] border-[#E50914]'
                      : 'bg-[#101217] border-[#1D212E] hover:border-[#2C3246]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-9 h-9 rounded bg-[#161822] overflow-hidden border border-[#262B3A] shrink-0">
                      <img
                        src={player.photo_url || '/ghost-fc-logo.jpg'}
                        alt={player.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/ghost-fc-logo.jpg';
                        }}
                      />
                    </div>
                    <div className="truncate">
                      <div className="font-heading font-bold text-xs text-white truncate flex items-center gap-1.5">
                        <span className="text-[#E50914] font-mono">#{player.jersey_number}</span>
                        <span className="truncate">{player.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-[#8E93A3] block">
                        {player.position_detail}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {hasSocials ? (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 rounded">
                        LINKED
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-900 text-zinc-500 border border-zinc-800 rounded">
                        EMPTY
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Edit Socials Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#0C0E14] border border-[#1E222E] p-5 space-y-4">
          {selectedPlayer ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#181B24]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded bg-[#161822] overflow-hidden border border-[#262B3A]">
                    <img
                      src={selectedPlayer.photo_url || '/ghost-fc-logo.jpg'}
                      alt={selectedPlayer.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-black text-white">
                      #{selectedPlayer.jersey_number} {selectedPlayer.name}
                    </h3>
                    <span className="text-[11px] font-mono text-[#E50914]">
                      {selectedPlayer.position_detail} · {selectedPlayer.role}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-[#8E93A3]">
                  URL FORMAT REQUIRED
                </span>
              </div>

              {/* Instagram */}
              <div>
                <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  Instagram Profile URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://instagram.com/player_handle"
                    value={socialsForm.instagram || ''}
                    onChange={(e) => setSocialsForm({ ...socialsForm, instagram: e.target.value })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono focus:border-[#E50914]"
                  />
                  {socialsForm.instagram && (
                    <a
                      href={socialsForm.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E93A3] hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* Facebook */}
              <div>
                <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1 flex items-center gap-1.5">
                  <Facebook className="w-3.5 h-3.5 text-blue-400" />
                  Facebook Page URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://facebook.com/player_official"
                    value={socialsForm.facebook || ''}
                    onChange={(e) => setSocialsForm({ ...socialsForm, facebook: e.target.value })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono focus:border-[#E50914]"
                  />
                  {socialsForm.facebook && (
                    <a
                      href={socialsForm.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E93A3] hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* TikTok */}
              <div>
                <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1 flex items-center gap-1.5">
                  <span className="font-bold text-[10px] text-cyan-400">TT</span>
                  TikTok Channel URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://tiktok.com/@player_handle"
                    value={socialsForm.tiktok || ''}
                    onChange={(e) => setSocialsForm({ ...socialsForm, tiktok: e.target.value })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono focus:border-[#E50914]"
                  />
                  {socialsForm.tiktok && (
                    <a
                      href={socialsForm.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E93A3] hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              {/* YouTube */}
              <div>
                <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1 flex items-center gap-1.5">
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  YouTube Channel / Playlist URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    placeholder="https://youtube.com/@player_official"
                    value={socialsForm.youtube || ''}
                    onChange={(e) => setSocialsForm({ ...socialsForm, youtube: e.target.value })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono focus:border-[#E50914]"
                  />
                  {socialsForm.youtube && (
                    <a
                      href={socialsForm.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E93A3] hover:text-white"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-[#181B24] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#8E93A3]">
                  Icons will only display on the public website when a valid URL is provided.
                </span>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#E50914] hover:bg-[#FF1A24] text-white font-heading font-black text-xs uppercase tracking-wider transition-colors shadow disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'UPDATING...' : 'SAVE SOCIAL LINKS'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="py-20 text-center space-y-2">
              <Share2 className="w-8 h-8 text-[#4E5364] mx-auto" />
              <h4 className="font-heading font-bold text-white text-sm">SELECT A PLAYER TO EDIT</h4>
              <p className="text-xs text-[#8E93A3] max-w-xs mx-auto">
                Choose any squad member on the left panel to update their verified social platforms.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
