import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRENDDROP • Daily Viral Fashion Outfits | As Seen on YouTube",
  description: "Browse and buy exact trending fashion clothes from our latest YouTube hauls. Verified fabric quality, honest creator sizing advice, and lowest price affiliate links to Meesho, Flipkart & Myntra.",
  keywords: [
    "Meesho haul",
    "Flipkart fashion haul",
    "trending kurtis under 500",
    "aesthetic Korean dresses",
    "YouTube fashion haul links",
    "affiliate fashion deals India",
    "college outfits under 499"
  ],
  authors: [{ name: "TrendDrop Fashion Studio" }],
  openGraph: {
    title: "TRENDDROP • Trending Fashion Clothes Daily",
    description: "Exact outfits from our YouTube haul with honest creator sizing & lowest prices on Meesho & Flipkart.",
    url: "https://trenddrop.vercel.app",
    siteName: "TrendDrop",
    images: [
      {
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "TrendDrop Fashion Outfits"
      }
    ],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "TRENDDROP • Trending Fashion Clothes Daily",
    description: "Direct links to every outfit featured in our YouTube videos with creator sizing recommendations.",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#faf9f6] text-gray-900 antialiased selection:bg-pink-100 selection:text-pink-900">
        {children}
      </body>
    </html>
  );
}
