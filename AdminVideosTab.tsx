import React, { useState } from 'react';
import { Player, PlayerVideo } from '../../types';
import { clubService } from '../../services/clubService';
import { isValidYouTubeUrl, getYouTubeEmbedUrl, getYouTubeThumbnailUrl } from '../../utils/youtube';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  Video,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Film,
  Play,
  Check,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';

interface AdminVideosTabProps {
  players: Player[];
  onRefresh: () => void;
}

export const AdminVideosTab: React.FC<AdminVideosTabProps> = ({ players, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [selectedPlayerFilter, setSelectedPlayerFilter] = useState<string>('ALL');

  // Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editingVideo, setEditingVideo] = useState<{
    id?: string;
    player_id: string;
    title: string;
    youtube_url: string;
    description: string;
    category: 'GOAL' | 'ASSIST' | 'SKILLS' | 'SAVE' | 'HIGHLIGHT';
  } | null>(null);

  // Deletion state
  const [videoToDelete, setVideoToDelete] = useState<{ videoId: string; playerId: string; title: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form error & loading
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ text: string; error?: boolean } | null>(null);

  const showNotification = (text: string, error = false) => {
    setNotification({ text, error });
    setTimeout(() => setNotification(null), 4000);
  };

  // Flatten all videos across players
  const allVideos: Array<PlayerVideo & { playerName: string; playerJersey: number }> = [];
  players.forEach((p) => {
    (p.videos || []).forEach((v) => {
      allVideos.push({
        ...v,
        playerName: p.name,
        playerJersey: p.jersey_number
      });
    });
  });

  const filteredVideos = allVideos.filter((v) => {
    const matchesPlayer = selectedPlayerFilter === 'ALL' || v.player_id === selectedPlayerFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      v.title.toLowerCase().includes(q) ||
      v.playerName.toLowerCase().includes(q) ||
      (v.description && v.description.toLowerCase().includes(q)) ||
      (v.category && v.category.toLowerCase().includes(q));
    return matchesPlayer && matchesSearch;
  });

  const handleOpenCreate = () => {
    setFormError(null);
    setEditingVideo({
      player_id: players[0]?.id || '',
      title: '',
      youtube_url: '',
      description: '',
      category: 'HIGHLIGHT'
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (v: PlayerVideo) => {
    setFormError(null);
    setEditingVideo({
      id: v.id,
      player_id: v.player_id,
      title: v.title,
      youtube_url: v.youtube_url,
      description: v.description || '',
      category: (v.category as any) || 'HIGHLIGHT'
    });
    setIsEditing(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!editingVideo) return;

    if (!editingVideo.player_id) {
      setFormError('Please select a player.');
      return;
    }

    if (!editingVideo.title.trim()) {
      setFormError('Video title is required.');
      return;
    }

    if (!editingVideo.youtube_url.trim()) {
      setFormError('YouTube URL is required.');
      return;
    }

    if (!isValidYouTubeUrl(editingVideo.youtube_url)) {
      setFormError('Invalid YouTube URL format. Must be youtube.com/watch?v=... or youtu.be/...');
      return;
    }

    setSaving(true);
    try {
      if (editingVideo.id) {
        // Edit existing
        await clubService.editPlayerVideo(editingVideo.player_id, editingVideo.id, {
          title: editingVideo.title,
          youtube_url: editingVideo.youtube_url,
          description: editingVideo.description,
          category: editingVideo.category
        });
        showNotification('Video updated successfully.');
      } else {
        // Create new
        await clubService.addPlayerVideo(editingVideo.player_id, {
          title: editingVideo.title,
          youtube_url: editingVideo.youtube_url,
          description: editingVideo.description,
          category: editingVideo.category
        });
        showNotification('Video added successfully.');
      }
      setIsEditing(false);
      setEditingVideo(null);
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save video');
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!videoToDelete) return;
    setDeleteLoading(true);
    try {
      await clubService.deletePlayerVideo(videoToDelete.playerId, videoToDelete.videoId);
      showNotification('Video removed.');
      setVideoToDelete(null);
      onRefresh();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete video', true);
    } finally {
      setDeleteLoading(false);
    }
  };

  const previewThumbnail = editingVideo?.youtube_url ? getYouTubeThumbnailUrl(editingVideo.youtube_url) : null;
  const previewEmbed = editingVideo?.youtube_url ? getYouTubeEmbedUrl(editingVideo.youtube_url) : null;

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
            MULTIMEDIA ARCHIVE & HIGHLIGHT REELS
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
            PLAYER YOUTUBE VIDEOS
          </h2>
          <p className="text-xs text-[#8E93A3] mt-1">
            Manage goals, assists, skills showcases, and match highlights linked to squad players.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#FF1A24] text-white font-heading font-black text-xs tracking-wider uppercase transition-colors shadow min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>ADD HIGHLIGHT VIDEO</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-[#0C0E14] border border-[#1E222E] flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#666B7E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, player, or category..."
            className="w-full bg-[#12141C] border border-[#242938] text-white text-xs pl-10 pr-4 py-2.5 outline-none font-mono focus:border-[#E50914] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#8E93A3]" />
          <select
            value={selectedPlayerFilter}
            onChange={(e) => setSelectedPlayerFilter(e.target.value)}
            className="bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono focus:border-[#E50914]"
          >
            <option value="ALL">ALL SQUAD PLAYERS ({allVideos.length} clips)</option>
            {players.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.jersey_number} {p.name} ({(p.videos || []).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="p-12 text-center bg-[#0C0E14] border border-[#1E222E] space-y-3">
          <Video className="w-10 h-10 text-[#555A6E] mx-auto" />
          <div className="text-white font-heading font-bold text-base">NO HIGHLIGHT VIDEOS FOUND</div>
          <p className="text-xs text-[#8E93A3] max-w-sm mx-auto">
            {search || selectedPlayerFilter !== 'ALL'
              ? 'No videos match your active filter. Try resetting your search.'
              : 'Start building player portfolios by linking YouTube match highlights and skills clips.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((video) => {
            const thumb = getYouTubeThumbnailUrl(video.youtube_url);
            return (
              <div
                key={video.id}
                className="bg-[#0C0E14] border border-[#1E222E] hover:border-[#E50914]/60 transition-all flex flex-col justify-between overflow-hidden group"
              >
                {/* Thumbnail / Header */}
                <div className="relative aspect-video bg-[#141722] overflow-hidden">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#555]">
                      <Film className="w-8 h-8" />
                    </div>
                  )}

                  {/* Play badge */}
                  <a
                    href={video.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#E50914] text-white flex items-center justify-center shadow-lg">
                      <Play className="w-5 h-5 ml-0.5" />
                    </div>
                  </a>

                  {/* Category Pill */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/80 border border-white/10 text-[10px] font-mono font-bold text-white uppercase">
                    {video.category || 'HIGHLIGHT'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#E50914] font-bold">
                      <span>#{video.playerJersey}</span>
                      <span>{video.playerName}</span>
                    </div>

                    <h3 className="font-heading font-bold text-sm text-white line-clamp-1">
                      {video.title}
                    </h3>

                    {video.description && (
                      <p className="text-xs text-[#8E93A3] line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#181B24] flex items-center justify-between">
                    <a
                      href={video.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-[#8E93A3] hover:text-white flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Watch</span>
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEdit(video)}
                        className="p-1.5 bg-[#141620] hover:bg-[#1E222E] text-white border border-[#262B3A] text-xs transition-colors"
                        title="Edit video details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setVideoToDelete({ videoId: video.id, playerId: video.player_id, title: video.title })}
                        className="p-1.5 bg-red-950/40 hover:bg-red-950/70 text-red-400 border border-red-900/40 text-xs transition-colors"
                        title="Delete video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Add Modal */}
      {isEditing && editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-xl bg-[#0D0E12] border border-[#262B3A] p-6 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto"
            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#E50914]" />

            <div className="flex items-center justify-between pb-3 border-b border-[#1C202C]">
              <div>
                <span className="text-[10px] font-mono text-[#E50914] font-bold uppercase tracking-wider block">
                  {editingVideo.id ? 'UPDATE CLIP' : 'NEW SQUAD HIGHLIGHT'}
                </span>
                <h3 className="font-heading text-lg font-black text-white uppercase">
                  {editingVideo.id ? 'EDIT VIDEO DOSSIER' : 'ADD YOUTUBE VIDEO'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingVideo(null);
                }}
                className="text-[#8E93A3] hover:text-white"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-950/50 border border-[#E50914] text-xs text-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#E50914] shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveVideo} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                  Associated Player *
                </label>
                <select
                  value={editingVideo.player_id}
                  onChange={(e) => setEditingVideo({ ...editingVideo, player_id: e.target.value })}
                  disabled={Boolean(editingVideo.id)}
                  className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono focus:border-[#E50914]"
                >
                  {players.map((p) => (
                    <option key={p.id} value={p.id}>
                      #{p.jersey_number} {p.name} ({p.position_detail})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                  Video Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 35-Yard Thunderstrike Goal vs Dynamo"
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({ ...editingVideo, title: e.target.value })}
                  className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none focus:border-[#E50914] font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                    Category Tag
                  </label>
                  <select
                    value={editingVideo.category}
                    onChange={(e) => setEditingVideo({ ...editingVideo, category: e.target.value as any })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono focus:border-[#E50914]"
                  >
                    <option value="GOAL">GOAL</option>
                    <option value="ASSIST">ASSIST</option>
                    <option value="SKILLS">SKILLS</option>
                    <option value="SAVE">SAVE</option>
                    <option value="HIGHLIGHT">HIGHLIGHT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://youtube.com/watch?v=..."
                    value={editingVideo.youtube_url}
                    onChange={(e) => setEditingVideo({ ...editingVideo, youtube_url: e.target.value })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono focus:border-[#E50914]"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              {previewEmbed && (
                <div className="p-3 bg-[#11131A] border border-[#1D212E] space-y-2">
                  <span className="text-[10px] font-mono text-[#8E93A3] uppercase block">
                    LIVE EMBED PREVIEW
                  </span>
                  <div className="aspect-video w-full overflow-hidden bg-black border border-white/10">
                    <iframe
                      src={previewEmbed}
                      title="YouTube Preview"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                  Tactical Breakdown / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the play, timing, assist, or match significance..."
                  value={editingVideo.description}
                  onChange={(e) => setEditingVideo({ ...editingVideo, description: e.target.value })}
                  className="w-full bg-[#12141C] border border-[#242938] text-white text-xs p-3 outline-none focus:border-[#E50914]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#1C202C]">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingVideo(null);
                  }}
                  className="px-4 py-2 text-xs font-heading font-black text-[#8E93A3] hover:text-white bg-[#141722] border border-[#262B3A] uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 text-xs font-heading font-black text-white bg-[#E50914] hover:bg-[#FF1A24] uppercase tracking-wider disabled:opacity-50 transition-colors shadow"
                >
                  {saving ? 'SAVING...' : 'SAVE VIDEO'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmModal
        isOpen={Boolean(videoToDelete)}
        title="REMOVE HIGHLIGHT VIDEO?"
        message={`Are you sure you want to permanently delete "${videoToDelete?.title}"? This cannot be undone.`}
        confirmLabel="DELETE VIDEO"
        onConfirm={handleConfirmDelete}
        onCancel={() => setVideoToDelete(null)}
        loading={deleteLoading}
      />
    </div>
  );
};
