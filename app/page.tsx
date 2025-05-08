'use client';

import { useState, ChangeEvent } from 'react';
import { AppStoreApp } from './types/app-store';
import { searchApps } from './utils/app-store';
import { ScreenshotDisplay } from './components/ScreenshotDisplay';

export default function Home() {
  const [appIcon, setAppIcon] = useState<string | null>(null);
  const [screenshotOrientation, setScreenshotOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [screenshots, setScreenshots] = useState<(string | null)[]>(['', '', '']);
  const [appName, setAppName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<AppStoreApp[]>([]);
  const [selectedApp, setSelectedApp] = useState<AppStoreApp | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    console.log('Searching for:', searchTerm);
    
    try {
      console.log('Calling searchApps...');
      const result = await searchApps(searchTerm);
      console.log('Search results:', result);
      setSearchResults(result.results);
      setSelectedApp(null);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIconUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAppIcon(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshotUpload = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshots(prev => {
          const next = [...prev];
          next[index] = reader.result as string;
          return next;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScreenshotRemove = (index: number) => () => {
    setScreenshots(prev => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
  };

  const handleOrientationChange = (ori: 'portrait' | 'landscape') => {
    setScreenshotOrientation(ori);
    if (ori === 'landscape') {
      setScreenshots([screenshots[0] || null, null, null]);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side - Search and iPhone Preview */}
        <div className="space-y-4">
          {/* Search Bar - Outside iPhone */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold mb-3">競合アプリを検索</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="アプリを検索..."
                className="flex-1 px-4 py-2 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-500 text-white text-base rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? '検索中...' : '検索'}
              </button>
            </div>
          </div>

          {/* iPhone Preview */}
          <div className="relative flex justify-center">
            <div className="w-[320px]">
              {/* iPhone Frame */}
              <div className="relative bg-black rounded-[50px] aspect-[9/19.5] p-3">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[25px] bg-black rounded-b-3xl z-10"></div>
                
                {/* Dynamic Island */}
                <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[80px] h-[8px] bg-black rounded-full z-10"></div>
                
                {/* Screen Content */}
                <div className="bg-white rounded-[40px] h-full overflow-hidden flex flex-col">
                  {/* Fixed App Preview */}
                  <div className="bg-white p-4 border-b border-gray-200">
                    <div className="flex items-start space-x-3">
                      {appIcon ? (
                        <img src={appIcon} alt="App Icon" className="w-[42px] h-[42px] rounded-xl" />
                      ) : (
                        <div className="w-[42px] h-[42px] bg-gray-200 rounded-xl flex items-center justify-center">
                          <span className="text-gray-400 text-[8px]">No Icon</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-[13px] leading-tight truncate">{appName || 'アプリ名'}</h4>
                        {/* 評価・件数（自分のアプリはダミー） */}
                        <p className="text-[10px] text-gray-400 mt-0.5">評価: -（-件）</p>
                      </div>
                    </div>
                    {/* スクリーンショット表示エリア */}
                    <div className="mt-3 flex gap-2 justify-center">
                      {screenshotOrientation === 'portrait'
                        ? screenshots.map((img, i) => (
                            <div key={i} className="h-[144px] w-auto flex items-center justify-center bg-gray-100 rounded-xl relative">
                              {img ? (
                                <>
                                  <img src={img} alt={`Screenshot${i+1}`} className="h-[144px] w-auto max-w-full rounded-xl object-contain" />
                                  <button type="button" className="absolute top-1 right-1 text-xs text-gray-400" onClick={handleScreenshotRemove(i)}>×</button>
                                </>
                              ) : (
                                <label className="flex flex-col items-center justify-center h-full w-[48px] cursor-pointer text-gray-400 text-xs">
                                  <span>＋</span>
                                  <input type="file" className="hidden" accept="image/*" onChange={handleScreenshotUpload(i)} />
                                </label>
                              )}
                            </div>
                          ))
                        : (
                            <div className="h-[144px] w-auto flex items-center justify-center bg-gray-100 rounded-xl relative">
                              {screenshots[0] ? (
                                <>
                                  <img src={screenshots[0]} alt="Screenshot1" className="h-[144px] w-auto max-w-full rounded-xl object-contain" />
                                  <button type="button" className="absolute top-1 right-1 text-xs text-gray-400" onClick={handleScreenshotRemove(0)}>×</button>
                                </>
                              ) : (
                                <label className="flex flex-col items-center justify-center h-full w-[48px] cursor-pointer text-gray-400 text-xs">
                                  <span>＋</span>
                                  <input type="file" className="hidden" accept="image/*" onChange={handleScreenshotUpload(0)} />
                                </label>
                              )}
                            </div>
                          )}
                    </div>
                  </div>

                  {/* Scrollable Results Area */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4">
                      {isLoading ? (
                        <div className="text-center py-4 text-gray-500 text-[13px]">検索中...</div>
                      ) : selectedApp ? (
                        // Selected App Detail View
                        <div>
                          <div className="flex items-start space-x-3">
                            <img src={selectedApp.artworkUrl512} alt={selectedApp.trackName} className="w-[42px] h-[42px] rounded-xl" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-[13px] leading-tight truncate">{selectedApp.trackName}</h4>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {selectedApp.averageUserRating ? `★ ${selectedApp.averageUserRating.toFixed(1)}（${selectedApp.userRatingCount.toLocaleString()}件）` : '評価なし'}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-4 mt-3">
                            <ScreenshotDisplay
                              urls={selectedApp.screenshotUrls}
                              onImageClick={() => {}}
                            />
                            <button
                              onClick={() => setSelectedApp(null)}
                              className="text-blue-500 text-[11px]"
                            >
                              ← 検索結果に戻る
                            </button>
                          </div>
                        </div>
                      ) : searchResults.length > 0 ? (
                        // Search Results List
                        <div className="space-y-6">
                          {searchResults.map((app) => (
                            <div
                              key={app.trackId}
                              className="space-y-3"
                            >
                              {/* App Info */}
                              <div
                                onClick={() => setSelectedApp(app)}
                                className="flex items-start space-x-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                              >
                                <img
                                  src={app.artworkUrl512}
                                  alt={app.trackName}
                                  className="w-[42px] h-[42px] rounded-xl"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-[13px] leading-tight truncate">{app.trackName}</h4>
                                  <p className="text-[10px] text-gray-400 mt-0.5">
                                    {app.averageUserRating ? `★ ${app.averageUserRating.toFixed(1)}（${app.userRatingCount.toLocaleString()}件）` : '評価なし'}
                                  </p>
                                </div>
                              </div>
                              
                              {/* App Screenshots */}
                              <ScreenshotDisplay
                                urls={app.screenshotUrls}
                                onImageClick={() => setSelectedApp(app)}
                              />
                              
                              {/* Separator */}
                              <div className="border-b border-gray-200"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        // Initial State or No Results
                        <div className="text-center py-4 text-gray-500 text-[13px]">
                          {searchTerm ? '検索結果がありません' : '競合アプリを検索してください'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Upload Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-8">開発アプリのプレビュー</h1>
          
          {/* App Info Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">アプリ情報</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">アプリ名</label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="アプリ名を入力"
                />
              </div>
              {/* アイコンアップロード */}
              <div>
                <h2 className="text-xl font-semibold mb-2">アプリアイコン (正方形)</h2>
                <p className="text-gray-600 mb-4">1024 x 1024 推奨</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {appIcon ? (
                    <img src={appIcon} alt="App Icon" className="max-w-[200px] mx-auto" />
                  ) : (
                    <div>
                      <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
                        アイコンをアップロード
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleIconUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
              {/* スクリーンショット向き選択 */}
              <div>
                <h2 className="text-xl font-semibold mb-2">スクリーンショット (縦または横)</h2>
                <div className="mb-2 flex gap-4 items-center">
                  <span className="text-sm">向き:</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="orientation" value="portrait" checked={screenshotOrientation === 'portrait'} onChange={() => handleOrientationChange('portrait')} />
                    <span className="text-sm">縦</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="radio" name="orientation" value="landscape" checked={screenshotOrientation === 'landscape'} onChange={() => handleOrientationChange('landscape')} />
                    <span className="text-sm">横</span>
                  </label>
                </div>
                <p className="text-gray-600 mb-4">iPhone: 1290 x 2796px / iPad: 2048 x 2732px 推奨</p>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center flex gap-2 justify-center">
                  {screenshotOrientation === 'portrait'
                    ? screenshots.map((img, i) => (
                        <div key={i} className="h-[144px] w-auto flex items-center justify-center bg-gray-100 rounded-xl relative">
                          {img ? (
                            <>
                              <img src={img} alt={`Screenshot${i+1}`} className="h-[144px] w-auto max-w-full rounded-xl object-contain" />
                              <button type="button" className="absolute top-1 right-1 text-xs text-gray-400" onClick={handleScreenshotRemove(i)}>×</button>
                            </>
                          ) : (
                            <label className="flex flex-col items-center justify-center h-full w-[48px] cursor-pointer text-gray-400 text-xs">
                              <span>＋</span>
                              <input type="file" className="hidden" accept="image/*" onChange={handleScreenshotUpload(i)} />
                            </label>
                          )}
                        </div>
                      ))
                    : (
                        <div className="h-[144px] w-auto flex items-center justify-center bg-gray-100 rounded-xl relative">
                          {screenshots[0] ? (
                            <>
                              <img src={screenshots[0]} alt="Screenshot1" className="h-[144px] w-auto max-w-full rounded-xl object-contain" />
                              <button type="button" className="absolute top-1 right-1 text-xs text-gray-400" onClick={handleScreenshotRemove(0)}>×</button>
                            </>
                          ) : (
                            <label className="flex flex-col items-center justify-center h-full w-[48px] cursor-pointer text-gray-400 text-xs">
                              <span>＋</span>
                              <input type="file" className="hidden" accept="image/*" onChange={handleScreenshotUpload(0)} />
                            </label>
                          )}
                        </div>
                      )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 