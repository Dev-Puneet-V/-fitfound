'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Sparkles, Heart, LogOut, User } from 'lucide-react';
import { StoreType, FashionCategory } from '@/types';

interface NavbarProps {
  onSelectNavFilter?: (filterType: 'drops' | 'meesho' | 'flipkart' | 'videos' | 'saved') => void;
  activeNavFilter?: string;
  savedCount: number;
  onOpenSaved: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectNavFilter,
  activeNavFilter,
  savedCount,
  onOpenSaved
}) => {
  const { user, openAuthModal, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-150 py-3.5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group shrink-0">
            <span className="font-editorial text-2xl sm:text-2xl font-bold tracking-tight text-gray-950">
              TrendDrop
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
            <button
              onClick={() => onSelectNavFilter?.('drops')}
              className={`hover:text-black transition-colors ${
                activeNavFilter === 'drops' ? 'text-black font-semibold' : ''
              }`}
            >
              Daily Drops
            </button>
            <button
              onClick={() => onSelectNavFilter?.('meesho')}
              className={`hover:text-black transition-colors ${
                activeNavFilter === 'meesho' ? 'text-black font-semibold' : ''
              }`}
            >
              Meesho Finds
            </button>
            <button
              onClick={() => onSelectNavFilter?.('flipkart')}
              className={`hover:text-black transition-colors ${
                activeNavFilter === 'flipkart' ? 'text-black font-semibold' : ''
              }`}
            >
              Flipkart Deals
            </button>
            <button
              onClick={() => onSelectNavFilter?.('videos')}
              className={`hover:text-black transition-colors ${
                activeNavFilter === 'videos' ? 'text-black font-semibold' : ''
              }`}
            >
              Video Hauls
            </button>

            {/* Saved Wishlist Link */}
            <button
              onClick={onOpenSaved}
              className="flex items-center gap-1.5 text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 rounded-full hover:bg-rose-50 transition-colors"
            >
              <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
              <span>Saved ({savedCount})</span>
            </button>
          </nav>

          {/* Right Action: Auth / Creator Studio */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Mobile Saved Button */}
            <button
              onClick={onOpenSaved}
              className="md:hidden flex items-center gap-1 text-rose-600 font-bold text-xs p-1.5 rounded-lg hover:bg-rose-50"
            >
              <Heart className="w-4 h-4 fill-rose-600" />
              <span>({savedCount})</span>
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold shadow-xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Creator Studio</span>
                </Link>

                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold shadow-xs transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Creator Studio</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
