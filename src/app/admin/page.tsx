'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit, 
  ExternalLink, 
  Copy, 
  Check, 
  Flame, 
  TrendingUp, 
  BarChart3, 
  Database, 
  Key, 
  Save, 
  RefreshCw,
  ShoppingBag,
  ArrowLeft,
  Wand2,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  LogOut,
  User,
  Lock,
  Mail
} from 'lucide-react';
import { YoutubeIcon } from '@/components/YoutubeIcon';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Product, VideoDrop, AdminStats, StoreType, FashionCategory } from '@/types';
import { 
  getProducts, 
  saveProduct, 
  deleteProduct, 
  getVideoDrops, 
  saveVideoDrop, 
  deleteVideoDrop, 
  getAdminStats, 
  resetToDefaults 
} from '@/lib/storage';

function AdminDashboardContent() {
  const { user, loading: authLoading, loginWithEmail, quickCreatorLogin, logout } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [submittingLogin, setSubmittingLogin] = useState(false);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setSubmittingLogin(true);
    const res = await loginWithEmail(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'Invalid credentials');
    }
    setSubmittingLogin(false);
  };

  const [activeTab, setActiveTab] = useState<'products' | 'videos' | 'analytics' | 'settings'>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [videos, setVideos] = useState<VideoDrop[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Product Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [customGeminiKey, setCustomGeminiKey] = useState('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStore, setFormStore] = useState<StoreType>('meesho');
  const [formAffiliateUrl, setFormAffiliateUrl] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formPrice, setFormPrice] = useState(499);
  const [formOriginalPrice, setFormOriginalPrice] = useState(1499);
  const [formCategory, setFormCategory] = useState<FashionCategory>('Kurtis & Ethnic');
  const [formTags, setFormTags] = useState('Under 499, Trending');
  const [formCreatorNote, setFormCreatorNote] = useState('');
  const [formSizingAdvice, setFormSizingAdvice] = useState('');
  const [formVideoTitle, setFormVideoTitle] = useState('');

  // Video Drop Form State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoThumbnail, setVideoThumbnail] = useState('');
  const [videoDesc, setVideoDesc] = useState('');

  useEffect(() => {
    loadData();
    const savedKey = localStorage.getItem('trenddrop_gemini_key') || '';
    setCustomGeminiKey(savedKey);

    const safety = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(safety);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const prods = await getProducts();
      const vids = await getVideoDrops();
      const st = await getAdminStats();
      setProducts(prods);
      setVideos(vids);
      setStats(st);
    } catch (e) {
      console.warn('Error loading admin data', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleOpenAddForm = () => {
    setEditingProduct(null);
    setFormTitle('');
    setFormSubtitle('Seen in Today\'s Video Look #1');
    setFormDescription('');
    setFormStore('meesho');
    setFormAffiliateUrl('');
    setFormImageUrl('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80');
    setFormPrice(449);
    setFormOriginalPrice(1399);
    setFormCategory('Kurtis & Ethnic');
    setFormTags('Under 499, Viral Pick, Honest Review');
    setFormCreatorNote('I am 5\'4" and wearing Size S. Fabric is 100% pure cotton, super breathable!');
    setFormSizingAdvice('True to size. Size up if between sizes.');
    setFormVideoTitle(videos[0]?.title || '');
    setIsFormOpen(true);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setFormTitle(prod.title);
    setFormSubtitle(prod.subtitle || '');
    setFormDescription(prod.description);
    setFormStore(prod.store);
    setFormAffiliateUrl(prod.affiliateUrl);
    setFormImageUrl(prod.imageUrl);
    setFormPrice(prod.price);
    setFormOriginalPrice(prod.originalPrice);
    setFormCategory(prod.category);
    setFormTags(prod.tags.join(', '));
    setFormCreatorNote(prod.creatorNote || '');
    setFormSizingAdvice(prod.sizingAdvice || '');
    setFormVideoTitle(prod.videoTitle || '');
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to remove this item?')) {
      await deleteProduct(id);
      loadData();
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const discount = Math.max(0, Math.round(((formOriginalPrice - formPrice) / formOriginalPrice) * 100));
    const tagArray = formTags.split(',').map(t => t.trim()).filter(Boolean);

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      title: formTitle,
      subtitle: formSubtitle,
      description: formDescription,
      store: formStore,
      affiliateUrl: formAffiliateUrl || 'https://www.meesho.com',
      imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
      price: Number(formPrice),
      originalPrice: Number(formOriginalPrice),
      discountPercent: discount,
      rating: editingProduct?.rating || 4.8,
      reviewCount: editingProduct?.reviewCount || 1280,
      category: formCategory,
      tags: tagArray.length > 0 ? tagArray : ['Trending'],
      creatorNote: formCreatorNote,
      sizingAdvice: formSizingAdvice,
      videoTitle: formVideoTitle,
      isTrending: true,
      clicksCount: editingProduct?.clicksCount || 0,
      createdAt: editingProduct?.createdAt || new Date().toISOString()
    };

    await saveProduct(productPayload);
    setIsFormOpen(false);
    loadData();
  };

  // AI Magic Generation using Free Gemini API
  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter a product name, raw description, or paste a link first!');
      return;
    }

    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawInput: aiPrompt,
          store: formStore,
          customApiKey: customGeminiKey
        })
      });

      if (res.ok) {
        const data = await res.json();
        setFormTitle(data.title || formTitle);
        if (data.subtitle) setFormSubtitle(data.subtitle);
        if (data.description) setFormDescription(data.description);
        if (data.category) setFormCategory(data.category as FashionCategory);
        if (data.suggestedPrice) setFormPrice(data.suggestedPrice);
        if (data.originalPrice) setFormOriginalPrice(data.originalPrice);
        if (data.tags) setFormTags(data.tags.join(', '));
        if (data.creatorNote) setFormCreatorNote(data.creatorNote);
        if (data.sizingAdvice) setFormSizingAdvice(data.sizingAdvice);
      }
    } catch (err) {
      console.error('AI generation failed', err);
      alert('AI generation failed, please check network or try again.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSaveVideoDrop = async (e: React.FormEvent) => {
    e.preventDefault();
    const slug = videoTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newDrop: VideoDrop = {
      id: `vid-${Date.now()}`,
      slug,
      title: videoTitle,
      youtubeUrl: videoUrl || 'https://youtube.com',
      youtubeVideoId: videoUrl.includes('v=') ? videoUrl.split('v=')[1]?.split('&')[0] : 'video',
      thumbnailUrl: videoThumbnail || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
      publishedDate: 'Today',
      description: videoDesc || 'All trending outfits and clothes featured in this YouTube haul!'
    };

    await saveVideoDrop(newDrop);
    setIsVideoModalOpen(false);
    setVideoTitle('');
    setVideoUrl('');
    setVideoThumbnail('');
    setVideoDesc('');
    loadData();
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm('Delete this video drop? Products will remain active.')) {
      await deleteVideoDrop(id);
      loadData();
    }
  };

  const handleSaveGeminiKey = () => {
    localStorage.setItem('trenddrop_gemini_key', customGeminiKey.trim());
    alert('Gemini API Key saved locally in browser! You can now use AI Auto-Fill for free.');
  };

  // SQL Schema for Supabase Free Tier
  const supabaseSqlSchema = `-- 100% FREE SUPABASE SCHEMA FOR TRENDDROP
-- Copy and run this in your Supabase SQL Editor:

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  store TEXT NOT NULL,
  "affiliateUrl" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "secondaryImages" TEXT[],
  price NUMERIC NOT NULL,
  "originalPrice" NUMERIC,
  "discountPercent" NUMERIC,
  rating NUMERIC DEFAULT 4.8,
  "reviewCount" NUMERIC DEFAULT 100,
  category TEXT NOT NULL,
  tags TEXT[],
  "creatorNote" TEXT,
  "sizingAdvice" TEXT,
  "videoTitle" TEXT,
  "videoUrl" TEXT,
  "isTrending" BOOLEAN DEFAULT true,
  "clicksCount" NUMERIC DEFAULT 0,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS video_drops (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  "youtubeUrl" TEXT NOT NULL,
  "youtubeVideoId" TEXT,
  "thumbnailUrl" TEXT NOT NULL,
  "publishedDate" TEXT,
  description TEXT
);

CREATE TABLE IF NOT EXISTS clicks (
  id TEXT PRIMARY KEY,
  "productId" TEXT,
  store TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) & Public Read/Write
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read" ON products FOR SELECT USING (true);
CREATE POLICY "Public Insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update" ON products FOR UPDATE USING (true);
CREATE POLICY "Public Delete" ON products FOR DELETE USING (true);
`;

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl text-center">
          <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <h2 className="font-editorial text-2xl font-bold text-gray-950 mb-1">
            Puneet Verma Creator Studio
          </h2>
          <p className="text-xs text-gray-500 mb-6 max-w-xs mx-auto">
            Please sign in to manage your daily YouTube lookbook outfits, generate affiliate links, and use the free Gemini AI assistant.
          </p>

          <div className="mb-5 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-left flex items-center justify-between">
            <div>
              <strong className="text-xs font-bold text-amber-950 block">✨ Quick Creator Access</strong>
              <span className="text-[11px] text-amber-800">1-click login as Puneet Verma</span>
            </div>
            <button
              onClick={quickCreatorLogin}
              className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold transition-all shadow-xs"
            >
              Quick Login
            </button>
          </div>

          <form onSubmit={handleManualLogin} className="space-y-3 text-left">
            {loginError && (
              <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs">
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Creator Email</label>
              <input
                type="email"
                required
                placeholder="puneet@trenddrop.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-black"
              />
            </div>
            <button
              type="submit"
              disabled={submittingLogin}
              className="w-full py-2.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm"
            >
              {submittingLogin ? 'Signing In...' : 'Sign In as Creator'}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-150">
            <Link href="/" className="text-xs text-gray-500 hover:text-black font-semibold">
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 pb-16">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Store</span>
            </Link>
            <div className="h-4 w-px bg-gray-200 hidden sm:block" />
            <h1 className="font-extrabold text-base sm:text-lg text-gray-900 flex items-center gap-2">
              <span className="font-editorial">TrendDrop</span>
              <span className="text-[10px] uppercase font-bold bg-black text-white px-2 py-0.5 rounded-full">
                Studio
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 text-xs font-semibold text-gray-800">
              <div className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">
                {user.name.charAt(0)}
              </div>
              <span>{user.name}</span>
            </div>

            <button
              onClick={handleOpenAddForm}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Daily Outfit</span>
            </button>

            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-2 border-t border-gray-100 pt-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Outfits & Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'videos'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <YoutubeIcon className="w-4 h-4 text-red-500" />
            <span>YouTube Video Drops & Description Links</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-blue-500" />
            <span>Clicks & Affiliate Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-500" />
            <span>Free Supabase & Gemini AI Setup</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Metric Cards Row */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Total Affiliate Clicks
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900">{stats.totalClicks}</span>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp className="w-3.5 h-3.5" /> +18%
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">High conversion purchase intent</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Today's YouTube Traffic Clicks
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-rose-600">{stats.todayClicks}</span>
                <span className="text-xs font-medium text-gray-500">clicks today</span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Direct from video links</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Top Converting Store
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-fuchsia-600">Meesho</span>
                <span className="text-xs font-semibold text-gray-500">
                  ({stats.storeBreakdown.meesho || 0} clicks)
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Flipkart closely following</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">
                Estimated Affiliate Potential
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-600">
                  ₹{Math.round(stats.totalClicks * 12.5)}
                </span>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                  8-12% Comm.
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Free passive revenue</p>
            </div>
          </div>
        )}

        {/* TAB 1: PRODUCTS */}
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">
                Live Outfits & Trending Clothes ({products.length})
              </h2>
              <button
                onClick={handleOpenAddForm}
                className="px-3 py-1.5 rounded-xl bg-pink-600 text-white text-xs font-bold hover:bg-pink-700 flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Outfit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(prod => (
                <div key={prod.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs flex flex-col justify-between">
                  <div className="p-4 flex gap-3">
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      className="w-20 h-24 object-cover object-top rounded-xl bg-gray-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-sm bg-gray-900 text-white">
                          {prod.store}
                        </span>
                        <span className="text-xs font-bold text-emerald-600">
                          ₹{prod.price}
                        </span>
                        {prod.discountPercent > 0 && (
                          <span className="text-[10px] text-gray-400 line-through">
                            ₹{prod.originalPrice}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2 mb-1">
                        {prod.title}
                      </h4>
                      {prod.subtitle && (
                        <p className="text-[10px] text-pink-600 font-medium truncate mb-1">
                          {prod.subtitle}
                        </p>
                      )}
                      <p className="text-[10px] text-gray-500 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-rose-500" />
                        <span><strong>{prod.clicksCount}</strong> outbound clicks</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                    <a
                      href={prod.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-pink-600 flex items-center gap-1 text-[11px] font-medium"
                    >
                      <ExternalLink className="w-3 h-3" /> Test Link
                    </a>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEditProduct(prod)}
                        className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: YOUTUBE VIDEO DROPS */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  YouTube Video Drops & Description Link Generator
                </h2>
                <p className="text-xs text-gray-500">
                  Give each YouTube video a dedicated outfit collection link to put in your YouTube description and pinned comment!
                </p>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>New Video Drop</span>
              </button>
            </div>

            <div className="space-y-4">
              {videos.map(drop => {
                const dropLink = typeof window !== 'undefined' 
                  ? `${window.location.origin}/?video=${drop.slug}` 
                  : `https://yourdomain.com/?video=${drop.slug}`;

                const youtubeDescriptionSnippet = `👗 ALL OUTFITS & CLOTHES FROM TODAY'S VIDEO 👗
Direct Links & My Sizing Reviews:
👉 ${dropLink}

(Includes honest fabric review, my size & height, and lowest price discount codes!)`;

                return (
                  <div key={drop.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
                      <div className="flex gap-3 items-center">
                        <img
                          src={drop.thumbnailUrl}
                          alt={drop.title}
                          className="w-24 h-16 object-cover rounded-xl bg-gray-100 shrink-0 shadow-xs"
                        />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase bg-red-100 text-red-700 px-2 py-0.5 rounded">
                              YouTube Video
                            </span>
                            <span className="text-xs text-gray-400">{drop.publishedDate}</span>
                          </div>
                          <h3 className="font-bold text-sm text-gray-900 leading-snug">
                            {drop.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteVideo(drop.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                          title="Delete video drop"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* YouTube Description Ready-Made Box */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                          <Copy className="w-3.5 h-3.5 text-gray-500" />
                          Ready-to-Paste YouTube Description Text:
                        </span>
                        <button
                          onClick={() => handleCopy(youtubeDescriptionSnippet, drop.id)}
                          className={`text-xs font-bold px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                            copiedText === drop.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                          }`}
                        >
                          {copiedText === drop.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Copied to Clipboard!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy YouTube Snippet</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="text-xs font-mono text-gray-700 bg-white p-3 rounded-lg border border-gray-200 whitespace-pre-wrap select-all">
                        {youtubeDescriptionSnippet}
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS & TELEMETRY */}
        {activeTab === 'analytics' && stats && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-gray-900">
              Affiliate Click Breakdown & Store Performance
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Store distribution */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
                <h3 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-pink-600" />
                  <span>Clicks per Affiliate Platform</span>
                </h3>

                <div className="space-y-3.5">
                  {(['meesho', 'flipkart', 'myntra', 'amazon'] as StoreType[]).map(store => {
                    const count = stats.storeBreakdown[store] || 0;
                    const percent = stats.totalClicks > 0 ? Math.round((count / stats.totalClicks) * 100) : 0;
                    return (
                      <div key={store}>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="capitalize">{store}</span>
                          <span className="text-gray-600">{count} clicks ({percent}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              store === 'meesho'
                                ? 'bg-fuchsia-600'
                                : store === 'flipkart'
                                ? 'bg-blue-600'
                                : store === 'myntra'
                                ? 'bg-rose-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
                <h3 className="font-bold text-sm text-gray-900 mb-4 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-500" />
                  <span>Top 5 Highest Converting Clothes</span>
                </h3>

                <div className="space-y-3">
                  {stats.topProducts.map((p, idx) => (
                    <div key={p.id} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-gray-50">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 font-extrabold flex items-center justify-center shrink-0 text-[10px]">
                          #{idx + 1}
                        </span>
                        <span className="font-semibold text-gray-900 truncate">
                          {p.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="uppercase text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-200 text-gray-700">
                          {p.store}
                        </span>
                        <span className="font-extrabold text-pink-600">
                          {p.clicks} clicks
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FREE SUPABASE & GEMINI SETUP */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Supabase Free Database Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Free Supabase Database Integration
                  </h3>
                  <p className="text-xs text-gray-500">
                    Supabase provides 500MB free PostgreSQL database forever at zero cost.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-950 mb-4 leading-relaxed">
                <p className="font-semibold mb-1">
                  ⚡ 100% Works Out-of-the-Box:
                </p>
                <p>
                  Your website currently functions seamlessly with instant LocalStorage backup, so you can add clothes and test right away. When you are ready to connect your free Supabase cloud database:
                </p>
                <ol className="list-decimal ml-4 mt-2 space-y-1">
                  <li>Create a free account on <a href="https://supabase.com" target="_blank" rel="noreferrer" className="underline font-bold">supabase.com</a></li>
                  <li>Click <strong>New Project</strong> (choose free plan)</li>
                  <li>Go to <strong>SQL Editor</strong> and run the script below (1 click)</li>
                  <li>Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to your environment variables</li>
                </ol>
              </div>

              <div className="relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-700">
                    1-Click SQL Setup Script:
                  </span>
                  <button
                    onClick={() => handleCopy(supabaseSqlSchema, 'sql')}
                    className="text-xs font-semibold px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center gap-1"
                  >
                    {copiedText === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === 'sql' ? 'Copied SQL!' : 'Copy SQL Script'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-gray-800 bg-gray-900 text-emerald-400 p-4 rounded-2xl overflow-x-auto max-h-56">
                  {supabaseSqlSchema}
                </pre>
              </div>
            </div>

            {/* Google Gemini Free AI Key Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-800 flex items-center justify-center font-bold">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    Free Google Gemini AI Key Setup
                  </h3>
                  <p className="text-xs text-gray-500">
                    Google AI Studio offers 100% free API keys (15 requests/min free forever).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-pink-50 border border-pink-100 text-xs text-pink-950 mb-4 leading-relaxed">
                <p>
                  Get your free Gemini key in 30 seconds at <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="underline font-bold text-pink-700">Google AI Studio</a>. Paste it below to enable AI auto-generation of viral titles, psychological hooks, and styling advice.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="password"
                  placeholder="Paste your free Gemini API Key (AIzaSy...)"
                  value={customGeminiKey}
                  onChange={(e) => setCustomGeminiKey(e.target.value)}
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                />
                <button
                  onClick={handleSaveGeminiKey}
                  className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-colors shrink-0 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Free AI Key</span>
                </button>
              </div>
            </div>

            {/* Free Vercel Deployment Instructions */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs">
              <h3 className="text-base font-bold text-gray-900 mb-2">
                🚀 100% Free Lifetime Deployment on Vercel
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Next.js can be deployed for free forever on Vercel with zero hosting costs, global CDN, and automatic SSL:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <strong className="block text-gray-900 mb-1">1. Push to GitHub</strong>
                  <p className="text-gray-500">Create a free GitHub repository and push this folder.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <strong className="block text-gray-900 mb-1">2. Import to Vercel</strong>
                  <p className="text-gray-500">Sign up on vercel.com (free) and click Import Repo.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <strong className="block text-gray-900 mb-1">3. Live in 60s</strong>
                  <p className="text-gray-500">Your site is live with custom URL to share in YouTube descriptions!</p>
                </div>
              </div>
            </div>

            {/* Reset Defaults button */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => {
                  if (confirm('Reset to default sample outfits?')) {
                    resetToDefaults();
                    loadData();
                  }
                }}
                className="text-xs text-gray-400 hover:text-red-600 flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Sample Data</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-200 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-150 mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingProduct ? 'Edit Outfit Details' : 'Add New Daily Outfit'}
                </h3>
                <p className="text-xs text-gray-500">
                  Fill in the details or use Free Gemini AI to auto-generate catchy styling & titles!
                </p>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
              >
                ×
              </button>
            </div>

            {/* AI AUTO-FILL BAR */}
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-50 to-purple-50 border border-pink-200">
              <div className="flex items-center gap-1.5 text-xs font-bold text-pink-900 mb-2">
                <Sparkles className="w-4 h-4 text-pink-600 animate-pulse" />
                <span>✨ Free Gemini AI Assistant (Auto-Fill in 1 Click)</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste product name or link (e.g. Kashmiri Cotton Anarkali from Meesho)..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 px-3.5 py-2 text-xs bg-white rounded-xl border border-pink-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                />
                <button
                  type="button"
                  onClick={handleGenerateWithAI}
                  disabled={isAiGenerating}
                  className="px-3.5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1 disabled:opacity-50"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>{isAiGenerating ? 'Generating...' : 'Auto-Fill'}</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Title & Subtitle */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Outfit Title *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Embroidered Kashmiri Cotton Anarkali Kurta Set"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Video Timestamp Context</label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder="e.g. Look #1 (Timestamp 01:42)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Affiliate Platform *</label>
                  <select
                    value={formStore}
                    onChange={(e) => setFormStore(e.target.value as StoreType)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300 capitalize"
                  >
                    <option value="meesho">Meesho</option>
                    <option value="flipkart">Flipkart</option>
                    <option value="myntra">Myntra</option>
                    <option value="amazon">Amazon</option>
                    <option value="ajio">Ajio</option>
                  </select>
                </div>
              </div>

              {/* Affiliate URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Your Affiliate / Referral URL *
                </label>
                <input
                  type="url"
                  required
                  value={formAffiliateUrl}
                  onChange={(e) => setFormAffiliateUrl(e.target.value)}
                  placeholder="https://www.meesho.com/... or https://dl.flipkart.com/..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Image URL *</label>
                <input
                  type="url"
                  required
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                />
              </div>

              {/* Price, Original Price, Category */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Sale Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as FashionCategory)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                  >
                    <option value="Kurtis & Ethnic">Kurtis & Ethnic</option>
                    <option value="Dresses & Co-ords">Dresses & Co-ords</option>
                    <option value="Tops & Tees">Tops & Tees</option>
                    <option value="Jeans & Bottoms">Jeans & Bottoms</option>
                    <option value="Streetwear">Streetwear</option>
                    <option value="Jewellery & Bags">Jewellery & Bags</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>
              </div>

              {/* Creator Review & Sizing */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  💬 Creator Note (Psychological Conversion Booster)
                </label>
                <textarea
                  rows={2}
                  value={formCreatorNote}
                  onChange={(e) => setFormCreatorNote(e.target.value)}
                  placeholder="e.g. I am 5'4, wearing S. Pure breathable cotton, looks 10x richer than ₹499!"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">📏 Sizing & Fit Tip</label>
                <input
                  type="text"
                  value={formSizingAdvice}
                  onChange={(e) => setFormSizingAdvice(e.target.value)}
                  placeholder="e.g. True to size. Go one size up for a breezy festive flare."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Brief 2-line description of fabric and cut"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="Under 499, Viral Find, Honest Review"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold shadow-md shadow-pink-600/20"
                >
                  {editingProduct ? 'Update Outfit' : 'Publish Outfit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW VIDEO DROP */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-150 mb-4">
              <h3 className="text-base font-bold text-gray-900">
                Create YouTube Video Drop
              </h3>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveVideoDrop} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Video Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Huge Meesho Kurti Haul Under ₹499! Honest Fabric Review"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">YouTube Video URL</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Video Thumbnail Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={videoThumbnail}
                  onChange={(e) => setVideoThumbnail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description Note</label>
                <textarea
                  rows={2}
                  placeholder="All 6 trending viral Kurtis from today's haul with direct links..."
                  value={videoDesc}
                  onChange={(e) => setVideoDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-gray-300 focus:outline-hidden focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/20"
                >
                  Create Drop Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthProvider>
      <AdminDashboardContent />
    </AuthProvider>
  );
}
