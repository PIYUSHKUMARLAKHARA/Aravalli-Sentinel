import React, { useState } from 'react';
import { Eye, ImageOff } from 'lucide-react';

const CATEGORY_DEFAULT_PHOTOS = {
  'Illegal Mining': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
  'Illegal Mining & Quarrying': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
  'Deforestation': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  'Deforestation / Tree Felling': 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  'Water Stress': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
  'Ground Water Depletion / Deep Boring': 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
  'Toxic Dumping': 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1200&q=80',
  'Toxic Waste Dumping': 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=1200&q=80',
  'Encroachment': 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1200&q=80',
  'Encroachment & Construction': 'https://images.unsplash.com/photo-1590496793929-36417d3117de?auto=format&fit=crop&w=1200&q=80',
  'Land Degradation': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
  'Other Ecological Threat': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
};

export function ImageWithFallback({
  src,
  fallbackSrc,
  threatCategory,
  alt = 'Environmental Evidence',
  className = 'w-full h-full object-cover',
  containerClassName = '',
  onZoom,
  showZoomBadge = false,
}) {
  const [errorCount, setErrorCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Determine current image source
  let currentSrc = src;
  if (!src || errorCount === 1) {
    currentSrc = fallbackSrc || CATEGORY_DEFAULT_PHOTOS[threatCategory] || CATEGORY_DEFAULT_PHOTOS['Illegal Mining'];
  } else if (errorCount >= 2) {
    currentSrc = CATEGORY_DEFAULT_PHOTOS[threatCategory] || CATEGORY_DEFAULT_PHOTOS['Illegal Mining'];
  }

  const handleError = () => {
    setLoading(false);
    setErrorCount(prev => prev + 1);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className={`relative overflow-hidden group bg-slate-900 ${containerClassName}`}>
      {loading && (
        <div className="absolute inset-0 bg-slate-800/80 animate-pulse flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-emerald-500/40 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      )}

      {errorCount > 2 ? (
        <div className="w-full h-full min-h-[100px] flex flex-col items-center justify-center bg-slate-950 text-slate-500 p-4 text-center">
          <ImageOff className="w-6 h-6 mb-1 text-slate-600" />
          <span className="text-[10px] font-mono">Evidence image unavailable</span>
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          onError={handleError}
          onLoad={handleLoad}
          className={`${className} transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        />
      )}

      {showZoomBadge && onZoom && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onZoom({
              url: currentSrc,
              alt,
              threatCategory,
            });
          }}
          className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-950/80 hover:bg-emerald-600 text-slate-300 hover:text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-md"
          title="Inspect Full-Size Evidence"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export default ImageWithFallback;
