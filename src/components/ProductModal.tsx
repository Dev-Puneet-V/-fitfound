'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { 
  X, 
  ExternalLink, 
  Star, 
  Flame, 
  Sparkles, 
  Check, 
  Share2, 
  Info,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onTrackClick: (productId: string, store: any) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onTrackClick
}) => {
  if (!product) return null;

  const [selectedImg, setSelectedImg] = useState<string>(product.imageUrl);
  const allImages = [product.imageUrl, ...(product.secondaryImages || [])];

  const handleBuy = (e: React.MouseEvent) => {
    onTrackClick(product.id, product.store);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ff2d55', '#2874f0', '#f43397']
      });
    } catch (e) {}

    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShare = () => {
    const text = `Look at this viral ${product.title} (₹${product.price}) from the haul: ${window.location.origin}/?product=${product.id}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow-md flex items-center justify-center transition-transform hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Images Section */}
          <div className="p-4 sm:p-6 bg-gray-50 flex flex-col justify-between">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-200 shadow-inner mb-3">
              <img
                src={selectedImg}
                alt={product.title}
                className="w-full h-full object-cover object-top transition-all duration-300"
              />
            </div>

            {/* Thumbnail switcher if multiple images exist */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(img)}
                    className={`w-14 h-18 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImg === img ? 'border-pink-600 scale-105' : 'border-transparent opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust badge */}
            <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Creator Tested:</strong> Ordered & styled personally for the YouTube haul.</span>
            </div>
          </div>

          {/* Details & Sizing Section */}
          <div className="p-5 sm:p-7 flex flex-col justify-between">
            <div>
              {/* Store & Discount */}
              <div className="flex items-center gap-2 mb-2">
                <span className="uppercase text-[11px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-md bg-gray-900 text-white">
                  {product.store}
                </span>
                {product.discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {product.discountPercent}% Instant Off
                  </span>
                )}
                <span className="text-xs text-gray-500 ml-auto flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  {product.clicksCount} clicks
                </span>
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-snug mb-1">
                {product.title}
              </h2>
              {product.subtitle && (
                <p className="text-xs text-pink-600 font-semibold mb-3 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{product.subtitle}</span>
                </p>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-2.5 mb-4 p-3 bg-gray-50 rounded-2xl">
                <span className="text-2xl sm:text-3xl font-black text-gray-950">
                  ₹{product.price}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                )}
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md ml-auto">
                  Best Value Verified
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                {product.description}
              </p>

              {/* Creator Honest Review */}
              {product.creatorNote && (
                <div className="mb-4 p-3.5 rounded-2xl bg-rose-50/80 border border-rose-100">
                  <h4 className="text-xs font-bold text-rose-800 flex items-center gap-1 mb-1">
                    <span>🎬 Honest Creator Feedback:</span>
                  </h4>
                  <p className="text-xs text-gray-800 italic leading-relaxed">
                    "{product.creatorNote}"
                  </p>
                </div>
              )}

              {/* Sizing Advice */}
              {product.sizingAdvice && (
                <div className="mb-4 p-3 rounded-2xl bg-blue-50/80 border border-blue-100 text-xs text-blue-900">
                  <strong className="block text-blue-800 font-bold mb-0.5">📏 Sizing & Fit Tip:</strong>
                  <p className="text-blue-800/90">{product.sizingAdvice}</p>
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {product.tags.map((tag, i) => (
                  <span key={i} className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
              <button
                onClick={handleBuy}
                className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 hover:from-rose-700 hover:to-pink-700 text-white font-extrabold text-sm shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Buy on {product.store.toUpperCase()} (₹{product.price})</span>
                <ExternalLink className="w-4 h-4 ml-1 opacity-90" />
              </button>

              <button
                onClick={handleShare}
                className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                title="Share on WhatsApp"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
