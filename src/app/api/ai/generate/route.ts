import { NextRequest, NextResponse } from 'next/server';
import { generateFashionDetails } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawInput, store, customApiKey } = body;

    if (!rawInput) {
      return NextResponse.json({ error: 'Raw input or title is required' }, { status: 400 });
    }

    const result = await generateFashionDetails(rawInput, store || 'meesho', customApiKey);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API AI generation error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to generate details' },
      { status: 500 }
    );
  }
}
