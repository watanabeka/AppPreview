export interface AppStoreResult {
  resultCount: number;
  results: AppStoreApp[];
}

export interface AppStoreApp {
  trackId: number;
  trackName: string;
  sellerName: string;
  artworkUrl512: string;
  screenshotUrls: string[];
  description: string;
  averageUserRating: number;
  userRatingCount: number;
  primaryGenreName: string;
  price: number;
  subtitle: string;
} 