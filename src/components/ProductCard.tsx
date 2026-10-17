'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { 
  ExternalLink, 
  Heart, 
  Share2, 
  Sparkles, 
  Star, 
  Flame, 
  CheckCircle2, 
  Eye,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onTrackClick: (productId: string, store: any) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onTrackClick
}) => {
  const { isProductSaved, toggleSaveProduct } = useAuth();
  const isSaved = isProductSaved(product.id);

  const handleBuyClick = (e: React.MouseEvent) => {
    onTrackClick(product.id, product.store);

    try {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { x, y },
        colors: ['#000000', '#f43397', '#2874f0', '#ffd700']
      });
    } catch (err) {}

    window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = `Hey! Check out this exact ${product.title} from the YouTube haul (only ₹${product.price}): ${window.location.origin}/?product=${product.id}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const getStoreBadge = () => {
    switch (product.store) {
      case 'meesho':
        return {
          name: 'Meesho',
          bg: 'bg-fuchsia-600 text-white',
        };
      case 'flipkart':
        return {
          name: 'Flipkart',
          bg: 'bg-blue-600 text-white',
        };
      case 'myntra':
        return {
          name: 'Myntra',
          bg: 'bg-rose-500 text-white',
        };
      case 'amazon':
        return {
          name: 'Amazon',
          bg: 'bg-amber-600 text-white',
        };
      default:
        return {
          name: product.store.toUpperCase(),
          bg: 'bg-black text-white',
        };
    }
  };

  const storeBadge = getStoreBadge();

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Product Image Area */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-104"
          loading="lazy"
        />

        {/* Floating Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Store Badge */}
          <span className={`pointer-events-auto px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs tracking-wide ${storeBadge.bg}`}>
            {storeBadge.name}
          </span>

          {/* Wishlist Heart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveProduct(product.id);
            }}
            className={`pointer-events-auto w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-xs flex items-center justify-center transition-all ${
              isSaved ? 'text-rose-600 scale-105' : 'text-gray-600 hover:text-black'
            }`}
            title={isSaved ? 'Remove from Saved' : 'Save to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>
        </div>

        {/* Discount Tag */}
        {product.discountPercent > 0 && (
          <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-black text-white shadow-xs">
              {product.discountPercent}% OFF
            </span>
          </div>
        )}

        {/* Quick View Overlay Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-white/90 text-gray-900 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-90 group-hover:scale-100 hover:bg-white pointer-events-auto"
          title="Quick View & Sizing Advice"
        >
          <Eye className="w-4 h-4 text-gray-800" />
        </button>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Video Subtitle / Timestamp */}
          {product.subtitle && (
            <p className="text-[11px] font-medium text-gray-500 mb-1 truncate">
              {product.subtitle}
            </p>
          )}

          {/* Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-semibold text-gray-950 text-xs sm:text-sm leading-snug line-clamp-2 hover:text-gray-600 transition-colors cursor-pointer mb-2"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Creator Honest Review Snippet */}
          {product.creatorNote && (
            <p className="text-[11px] text-gray-500 italic line-clamp-1 mb-2">
              "{product.creatorNote}"
            </p>
          )}
        </div>

        {/* Pricing & CTA Section */}
        <div className="pt-2 border-t border-gray-150">
          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-lg font-bold text-gray-950 tracking-tight">
              ₹{product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {/* Primary Buy CTA + WhatsApp Share */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleBuyClick}
              className="flex-1 py-2 px-3 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-semibold shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-98"
            >
              <span>Buy on {storeBadge.name}</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors shrink-0"
              title="Share on WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
