import React, { useState } from 'react';
import { Match, MatchStatus } from '../../types';
import { clubService } from '../../services/clubService';
import { Plus, Edit, Trash2, Calendar, MapPin, Trophy, Clock, X, Check, Shield } from 'lucide-react';
import { ConfirmModal } from '../../components/common/ConfirmModal';

interface AdminMatchesTabProps {
  matches: Match[];
  onRefresh: () => void;
}

export const AdminMatchesTab: React.FC<AdminMatchesTabProps> = ({ matches, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Partial<Match> | null>(null);
  const [notification, setNotification] = useState<{ text: string; error?: boolean } | null>(null);

  const showNotification = (text: string, error = false) => {
    setNotification({ text, error });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateNew = () => {
    setSelectedMatch({
      opponent: '',
      opponent_logo_url: '',
      date: new Date().toISOString().split('T')[0],
      time: '20:00',
      venue: 'The Crypt Arena',
      competition: 'Premier Champions Cup',
      round_info: 'Group Stage',
      is_home: true,
      ghost_score: null,
      opponent_score: null,
      status: 'Upcoming'
    });
    setIsEditing(true);
  };

  const handleEdit = (match: Match) => {
    setSelectedMatch(JSON.parse(JSON.stringify(match)));
    setIsEditing(true);
  };

  const [matchToDelete, setMatchToDelete] = useState<Match | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (!matchToDelete) return;
    setDeleteLoading(true);
    try {
      await clubService.deleteMatch(matchToDelete.id);
      showNotification(`Match against ${matchToDelete.opponent} removed.`);
      setMatchToDelete(null);
      onRefresh();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete match', true);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSaveMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatch || !selectedMatch.opponent?.trim()) {
      showNotification('Opponent name is required.', true);
      return;
    }

    try {
      await clubService.saveMatch(selectedMatch);
      showNotification('Match details updated.');
      setIsEditing(false);
      setSelectedMatch(null);
      onRefresh();
    } catch (err: any) {
      showNotification(err.message || 'Failed to save match', true);
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
            CAMPAIGN FIXTURE CALENDAR
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
            MATCH MANAGEMENT
          </h2>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E50914] hover:bg-[#FF1A24] text-white font-heading font-black text-sm tracking-wider uppercase transition-colors self-start sm:self-auto min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>SCHEDULE NEW MATCH</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. MOBILE RESPONSIVE MATCH CARDS (< 768px)                                */}
      {/* ========================================================================= */}
      <div className="block md:hidden space-y-3">
        {matches.map((match) => (
          <div key={match.id} className="bg-[#0C0E14] border border-[#1E222E] p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#181B24] text-xs">
              <span className="font-heading font-black text-white uppercase">{match.competition}</span>
              <span
                className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded ${
                  match.status === 'Upcoming'
                    ? 'bg-blue-950/40 text-blue-400 border border-blue-800/40'
                    : match.status === 'Completed'
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                    : 'bg-yellow-950/40 text-yellow-400 border border-yellow-800/40'
                }`}
              >
                {match.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded bg-[#141620] border border-[#262B3A] flex items-center justify-center overflow-hidden shrink-0">
                  {match.opponent_logo_url ? (
                    <img src={match.opponent_logo_url} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <span className="font-mono text-[9px] text-[#8E93A3] font-bold">OPP</span>
                  )}
                </div>
                <div>
                  <h4 className="font-heading font-black text-base text-white">{match.opponent}</h4>
                  <span className="text-[10px] font-mono text-[#8E93A3]">{match.is_home ? 'HOME FIXTURE' : 'AWAY FIXTURE'}</span>
                </div>
              </div>

              <div className="text-right">
                {match.status === 'Completed' ? (
                  <span className="font-teko text-2xl font-black text-[#E50914]">
                    {match.ghost_score ?? 0} - {match.opponent_score ?? 0}
                  </span>
                ) : (
                  <span className="text-xs font-mono text-[#585D6E] font-bold">UPCOMING</span>
                )}
              </div>
            </div>

            <div className="text-[11px] font-mono text-[#8E93A3] flex items-center justify-between">
              <span>{match.date} · {match.time}</span>
              <span className="truncate max-w-[150px]">{match.venue}</span>
            </div>

            <div className="pt-2 border-t border-[#181B24] flex items-center justify-end gap-2">
              <button
                onClick={() => handleEdit(match)}
                className="px-3 py-1.5 bg-[#141620] hover:bg-[#1E222E] border border-[#262B3A] text-xs font-mono text-white min-h-[38px] flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5 text-[#E50914]" />
                <span>EDIT</span>
              </button>

              <button
                onClick={() => setMatchToDelete(match)}
                className="p-2 bg-[#141620] hover:bg-red-950/60 border border-[#262B3A] text-[#8E93A3] hover:text-red-400 min-h-[38px] min-w-[38px] flex items-center justify-center"
                title="Delete Match"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 2. DESKTOP MATCHES TABLE (>= 768px)                                       */}
      {/* ========================================================================= */}
      <div className="hidden md:block bg-[#0C0E14] border border-[#1E222E] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#101217] border-b border-[#1E222E] font-heading font-black text-[#8E93A3] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">DATE / TIME</th>
              <th className="py-3 px-4">COMPETITION</th>
              <th className="py-3 px-4">OPPONENT</th>
              <th className="py-3 px-4">VENUE</th>
              <th className="py-3 px-4 text-center">SCORE</th>
              <th className="py-3 px-4">STATUS</th>
              <th className="py-3 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#181B24]">
            {matches.map((match) => (
              <tr key={match.id} className="hover:bg-[#101217] transition-colors">
                <td className="py-3.5 px-4 font-mono text-white">
                  <div>{match.date}</div>
                  <div className="text-[10px] text-[#8E93A3]">{match.time}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-heading font-black text-white uppercase">{match.competition}</div>
                  <div className="text-[10px] font-mono text-[#8E93A3]">{match.round_info || 'Fixture'}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-[#141620] border border-[#262B3A] flex items-center justify-center overflow-hidden">
                      {match.opponent_logo_url ? (
                        <img src={match.opponent_logo_url} alt="" className="w-full h-full object-contain" />
                      ) : (
                        <span className="font-mono text-[9px] text-[#8E93A3]">OPP</span>
                      )}
                    </div>
                    <div>
                      <span className="font-heading font-black text-sm text-white block">
                        {match.opponent}
                      </span>
                      <span className="text-[10px] font-mono text-[#8E93A3]">
                        {match.is_home ? 'HOME' : 'AWAY'}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-[#C5C9D6] max-w-[150px] truncate">
                  {match.venue}
                </td>
                <td className="py-3.5 px-4 text-center font-teko text-xl font-bold">
                  {match.status === 'Completed' ? (
                    <span className="text-[#E50914]">
                      {match.ghost_score ?? 0} - {match.opponent_score ?? 0}
                    </span>
                  ) : (
                    <span className="text-[#585D6E] text-sm font-mono">- vs -</span>
                  )}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded ${
                      match.status === 'Upcoming'
                        ? 'bg-blue-950/40 text-blue-400 border border-blue-800/40'
                        : match.status === 'Completed'
                        ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                        : 'bg-yellow-950/40 text-yellow-400 border border-yellow-800/40'
                    }`}
                  >
                    {match.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(match)}
                      className="p-1.5 bg-[#141620] hover:bg-[#1E222E] border border-[#262B3A] text-white hover:text-[#E50914] transition-colors"
                      title="Edit Match"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setMatchToDelete(match)}
                      className="p-1.5 bg-[#141620] hover:bg-red-950/60 border border-[#262B3A] text-[#8E93A3] hover:text-red-400 transition-colors"
                      title="Delete Match"
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

      {/* Edit / Create Match Modal */}
      {isEditing && selectedMatch && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#0C0E14] border border-[#242938] w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl rounded-t-lg sm:rounded-none overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#1E222E] flex items-center justify-between bg-[#0E1016] shrink-0">
              <div>
                <span className="text-[10px] font-mono text-[#E50914] font-bold uppercase tracking-widest">
                  FIXTURE PROTOCOL
                </span>
                <h3 className="font-heading text-xl sm:text-2xl font-black text-white">
                  {selectedMatch.id ? `EDIT MATCH VS ${selectedMatch.opponent}` : 'SCHEDULE NEW MATCH'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setSelectedMatch(null);
                }}
                className="p-2 text-[#8E93A3] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMatch} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                    Opponent Club Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={selectedMatch.opponent || ''}
                    onChange={(e) => setSelectedMatch({ ...selectedMatch, opponent: e.target.value })}
                    className="w-full bg-[#12141C] border border-[#242938] focus:border-[#E50914] text-white text-xs px-3 py-2.5 outline-none font-bold"
                    placeholder="e.g. Valkyrie United"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                    Opponent Logo URL
                  </label>
                  <input
                    type="text"
                    value={selectedMatch.opponent_logo_url || ''}
                    onChange={(e) => setSelectedMatch({ ...selectedMatch, opponent_logo_url: e.target.value })}
                    className="w-full bg-[#12141C] border border-[#242938] focus:border-[#E50914] text-white text-xs px-3 py-2.5 outline-none font-mono"
                    placeholder="https://... logo image"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                    Competition Tournament
                  </label>
                  <input
                    type="text"
                    value={selectedMatch.competition || ''}
                    onChange={(e) => setSelectedMatch({ ...selectedMatch, competition: e.target.value })}
                    className="w-full bg-[#12141C] border border-[#242938] focus:border-[#E50914] text-white text-xs px-3 py-2.5 outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">
                    Stage / Round Details
                  </label>
                  <input
                    type="text"
                    value={selectedMatch.round_info || ''}
                    onChange={(e) => setSelectedMatch({ ...selectedMatch, round_info: e.target.value })}
                    className="w-full bg-[#12141C] border border-[#242938] focus:border-[#E50914] text-white text-xs px-3 py-2.5 outline-none"
                    placeholder="e.g. Semi-Final Leg 1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">Match Date</label>
                  <input
                    type="date"
                    required
                    value={selectedMatch.date || ''}
                    onChange={(e) => setSelectedMatch({ ...selectedMatch, date: e.target.value })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">Kickoff Time</label>
                  <input
                    type="text"
                    required
                    value={selectedMatch.time || ''}
                    onChange={(e) => setSelectedMatch({ ...selectedMatch, time: e.target.value })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-mono"
                    placeholder="20:00"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">Status</label>
                  <select
                    value={selectedMatch.status || 'Upcoming'}
                    onChange={(e) => setSelectedMatch({ ...selectedMatch, status: e.target.value as MatchStatus })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-bold"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">Stadium Venue</label>
                  <input
                    type="text"
                    value={selectedMatch.venue || ''}
                    onChange={(e) => setSelectedMatch({ ...selectedMatch, venue: e.target.value })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none"
                    placeholder="The Crypt Arena"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8E93A3] uppercase mb-1">Home / Away</label>
                  <select
                    value={selectedMatch.is_home ? 'true' : 'false'}
                    onChange={(e) => setSelectedMatch({ ...selectedMatch, is_home: e.target.value === 'true' })}
                    className="w-full bg-[#12141C] border border-[#242938] text-white text-xs px-3 py-2.5 outline-none font-bold"
                  >
                    <option value="true">GHOST FC is HOME</option>
                    <option value="false">GHOST FC is AWAY</option>
                  </select>
                </div>
              </div>

              {/* Scoreline Inputs if Completed */}
              <div className="p-3.5 bg-[#101217] border border-[#202432] space-y-2">
                <span className="text-xs font-heading font-black text-white uppercase block">
                  SCORELINE RESULT (GHOST FC vs OPPONENT)
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-[#8E93A3] mb-1">GHOST FC Score</label>
                    <input
                      type="number"
                      min={0}
                      value={selectedMatch.ghost_score ?? ''}
                      onChange={(e) => setSelectedMatch({
                        ...selectedMatch,
                        ghost_score: e.target.value === '' ? null : parseInt(e.target.value) || 0
                      })}
                      className="w-full bg-[#161822] border border-[#262B3A] text-white text-xs px-3 py-2 font-mono text-center font-bold"
                      placeholder="e.g. 3"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-[#8E93A3] mb-1">Opponent Score</label>
                    <input
                      type="number"
                      min={0}
                      value={selectedMatch.opponent_score ?? ''}
                      onChange={(e) => setSelectedMatch({
                        ...selectedMatch,
                        opponent_score: e.target.value === '' ? null : parseInt(e.target.value) || 0
                      })}
                      className="w-full bg-[#161822] border border-[#262B3A] text-white text-xs px-3 py-2 font-mono text-center font-bold"
                      placeholder="e.g. 1"
                    />
                  </div>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="pt-4 border-t border-[#1E222E] flex items-center justify-end gap-3 sticky bottom-0 bg-[#0C0E14] py-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedMatch(null);
                  }}
                  className="px-4 py-2.5 bg-[#141620] hover:bg-[#1E222E] text-xs font-heading font-black text-[#8E93A3] hover:text-white uppercase transition-colors min-h-[44px]"
                >
                  CANCEL
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#E50914] hover:bg-[#FF1A24] text-xs font-heading font-black text-white uppercase tracking-wider transition-colors shadow min-h-[44px]"
                >
                  SAVE MATCH RECORD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(matchToDelete)}
        title="DELETE SCHEDULED MATCH?"
        message={`Are you sure you want to permanently delete the match against ${matchToDelete?.opponent}? This record will be purged from the fixture schedule.`}
        confirmLabel="DELETE FIXTURE"
        onConfirm={handleConfirmDelete}
        onCancel={() => setMatchToDelete(null)}
        loading={deleteLoading}
      />
    </div>
  );
};
