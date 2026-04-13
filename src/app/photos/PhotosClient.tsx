"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import RevealSection from "@/components/ui/RevealSection";

interface PhotosClientProps {
  galleryUrl: string;
  driveUrl: string | null;
}

export default function PhotosClient({ galleryUrl, driveUrl }: PhotosClientProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploaderName, setUploaderName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    setUploadSuccess(false);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(10);

    try {
      const formData = new FormData();

      for (const file of selectedFiles) {
        formData.append("files", file);
      }

      if (uploaderName.trim()) {
        formData.append("uploaderName", uploaderName.trim());
      }

      setUploadProgress(30);

      const response = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      });

      setUploadProgress(80);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Yükleme başarısız.");
      }

      setUploadProgress(100);

      if (data.errors && data.errors.length > 0) {
        setUploadError(
          `${data.uploadedCount}/${data.totalCount} dosya yüklendi. Bazı dosyalar yüklenemedi.`
        );
      }

      setUploadSuccess(true);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Yükleme sırasında bir hata oluştu."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

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
            {driveUrl && (
              <a
                href={driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 text-xs font-sans tracking-[0.12em] uppercase rounded-full
                  border border-[var(--color-warm-charcoal)] text-[var(--color-warm-charcoal)]
                  hover:bg-[var(--color-warm-charcoal)] hover:text-[var(--color-warm-white)] transition-all duration-300"
              >
                Drive'da Görüntüle
              </a>
            )}
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
            Bu özel günden çektiğiniz fotoğrafları bizimle paylaşın.
          </p>
        </RevealSection>
      </div>

      {/* Main content */}
      <div className="max-w-[var(--container-max)] mx-auto px-6 pb-20">
        <div className="max-w-lg mx-auto">
          {uploadSuccess ? (
            <RevealSection>
              <div className="text-center py-12 px-8 bg-[var(--color-warm-white)] rounded-xl shadow-[var(--shadow-dreamy)]">
                <div className="text-5xl mb-6">✨</div>
                <h3 className="font-serif text-2xl text-[var(--color-warm-charcoal)] mb-3">
                  Teşekkürler!
                </h3>
                <p className="text-body-elegant max-w-sm mx-auto mb-8">
                  Fotoğraflarınız başarıyla yüklendi. Anı albümümüze güzel bir
                  katkı oldu.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <button
                    onClick={() => {
                      setUploadSuccess(false);
                      setSelectedFiles([]);
                    }}
                    className="btn-primary"
                  >
                    Daha Fazla Yükle
                  </button>
                  <a href={galleryUrl} className="btn-secondary">
                    Galeriyi Görüntüle
                  </a>
                </div>
              </div>
            </RevealSection>
          ) : (
            <div className="bg-[var(--color-warm-white)] rounded-xl p-8 sm:p-10 shadow-[var(--shadow-dreamy)]">
              {/* Name input */}
              <div className="mb-8">
                <label
                  htmlFor="uploaderName"
                  className="text-eyebrow block mb-3"
                >
                  Adınız{" "}
                  <span className="text-[var(--color-taupe-light)] normal-case tracking-normal">
                    (isteğe bağlı)
                  </span>
                </label>
                <input
                  id="uploaderName"
                  type="text"
                  value={uploaderName}
                  onChange={(e) => setUploaderName(e.target.value)}
                  placeholder="Adınızı yazın..."
                  className="w-full px-4 py-3 bg-[var(--color-cream)] border border-[var(--color-champagne-light)]/50 rounded-lg
                    font-sans text-sm text-[var(--color-warm-charcoal)]
                    placeholder:text-[var(--color-taupe-light)]
                    focus:outline-none focus:border-[var(--color-champagne)] focus:ring-1 focus:ring-[var(--color-champagne)]/30
                    transition-all duration-300"
                />
              </div>

              {/* File drop zone */}
              <div className="mb-6">
                <label
                  htmlFor="fileInput"
                  className="text-eyebrow block mb-3"
                >
                  Fotoğraflarınız
                </label>
                <div
                  className="border-2 border-dashed border-[var(--color-champagne-light)] rounded-xl p-8 text-center cursor-pointer
                    hover:border-[var(--color-champagne)] hover:bg-[var(--color-cream)]/50 transition-all duration-300"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-3xl mb-3">📸</div>
                  <p className="font-serif text-base text-[var(--color-warm-charcoal)]">
                    Fotoğraflarınızı seçmek için tıklayın
                  </p>
                  <p className="text-caption mt-2">
                    JPEG, PNG, WebP veya MP4 — Maks. 50MB
                  </p>
                  <input
                    ref={fileInputRef}
                    id="fileInput"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/quicktime"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Selected files preview */}
              {selectedFiles.length > 0 && (
                <div className="mb-6">
                  <p className="text-eyebrow mb-3">
                    {selectedFiles.length} dosya seçildi
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="relative aspect-square bg-[var(--color-cream)] rounded-lg overflow-hidden group"
                      >
                        {file.type.startsWith("image/") ? (
                          <Image
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <span className="text-2xl">🎬</span>
                          </div>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(index);
                          }}
                          className="absolute top-1 right-1 w-6 h-6 bg-[var(--color-warm-charcoal)]/70 text-white rounded-full
                            flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                          aria-label="Kaldır"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload error */}
              {uploadError && (
                <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-100">
                  <p className="text-sm text-red-600">{uploadError}</p>
                </div>
              )}

              {/* Upload progress */}
              {isUploading && (
                <div className="mb-6">
                  <div className="h-1.5 bg-[var(--color-cream-dark)] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-champagne)] rounded-full transition-all duration-500"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-caption text-center mt-2">
                    Yükleniyor... %{uploadProgress}
                  </p>
                </div>
              )}

              {/* Upload button */}
              <button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
                className={`btn-primary w-full justify-center ${
                  selectedFiles.length === 0 || isUploading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isUploading ? "Yükleniyor..." : "Fotoğrafları Paylaş"}
              </button>
            </div>
          )}
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
