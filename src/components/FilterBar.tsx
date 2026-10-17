'use client';

import React from 'react';
import { FashionCategory, StoreType } from '@/types';
import { Tag, Sparkles, Flame, Check } from 'lucide-react';

interface FilterBarProps {
  selectedCategory: FashionCategory;
  onSelectCategory: (cat: FashionCategory) => void;
  selectedStore: StoreType | 'all';
  onSelectStore: (store: StoreType | 'all') => void;
  priceFilter: string;
  onSelectPrice: (price: string) => void;
  sortBy: string;
  onSelectSort: (sort: string) => void;
  totalResults: number;
}

const CATEGORIES: FashionCategory[] = [
  'All',
  'Kurtis & Ethnic',
  'Dresses & Co-ords',
  'Tops & Tees',
  'Jeans & Bottoms',
  'Streetwear',
  'Jewellery & Bags',
  'Footwear'
];

const STORES: { id: StoreType | 'all'; label: string; badgeColor: string }[] = [
  { id: 'all', label: 'All Stores', badgeColor: 'bg-gray-900 text-white' },
  { id: 'meesho', label: 'Meesho', badgeColor: 'bg-fuchsia-600 text-white' },
  { id: 'flipkart', label: 'Flipkart', badgeColor: 'bg-blue-600 text-white' },
  { id: 'myntra', label: 'Myntra', badgeColor: 'bg-rose-500 text-white' },
  { id: 'amazon', label: 'Amazon', badgeColor: 'bg-amber-600 text-white' }
];

const PRICE_TIERS = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-299', label: 'Under ₹299 (Super Budget)' },
  { id: 'under-499', label: 'Under ₹499 (YouTube Fav)' },
  { id: 'under-799', label: 'Under ₹799' },
  { id: 'steal-deal', label: '🔥 Steal Deals (>65% OFF)' }
];

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedStore,
  onSelectStore,
  priceFilter,
  onSelectPrice,
  sortBy,
  onSelectSort,
  totalResults
}) => {
  return (
    <div className="space-y-3.5 mb-6">
      {/* Category Horizontal Scrollable Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map(category => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25 scale-[1.02]'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200/80 shadow-2xs'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Store, Price & Sort Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-2xs">
        {/* Store Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mr-1 hidden sm:inline">
            Store:
          </span>
          {STORES.map(store => {
            const isSelected = selectedStore === store.id;
            return (
              <button
                key={store.id}
                onClick={() => onSelectStore(store.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? `${store.badgeColor} shadow-xs scale-102`
                    : 'bg-gray-100 hover:bg-gray-200/80 text-gray-700'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                <span>{store.label}</span>
              </button>
            );
          })}
        </div>

        {/* Price & Sort Selects */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Price Quick Filter */}
          <select
            value={priceFilter}
            onChange={(e) => onSelectPrice(e.target.value)}
            className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-pink-200"
          >
            {PRICE_TIERS.map(tier => (
              <option key={tier.id} value={tier.id}>{tier.label}</option>
            ))}
          </select>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => onSelectSort(e.target.value)}
            className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-pink-200"
          >
            <option value="popular">🔥 Most Popular</option>
            <option value="discount">🏷️ Highest Discount</option>
            <option value="price-low">💰 Price: Low to High</option>
            <option value="price-high">💎 Price: High to Low</option>
            <option value="newest">✨ Latest Added</option>
          </select>

          {/* Results count */}
          <span className="text-xs text-gray-500 font-medium hidden md:inline ml-2">
            ({totalResults} items)
          </span>
        </div>
      </div>
    </div>
  );
};
