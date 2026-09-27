import React, { useState } from 'react';
import { Player } from '../../types';
import { clubService } from '../../services/clubService';
import { Crown, Shield, Check, AlertCircle } from 'lucide-react';

interface AdminCaptainTabProps {
  players: Player[];
  onRefresh: () => void;
}

export const AdminCaptainTab: React.FC<AdminCaptainTabProps> = ({ players, onRefresh }) => {
  const activePlayers = players.filter((p) => p.is_active);

  const currentCaptain = players.find((p) => p.is_captain);
  const currentVice = players.find((p) => p.is_vice_captain && !p.is_captain);

  const [selectedCaptain, setSelectedCaptain] = useState<string>(currentCaptain?.id || '');
  const [selectedVice, setSelectedVice] = useState<string>(currentVice?.id || '');
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSaveLeadership = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (selectedCaptain && selectedVice && selectedCaptain === selectedVice) {
      setMessage({
        text: 'Violation: A single player cannot serve as both Club Captain and Vice Captain simultaneously.',
        error: true
      });
      return;
    }

    setSaving(true);
    try {
      await clubService.setCaptain(selectedCaptain, selectedVice);
      setMessage({ text: 'Official on-pitch leadership updated successfully.' });
      onRefresh();
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to update leadership', error: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="pb-4 border-b border-[#1E1E1E]">
        <span className="text-[11px] font-mono text-[#E50914] font-bold uppercase tracking-widest block mb-1">
          ON-PITCH AUTHORITY
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
          CAPTAIN & VICE CAPTAIN SELECTION
        </h2>
        <p className="text-xs text-[#888888] mt-1">
          Designate the official team leaders who wear the armband and lead GHOST FC out of the tunnel.
        </p>
      </div>

      {message && (
        <div
          className={`p-3.5 border flex items-center gap-2.5 text-xs font-heading font-bold uppercase tracking-wider ${
            message.error
              ? 'bg-red-950/40 border-[#E50914] text-red-200'
              : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
          }`}
        >
          {message.error ? <AlertCircle className="w-4 h-4 text-[#E50914]" /> : <Check className="w-4 h-4 text-emerald-400" />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSaveLeadership} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Captain Selector Card */}
          <div className="bg-[#0E0E0E] border border-[#222222] p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1C1C1C]">
              <div className="w-8 h-8 rounded bg-[#E50914] flex items-center justify-center text-white">
                <Crown className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white uppercase">
                  CLUB CAPTAIN
                </h3>
                <span className="text-[10px] font-mono text-[#888888]">Primary On-Pitch Leader</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#AAAAAA] uppercase mb-2">
                Select Active Player
              </label>
              <select
                value={selectedCaptain}
                onChange={(e) => setSelectedCaptain(e.target.value)}
                className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#E50914] text-white text-xs px-3 py-2.5 outline-none font-mono"
              >
                <option value="">-- No Captain Selected --</option>
                {activePlayers.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === selectedVice}>
                    #{p.jersey_number} {p.name} ({p.position_detail}) {p.id === selectedVice ? '(Vice Captain)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview of chosen captain */}
            {selectedCaptain && (
              <div className="p-3 bg-[#121212] border border-[#1F1F1F] flex items-center gap-3">
                {(() => {
                  const p = players.find((x) => x.id === selectedCaptain);
                  if (!p) return null;
                  return (
                    <>
                      <div className="w-12 h-12 rounded bg-[#1A1A1A] overflow-hidden border border-[#E50914]">
                        <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-heading font-bold text-sm text-white">
                          #{p.jersey_number} {p.name}
                        </div>
                        <div className="text-[11px] font-mono text-[#888888]">{p.position_detail} · Age {p.age}</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Vice Captain Selector Card */}
          <div className="bg-[#0E0E0E] border border-[#222222] p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1C1C1C]">
              <div className="w-8 h-8 rounded bg-[#1C1C1C] border border-[#333333] flex items-center justify-center text-[#E50914]">
                <Shield className="w-4 h-4 text-[#E50914]" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-white uppercase">
                  VICE CAPTAIN
                </h3>
                <span className="text-[10px] font-mono text-[#888888]">Secondary Armband Deputy</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#AAAAAA] uppercase mb-2">
                Select Active Player
              </label>
              <select
                value={selectedVice}
                onChange={(e) => setSelectedVice(e.target.value)}
                className="w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#E50914] text-white text-xs px-3 py-2.5 outline-none font-mono"
              >
                <option value="">-- No Vice Captain Selected --</option>
                {activePlayers.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === selectedCaptain}>
                    #{p.jersey_number} {p.name} ({p.position_detail}) {p.id === selectedCaptain ? '(Captain)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview of chosen vice captain */}
            {selectedVice && (
              <div className="p-3 bg-[#121212] border border-[#1F1F1F] flex items-center gap-3">
                {(() => {
                  const p = players.find((x) => x.id === selectedVice);
                  if (!p) return null;
                  return (
                    <>
                      <div className="w-12 h-12 rounded bg-[#1A1A1A] overflow-hidden border border-[#333333]">
                        <img src={p.photo_url} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-heading font-bold text-sm text-white">
                          #{p.jersey_number} {p.name}
                        </div>
                        <div className="text-[11px] font-mono text-[#888888]">{p.position_detail} · Age {p.age}</div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-[#E50914] hover:bg-[#FF1A1A] disabled:opacity-50 text-white font-heading font-bold text-xs tracking-wider uppercase transition-colors shadow"
        >
          {saving ? 'UPDATING LEADERSHIP...' : 'CONFIRM CLUB LEADERSHIP'}
        </button>
      </form>
    </div>
  );
};
