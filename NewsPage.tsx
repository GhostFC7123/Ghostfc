import React, { useState, useEffect } from 'react';
import { clubService } from '../services/clubService';
import { NewsArticle } from '../types';
import { NewsCard } from '../components/news/NewsCard';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Newspaper, Search } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    async function loadNews() {
      try {
        const data = await clubService.getNews();
        setArticles(data.filter((a) => a.is_published));
      } catch (err) {
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
    window.scrollTo(0, 0);
  }, []);

  const categories = ['ALL', 'MATCH PREVIEW', 'AWARDS', 'TACTICAL FOCUS', 'CLUB NEWS'];

  const filtered = articles.filter((a) => {
    const matchesCat = selectedCategory === 'ALL' || a.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      a.title.toLowerCase().includes(q) ||
      a.short_description.toLowerCase().includes(q) ||
      a.content.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  if (loading) {
    return <LoadingState message="Loading GHOST FC Newsroom..." className="min-h-screen" />;
  }

  const featured = filtered[0];
  const regular = filtered.slice(1);

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
                <Newspaper className="w-4 h-4" />
                OFFICIAL CLUB COMMUNICATIONS & PRESS CENTER
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-wide">
                LATEST NEWS & PRESS
              </h1>
              <p className="text-xs sm:text-sm text-[#8E93A3] max-w-xl">
                Exclusive press briefings, match previews, tactical blueprints, and squad bulletins straight from The Crypt.
              </p>
            </div>

            {/* Category filter tabs */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-heading font-black tracking-wider uppercase transition-all shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-[#E50914] text-white shadow clip-skew-btn'
                      : 'bg-[#101217] text-[#8E93A3] hover:text-white border border-[#202432]'
                  }`}
                >
                  <span className={selectedCategory === cat ? 'clip-skew-content inline-block' : ''}>
                    {cat}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Articles Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16">
        {filtered.length === 0 ? (
          <EmptyState
            title="No Articles Found"
            description="There are currently no published news articles matching your criteria."
            actionLabel="Reset News Filters"
            onAction={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="space-y-12 sm:space-y-16">
            {/* Top Featured Story */}
            {featured && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-3.5 bg-[#E50914]" />
                  <span className="font-heading font-black text-sm tracking-wider text-white uppercase">
                    FEATURED DISPATCH
                  </span>
                </div>
                <NewsCard article={featured} featured={true} />
              </div>
            )}

            {/* Regular Grid */}
            {regular.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-6 pb-3 border-b border-[#1C202C]">
                  <span className="w-1.5 h-3.5 bg-[#E50914]" />
                  <span className="font-heading font-black text-xl tracking-wider text-white uppercase">
                    MORE CLUB DISPATCHES
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                  {regular.map((art) => (
                    <NewsCard key={art.id} article={art} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
