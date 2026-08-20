import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Maximize2, X } from 'lucide-react';

export interface SlideItem {
  id: string | number;
  url: string;
  title?: string;
  description?: string;
  category?: string;
}

interface ImageSliderProps {
  slides: SlideItem[];
  intervalMs?: number;
  autoPlay?: boolean;
  showThumbnails?: boolean;
  showIndicators?: boolean;
  showCaptions?: boolean;
  aspectRatio?: 'video' | 'wide' | 'square' | 'auto';
  className?: string;
}

export const ImageSlider: React.FC<ImageSliderProps> = ({
  slides = [],
  intervalMs = 5000,
  autoPlay: initialAutoPlay = true,
  showThumbnails = true,
  showIndicators = true,
  showCaptions = true,
  aspectRatio = 'video',
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(initialAutoPlay);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay effect
  useEffect(() => {
    if (!isPlaying || isHovered || slides.length <= 1) return;

    const timer = setInterval(() => {
      nextSlide();
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, slides.length, intervalMs, nextSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, isFullscreen]);

  if (!slides || slides.length === 0) {
    return (
      <div className="w-full py-16 bg-slate-900/5 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-500">
        No slides available to display
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  const aspectClasses = {
    video: 'aspect-[16/9]',
    wide: 'aspect-[21/9]',
    square: 'aspect-square',
    auto: 'h-[450px]',
  }[aspectRatio];

  return (
    <div className={`w-full flex flex-col gap-3 select-none ${className}`}>
      {/* Main Slider Viewport */}
      <div
        id="frontend-image-slider"
        className={`relative w-full overflow-hidden rounded-2xl bg-slate-950 shadow-xl ${aspectClasses}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slides rendering */}
        {slides.map((slide, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
            >
              <img
                src={slide.url}
                alt={slide.title || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
                loading={index === 0 ? 'eager' : 'lazy'}
              />

              {/* Gradient overlay for text readability */}
              {showCaptions && (slide.title || slide.description) && (
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-6 md:p-8 text-white">
                  {slide.category && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                      {slide.category}
                    </span>
                  )}
                  {slide.title && (
                    <h3 className="text-lg md:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
                      {slide.title}
                    </h3>
                  )}
                  {slide.description && (
                    <p className="mt-1 text-sm md:text-base text-slate-200 line-clamp-2 max-w-2xl">
                      {slide.description}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              id="slider-prev-btn"
              type="button"
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-transform active:scale-95"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              id="slider-next-btn"
              type="button"
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition-transform active:scale-95"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Top Control Bar (Autoplay toggle & Fullscreen) */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          {slides.length > 1 && (
            <button
              id="slider-playpause-btn"
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/10 transition-colors"
              title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
          )}

          <button
            id="slider-fullscreen-btn"
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="p-2 rounded-full bg-slate-900/60 hover:bg-slate-900/90 text-white backdrop-blur-md border border-white/10 transition-colors"
            title="View fullscreen"
            aria-label="View fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar for Autoplay */}
        {isPlaying && !isHovered && slides.length > 1 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-20 overflow-hidden">
            <div
              key={currentIndex}
              className="h-full bg-cyan-400 transition-all"
              style={{
                animation: `sliderProgress ${intervalMs}ms linear forwards`,
              }}
            />
          </div>
        )}

        {/* Slide Counter Badge */}
        <div className="absolute bottom-4 right-4 z-20 px-3 py-1 rounded-full bg-slate-900/60 text-xs text-white/90 font-medium backdrop-blur-md border border-white/10">
          {currentIndex + 1} / {slides.length}
        </div>

        {/* Slide Indicators / Dots */}
        {showIndicators && slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                id={`slider-dot-${index}`}
                type="button"
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-7 bg-white'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {showThumbnails && slides.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-1 px-1 no-scrollbar">
          {slides.map((slide, index) => {
            const isSelected = index === currentIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(index)}
                className={`relative shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  isSelected
                    ? 'border-cyan-500 scale-105 shadow-md shadow-cyan-500/20'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={slide.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 md:p-8 backdrop-blur-sm animate-in fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between text-white">
            <span className="text-sm font-medium text-slate-300">
              {currentIndex + 1} of {slides.length}
            </span>
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Central Image with prev/next */}
          <div className="relative flex-1 flex items-center justify-center max-w-6xl mx-auto w-full my-4">
            <button
              type="button"
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            <img
              src={currentSlide.url}
              alt={currentSlide.title || 'Fullscreen slide'}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            <button
              type="button"
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Caption in Fullscreen */}
          {currentSlide.title && (
            <div className="text-center text-white max-w-2xl mx-auto">
              <h4 className="text-lg font-semibold">{currentSlide.title}</h4>
              {currentSlide.description && (
                <p className="text-sm text-slate-400 mt-1">{currentSlide.description}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Progress animation keyframes inline */}
      <style>{`
        @keyframes sliderProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};
