import { AppStoreResult } from '../types/app-store';

export async function searchApps(term: string): Promise<AppStoreResult> {
  const params = new URLSearchParams({
    term,
    country: 'jp',
    media: 'software',
    entity: 'software',
    limit: '10',
    attributes: 'developerName,description,screenshotUrls,artworkUrl512,trackName,sellerName,averageUserRating,userRatingCount,price,subtitle'
  });
  
  const url = `https://itunes.apple.com/search?${params.toString()}`;
  console.log('Fetching from iTunes API:', url);
  
  const response = await fetch(url);
  console.log('iTunes API Response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('iTunes API Error:', errorData);
    throw new Error(errorData.error || 'Failed to fetch from iTunes API');
  }

  const data = await response.json();
  console.log('iTunes API Response data:', data);
  return data;
} 