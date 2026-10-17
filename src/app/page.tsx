'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { SearchFilterStrip } from '@/components/SearchFilterStrip';
import { ProductCard } from '@/components/ProductCard';
import { ProductModal } from '@/components/ProductModal';
import { AuthModal } from '@/components/AuthModal';
import { LiveNotificationToast } from '@/components/LiveNotificationToast';
import { Product, VideoDrop, FashionCategory, StoreType } from '@/types';
import { getProducts, getVideoDrops, recordClick } from '@/lib/storage';
import { Sparkles, Heart, ShoppingBag, X } from 'lucide-react';
import Link from 'next/link';

function FashionFeed() {
  const searchParams = useSearchParams();
  const videoParam = searchParams.get('video');
  const productParam = searchParams.get('product');

  const { savedProductIds } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [videoDrops, setVideoDrops] = useState<VideoDrop[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<StoreType | 'all'>('all');
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<FashionCategory>('All');
  const [sortBy, setSortBy] = useState<string>('price-low');
  const [savedOnly, setSavedOnly] = useState(false);
  const [activeNavFilter, setActiveNavFilter] = useState<string>('drops');

  // Modal State
  const [modalProduct, setModalProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const prods = await getProducts();
      const vids = await getVideoDrops();
      setProducts(prods);
      setVideoDrops(vids);

      if (productParam) {
        const matched = prods.find(p => p.id === productParam);
        if (matched) {
          setModalProduct(matched);
        }
      }
      setLoading(false);
    }
    load();
  }, [productParam]);

  const handleNavFilter = (filterType: 'drops' | 'meesho' | 'flipkart' | 'videos' | 'saved') => {
    setActiveNavFilter(filterType);
    setSavedOnly(false);

    if (filterType === 'drops') {
      setSelectedStore('all');
      setSelectedCategory('All');
      setSelectedPrice('all');
    } else if (filterType === 'meesho') {
      setSelectedStore('meesho');
    } else if (filterType === 'flipkart') {
      setSelectedStore('flipkart');
    } else if (filterType === 'videos') {
      // scroll to lookbook
      const el = document.getElementById('looks-feed');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (filterType === 'saved') {
      setSavedOnly(true);
    }
  };

  const handleTrackClick = async (productId: string, store: StoreType) => {
    await recordClick(productId, store);
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, clicksCount: (p.clicksCount || 0) + 1 };
      }
      return p;
    }));
  };

  const scrollToLooks = () => {
    const el = document.getElementById('looks-feed');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered Outfits
  const filteredProducts = useMemo(() => {
    return products
      .filter(item => {
        // Saved only toggle
        if (savedOnly && !savedProductIds.includes(item.id)) {
          return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesDesc = item.description.toLowerCase().includes(q);
          const matchesTags = item.tags.some(t => t.toLowerCase().includes(q));
          const matchesStore = item.store.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesTags && !matchesStore) {
            return false;
          }
        }

        // Store
        if (selectedStore !== 'all' && item.store !== selectedStore) {
          return false;
        }

        // Category
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }

        // Price
        if (selectedPrice === 'under-499' && item.price >= 500) return false;
        if (selectedPrice === 'under-999' && item.price >= 1000) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'popular') return (b.clicksCount || 0) - (a.clicksCount || 0);
        if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return 0;
      });
  }, [products, savedOnly, savedProductIds, searchQuery, selectedStore, selectedCategory, selectedPrice, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Navbar */}
      <Navbar
        onSelectNavFilter={handleNavFilter}
        activeNavFilter={activeNavFilter}
        savedCount={savedProductIds.length}
        onOpenSaved={() => setSavedOnly(prev => !prev)}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 w-full">
        {/* Editorial Hero Section */}
        <HeroSection
          totalOutfitsCount={products.length}
          onBrowseClick={scrollToLooks}
          youtubeUrl="https://youtube.com"
          featuredLookbookTitle="College & Casual Budget Drops · Starts at ₹349"
          featuredLookbookPrice="Starts at ₹349"
        />

        {/* Search & Segmented Filter Bar */}
        <SearchFilterStrip
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStore={selectedStore}
          onSelectStore={setSelectedStore}
          selectedPrice={selectedPrice}
          onSelectPrice={setSelectedPrice}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSelectSort={setSortBy}
          totalOutfitsCount={filteredProducts.length}
        />

        {/* Saved Filter Notice */}
        {savedOnly && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-900">
              <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
              <span>Showing your Saved Wishlist ({savedProductIds.length} outfits)</span>
            </div>
            <button
              onClick={() => setSavedOnly(false)}
              className="text-xs text-rose-700 hover:text-rose-950 font-bold flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Show All Outfits</span>
            </button>
          </div>
        )}

        {/* Outfits Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pb-16">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setModalProduct}
                onTrackClick={handleTrackClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-150 p-8 my-6">
            <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-500 mx-auto flex items-center justify-center mb-3">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              {savedOnly ? 'Your saved wishlist is empty' : 'No outfits matched your filters'}
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
              {savedOnly 
                ? 'Tap the heart icon on any outfit card to save it here for later shopping!'
                : 'Try adjusting your search keywords, clearing store filters, or resetting price options.'}
            </p>
            <button
              onClick={() => {
                setSavedOnly(false);
                setSearchQuery('');
                setSelectedStore('all');
                setSelectedCategory('All');
                setSelectedPrice('all');
              }}
              className="px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Lookbook Quick View Modal */}
      <ProductModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
        onTrackClick={handleTrackClick}
      />

      {/* Auth Modal (Login / Sign Up / Creator Access) */}
      <AuthModal />

      {/* Live Social Proof Activity Toast */}
      <LiveNotificationToast />

      {/* Footer */}
      <footer className="border-t border-gray-150 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div>
            <span className="font-editorial text-lg font-bold text-gray-950 block mb-1">
              TrendDrop
            </span>
            <p>Direct affiliate links from Puneet Verma YouTube hauls.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-black font-semibold transition-colors">
              Creator Studio
            </Link>
            <span>·</span>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
              YouTube Channel
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <FashionFeed />
      </Suspense>
    </AuthProvider>
  );
}
