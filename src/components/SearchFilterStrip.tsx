'use client';

import React from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { StoreType, FashionCategory } from '@/types';

interface SearchFilterStripProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedStore: StoreType | 'all';
  onSelectStore: (store: StoreType | 'all') => void;
  selectedPrice: string;
  onSelectPrice: (price: string) => void;
  selectedCategory: FashionCategory;
  onSelectCategory: (cat: FashionCategory) => void;
  sortBy: string;
  onSelectSort: (sort: string) => void;
  totalOutfitsCount: number;
}

const STORE_PILLS: { id: StoreType | 'all'; label: string }[] = [
  { id: 'all', label: 'All Stores' },
  { id: 'meesho', label: 'Meesho' },
  { id: 'flipkart', label: 'Flipkart' },
  { id: 'myntra', label: 'Myntra' },
  { id: 'amazon', label: 'Amazon' }
];

const PRICE_PILLS = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-499', label: 'Under ₹499' },
  { id: 'under-999', label: 'Under ₹999' }
];

const CATEGORY_PILLS: { id: FashionCategory; label: string }[] = [
  { id: 'All', label: 'All Categories' },
  { id: 'Tops & Tees', label: 'Tops & Shirts' },
  { id: 'Kurtis & Ethnic', label: 'Ethnic & Kurtis' },
  { id: 'Dresses & Co-ords', label: 'Dresses & Co-ords' },
  { id: 'Jeans & Bottoms', label: 'Bottoms & Pants' },
  { id: 'Streetwear', label: 'Streetwear' },
  { id: 'Jewellery & Bags', label: 'Jewellery & Accessories' }
];

export const SearchFilterStrip: React.FC<SearchFilterStripProps> = ({
  searchQuery,
  onSearchChange,
  selectedStore,
  onSelectStore,
  selectedPrice,
  onSelectPrice,
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSelectSort,
  totalOutfitsCount
}) => {
  return (
    <div id="looks-feed" className="py-6 space-y-4">
      {/* Row 1: Search Bar & Count / Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search clothes, Meesho code, video look..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm bg-gray-100 hover:bg-gray-150/80 focus:bg-white text-gray-900 placeholder-gray-400 rounded-xl border border-transparent focus:border-gray-300 focus:outline-hidden transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-xs w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>

        {/* Showing Count & Sort Dropdown */}
        <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-gray-600 shrink-0">
          <span className="font-medium">
            Showing <strong className="text-gray-950 font-bold">{totalOutfitsCount}</strong> outfits
          </span>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSelectSort(e.target.value)}
              className="appearance-none bg-transparent hover:bg-gray-50 py-1.5 pl-2.5 pr-7 font-semibold text-gray-800 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 focus:outline-hidden text-xs"
            >
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
              <option value="discount">Highest Discount</option>
              <option value="newest">Latest Added</option>
            </select>
            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-gray-500" />
          </div>
        </div>
      </div>

      {/* Row 2: Filter Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        
        {/* Store Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {STORE_PILLS.map(store => {
            const isActive = selectedStore === store.id;
            return (
              <button
                key={store.id}
                onClick={() => onSelectStore(store.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-black text-white font-semibold shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {store.label}
              </button>
            );
          })}
        </div>

        {/* Vertical Divider */}
        <div className="h-4 w-px bg-gray-200 shrink-0 mx-1" />

        {/* Price Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {PRICE_PILLS.map(price => {
            const isActive = selectedPrice === price.id;
            return (
              <button
                key={price.id}
                onClick={() => onSelectPrice(price.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-black text-white font-semibold shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {price.label}
              </button>
            );
          })}
        </div>

        {/* Vertical Divider */}
        <div className="h-4 w-px bg-gray-200 shrink-0 mx-1" />

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {CATEGORY_PILLS.map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-black text-white font-semibold shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
