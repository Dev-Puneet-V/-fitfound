'use client';

import React from 'react';
import { VideoDrop } from '@/types';
import { PlayCircle, Clock, ExternalLink, Sparkles } from 'lucide-react';
import { YoutubeIcon } from '@/components/YoutubeIcon';

interface VideoBannerProps {
  currentDrop?: VideoDrop;
  allDrops: VideoDrop[];
  onSelectDrop: (dropId: string | null) => void;
  selectedDropId: string | null;
}

export const VideoBanner: React.FC<VideoBannerProps> = ({
  currentDrop,
  allDrops,
  onSelectDrop,
  selectedDropId
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-rose-900 via-purple-950 to-slate-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl mb-6 sm:mb-8 border border-white/10">
      {/* Decorative background glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        {/* Top Tagline */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-pink-200">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>YouTube Video Outfits & Exact Links</span>
          </div>

          {/* Quick Drop Selector */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-gray-300 hidden sm:inline">Browse Haul:</span>
            <button
              onClick={() => onSelectDrop(null)}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                selectedDropId === null
                  ? 'bg-white text-gray-950 shadow-md font-semibold'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              All Outfits
            </button>
            {allDrops.map(drop => (
              <button
                key={drop.id}
                onClick={() => onSelectDrop(drop.id)}
                className={`px-3 py-1 rounded-full font-medium transition-all truncate max-w-[140px] sm:max-w-[200px] ${
                  selectedDropId === drop.id
                    ? 'bg-rose-500 text-white shadow-md font-semibold'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title={drop.title}
              >
                {drop.title.split('!')[0].split('-')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Banner Content */}
        {currentDrop ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-8">
              <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                <YoutubeIcon className="w-4 h-4 text-red-400" />
                <span>Featured Video Haul • {currentDrop.publishedDate}</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                {currentDrop.title}
              </h1>
              <p className="text-sm text-gray-300 line-clamp-2 max-w-2xl mb-4 font-normal">
                {currentDrop.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={currentDrop.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02]"
                >
                  <PlayCircle className="w-4 h-4 fill-white text-red-600" />
                  <span>Watch Video on YouTube</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                <span className="text-xs text-rose-200/80 bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
                  ✨ Click any outfit card below to buy directly from Meesho / Flipkart!
                </span>
              </div>
            </div>

            {/* Thumbnail Preview */}
            <div className="hidden md:block md:col-span-4">
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-2xl border border-white/20 group">
                <img
                  src={currentDrop.thumbnailUrl}
                  alt={currentDrop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[11px] font-medium text-white/90 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-pink-400" /> All timestamps linked below
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Trending Fashion Finds & Affiliate Hauls
            </h1>
            <p className="text-sm text-gray-300 max-w-2xl mb-4">
              Direct affiliate links to every outfit styled on our YouTube channel. Tested for fabric quality, real sizing, and lowest verified pricing on Meesho, Flipkart & Myntra.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
