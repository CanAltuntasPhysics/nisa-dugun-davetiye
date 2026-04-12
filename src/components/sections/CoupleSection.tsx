"use client";

import Image from "next/image";
import RevealSection from "@/components/ui/RevealSection";

/**
 * Couple Photo Section
 *
 * Emotional, intimate, editorial composition.
 * The photo breathes with generous whitespace, minimal text.
 * Uses a cinematic aspect ratio and soft atmospheric treatment.
 */
export default function CoupleSection() {
  return (
    <section
      id="couple"
      className="section-spacing bg-[var(--color-cream)]"
    >
      <div className="max-w-[var(--container-narrow)] mx-auto px-6">
        <RevealSection>
          <div className="text-center mb-14">
            <p className="text-eyebrow mb-3">Hikâyemiz</p>
            <div className="ornament-line" />
          </div>
        </RevealSection>

        <RevealSection delay={200}>
          <div className="relative mx-auto max-w-xl">
            {/* Outer frame with subtle champagne border */}
            <div className="p-3 sm:p-4 bg-[var(--color-warm-white)] shadow-[var(--shadow-dreamy)] rounded-sm">
              {/* Photo with editorial treatment */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/images/couple.png"
                  alt="Nisa & Ömer"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
                {/* Subtle warm overlay for cohesion */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2420]/8 via-transparent to-[#2A2420]/4" />
              </div>
            </div>

            {/* Caption beneath the photo */}
            <div className="mt-10 sm:mt-12 text-center">
              <p className="font-serif text-2xl sm:text-3xl font-light text-[var(--color-warm-charcoal)] tracking-tight leading-snug">
                Nisa & Ömer
              </p>
              <div className="flex items-center justify-center gap-3 mt-4 mb-3">
                <div className="w-8 h-px bg-[var(--color-champagne-light)]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-champagne)]" />
                <div className="w-8 h-px bg-[var(--color-champagne-light)]" />
              </div>
              <p className="text-body-elegant italic max-w-sm mx-auto">
                Birlikte yazdığımız hikâyenin en güzel bölümü başlıyor.
              </p>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
