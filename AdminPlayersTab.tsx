import React, { useState } from 'react';
import { Player, PlayerPosition, PlayerSkills, PlayerSocials, PlayerVideo } from '../../types';
import { clubService } from '../../services/clubService';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Search,
  Sliders,
  Share2,
  Video,
  Shield,
  Crown,
  AlertCircle,
  Eye,
  Film,
  UserCheck,
  UserX,
  Image as ImageIcon
} from 'lucide-react';

interface AdminPlayersTabProps {
  players: Player[];
  onRefresh: () => void;
}

export const AdminPlayersTab: React.FC<AdminPlayersTabProps> = ({ players, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [posFilter, setPosFilter] = useState<'ALL' | PlayerPosition>('ALL');

  // Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Partial<Player> | null>(null);
  const [imageError, setImageError] = useState(false);

  // Deletion state
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Status notification
  const [notification, setNotification] = useState<{ text: string; error?: boolean } | null>(null);

  const showNotification = (text: string, error = false) => {
    setNotification({ text, error });
    setTimeout(() => setNotification(null), 4000);
  };

  const filteredPlayers = players.filter((p) => {
    // Status filter
    if (statusFilter === 'ACTIVE' && !p.is_active) return false;
    if (statusFilter === 'INACTIVE' && p.is_active) return false;

    // Position filter
    if (posFilter !== 'ALL' && p.position !== posFilter) return false;

    // Search query
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.jersey_number.toString() === q ||
      p.position_detail.toLowerCase().includes(q) ||
      p.role.toLowerCase().includes(q)
    );
  });

  const handleCreateNew = () => {
    setImageError(false);
    setSelectedPlayer({
      name: '',
      jersey_number: 10,
      position: 'FWD',
      position_detail: 'Striker',
      role: 'First Team',
      is_captain: false,
      is_vice_captain: false,
      age: 22,
      height: '185 cm',
      preferred_foot: 'Right',
      photo_url: '',
      short_description: '',
      playing_style: 'Creative and dynamic forward with explosive acceleration and lethal finishing.',
      is_active: true,
      skills: { pace: 80, shooting: 75, passing: 75, dribbling: 80, defending: 60, physical: 75 },
      socials: { instagram: '', facebook: '', tiktok: '', youtube: '' },
      videos: []
    });
    setIsEditing(true);
  };

  const handleEdit = (player: Player) => {
    setImageError(false);
    setSelectedPlayer(JSON.parse(JSON.stringify(player)));
    setIsEditing(true);
  };

  const handleToggleActive = async (player: Player) => {
    try {
      await clubService.savePlayer({
        id: player.id,
        is_active: !player.is_active
      });
      showNotification(`${player.name} is now ${!player.is_active ? 'ACTIVE' : 'INACTIVE'}.`);
      onRefresh();
    } catch (err: any) {
      showNotification('Failed to update player status', true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!playerToDelete) return;
    setDeleteLoading(true);
    try {
      await clubService.deletePlayer(playerToDelete.id);
      showNotification(`Player ${playerToDelete.name} (#${playerToDelete.jersey_number}) permanently removed.`);
      setPlayerToDelete(null);
      onRefresh();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete player', true);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSavePlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;

    if (!selectedPlayer.name?.trim()) {
      showNotification('Player name is required.', true);
      return;
    }

    if (!selectedPlayer.jersey_number || selectedPlayer.jersey_number < 1 || selectedPlayer.jersey_number > 99) {
      showNotification('Jersey number must be between 1 and 99.', true);
      return;
    }

    try {
      await clubService.savePlayer(selectedPlayer);
      showNotification(`Dossier for ${selectedPlayer.name} (#${selectedPlayer.jersey_number}) saved.`);
      setIsEditing(false);
      setSelectedPlayer(null);
      onRefresh();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save player profile', true);
    }
  };

  // Specific position options with tactical category mapping
  const TACTICAL_POSITIONS = [
    { code: 'GK', cat: 'GK', label: 'GK - Goalkeeper' },
    { code: 'CB', cat: 'DEF', label: 'CB - Centre Back' },
    { code: 'LB', cat: 'DEF', label: 'LB - Left Back' },
    { code: 'RB', cat: 'DEF', label: 'RB - Right Back' },
    { code: 'CDM', cat: 'MID', label: 'CDM - Defensive Midfielder' },
    { code: 'CM', cat: 'MID', label: 'CM - Central Midfielder' },
    { code: 'CAM', cat: 'MID', label: 'CAM - Attacking Midfielder' },
    { code: 'LW', cat: 'FWD', label: 'LW - Left Winger' },
    { code: 'RW', cat: 'FWD', label: 'RW - Right Winger' },
    { code: 'ST', cat: 'FWD', label: 'ST - Striker' },
  ];

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
            FIRST TEAM DOSSIERS & METRICS
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
            PLAYER MANAGEMENT
          </h2>
          <p className="text-xs text-[#8E93A3] mt-1">
            Complete squad roster control, attribute tuning, social profiles, and tactical credentials.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#FF1A24] text-white font-heading font-black text-xs tracking-wider uppercase transition-colors shadow min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW PLAYER</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="p-4 bg-[#0C0E14] border border-[#1E222E] space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#666B7E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, jersey number, position..."
              className="w-full bg-[#12141C] border border-[#242938] text-white text-xs pl-10 pr-4 py-2.5 outline-none font-mono focus:border-[#E50914] transition-colors"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1.5 bg-[#12141C] border border-[#242938] p-1 shrink-0">
            {(['ALL', 'ACTIVE', 'INACTIVE'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 text-[11px] font-mono font-bold uppercase transition-colors ${
                  statusFilter === s
                    ? 'bg-[#E50914] text-white'
                    : 'text-[#8E93A3] hover:text-white'
                }`}
              >
                {s} ({players.filter((p) => s === 'ALL' ? true : s === 'ACTIVE' ? p.is_active : !p.is_active).length})
              </button>
            ))}
          </div>
        </div>

        {/* Position Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10px] font-mono text-[#666B7E] uppercase mr-1">Position:</span>
          {(['ALL', 'GK', 'DEF', 'MID', 'FWD'] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              className={`px-2.5 py-1 text-[10px] font-mono uppercase border transition-colors ${
                posFilter === pos
                  ? 'bg-white/10 border-white text-white font-bold'
                  : 'bg-[#12141C] border-[#222738] text-[#8E93A3] hover:text-white'
              }`}
            >
              {pos === 'ALL' ? 'ALL POSITIONS' : pos === 'GK' ? 'GOALKEEPERS' : pos === 'DEF' ? 'DEFENDERS' : pos === 'MID' ? 'MIDFIELDERS' : 'FORWARDS'}
            </button>
          ))}
        </div>
      </div>

      {/* Players List Table (Desktop) / Cards (Mobile) */}
      <div className="bg-[#0C0E14] border border-[#1E222E] overflow-hidden">
        {filteredPlayers.length === 0 ? (
          <div className="p-12 text-center text-[#8E93A3] space-y-2">
            <UserX className="w-8 h-8 text-[#555A6E] mx-auto" />
            <div className="text-white font-heading font-bold text-sm">NO SQUAD MEMBERS FOUND</div>
            <p className="text-xs">No players match your active search and filter parameters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#181B24] text-[10px] text-[#8E93A3] uppercase bg-[#090A0E]">
                  <th className="py-3 px-4">Photo</th>
                  <th className="py-3 px-4">Player</th>
                  <th className="py-3 px-3">Jersey</th>
                  <th className="py-3 px-3">Position</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151822]">
                {filteredPlayers.map((player) => (
                  <tr
                    key={player.id}
                    className={`hover:bg-[#11131B] transition-colors ${
                      !player.is_active ? 'opacity-60 bg-black/30' : ''
                    }`}
                  >
                    {/* Photo */}
                    <td className="py-3 px-4">
                      <div className="w-10 h-10 rounded bg-[#161822] overflow-hidden border border-[#242938]">
                        <img
                          src={player.photo_url || '/ghost-fc-logo.jpg'}
                          alt={player.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/ghost-fc-logo.jpg';
                          }}
                        />
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-heading font-black text-sm text-white flex items-center gap-1.5">
                        <span>{player.name}</span>
                        {player.is_captain && (
                          <span className="px-1.5 py-0.5 bg-[#E50914] text-white text-[9px] font-mono font-bold">
                            C
                          </span>
                        )}
                        {player.is_vice_captain && !player.is_captain && (
                          <span className="px-1.5 py-0.5 bg-zinc-700 text-white text-[9px] font-mono font-bold">
                            VC
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#7E8496] font-mono block">
                        {player.age} yrs · {player.height} · {player.preferred_foot} foot
                      </span>
                    </td>

                    {/* Jersey */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-heading font-black text-base text-[#E50914]">
                        #{player.jersey_number}
                      </span>
                    </td>

                    {/* Position */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-[#141722] border border-[#222738] text-[10px] text-white font-bold">
                        {player.position}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="text-white block font-bold text-xs">{player.position_detail}</span>
                      <span className="text-[10px] text-[#8E93A3]">{player.role}</span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleActive(player)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded transition-colors ${
                          player.is_active
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/60'
                            : 'bg-zinc-900 text-zinc-500 border border-zinc-700 hover:bg-zinc-800'
                        }`}
                        title="Click to toggle status"
                      >
                        {player.is_active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                        <span>{player.is_active ? 'ACTIVE' : 'INACTIVE'}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleEdit(player)}
                          className="px-2.5 py-1.5 bg-[#141620] hover:bg-[#1E222E] text-white border border-[#262B3A] text-xs font-heading font-bold uppercase transition-colors flex items-center gap-1"
                          title="Edit player profile"
                        >
                          <Edit className="w-3 h-3 text-[#E50914]" />
                          <span>EDIT</span>
                        </button>

                        <button
                          onClick={() => handleToggleActive(player)}
                          className="p-1.5 bg-[#141620] hover:bg-[#1E222E] text-[#8E93A3] hover:text-white border border-[#262B3A] text-xs transition-colors"
                          title={player.is_active ? 'Deactivate player' : 'Activate player'}
                        >
                          {player.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>

                        <button
                          onClick={() => setPlayerToDelete(player)}
                          className="p-1.5 bg-red-950/40 hover:bg-red-950/70 text-red-400 border border-red-900/40 text-xs transition-colors"
                          title="Permanently delete player"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Player Modal */}
      {isEditing && selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className="w-full max-w-3xl bg-[#0D0E12] border border-[#262B3A] p-5 sm:p-7 shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto"
            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#E50914]" />

            <div className="flex items-center justify-between pb-3 border-b border-[#1C202C]">
              <div>
                <span className="text-[10px] font-mono text-[#E50914] font-bold uppercase tracking-wider block">
                  {selectedPlayer.id ? 'UPDATE DOSSIER' : 'REGISTER NEW SQUAD TALENT'}
                </span>
                <h3 className="font-heading text-xl font-black text-white uppercase">
                  {selectedPlayer.id ? `EDIT PLAYER: ${selectedPlayer.name}` : 'ADD SQUAD PLAYER'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedPlayer(null);
                }}
                className="text-[#8E93A3] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePlayer} className="space-y-4">
              {/* Photo & Image Preview Row */}
              <div className="p-3 bg-[#11131A] border border-[#1E222E] flex flex-col sm:flex-row items-center gap-4">
                <div className="w-20 h-20 rounded bg-[#161822] overflow-hidden border border-[#262B3A] shrink-0 relative flex items-center justify-center">
                  {selectedPlayer.photo_url && !imageError ? (
                    <img
                      src={selectedPlayer.photo_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="text-center p-1 text-[#666B7E]">
                      <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-[9px] font-mono uppercase block">No Image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-1">
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase">
                    Player Photo URL
                  </label>
                  <input
                    type="text"
                    value={selectedPlayer.photo_url || ''}
                    onChange={(e) => {
                      setImageError(false);
                      setSelectedPlayer({ ...selectedPlayer, photo_url: e.target.value });
                    }}
                    placeholder="https://... or /ghost_fc_captain_1790354267610.jpg"
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2 outline-none font-mono focus:border-[#E50914]"
                  />
                  <span className="text-[10px] font-mono text-[#666B7E] block">
                    Paste public image URL. Live preview updates immediately.
                  </span>
                </div>
              </div>

              {/* Name & Jersey */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedPlayer.name || ''}
                    onChange={(e) => setSelectedPlayer({ ...selectedPlayer, name: e.target.value })}
                    placeholder="e.g. Rohan Sterling"
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-bold focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                    Jersey No. (1 - 99) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={99}
                    value={selectedPlayer.jersey_number ?? 10}
                    onChange={(e) => setSelectedPlayer({ ...selectedPlayer, jersey_number: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono font-bold focus:border-[#E50914]"
                  />
                </div>
              </div>

              {/* Position & Tactical Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                    Position Code *
                  </label>
                  <select
                    value={selectedPlayer.position_detail || 'Attacking Midfielder'}
                    onChange={(e) => {
                      const selected = TACTICAL_POSITIONS.find((t) => t.code === e.target.value || t.label.includes(e.target.value));
                      if (selected) {
                        setSelectedPlayer({
                          ...selectedPlayer,
                          position: selected.cat as PlayerPosition,
                          position_detail: selected.label.split(' - ')[1] || selected.code
                        });
                      } else {
                        setSelectedPlayer({
                          ...selectedPlayer,
                          position_detail: e.target.value
                        });
                      }
                    }}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono focus:border-[#E50914]"
                  >
                    {TACTICAL_POSITIONS.map((tp) => (
                      <option key={tp.code} value={tp.label.split(' - ')[1]}>
                        {tp.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                    Category (GK/DEF/MID/FWD)
                  </label>
                  <select
                    value={selectedPlayer.position || 'MID'}
                    onChange={(e) => setSelectedPlayer({ ...selectedPlayer, position: e.target.value as PlayerPosition })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono focus:border-[#E50914]"
                  >
                    <option value="GK">Goalkeeper (GK)</option>
                    <option value="DEF">Defender (DEF)</option>
                    <option value="MID">Midfielder (MID)</option>
                    <option value="FWD">Forward (FWD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                    Squad Role Label
                  </label>
                  <input
                    type="text"
                    value={selectedPlayer.role || 'First Team'}
                    onChange={(e) => setSelectedPlayer({ ...selectedPlayer, role: e.target.value })}
                    placeholder="e.g. Club Captain, First Team, Playmaker"
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              {/* Physical Attributes & Status */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">Age</label>
                  <input
                    type="number"
                    value={selectedPlayer.age ?? 22}
                    onChange={(e) => setSelectedPlayer({ ...selectedPlayer, age: parseInt(e.target.value) || 20 })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2 outline-none font-mono focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">Height</label>
                  <input
                    type="text"
                    value={selectedPlayer.height || '185 cm'}
                    onChange={(e) => setSelectedPlayer({ ...selectedPlayer, height: e.target.value })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2 outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">Foot</label>
                  <select
                    value={selectedPlayer.preferred_foot || 'Right'}
                    onChange={(e) => setSelectedPlayer({ ...selectedPlayer, preferred_foot: e.target.value as any })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2 outline-none font-mono focus:border-[#E50914]"
                  >
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">Squad Status</label>
                  <select
                    value={selectedPlayer.is_active ? 'true' : 'false'}
                    onChange={(e) => setSelectedPlayer({ ...selectedPlayer, is_active: e.target.value === 'true' })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2 outline-none font-mono focus:border-[#E50914]"
                  >
                    <option value="true">Active Squad</option>
                    <option value="false">Inactive / Left Team</option>
                  </select>
                </div>
              </div>

              {/* Bio & Playing style */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    value={selectedPlayer.short_description || ''}
                    onChange={(e) => setSelectedPlayer({ ...selectedPlayer, short_description: e.target.value })}
                    placeholder="Brief squad summary..."
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs p-2.5 outline-none focus:border-[#E50914]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                    Tactical Playing Style
                  </label>
                  <textarea
                    rows={2}
                    value={selectedPlayer.playing_style || ''}
                    onChange={(e) => setSelectedPlayer({ ...selectedPlayer, playing_style: e.target.value })}
                    placeholder="e.g. Creative attacking midfielder with strong passing, vision and ball control."
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs p-2.5 outline-none focus:border-[#E50914]"
                  />
                </div>
              </div>

              {/* Player Skills (0 - 100) with Sliders & Live Visual Bars */}
              <div className="p-4 bg-[#101217] border border-[#202432] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-black text-white uppercase tracking-wider">
                    ATHLETIC PERFORMANCE SKILLS (0 - 100)
                  </span>
                  <span className="text-[10px] font-mono text-[#E50914]">
                    LIVE VISUAL BARS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {(['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'] as const).map((attr) => {
                    const val = selectedPlayer.skills?.[attr] ?? 75;
                    return (
                      <div key={attr} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="uppercase text-[#8E93A3] font-bold">{attr}</span>
                          <span className="text-white font-bold">{val} / 100</span>
                        </div>

                        {/* Visual Bar */}
                        <div className="h-2 w-full bg-[#161822] overflow-hidden border border-white/5">
                          <div
                            className={`h-full transition-all duration-300 ${
                              val >= 80 ? 'bg-[#E50914]' : val >= 65 ? 'bg-amber-500' : 'bg-zinc-500'
                            }`}
                            style={{ width: `${val}%` }}
                          />
                        </div>

                        {/* Slider */}
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={val}
                          onChange={(e) => {
                            const newNum = parseInt(e.target.value);
                            setSelectedPlayer({
                              ...selectedPlayer,
                              skills: {
                                ...(selectedPlayer.skills || { pace: 70, shooting: 70, passing: 70, dribbling: 70, defending: 70, physical: 70 }),
                                [attr]: newNum
                              }
                            });
                          }}
                          className="w-full accent-[#E50914] cursor-pointer h-1"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Social Channels Preview */}
              <div className="p-3 bg-[#101217] border border-[#202432] space-y-2">
                <span className="text-[11px] font-mono text-[#8E93A3] uppercase block font-bold">
                  Player Social Links (Optional)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <input
                    type="url"
                    placeholder="Instagram URL"
                    value={selectedPlayer.socials?.instagram || ''}
                    onChange={(e) => setSelectedPlayer({
                      ...selectedPlayer,
                      socials: { ...(selectedPlayer.socials || {}), instagram: e.target.value }
                    })}
                    className="bg-[#161822] border border-[#262B3A] text-white px-2.5 py-1.5 outline-none font-mono text-[11px]"
                  />
                  <input
                    type="url"
                    placeholder="YouTube URL"
                    value={selectedPlayer.socials?.youtube || ''}
                    onChange={(e) => setSelectedPlayer({
                      ...selectedPlayer,
                      socials: { ...(selectedPlayer.socials || {}), youtube: e.target.value }
                    })}
                    className="bg-[#161822] border border-[#262B3A] text-white px-2.5 py-1.5 outline-none font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-[#1E222E] flex items-center justify-end gap-3 sticky bottom-0 bg-[#0D0E12] py-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedPlayer(null);
                  }}
                  className="px-4 py-2.5 bg-[#141620] hover:bg-[#1E222E] text-xs font-heading font-black text-[#8E93A3] hover:text-white uppercase transition-colors"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E50914] hover:bg-[#FF1A24] text-xs font-heading font-black text-white uppercase tracking-wider transition-colors shadow"
                >
                  SAVE ATHLETE PROFILE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Player Deletion */}
      <ConfirmModal
        isOpen={Boolean(playerToDelete)}
        title="PERMANENTLY REMOVE SQUAD PLAYER?"
        message={`Are you sure you want to delete ${playerToDelete?.name} (#${playerToDelete?.jersey_number})? All related skill ratings, video archives, and lineup references will be safely purged.`}
        confirmLabel="REMOVE PLAYER"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPlayerToDelete(null)}
        loading={deleteLoading}
      />
    </div>
  );
};
