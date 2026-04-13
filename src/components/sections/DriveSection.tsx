"use client";

import { QRCodeSVG } from "qrcode.react";
import RevealSection from "@/components/ui/RevealSection";

/**
 * Drive / Photo Sharing Section
 *
 * Elegant invitation for guests to upload and browse shared photos.
 * Features QR code and CTA button, warm emotional copy.
 */

const PHOTOS_URL = "/photos";
const QR_URL = "https://nisa-omer-davetiye.vercel.app/photos";

export default function DriveSection() {
  const qrValue = QR_URL;

  return (
    <section
      id="photos-cta"
      className="section-spacing bg-[var(--color-ivory)]"
    >
      <div className="max-w-[var(--container-text)] mx-auto px-6">
        <RevealSection>
          <div className="text-center mb-12">
            <p className="text-eyebrow mb-3">Anılarımız</p>
            <div className="ornament-line" />
            <h2 className="text-headline text-3xl sm:text-4xl mt-6">
              Bu Günü Birlikte Ölümsüzleştirin
            </h2>
            <p className="text-body-elegant mt-6 max-w-lg mx-auto">
              Düğünümüzden çektiğiniz fotoğrafları bizimle paylaşın.
              <br className="hidden sm:block" />
              Birlikte oluşturacağımız bu anı albümü, en güzel hediyeniz olacak.
            </p>
          </div>
        </RevealSection>

        {/* QR Code + CTA Card */}
        <RevealSection delay={200}>
          <div className="max-w-sm mx-auto bg-[var(--color-warm-white)] rounded-lg p-10 sm:p-12 text-center shadow-[var(--shadow-dreamy)]">
            {/* QR Code */}
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white rounded-lg">
                <QRCodeSVG
                  value={qrValue}
                  size={160}
                  bgColor="#FFFFFF"
                  fgColor="#3D3530"
                  level="M"
                  style={{ width: "100%", height: "auto", maxWidth: 160 }}
                />
              </div>
            </div>

            <p className="text-caption mb-6">
              QR kodu okutarak veya aşağıdaki butona tıklayarak
              <br />
              fotoğraf paylaşabilir ve albümü görüntüleyebilirsiniz.
            </p>

            <a href={PHOTOS_URL} className="btn-primary w-full justify-center">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                />
              </svg>
              Fotoğraf Albümü
            </a>
          </div>
        </RevealSection>

        {/* Subtle footer note */}
        <RevealSection delay={400}>
          <p className="text-center text-caption mt-10 max-w-xs mx-auto">
            Yüklediğiniz fotoğraflar özel albümümüze eklenir ve tüm
            misafirlerimizle paylaşılır.
          </p>
        </RevealSection>
      </div>
    </section>
  );
}
