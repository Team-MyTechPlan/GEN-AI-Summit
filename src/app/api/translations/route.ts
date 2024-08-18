// app/api/translations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTranslations } from '@/lib/getTranslations';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lang = searchParams.get('lang');

  if (!lang || !['en', 'es'].includes(lang)) {
    return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
  }

  try {
    const translations = await getTranslations(lang);
    return NextResponse.json(translations);
  } catch (error) {
    console.error('Failed to load translations:', error);
    return NextResponse.json({ error: 'Failed to load translations' }, { status: 500 });
  }
}