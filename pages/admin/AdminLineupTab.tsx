import React, { useState } from 'react';
import { Player, LineupConfig, FormationType } from '../../types';
import { clubService } from '../../services/clubService';
import { FORMATION_SLOTS, LineupPitch } from '../../components/pitch/LineupPitch';
import { Sliders, Users, Check, AlertCircle, Save } from 'lucide-react';

interface AdminLineupTabProps {
  lineup: LineupConfig | null;
  players: Player[];
  onRefresh: () => void;
}

export const AdminLineupTab: React.FC<AdminLineupTabProps> = ({ lineup, players, onRefresh }) => {
  const activePlayers = players.filter((p) => p.is_active);

  const [formation, setFormation] = useState<FormationType>(lineup?.formation || '4-3-3');
  const [startingXI, setStartingXI] = useState<Record<string, string>>(lineup?.starting_xi || {});
  const [substitutes, setSubstitutes] = useState<string[]>(lineup?.substitutes || []);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  const formationsList: FormationType[] = ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2', '3-4-3'];
  const currentSlots = FORMATION_SLOTS[formation] || FORMATION_SLOTS['4-3-3'];

  // Check which players are already assigned to the XI
  const assignedPlayerIds = new Set(Object.values(startingXI).filter(Boolean));

  const handlePositionChange = (slotId: string, playerId: string) => {
    const updated = { ...startingXI };
    if (!playerId) {
      delete updated[slotId];
    } else {
      for (const key in updated) {
        if (updated[key] === playerId) {
          delete updated[key];
        }
      }
      if (substitutes.includes(playerId)) {
        setSubstitutes(substitutes.filter((id) => id !== playerId));
      }
      updated[slotId] = playerId;
    }
    setStartingXI(updated);
  };

  const handleToggleSub = (playerId: string) => {
    if (substitutes.includes(playerId)) {
      setSubstitutes(substitutes.filter((id) => id !== playerId));
    } else {
      if (substitutes.length >= 9) {
        setMessage({ text: 'Bench capacity limit reached (max 9 substitutes).', error: true });
        return;
      }
      if (assignedPlayerIds.has(playerId)) {
        setMessage({ text: 'Player is already chosen in the Starting XI.', error: true });
        return;
      }
      setSubstitutes([...substitutes, playerId]);
    }
  };

  const handleSaveLineup = async () => {
    setMessage(null);
    setSaving(true);
    try {
      await clubService.saveLineup({
        id: lineup?.id || 'default_lineup',
        formation,
        starting_xi: startingXI,
        substitutes
      });
      setMessage({ text: 'Tactical formation and matchday roster deployed successfully.' });
      onRefresh();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to save lineup', error: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1E1E1E] gap-4">
        <div>
          <span className="text-[11px] font-mono text-[#E50914] font-bold uppercase tracking-widest block mb-1">
            MATCHDAY TACTICAL SETUP
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
            STARTING XI & FORMATION
          </h2>
          <p className="text-xs text-[#8E93A3] mt-1">
            Configure on-pitch tactical positions, structure, and bench reserves.
          </p>
        </div>

        <button
          onClick={handleSaveLineup}
          disabled={saving}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#FF1A24] disabled:opacity-50 text-white font-heading font-black text-xs tracking-wider uppercase transition-colors shadow min-h-[44px]"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'DEPLOYING...' : 'DEPLOY TACTICAL LINEUP'}</span>
        </button>
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

      {/* Formation Selector Bar */}
      <div className="bg-[#0C0E14] border border-[#1E222E] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-[#E50914]" />
          <span className="font-heading font-black text-xs sm:text-sm text-white uppercase">
            CHOOSE TACTICAL SHAPE:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {formationsList.map((f) => (
            <button
              key={f}
              onClick={() => setFormation(f)}
              className={`px-3.5 py-1.5 font-heading font-black text-xs uppercase tracking-wider transition-colors min-h-[36px] ${
                formation === f
                  ? 'bg-[#E50914] text-white shadow'
                  : 'bg-[#12141C] text-[#8E93A3] hover:text-white border border-[#232734]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Pitch & Position Selectors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Pitch Visualizer (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0C0E14] border border-[#1E222E] p-3.5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#181B24]">
            <span className="font-heading font-black text-sm text-white uppercase">
              TACTICAL PITCH ({formation})
            </span>
            <span className="text-[11px] font-mono text-[#8E93A3]">
              {Object.keys(startingXI).filter((k) => startingXI[k]).length} / 11 FILLED
            </span>
          </div>

          <LineupPitch
            formation={formation}
            startingXI={startingXI}
            players={players}
            interactive={false}
          />
        </div>

        {/* Slot-by-Slot Selectors (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0C0E14] border border-[#1E222E] p-4 sm:p-5 space-y-4 max-h-[720px] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 border-b border-[#181B24]">
            <span className="font-heading font-black text-sm text-white uppercase">
              ASSIGN POSITIONS
            </span>
            <span className="text-[10px] font-mono text-[#585D6E]">
              DUPLICATES PREVENTED
            </span>
          </div>

          <div className="space-y-2.5">
            {currentSlots.map((slot) => {
              const currentId = startingXI[slot.slotId] || '';

              return (
                <div key={slot.slotId} className="p-2.5 bg-[#101217] border border-[#202432] flex items-center justify-between gap-2.5">
                  <div className="w-12 shrink-0">
                    <span className="font-mono font-bold text-xs text-[#E50914] block">
                      {slot.slotId}
                    </span>
                    <span className="text-[9px] font-mono text-[#8E93A3] uppercase">
                      {slot.label}
                    </span>
                  </div>

                  <select
                    value={currentId}
                    onChange={(e) => handlePositionChange(slot.slotId, e.target.value)}
                    className="w-full bg-[#141620] border border-[#262B3A] focus:border-[#E50914] text-white text-xs px-2.5 py-2 outline-none font-mono"
                  >
                    <option value="">-- Unassigned --</option>
                    {activePlayers.map((p) => {
                      const isAssignedElsewhere = assignedPlayerIds.has(p.id) && currentId !== p.id;
                      return (
                        <option
                          key={p.id}
                          value={p.id}
                          disabled={isAssignedElsewhere}
                        >
                          #{p.jersey_number} {p.name} ({p.position_detail}) {isAssignedElsewhere ? '(In XI)' : ''}
                        </option>
                      );
                    })}
                  </select>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bench / Substitutes Management */}
      <div className="bg-[#0C0E14] border border-[#1E222E] p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#181B24] gap-2">
          <div>
            <h3 className="font-heading text-lg font-black text-white uppercase flex items-center gap-2">
              <Users className="w-4 h-4 text-[#E50914]" />
              SUBSTITUTE BENCH SELECTION
            </h3>
            <span className="text-xs text-[#8E93A3]">
              Tap a player to add or remove them from the matchday bench (max 9 reserves).
            </span>
          </div>
          <span className="text-xs font-mono text-[#E50914] font-bold">
            {substitutes.length} RESERVES SELECTED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          {activePlayers.map((player) => {
            const isStarting = assignedPlayerIds.has(player.id);
            const isSub = substitutes.includes(player.id);

            return (
              <button
                key={player.id}
                type="button"
                disabled={isStarting}
                onClick={() => handleToggleSub(player.id)}
                className={`p-3 text-left border flex items-center justify-between transition-colors min-h-[48px] ${
                  isStarting
                    ? 'bg-[#0E1015] border-[#1C1F2B] opacity-40 cursor-not-allowed'
                    : isSub
                    ? 'bg-[#151822] border-[#E50914] text-white'
                    : 'bg-[#101217] border-[#202432] text-[#8E93A3] hover:text-white hover:border-[#2D3344]'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[#E50914]">
                      #{player.jersey_number}
                    </span>
                    <span className="font-heading font-black text-sm text-white truncate">
                      {player.name}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#8E93A3] uppercase">
                    {player.position_detail}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {isStarting ? (
                    <span className="text-[9px] font-mono text-[#585D6E]">STARTING</span>
                  ) : isSub ? (
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded font-bold">
                      BENCH
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono text-[#585D6E]">+ ADD</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
