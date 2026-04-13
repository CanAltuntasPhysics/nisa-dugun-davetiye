import type { Metadata } from "next";
import Link from "next/link";
import { listGalleryFiles } from "@/lib/drive";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Galeri — Nisa & Ömer",
  description: "Misafirlerimizin paylaştığı düğün fotoğrafları.",
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  let files: Awaited<ReturnType<typeof listGalleryFiles>> = [];
  let errorMessage: string | null = null;

  try {
    files = await listGalleryFiles();
  } catch (err) {
    errorMessage =
      err instanceof Error ? err.message : "Galeri yüklenirken bir hata oluştu.";
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <header className="sticky top-0 z-40 bg-[var(--color-cream)]/95 backdrop-blur-sm border-b border-[var(--color-champagne-light)]/30">
        <div className="max-w-[var(--container-max)] mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl text-[var(--color-warm-charcoal)] hover:text-[var(--color-champagne-muted)] transition-colors duration-300"
          >
            Nisa & Ömer
          </Link>
          <Link
            href="/photos"
            className="px-5 py-2 text-xs font-sans tracking-[0.12em] uppercase rounded-full
              bg-[var(--color-warm-charcoal)] text-[var(--color-warm-white)]
              hover:bg-[var(--color-warm-black)] transition-all duration-300"
          >
            Fotoğraf Yükle
          </Link>
        </div>
      </header>

      <div className="pt-12 pb-8 px-6 text-center">
        <p className="text-eyebrow mb-3">Anı Albümü</p>
        <div className="ornament-line" />
        <h1 className="text-headline text-3xl sm:text-4xl mt-6">Galeri</h1>
        {files.length === 0 && (
          <p className="text-body-elegant mt-4 max-w-md mx-auto">
            Henüz paylaşılan fotoğraf yok.
          </p>
        )}
      </div>

      <div className="max-w-[var(--container-max)] mx-auto px-6 pb-20">
        {errorMessage ? (
          <div className="max-w-md mx-auto p-6 bg-red-50 rounded-lg border border-red-100 text-center">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        ) : (
          <GalleryClient files={files} />
        )}
      </div>
    </div>
  );
}
