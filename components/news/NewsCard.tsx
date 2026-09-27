import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { NewsArticle } from '../../types';
import { Calendar, User, ArrowRight, Tag, Clock } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, featured = false }) => {
  const [imgError, setImgError] = useState(false);

  if (featured) {
    return (
      <div className="group relative bg-[#0C0E14] border border-[#1E222E] hover:border-[#E50914] transition-all duration-300 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-2xl card-rim transform-gpu hover:-translate-y-1">
        {/* Image Column */}
        <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto w-full overflow-hidden bg-[#141620]">
          {!imgError ? (
            <img
              src={article.image_url || '/stadium_atmosphere_1790354254462.jpg'}
              alt={article.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover filter contrast-110 group-hover:scale-105 transition-all duration-700"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#101217]">
              <img src="/ghost-fc-logo.jpg" alt="Ghost FC" className="w-20 h-20 opacity-20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0C0E14] via-[#0C0E14]/40 to-transparent" />

          {/* Category Tag Top Left */}
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-[#E50914] text-white text-[11px] font-heading font-black tracking-widest px-3 py-1 uppercase clip-skew-btn shadow-lg">
              <span className="clip-skew-content inline-block">{article.category}</span>
            </span>
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#0C0E14]">
          <div className="space-y-3.5">
            <div className="flex items-center gap-2.5 text-xs font-mono text-[#8E93A3]">
              <div className="flex items-center gap-1.5 text-white">
                <Calendar className="w-3.5 h-3.5 text-[#E50914]" />
                <span>{article.published_date}</span>
              </div>
              <span className="text-[#3A3F50]" aria-hidden="true">•</span>
              <span>{article.author}</span>
            </div>

            <Link to={`/news/${article.slug || article.id}`}>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-white group-hover:text-[#E50914] transition-colors line-clamp-3 leading-tight">
                {article.title}
              </h3>
            </Link>

            <p className="text-xs sm:text-sm text-[#8E93A3] line-clamp-4 leading-relaxed">
              {article.short_description}
            </p>
          </div>

          <div className="pt-6 border-t border-[#181B24]">
            <Link
              to={`/news/${article.slug || article.id}`}
              className="inline-flex items-center gap-2 text-xs font-heading font-black tracking-wider text-white hover:text-[#E50914] uppercase transition-colors"
            >
              <span>READ FULL OFFICIAL REPORT</span>
              <ArrowRight className="w-4 h-4 text-[#E50914] group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-[#0C0E14] border border-[#1E222E] hover:border-[#E50914] transition-all duration-300 flex flex-col h-full overflow-hidden shadow-lg card-rim transform-gpu hover:-translate-y-1">
      {/* Thumbnail */}
      <Link
        to={`/news/${article.slug || article.id}`}
        className="relative aspect-[16/10] w-full overflow-hidden bg-[#141620] block"
      >
        {!imgError ? (
          <img
            src={article.image_url || '/stadium_atmosphere_1790354254462.jpg'}
            alt={article.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover filter contrast-110 group-hover:scale-105 transition-all duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#101217]">
            <img src="/ghost-fc-logo.jpg" alt="Ghost FC" className="w-16 h-16 opacity-20" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E14] via-transparent to-transparent opacity-80" />

        <div className="absolute top-3 left-3 z-10">
          <span className="bg-[#090A0E]/90 backdrop-blur-sm border border-[#E50914]/50 text-white text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 uppercase">
            {article.category}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 justify-between bg-[#0C0E14]">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#8E93A3]">
            <Calendar className="w-3 h-3 text-[#E50914]" />
            <span>{article.published_date}</span>
          </div>

          <Link to={`/news/${article.slug || article.id}`}>
            <h4 className="font-heading text-lg font-black text-white group-hover:text-[#E50914] transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h4>
          </Link>

          <p className="text-xs text-[#8E93A3] line-clamp-2 leading-relaxed">
            {article.short_description}
          </p>
        </div>

        <div className="pt-4 mt-4 border-t border-[#181B24]">
          <Link
            to={`/news/${article.slug || article.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-heading font-black tracking-wider text-white hover:text-[#E50914] uppercase transition-colors"
          >
            <span>READ STORY</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E50914] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
