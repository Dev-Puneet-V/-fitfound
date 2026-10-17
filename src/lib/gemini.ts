export interface AIFashionOutput {
  title: string;
  subtitle: string;
  description: string;
  category: string;
  suggestedPrice: number;
  originalPrice: number;
  discountPercent: number;
  tags: string[];
  creatorNote: string;
  sizingAdvice: string;
  seoMetaTitle: string;
  seoMetaDescription: string;
}

export async function generateFashionDetails(
  rawInput: string,
  store: string,
  apiKey?: string
): Promise<AIFashionOutput> {
  const key = apiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (key) {
    try {
      const prompt = `
You are an expert Indian fashion stylist, viral YouTube fashion creator, and e-commerce copywriter.
Analyze this raw fashion product description or link:
"${rawInput}"
Target Store: ${store} (e.g. Meesho, Flipkart, Myntra, Amazon).

Generate high-converting, psychologically engaging, and SEO-optimized fashion product metadata.
The audience arrives from YouTube video descriptions or Instagram bio links on mobile phones.
Keep the tone authentic, trendy, trustworthy, and urgency-driven (FOMO, styling hacks, honest creator sizing).

Respond ONLY with a valid JSON object matching this exact structure:
{
  "title": "Short catchy aesthetic title (max 65 chars)",
  "subtitle": "YouTube context e.g. 'Seen in Look #1 (Timestamp 02:15)' or 'Trending Viral Find'",
  "description": "Engaging 2-3 sentence product description highlighting fabric quality, cut, and occasion",
  "category": "One of: 'Kurtis & Ethnic', 'Dresses & Co-ords', 'Tops & Tees', 'Jeans & Bottoms', 'Streetwear', 'Jewellery & Bags', 'Footwear'",
  "suggestedPrice": 499,
  "originalPrice": 1499,
  "discountPercent": 67,
  "tags": ["Under 499", "Viral Find", "College Core", "Festive Ready"],
  "creatorNote": "Honest creator note e.g. 'I am 5\\'4\" and wearing Size S. Fabric is breathable cotton, looks 10x richer than ₹499!'",
  "sizingAdvice": "Clear sizing tip e.g. 'Fits true to size. If between sizes, size up for a relaxed fit.'",
  "seoMetaTitle": "SEO title for Google ranking e.g. 'Buy Trending Viral Embroidered Kurti Set Online Under ₹500'",
  "seoMetaDescription": "150-char Google meta description with high search volume keywords"
}
`;

      // Free Google Gemini 1.5 Flash endpoint
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (response.ok) {
        const json = await response.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          const parsed = JSON.parse(text) as AIFashionOutput;
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, using intelligent heuristic generator', err);
    }
  }

  // Fallback heuristic generator when API key is missing or offline
  return generateHeuristicFashionDetails(rawInput, store);
}

function generateHeuristicFashionDetails(rawInput: string, store: string): AIFashionOutput {
  const lower = rawInput.toLowerCase();
  
  let category = 'Kurtis & Ethnic';
  let price = 449;
  let original = 1399;
  let tags = ['Viral Find', 'Trending', 'Best Seller'];

  if (lower.includes('top') || lower.includes('t-shirt') || lower.includes('tee') || lower.includes('shirt')) {
    category = 'Tops & Tees';
    price = 329;
    original = 899;
    tags = ['Aesthetic Top', 'Casual Chic', 'Under 399'];
  } else if (lower.includes('dress') || lower.includes('coord') || lower.includes('co-ord') || lower.includes('set')) {
    category = 'Dresses & Co-ords';
    price = 599;
    original = 1899;
    tags = ['Korean Aesthetic', 'Cottagecore', 'Date Night'];
  } else if (lower.includes('jean') || lower.includes('pant') || lower.includes('trouser') || lower.includes('bottom')) {
    category = 'Jeans & Bottoms';
    price = 499;
    original = 1299;
    tags = ['High Waist', 'Korean Drape', 'Under 499'];
  } else if (lower.includes('jhumka') || lower.includes('jewel') || lower.includes('earring') || lower.includes('necklace') || lower.includes('bag')) {
    category = 'Jewellery & Bags';
    price = 199;
    original = 699;
    tags = ['Oxidized Silver', 'Boho Chic', 'Under 199'];
  }

  const discount = Math.round(((original - price) / original) * 100);

  // Capitalize title
  const cleanTitle = rawInput.trim().replace(/^https?:\/\/\S+/i, '').trim();
  const displayTitle = cleanTitle.length > 5 
    ? cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1)
    : `Trending Viral ${category.split(' ')[0]} Pick`;

  return {
    title: displayTitle.slice(0, 65),
    subtitle: `Seen in Today's Video Haul (Best ${store.toUpperCase()} Find)`,
    description: `Super aesthetic, premium-finish ${category.toLowerCase()} crafted from high-comfort breathable fabric. Perfect for effortless daily styling, college wear, or weekend cafe outings.`,
    category,
    suggestedPrice: price,
    originalPrice: original,
    discountPercent: discount,
    tags,
    creatorNote: `I’m wearing Size S in the YouTube video! The fabric is soft, breathable, and doesn't shrink after wash. Definitely a 10/10 steal.`,
    sizingAdvice: 'Fits true to Indian standard sizing. If you prefer a loose relaxed fit, go one size up.',
    seoMetaTitle: `${displayTitle} - Buy Online on ${store.toUpperCase()} at Best Discounted Price`,
    seoMetaDescription: `Get the exact ${displayTitle} featured in our latest YouTube fashion haul. Grab up to ${discount}% OFF on ${store.toUpperCase()} with direct creator links.`
  };
}
