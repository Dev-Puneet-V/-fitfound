# 🌸 TrendDrop — Daily Viral Fashion Affiliate Platform & Creator Studio

> **Designed specifically for YouTube & Instagram fashion creators.**
> Converts video viewers into high-intent buyers on **Meesho**, **Flipkart**, **Myntra**, and **Amazon** with zero friction, psychological social proof, honest sizing reviews, and 100% free hosting.

---

## ⚡ What Makes This Special?

1. **YouTube-to-Checkout Funnel**:
   - YouTube viewers land directly on the outfits featured in that exact video (`?video=meesho-kurti-haul-under-499`).
   - Timestamps matched: "Look #1 (01:42)", "Look #2 (04:15)".
2. **Psychological Conversion UX**:
   - **Live Activity Toasts**: *"✨ Sneha from Pune just grabbed the Kashmiri Cotton Anarkali"*
   - **Live Viewers Badge**: Dynamic shoppers count (*148 shoppers live*).
   - **Creator Truth Badge**: Honest fabric quality rating & exact size/height worn by creator to eliminate return hesitation.
   - **Direct Store Badges**: Meesho (fuchsia), Flipkart (blue/yellow), Myntra (rose), Amazon (amber).
   - **Confetti Micro-Delight**: Celebratory micro-burst when clicking "Buy Now" before redirecting to the affiliate partner.
   - **1-Click WhatsApp Share**: Pre-filled viral messages for viewers to share outfits with friends.
3. **Handy Creator Admin Dashboard (`/admin`)**:
   - Add/edit daily drops in 30 seconds.
   - **✨ Free Gemini AI Assistant**: Auto-fills titles, psychological creator notes, sizing tips, tags, and SEO tags with 1 click.
   - **YouTube Description Generator**: 1-click copies a ready-to-paste text block for your YouTube description and pinned comment.
   - **Affiliate Telemetry**: Live click tracker and store breakdown (Meesho vs Flipkart vs Myntra).
4. **100% Free Lifetime Infrastructure**:
   - **Frontend & API**: Deployed free on **Vercel** with global CDN and SSL.
   - **Database**: **Supabase** (Free 500MB PostgreSQL, with resilient LocalStorage fallback so it works immediately).
   - **AI API**: **Google Gemini 1.5 Flash** (Free tier via Google AI Studio).

---

## 🚀 Quick Start (Local Development)

```bash
cd trenddrop
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the public storefront and [http://localhost:3000/admin](http://localhost:3000/admin) for the Creator Studio.

---

## 🆓 100% Free Deployment & Cloud Setup

### 1. Free Hosting on Vercel (0 Cost Forever)
1. Push this project to a free GitHub repository.
2. Sign in to [vercel.com](https://vercel.com) (free Hobby tier).
3. Click **Add New Project** -> **Import** your repository.
4. Click **Deploy**. Your site is instantly live with a free `.vercel.app` domain or your own custom domain.

### 2. Free Google Gemini AI Key (Zero Cost)
1. Visit [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Click **Create API Key** (instant, free 15 requests per minute).
3. Paste the key in your dashboard under **Settings** or set `GEMINI_API_KEY` in your `.env.local` / Vercel Environment Variables.

### 3. Free Supabase Database (500MB Free PostgreSQL)
1. Sign up at [supabase.com](https://supabase.com) and create a free project.
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the 1-Click SQL script provided directly in your TrendDrop Admin Dashboard (**Settings** tab) and click **Run**.
4. Copy your `Project URL` and `anon public key` from **Project Settings > API** into your `.env.local` or Vercel Environment Variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
*(Note: If you haven't set up Supabase yet, the site automatically uses browser LocalStorage, so everything works out of the box!)*
