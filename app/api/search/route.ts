import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');
  
  console.log('API Route - Received search term:', term);

  if (!term) {
    console.log('API Route - No search term provided');
    return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
  }

  const params = new URLSearchParams({
    term,
    country: 'jp',
    media: 'software',
    entity: 'software',
    limit: '10',
    attributes: 'developerName,description,screenshotUrls,artworkUrl512,trackName,sellerName,averageUserRating,userRatingCount,price,subtitle'
  });

  const url = `https://itunes.apple.com/search?${params.toString()}`;
  console.log('API Route - Fetching from URL:', url);

  try {
    const response = await fetch(url);
    console.log('API Route - Response status:', response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch from App Store API: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Route - Received data:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Route - Search failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch from App Store API' },
      { status: 500 }
    );
  }
} 