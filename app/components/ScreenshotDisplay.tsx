import { useState } from 'react';

interface ScreenshotDisplayProps {
  urls: string[];
  onImageClick: () => void;
}

export function ScreenshotDisplay({ urls, onImageClick }: ScreenshotDisplayProps) {
  const [isLandscape, setIsLandscape] = useState<boolean | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const handleFirstImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const landscape = img.naturalWidth > img.naturalHeight;
    setIsLandscape(landscape);
    setAspectRatio(img.naturalWidth / img.naturalHeight);
  };

  if (isLandscape === null || aspectRatio === null) {
    // 最初の画像を非表示で読み込み、アスペクト比を判定
    return (
      <img
        src={urls[0]}
        alt=""
        className="hidden"
        onLoad={handleFirstImageLoad}
      />
    );
  }

  if (isLandscape) {
    // 横長画像の場合は1枚だけ表示
    return (
      <img
        src={urls[0]}
        alt="Screenshot"
        className="w-full rounded-lg cursor-pointer"
        style={{ aspectRatio }}
        onClick={onImageClick}
      />
    );
  }

  // 縦長画像の場合は3枚まで表示
  return (
    <div className="flex gap-1.5 overflow-x-auto -mx-4 px-4">
      {urls.slice(0, 3).map((url, index) => (
        <img
          key={index}
          src={url}
          alt={`Screenshot ${index + 1}`}
          className="h-[144px] w-auto flex-shrink-0 rounded-lg cursor-pointer object-contain"
          style={{ aspectRatio }}
          onClick={onImageClick}
        />
      ))}
    </div>
  );
} 