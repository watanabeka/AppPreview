import { AppStoreResult } from '../types/app-store';

export async function searchApps(term: string): Promise<AppStoreResult> {
  const params = new URLSearchParams({ term });
  const url = `/api/search?${params.toString()}`;
  
  console.log('Fetching from API:', url);
  
  const response = await fetch(url);
  console.log('API Response status:', response.status);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('API Error:', errorData);
    throw new Error(errorData.error || 'Failed to fetch from App Store API');
  }

  const data = await response.json();
  console.log('API Response data:', data);
  return data;
} 