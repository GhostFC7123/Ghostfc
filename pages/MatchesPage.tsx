import React, { useState, useEffect, useMemo } from 'react';
import { clubService } from '../services/clubService';
import { Match, MatchStatus } from '../types';
import { MatchCard } from '../components/matches/MatchCard';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Calendar, Trophy, MapPin, CheckCircle, Clock, Shield } from 'lucide-react';

export const MatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | MatchStatus>('ALL');

  useEffect(() => {
    async function loadMatches() {
      try {
        const data = await clubService.getMatches();
        setMatches(data);
      } catch (err) {
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
    window.scrollTo(0, 0);
  }, []);

  const filteredMatches = useMemo(() => {
    if (filter === 'ALL') return matches;
    return matches.filter((m) => m.status === filter);
  }, [matches, filter]);

  const upcomingMatches = matches.filter((m) => m.status === 'Upcoming');
  const nextFeaturedMatch = upcomingMatches[0];
  const completedMatches = matches.filter((m) => m.status === 'Completed');

  if (loading) {
    return <LoadingState message="Loading Match Center Fixtures..." className="min-h-screen" />;
  }

  return (
    <div className="min-h-screen bg-[#050507] text-[#F0F1F5] pt-24 pb-28">
      {/* Header Banner */}
      <section className="relative py-14 sm:py-20 bg-[#08090C] border-b border-[#181B24] overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E50914]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-carbon-mesh opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#E50914] uppercase tracking-widest font-bold">
                <Calendar className="w-4 h-4" />
                CAMPAIGN 2026/27 FIXTURE SCHEDULE
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-wide">
                MATCH CENTER
              </h1>
              <p className="text-xs sm:text-sm text-[#8E93A3] max-w-xl">
                Stay updated with every GHOST FC fixture across the Premier Champions Cup, Elite Super League, and National Cup.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-[#0C0E14] p-1.5 border border-[#202432] card-rim self-start md:self-auto overflow-x-auto">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 font-heading font-black text-xs sm:text-sm tracking-wider uppercase transition-colors shrink-0 ${
                  filter === 'ALL'
                    ? 'bg-[#E50914] text-white shadow'
                    : 'text-[#8E93A3] hover:text-white'
                }`}
              >
                ALL FIXTURES ({matches.length})
              </button>
              <button
                onClick={() => setFilter('Upcoming')}
                className={`px-4 py-2 font-heading font-black text-xs sm:text-sm tracking-wider uppercase transition-colors shrink-0 ${
                  filter === 'Upcoming'
                    ? 'bg-[#E50914] text-white shadow'
                    : 'text-[#8E93A3] hover:text-white'
                }`}
              >
                UPCOMING ({upcomingMatches.length})
              </button>
              <button
                onClick={() => setFilter('Completed')}
                className={`px-4 py-2 font-heading font-black text-xs sm:text-sm tracking-wider uppercase transition-colors shrink-0 ${
                  filter === 'Completed'
                    ? 'bg-[#E50914] text-white shadow'
                    : 'text-[#8E93A3] hover:text-white'
                }`}
              >
                RESULTS ({completedMatches.length})
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Next Match Showcase Banner */}
      {(filter === 'ALL' || filter === 'Upcoming') && nextFeaturedMatch && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
          <div className="mb-4 flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-[#E50914]" />
            <span className="font-heading font-black text-sm tracking-wider text-white uppercase">
              NEXT OFFICIAL FIXTURE
            </span>
          </div>
          <MatchCard match={nextFeaturedMatch} featured={true} />
        </section>
      )}

      {/* Matches Grid List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">
        <div className="pb-4 border-b border-[#1C202C] mb-8 flex items-center justify-between">
          <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-wider text-white uppercase">
            {filter === 'ALL'
              ? 'ALL SCHEDULED FIXTURES & RESULTS'
              : filter === 'Upcoming'
              ? 'UPCOMING MATCHES'
              : 'COMPLETED RESULTS'}
          </h2>
          <span className="text-xs font-mono text-[#8E93A3]">
            {filteredMatches.length} FIXTURES RECORDED
          </span>
        </div>

        {filteredMatches.length === 0 ? (
          <EmptyState
            title="No Matches Found"
            description="There are currently no matches recorded under this status filter."
            actionLabel="View All Fixtures"
            onAction={() => setFilter('ALL')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredMatches.map((match) => (
              <MatchCard key={match.id} match={match} featured={false} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
