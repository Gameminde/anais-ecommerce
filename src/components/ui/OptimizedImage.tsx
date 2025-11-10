import React from 'react';

// Simple placeholder SVG data URL
const PLACEHOLDER_SVG = "data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ccircle cx='100' cy='80' r='20' fill='%23d1d5db'/%3E%3Ctext x='100' y='185' text-anchor='middle' font-family='Arial, sans-serif' font-size='12' fill='%236b7280'%3EImage%3C/text%3E%3C/svg%3E";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  placeholder?: string;
}

// Fonction pour convertir une URL Supabase en URL Edge Function
const getEdgeFunctionUrl = (supabaseUrl: string): string | null => {
  if (!supabaseUrl.includes('supabase.co') || !supabaseUrl.includes('/storage/v1/object/public/products/')) {
    return null;
  }

  // Extraire le nom du fichier de l'URL Supabase
  // Exemple: https://zvyhuqkyeyzkjdvafdkx.supabase.co/storage/v1/object/public/products/1762726640710-jwmxj2fgspb.png
  // Devient: 1762726640710-jwmxj2fgspb.png
  const urlParts = supabaseUrl.split('/products/');
  if (urlParts.length !== 2) return null;

  const fileName = urlParts[1];
  const edgeFunctionUrl = `https://zvyhuqkyeyzkjdvafdkx.supabase.co/functions/v1/serve-image?path=${encodeURIComponent(fileName)}`;

  return edgeFunctionUrl;
};

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes,
  placeholder = PLACEHOLDER_SVG
}) => {
  // For Supabase images, use direct URL with aggressive CORS settings
  if (src.includes('supabase.co') && src.includes('/storage/v1/object/public/')) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading="lazy"
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        onError={(e) => {
          console.error(`❌ Supabase image failed: ${src}`);
          const target = e.target as HTMLImageElement;
          if (target && placeholder !== src) {
            target.src = placeholder;
          }
        }}
      />
    );
  }

  // For other images, use simple img tag
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      onError={(e) => {
        console.warn(`Failed to load image: ${src}`);
        const target = e.target as HTMLImageElement;
        if (target && placeholder !== src) {
          target.src = placeholder;
        }
      }}
    />
  );
};

// Hook for preloading critical images
export const useImagePreloader = () => {
  const preloadImage = (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  };

  const preloadImages = (srcs: string[]): Promise<void[]> => {
    return Promise.all(srcs.map(src => preloadImage(src)));
  };

  return { preloadImage, preloadImages };
};
