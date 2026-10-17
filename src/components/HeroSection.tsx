'use client';

import React from 'react';
import { ArrowDown, CheckCircle2, ShieldCheck, Tag, ExternalLink } from 'lucide-react';
import { YoutubeIcon } from '@/components/YoutubeIcon';

interface HeroSectionProps {
  totalOutfitsCount: number;
  onBrowseClick: () => void;
  youtubeUrl?: string;
  featuredLookbookTitle?: string;
  featuredLookbookPrice?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  totalOutfitsCount = 8,
  onBrowseClick,
  youtubeUrl = 'https://youtube.com',
  featuredLookbookTitle = 'College & Casual Budget Drops · Starts at ₹349',
  featuredLookbookPrice = 'Starts at ₹349'
}) => {
  return (
    <section className="pt-6 sm:pt-10 pb-8 border-b border-gray-150">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Creator Headline & Story */}
        <div className="lg:col-span-7">
          {/* Eyebrow */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3 sm:mb-4">
            <span className="text-gray-900 font-bold">PUNEET VERMA FASHION</span>
            <span>·</span>
            <span>DIRECT AFFILIATE LINKS</span>
            <span>·</span>
            <span>{totalOutfitsCount} OUTFITS ONLINE</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-950 tracking-tight leading-[1.12] mb-4 sm:mb-5">
            Trending fashion finds you saw in my YouTube hauls.
          </h1>

          {/* Subtitle Paragraph */}
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-xl mb-6 sm:mb-8 font-normal">
            Skip searching for codes or blurry screenshots. Tapping any outfit takes you straight to Flipkart, Meesho, or Myntra with the exact deals, honest sizing recommendations, and active discount coupons.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onBrowseClick}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm hover:scale-[1.01]"
            >
              <span>Browse Today's Looks</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold transition-all"
            >
              <YoutubeIcon className="w-4 h-4 text-red-600" />
              <span>Watch YouTube Haul</span>
            </a>
          </div>
        </div>

        {/* Right Column: Lookbook Feature Card */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-neutral-900 aspect-[4/3] group">
            {/* Flatlay Fashion Image */}
            <img
              src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=1000&auto=format&fit=crop&q=80"
              alt="Contemporary Fusion Lookbook"
              className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 opacity-95"
            />

            {/* Top Fashion Editorial Title Overlay */}
            <div className="absolute top-4 left-0 right-0 text-center pointer-events-none">
              <span className="font-editorial text-xl sm:text-2xl font-bold tracking-widest text-gray-900 drop-shadow-sm bg-white/70 backdrop-blur-xs px-4 py-1 rounded-full uppercase text-xs">
                Contemporary Fusion
              </span>
            </div>

            {/* Bottom Info Tag Banner */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-300 block mb-0.5">
                LATEST VIDEO LOOKBOOK
              </span>
              <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                {featuredLookbookTitle}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Trust Badges Row */}
      <div className="mt-8 sm:mt-10 pt-6 border-t border-gray-150 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-gray-600">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-gray-800 shrink-0" />
          <span>100% Free Access to Links</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gray-800 shrink-0" />
          <span>Direct Merchant Checkout</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-gray-800 shrink-0" />
          <span>Verified Lowest Discount Price</span>
        </div>
        <div className="flex items-center gap-2">
          <YoutubeIcon className="w-4 h-4 text-red-600 shrink-0" />
          <span>Exact Outfit Timestamps</span>
        </div>
      </div>
    </section>
  );
};
