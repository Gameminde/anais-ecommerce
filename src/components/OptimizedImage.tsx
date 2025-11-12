import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate responsive image URLs with vite-imagetools
  const generateSrcSet = (src: string) => {
    // For local images, use vite-imagetools query parameters
    if (src.startsWith('/')) {
      return `${src}?w=400;800;1200&format=webp&quality=85`;
    }
    return src;
  };

  const generateSrc = (src: string) => {
    // For local images, use vite-imagetools query parameters
    if (src.startsWith('/')) {
      return `${src}?w=800&format=webp&quality=85`;
    }
    return src;
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder/Skeleton */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          {placeholder ? (
            <img
              src={placeholder}
              alt=""
              className="w-8 h-8 opacity-50"
            />
          ) : (
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          )}
        </div>
      )}

      {/* Main Image */}
      {isInView && (
        <picture>
          {/* WebP format for modern browsers */}
          <source
            srcSet={generateSrcSet(src)}
            type="image/webp"
          />
          {/* Fallback to original format */}
          <img
            ref={imgRef}
            src={generateSrc(src)}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              aspectRatio: width && height ? `${width}/${height}` : undefined
            }}
          />
        </picture>
      )}

      {/* Error state */}
      {hasError && (
        <div
          className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400"
          style={{ width, height }}
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
