import React, { useState } from 'react';
import { getYouTubeEmbedUrl } from '../../utils/youtube';
import { Play, AlertCircle, Film } from 'lucide-react';

interface YouTubeEmbedProps {
  url: string;
  title: string;
  category?: string;
  description?: string;
  className?: string;
}

export const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  url,
  title,
  category,
  description,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbError, setThumbError] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(url);

  if (!embedUrl) {
    return (
      <div className={`bg-[#0C0E14] border border-[#1E222E] p-6 text-center card-rim ${className}`}>
        <AlertCircle className="w-8 h-8 text-[#E50914] mx-auto mb-2" />
        <p className="text-sm font-semibold text-white">Video unavailable</p>
        <p className="text-xs text-[#8E93A3] mt-1">Invalid or unsupported video URL format.</p>
      </div>
    );
  }

  // Extract video ID for high-res thumbnail
  const idMatch = embedUrl.match(/embed\/([a-zA-Z0-9_-]{11})/);
  const videoId = idMatch ? idMatch[1] : null;
  const thumbnailUrl = videoId && !thumbError
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  return (
    <div className={`group bg-[#0C0E14] border border-[#1E222E] hover:border-[#E50914]/60 transition-all duration-300 overflow-hidden card-rim flex flex-col ${className}`}>
      {/* Responsive 16:9 Video Container */}
      <div className="relative aspect-video w-full bg-black overflow-hidden shrink-0">
        {isPlaying ? (
          <iframe
            src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1`}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div
            className="relative w-full h-full cursor-pointer select-none"
            onClick={() => setIsPlaying(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsPlaying(true);
              }
            }}
            aria-label={`Play ${title}`}
          >
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={title}
                onError={() => setThumbError(true)}
                className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-[#12141C] flex flex-col items-center justify-center p-4">
                <Film className="w-10 h-10 text-[#585D6E] mb-2" />
                <span className="text-[11px] font-mono text-[#8E93A3] uppercase">Official Club Broadcast</span>
              </div>
            )}

            {/* Dark vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0E14] via-black/40 to-transparent pointer-events-none" />

            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#E50914] group-hover:bg-[#FF1A24] group-hover:scale-110 flex items-center justify-center text-white shadow-[0_0_25px_rgba(229,9,20,0.6)] transition-all duration-300">
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5" />
              </div>
            </div>

            {/* Category tag */}
            {category && (
              <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-sm border border-[#E50914]/60 px-2.5 py-1 text-[10px] font-heading font-black tracking-wider text-white uppercase clip-skew-btn">
                <span className="clip-skew-content inline-block">{category}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Video metadata */}
      <div className="p-4 bg-[#0C0E14] flex flex-col flex-grow justify-between">
        <div>
          <h4 className="font-heading text-base sm:text-lg font-black tracking-wide text-white group-hover:text-[#E50914] transition-colors line-clamp-1">
            {title}
          </h4>
          {description && (
            <p className="text-xs text-[#8E93A3] mt-1.5 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
