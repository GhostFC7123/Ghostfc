import React, { useState, useEffect, useMemo } from 'react';
import { clubService } from '../services/clubService';
import { Player, PlayerPosition } from '../types';
import { PlayerCard } from '../components/players/PlayerCard';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Search, Filter, Shield, Users, Trophy } from 'lucide-react';

export const SquadPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | PlayerPosition>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const data = await clubService.getPlayers();
        setPlayers(data);
      } catch (err) {
        console.error('Error fetching squad:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
    window.scrollTo(0, 0);
  }, []);

  const filterTabs: Array<{ id: 'ALL' | PlayerPosition; label: string; count?: number }> = [
    { id: 'ALL', label: 'ALL SQUAD' },
    { id: 'GK', label: 'GOALKEEPERS' },
    { id: 'DEF', label: 'DEFENDERS' },
    { id: 'MID', label: 'MIDFIELDERS' },
    { id: 'FWD', label: 'FORWARDS' },
  ];

  const filteredPlayers = useMemo(() => {
    return players.filter((player) => {
      const matchesPosition = activeFilter === 'ALL' || player.position === activeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        player.name.toLowerCase().includes(q) ||
        player.jersey_number.toString() === q ||
        player.position_detail.toLowerCase().includes(q);
      return matchesPosition && matchesSearch;
    });
  }, [players, activeFilter, searchQuery]);

  const positions: Array<{ key: PlayerPosition; title: string; desc: string }> = [
    { key: 'GK', title: 'GOALKEEPERS', desc: 'Commanding aerial presence & reflex shot-stopping' },
    { key: 'DEF', title: 'DEFENDERS', desc: 'Physical authority, aggressive pressing & tactical backlines' },
    { key: 'MID', title: 'MIDFIELDERS', desc: 'Engine room architects, high-speed transitions & vision' },
    { key: 'FWD', title: 'FORWARDS', desc: 'Clinical finishers, lethal wingers & pressing forwards' },
  ];

  if (loading) {
    return <LoadingState message="Loading GHOST FC 25-Man Roster..." className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-[#050507] text-[#F0F1F5] pt-24 pb-24">
      {/* Squad Header Banner */}
      <section className="relative py-14 sm:py-20 bg-[#08090C] border-b border-[#181B24] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E50914]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-carbon-mesh opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#E50914] uppercase tracking-widest font-bold">
                <Users className="w-4 h-4" />
                OFFICIAL SQUAD DIRECTORY 2026/27
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-wide">
                FIRST TEAM SQUAD
              </h1>
              <p className="text-xs sm:text-sm text-[#8E93A3] max-w-xl">
                Explore individual player profiles, match performance statistics, athletic skill ratings, and official video moments for every member of GHOST FC.
              </p>
            </div>

            {/* Total active squad badge */}
            <div className="bg-[#0C0E14] border border-[#202432] px-6 py-4 rounded-none flex items-center gap-5 self-start md:self-auto card-rim shadow-xl">
              <span className="font-teko text-5xl font-black text-[#E50914] leading-none">
                {players.length}
              </span>
              <div className="text-left">
                <span className="font-heading text-xs font-black text-white block uppercase tracking-wider">
                  REGISTERED ATHLETES
                </span>
                <span className="text-[10px] font-mono text-[#8E93A3]">FIRST TEAM ROSTER</span>
              </div>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="mt-10 pt-6 border-t border-[#181B24] flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 sm:pb-0">
              {filterTabs.map((tab) => {
                const isActive = activeFilter === tab.id;
                const count = tab.id === 'ALL' ? players.length : players.filter(p => p.position === tab.id).length;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`px-4 py-2 font-heading font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 shrink-0 ${
                      isActive
                        ? 'bg-[#E50914] text-white shadow-[0_0_15px_rgba(229,9,20,0.4)] clip-skew-btn'
                        : 'bg-[#101217] text-[#8E93A3] hover:text-white hover:bg-[#181B24] border border-[#202432]'
                    }`}
                  >
                    <span className={isActive ? 'clip-skew-content inline-flex items-center gap-1.5' : 'inline-flex items-center gap-1.5'}>
                      <span>{tab.label}</span>
                      <span className={`text-[10px] font-mono ${isActive ? 'text-white/80' : 'text-[#585D6E]'}`}>
                        ({count})
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#585D6E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, #number or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#101217] border border-[#222634] focus:border-[#E50914] text-white text-xs pl-10 pr-8 py-2.5 outline-none transition-colors placeholder:text-[#585D6E]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#585D6E] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Squad Grid Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        {filteredPlayers.length === 0 ? (
          <EmptyState
            title="No Players Found"
            description={`No players matched your criteria "${searchQuery}". Try adjusting your filter or search query.`}
            actionLabel="Reset Squad Filters"
            onAction={() => {
              setActiveFilter('ALL');
              setSearchQuery('');
            }}
          />
        ) : activeFilter === 'ALL' && !searchQuery ? (
          // Grouped by Position when ALL is selected
          <div className="space-y-16 sm:space-y-20">
            {positions.map((pos) => {
              const posPlayers = players.filter((p) => p.position === pos.key);
              if (posPlayers.length === 0) return null;

              return (
                <div key={pos.key} className="space-y-6">
                  {/* Position Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-3.5 border-b border-[#1C202C] gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-2 h-5 bg-[#E50914]" />
                      <h2 className="font-heading text-2xl sm:text-3xl font-black text-white tracking-wider">
                        {pos.title}
                      </h2>
                    </div>
                    <span className="text-xs font-mono text-[#8E93A3]">
                      {posPlayers.length} {posPlayers.length === 1 ? 'ATHLETE' : 'ATHLETES'} · {pos.desc}
                    </span>
                  </div>

                  {/* Player Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
                    {posPlayers.map((player) => (
                      <PlayerCard key={player.id} player={player} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Filtered Grid
          <div>
            <div className="text-xs font-mono text-[#8E93A3] mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50914]" />
              <span>SHOWING {filteredPlayers.length} {filteredPlayers.length === 1 ? 'RESULT' : 'RESULTS'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
              {filteredPlayers.map((player) => (
                <PlayerCard key={player.id} player={player} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
