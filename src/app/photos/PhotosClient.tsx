"use client";

import Link from "next/link";
import RevealSection from "@/components/ui/RevealSection";

interface PhotosClientProps {
  galleryUrl: string;
  driveUrl: string | null;
}

export default function PhotosClient({ galleryUrl, driveUrl }: PhotosClientProps) {
  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--color-cream)]/95 backdrop-blur-sm border-b border-[var(--color-champagne-light)]/30">
        <div className="max-w-[var(--container-max)] mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl text-[var(--color-warm-charcoal)] hover:text-[var(--color-champagne-muted)] transition-colors duration-300"
          >
            Nisa & Ömer
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={galleryUrl}
              className="px-5 py-2 text-xs font-sans tracking-[0.12em] uppercase rounded-full
                bg-[var(--color-warm-charcoal)] text-[var(--color-warm-white)]
                hover:bg-[var(--color-warm-black)] transition-all duration-300"
            >
              Galeriyi Görüntüle
            </a>
          </div>
        </div>
      </header>

      {/* Page intro */}
      <div className="pt-16 pb-8 px-6 text-center">
        <RevealSection>
          <p className="text-eyebrow mb-3">Anı Albümü</p>
          <div className="ornament-line" />
          <h1 className="text-headline text-3xl sm:text-4xl mt-6">
            Anınızı Paylaşın
          </h1>
          <p className="text-body-elegant mt-4 max-w-md mx-auto">
            Bu özel günden çektiğiniz fotoğrafları doğrudan Google Drive
            klasörümüze yükleyerek bizimle paylaşabilirsiniz.
          </p>
        </RevealSection>
      </div>

      {/* Main content */}
      <div className="max-w-[var(--container-max)] mx-auto px-6 pb-20">
        <div className="max-w-lg mx-auto">
          <div className="bg-[var(--color-warm-white)] rounded-xl p-8 sm:p-10 shadow-[var(--shadow-dreamy)] text-center">
            <div className="text-5xl mb-6">📸</div>
            <h3 className="font-serif text-2xl text-[var(--color-warm-charcoal)] mb-3">
              Drive Klasörüne Yükle
            </h3>

            <div className="flex justify-center">
              {driveUrl ? (
                <a
                  href={driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary justify-center"
                >
                  Görsel Yükle
                </a>
              ) : (
                <button disabled className="btn-primary justify-center opacity-50 cursor-not-allowed">
                  Drive Bağlantısı Hazır Değil
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Back to invitation link */}
      <div className="fixed bottom-6 left-6 z-30">
        <Link
          href="/"
          className="flex items-center gap-2 text-xs font-sans tracking-[0.12em] uppercase text-[var(--color-taupe)] hover:text-[var(--color-warm-charcoal)]
            bg-[var(--color-warm-white)]/90 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-[var(--shadow-soft)] transition-all duration-300"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Davetiye
        </Link>
      </div>
    </div>
  );
}
