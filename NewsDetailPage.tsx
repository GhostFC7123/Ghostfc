import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { clubService } from '../services/clubService';
import { NewsArticle } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import { EmptyState } from '../components/common/EmptyState';
import { Calendar, User, ArrowLeft, Share2, Tag, Shield, Clock } from 'lucide-react';

export const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadArticle() {
      if (!id) return;
      try {
        const found = await clubService.getNewsById(id);
        setArticle(found);
      } catch (err) {
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return <LoadingState message="Retrieving Official Report..." className="min-h-screen" />;
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#050507] text-[#F0F1F5] pt-32 px-4">
        <div className="max-w-xl mx-auto">
          <EmptyState
            title="Article Not Found"
            description="The requested news article does not exist or has been unpublished."
            actionLabel="Return to Newsroom"
            onAction={() => navigate('/news')}
          />
        </div>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#F0F1F5] pt-24 pb-28">
      {/* Top back & share bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between border-b border-[#181B24] pb-4">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-xs font-heading font-black tracking-wider text-[#8E93A3] hover:text-[#E50914] uppercase transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO ALL DISPATCHES
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[#8E93A3] hover:text-white bg-[#101217] border border-[#232735] hover:border-[#E50914] px-3.5 py-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-[#E50914]" />
            <span>{copied ? 'LINK COPIED' : 'SHARE DISPATCH'}</span>
          </button>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
        {/* Category & Date Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono mb-4">
          <span className="bg-[#E50914] text-white px-2.5 py-0.5 text-[10px] font-heading font-black uppercase tracking-wider clip-skew-btn shadow">
            <span className="clip-skew-content inline-block">{article.category}</span>
          </span>
          <span className="text-[#3A3F50]" aria-hidden="true">•</span>
          <div className="flex items-center gap-1.5 text-white">
            <Calendar className="w-3.5 h-3.5 text-[#E50914]" />
            <span>{article.published_date}</span>
          </div>
          <span className="text-[#3A3F50]" aria-hidden="true">•</span>
          <span className="text-[#8E93A3]">By {article.author}</span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide leading-tight mb-6">
          {article.title}
        </h1>

        {/* Lead Excerpt */}
        {article.short_description && (
          <div className="text-base sm:text-lg text-[#C5C9D6] font-normal leading-relaxed mb-8 border-l-4 border-[#E50914] pl-4 py-2 italic bg-[#0C0E14] card-rim">
            {article.short_description}
          </div>
        )}

        {/* Hero Cover Image */}
        <div className="relative aspect-[16/9] w-full bg-[#101217] border border-[#202432] overflow-hidden mb-10 shadow-2xl card-rim">
          <img
            src={article.image_url || '/stadium_atmosphere_1790354254462.jpg'}
            alt={article.title}
            className="w-full h-full object-cover filter contrast-110"
          />
        </div>

        {/* Article Body Content */}
        <div className="text-sm sm:text-base text-[#9A9EB0] leading-relaxed space-y-6">
          {article.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Footer info box */}
        <div className="mt-14 pt-8 border-t border-[#181B24] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0C0E14] p-6 border border-[#202432] card-rim">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#12141C] border border-[#E50914] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[#E50914]" />
            </div>
            <div>
              <span className="text-xs font-heading font-black text-white uppercase block">
                GHOST FC COMMUNICATIONS BUREAU
              </span>
              <span className="text-[11px] font-mono text-[#8E93A3]">
                Official Club Editorial & Press Desk · London / Global
              </span>
            </div>
          </div>

          <Link
            to="/news"
            className="px-4 py-2 bg-[#141720] hover:bg-[#E50914] text-white text-xs font-heading font-black tracking-wider uppercase transition-colors shrink-0"
          >
            More Club Dispatches →
          </Link>
        </div>
      </article>
    </div>
  );
};
