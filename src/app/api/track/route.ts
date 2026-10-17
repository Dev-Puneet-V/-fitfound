import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { productId, store } = await req.json();
    // Return success response (client storage also handles offline/local click logs)
    return NextResponse.json({ success: true, productId, store, timestamp: new Date().toISOString() });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
