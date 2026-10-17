'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Flame, Sparkles, X, CheckCircle2 } from 'lucide-react';

const NOTIFICATIONS = [
  {
    name: 'Sneha from Pune',
    action: 'just grabbed the Kashmiri Cotton Anarkali',
    time: '2 mins ago',
    icon: ShoppingBag,
    color: 'text-pink-600 bg-pink-50'
  },
  {
    name: '🔥 High Demand Alert',
    action: '74 people clicked the Korean Trousers today',
    time: 'Trending',
    icon: Flame,
    color: 'text-amber-600 bg-amber-50'
  },
  {
    name: 'Ananya from Bengaluru',
    action: 'viewed Vintage Floral Midi Dress',
    time: 'Just now',
    icon: Sparkles,
    color: 'text-rose-600 bg-rose-50'
  },
  {
    name: '⚡ Price Drop Verified',
    action: 'Flipkart Festive Sale: Kurtis starting ₹349',
    time: 'Verified',
    icon: CheckCircle2,
    color: 'text-emerald-600 bg-emerald-50'
  }
];

export const LiveNotificationToast: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    // Show after initial delay
    const initialTimer = setTimeout(() => {
      setVisible(true);
    }, 3500);

    // Rotate every 12 seconds
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % NOTIFICATIONS.length);
        setVisible(true);
      }, 600);
    }, 11000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [dismissed]);

  if (dismissed || !visible) return null;

  const current = NOTIFICATIONS[currentIndex];
  const IconComponent = current.icon;

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-xs sm:max-w-sm transition-all duration-500 ease-out transform translate-y-0 opacity-100 animate-float">
      <div className="flex items-center gap-3 p-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-100 ring-1 ring-black/5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${current.color}`}>
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0 pr-1">
          <p className="text-xs font-semibold text-gray-900 truncate">
            {current.name}
          </p>
          <p className="text-[11px] text-gray-600 leading-tight line-clamp-1">
            {current.action}
          </p>
          <span className="text-[10px] text-pink-600 font-medium">
            {current.time}
          </span>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-md transition-colors"
          title="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
