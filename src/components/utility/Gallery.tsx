import React, { useCallback, useRef, useState } from "react";

export type GalleryItem = {
  description: string;
  path: string;
};

export type GalleryProps = {
  set: GalleryItem[];
  className?: string;
  height?: number | string;
};

function isVideoPath(path: string): boolean {
  return /\.(mp4|webm|ogg)$/i.test(path);
}

function normalizeSrc(path: string): string {
  // Keep relative paths as-is for GitHub Pages compatibility
  return path;
}

export default function Gallery({ set, className, height }: GalleryProps) {
  const items = set.map((it) => ({ ...it, path: normalizeSrc(it.path) }));
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  if (!items.length) return null;

  const goPrev = useCallback(() => {
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const goNext = useCallback(() => {
    setIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartX.current = t.clientX;
    touchStartY.current = t.clientY;
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current == null || touchStartY.current == null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX.current;
    const dy = t.clientY - touchStartY.current;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    touchStartX.current = null;
    touchStartY.current = null;

    // Only consider mostly-horizontal swipes
    if (absDx > 40 && absDx > absDy) {
      if (dx < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  }, [goNext, goPrev]);

  const current = items[index];
  const altText = current.description || "Gallery item";

  const wrapperClass = (
    `bg-white rounded-lg shadow border border-gray-100 ${className ?? ""}`
  ).trim();

  const resolvedHeight = typeof height === "number" ? `${height}px` : height;
  const hasHeight = Boolean(resolvedHeight);
  const containerStyle: React.CSSProperties | undefined = hasHeight
    ? { height: resolvedHeight }
    : undefined;
  const imageClass = hasHeight
    ? `max-w-full max-h-full w-auto h-[${height}px] object-contain`
    : "w-full h-auto object-cover";
  const videoClass = hasHeight
    ? `max-w-full max-h-full w-auto h-[${height}px] object-contain`
    : "w-full h-auto";

  return (
    <figure className={wrapperClass}>
      <div
        className="relative bg-gray-100 grid place-items-center overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={containerStyle}
      >
        {/* Media */}
        {isVideoPath(current.path) ? (
          <video
            key={`${current.path}-${index}`}
            className={videoClass}
            controls
            preload="metadata"
            playsInline
          >
            <source src={current.path} />
          </video>
        ) : (
          <img
            key={`${current.path}-${index}`}
            src={current.path}
            alt={altText}
            className={imageClass}
            loading="lazy"
          />
        )}

        {/* Counter */}
        <div className="absolute top-2 right-2 text-xs px-2 py-1 rounded bg-black/60 text-white">
          {index + 1}/{items.length}
        </div>

        {/* Prev button */}
        <button
          type="button"
          aria-label="Previous"
          onClick={goPrev}
          className="absolute inset-y-0 left-0 my-auto h-10 w-10 grid place-items-center rounded-full bg-white/70 hover:bg-white text-gray-800 shadow mx-2"
        >
          ‹
        </button>

        {/* Next button */}
        <button
          type="button"
          aria-label="Next"
          onClick={goNext}
          className="absolute inset-y-0 right-0 my-auto h-10 w-10 grid place-items-center rounded-full bg-white/70 hover:bg-white text-gray-800 shadow mx-2"
        >
          ›
        </button>
      </div>

      {current.description ? (
        <figcaption className="p-3 text-sm text-gray-700">
          {current.description}
        </figcaption>
      ) : null}
    </figure>
  );
}
