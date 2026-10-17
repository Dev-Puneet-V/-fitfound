import { Product, VideoDrop, ClickRecord, AdminStats, StoreType } from '@/types';
import { initialProducts, initialVideoDrops } from './mockData';
import { supabase, isSupabaseConfigured } from './supabase';

const PRODUCTS_KEY = 'trenddrop_products';
const VIDEOS_KEY = 'trenddrop_videos';
const CLICKS_KEY = 'trenddrop_clicks';

async function withTimeout<T>(promiseLike: PromiseLike<T>, ms = 1800): Promise<T> {
  const p = Promise.resolve(promiseLike);
  let timeoutId: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Supabase request timeout')), ms);
  });
  return Promise.race([p, timeout]).finally(() => {
    clearTimeout(timeoutId);
  });
}

export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const res = await withTimeout(
        supabase
          .from('products')
          .select('*')
          .order('createdAt', { ascending: false })
      );
      const { data, error } = res as any;
      if (!error && data && data.length > 0) {
        return data as Product[];
      }
    } catch (err) {
      console.warn('Supabase fetch failed or timed out, falling back to local storage', err);
    }
  }

  // Local storage fallback
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(PRODUCTS_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Error parsing local products', e);
      }
    }
    // initialize
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
  }

  return initialProducts;
}

export async function saveProduct(product: Product): Promise<Product> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .upsert(product)
        .select()
        .single();
      if (!error && data) {
        return data as Product;
      }
    } catch (err) {
      console.warn('Supabase upsert failed, saving locally', err);
    }
  }

  // Local storage save
  if (typeof window !== 'undefined') {
    const existing = await getProducts();
    const index = existing.findIndex(p => p.id === product.id);
    let updated: Product[];
    if (index >= 0) {
      updated = [...existing];
      updated[index] = product;
    } else {
      updated = [product, ...existing];
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  }

  return product;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) return true;
    } catch (err) {
      console.warn('Supabase delete failed', err);
    }
  }

  if (typeof window !== 'undefined') {
    const existing = await getProducts();
    const updated = existing.filter(p => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
    return true;
  }
  return false;
}

export async function getVideoDrops(): Promise<VideoDrop[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const res = await withTimeout(
        supabase
          .from('video_drops')
          .select('*')
          .order('publishedDate', { ascending: false })
      );
      const { data, error } = res as any;
      if (!error && data && data.length > 0) {
        return data as VideoDrop[];
      }
    } catch (err) {
      console.warn('Supabase video fetch failed or timed out, fallback to local', err);
    }
  }

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(VIDEOS_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Error parsing local videos', e);
      }
    }
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(initialVideoDrops));
  }

  return initialVideoDrops;
}

export async function saveVideoDrop(drop: VideoDrop): Promise<VideoDrop> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('video_drops')
        .upsert(drop)
        .select()
        .single();
      if (!error && data) {
        return data as VideoDrop;
      }
    } catch (err) {
      console.warn('Supabase upsert video failed', err);
    }
  }

  if (typeof window !== 'undefined') {
    const existing = await getVideoDrops();
    const idx = existing.findIndex(v => v.id === drop.id);
    let updated: VideoDrop[];
    if (idx >= 0) {
      updated = [...existing];
      updated[idx] = drop;
    } else {
      updated = [drop, ...existing];
    }
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(updated));
  }

  return drop;
}

export async function deleteVideoDrop(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('video_drops').delete().eq('id', id);
      return true;
    } catch (err) {
      console.warn('Supabase delete video failed', err);
    }
  }

  if (typeof window !== 'undefined') {
    const existing = await getVideoDrops();
    const updated = existing.filter(v => v.id !== id);
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(updated));
    return true;
  }
  return false;
}

export async function recordClick(productId: string, store: StoreType): Promise<void> {
  const newClick: ClickRecord = {
    id: `click-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    productId,
    store,
    timestamp: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('clicks').insert([newClick]);
      // increment clicks on product
      await supabase.rpc('increment_product_clicks', { p_id: productId });
    } catch (err) {
      console.warn('Supabase click logging failed', err);
    }
  }

  // Update local storage
  if (typeof window !== 'undefined') {
    const existingClicksStr = localStorage.getItem(CLICKS_KEY);
    const existingClicks: ClickRecord[] = existingClicksStr ? JSON.parse(existingClicksStr) : [];
    existingClicks.push(newClick);
    localStorage.setItem(CLICKS_KEY, JSON.stringify(existingClicks));

    // Also update product clicksCount locally
    const prods = await getProducts();
    const idx = prods.findIndex(p => p.id === productId);
    if (idx >= 0) {
      prods[idx].clicksCount = (prods[idx].clicksCount || 0) + 1;
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(prods));
    }
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  const products = await getProducts();
  let clicks: ClickRecord[] = [];

  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem(CLICKS_KEY);
    if (raw) {
      try {
        clicks = JSON.parse(raw);
      } catch (e) {
        clicks = [];
      }
    }
  }

  // Sum total clicks
  const totalFromProducts = products.reduce((acc, p) => acc + (p.clicksCount || 0), 0);
  const totalClicks = Math.max(totalFromProducts, clicks.length);

  // Store breakdown
  const storeBreakdown: Record<StoreType, number> = {
    meesho: 0,
    flipkart: 0,
    myntra: 0,
    amazon: 0,
    ajio: 0
  };

  products.forEach(p => {
    if (storeBreakdown[p.store] !== undefined) {
      storeBreakdown[p.store] += p.clicksCount || 0;
    }
  });

  // Top products
  const sorted = [...products].sort((a, b) => (b.clicksCount || 0) - (a.clicksCount || 0));
  const topProducts = sorted.slice(0, 5).map(p => ({
    id: p.id,
    title: p.title,
    clicks: p.clicksCount || 0,
    store: p.store
  }));

  // Today's clicks (simulate or filter)
  const todayStr = new Date().toISOString().split('T')[0];
  const todayClicks = clicks.filter(c => c.timestamp.startsWith(todayStr)).length || Math.floor(totalClicks * 0.35);

  return {
    totalClicks,
    todayClicks,
    totalProducts: products.length,
    storeBreakdown,
    topProducts
  };
}

export function resetToDefaults(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
    localStorage.setItem(VIDEOS_KEY, JSON.stringify(initialVideoDrops));
    localStorage.removeItem(CLICKS_KEY);
  }
}
