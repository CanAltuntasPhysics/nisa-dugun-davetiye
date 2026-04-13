"use client";

import { useState, useEffect, useCallback } from "react";
import type { GalleryFile } from "@/lib/drive";

interface GalleryClientProps {
  files: GalleryFile[];
}

const PAGE_SIZE = 8;

export default function GalleryClient({ files }: GalleryClientProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? null : (i + 1) % files.length
      ),
    [files.length]
  );
  const prev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? null : (i - 1 + files.length) % files.length
      ),
    [files.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, close, next, prev]);

  if (files.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">📷</div>
        <p className="text-body-elegant">
          İlk fotoğrafı siz paylaşın.
        </p>
      </div>
    );
  }

  const active = activeIndex !== null ? files[activeIndex] : null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
        {files.slice(0, visibleCount).map((file, index) => {
          const isVideo = file.mimeType.startsWith("video/");
          return (
            <button
              key={file.id}
              onClick={() => setActiveIndex(index)}
              className="relative aspect-square bg-[var(--color-warm-white)] rounded-lg overflow-hidden group cursor-pointer shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-dreamy)] transition-shadow duration-300"
              aria-label={`Görüntüle: ${file.name}`}
            >
              {isVideo ? (
                <div className="flex items-center justify-center h-full bg-[var(--color-cream-dark)]">
                  <span className="text-4xl">🎬</span>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/api/photos/${file.id}/media?size=thumb`}
                  alt={file.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
              )}
            </button>
          );
        })}
      </div>

      {visibleCount < files.length && (
        <div className="text-center mt-10">
          <button
            onClick={() =>
              setVisibleCount((c) => Math.min(c + PAGE_SIZE, files.length))
            }
            className="btn-primary"
          >
            Daha Fazla Görüntüle
          </button>
        </div>
      )}

      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white text-2xl cursor-pointer"
            aria-label="Kapat"
          >
            ✕
          </button>

          {files.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/80 hover:text-white text-3xl cursor-pointer"
                aria-label="Önceki"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-white/80 hover:text-white text-3xl cursor-pointer"
                aria-label="Sonraki"
              >
                ›
              </button>
            </>
          )}

          <div
            className="max-w-[95vw] max-h-[90vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {active.mimeType.startsWith("video/") ? (
              <video
                src={`/api/photos/${active.id}/media`}
                controls
                autoPlay
                className="max-w-full max-h-[90vh] rounded-lg"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`/api/photos/${active.id}/media`}
                alt={active.name}
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
