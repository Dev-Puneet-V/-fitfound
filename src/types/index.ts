export type StoreType = 'flipkart' | 'meesho' | 'myntra' | 'amazon' | 'ajio';

export type FashionCategory = 
  | 'All'
  | 'Kurtis & Ethnic'
  | 'Dresses & Co-ords'
  | 'Tops & Tees'
  | 'Jeans & Bottoms'
  | 'Streetwear'
  | 'Jewellery & Bags'
  | 'Footwear';

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  store: StoreType;
  affiliateUrl: string;
  imageUrl: string;
  secondaryImages?: string[];
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  category: FashionCategory;
  tags: string[];
  creatorNote?: string;
  sizingAdvice?: string;
  videoTitle?: string;
  videoUrl?: string;
  isTrending?: boolean;
  isStealDeal?: boolean;
  clicksCount: number;
  createdAt: string;
}

export interface VideoDrop {
  id: string;
  slug: string;
  title: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  thumbnailUrl: string;
  publishedDate: string;
  description: string;
  productCount?: number;
}

export interface ClickRecord {
  id: string;
  productId: string;
  store: StoreType;
  timestamp: string;
  referrer?: string;
}

export interface AdminStats {
  totalClicks: number;
  todayClicks: number;
  totalProducts: number;
  storeBreakdown: Record<StoreType, number>;
  topProducts: { id: string; title: string; clicks: number; store: StoreType }[];
}
