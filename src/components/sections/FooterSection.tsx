"use client";

import RevealSection from "@/components/ui/RevealSection";

/**
 * Footer Section
 *
 * Minimal, warm closing section with the couple's names.
 */
export default function FooterSection() {
  return (
    <footer className="py-16 sm:py-20 bg-[var(--color-warm-charcoal)]">
      <div className="max-w-[var(--container-text)] mx-auto px-6 text-center">
        <RevealSection>
          <div className="ornament-line mb-6" />

          <p className="font-serif text-3xl sm:text-4xl font-light text-[var(--color-cream)] tracking-tight">
            Nisa & Ömer
          </p>

          <p className="font-sans text-xs tracking-[0.25em] text-[var(--color-taupe-light)] mt-4 uppercase">
            1 Mayıs 2026
          </p>

          <p className="text-caption text-[var(--color-taupe)] mt-8 max-w-sm mx-auto">
            Özel günümüzü bizimle paylaşacağınız için teşekkür ederiz.
            <br />
            Sevgiyle.
          </p>
        </RevealSection>
      </div>
    </footer>
  );
}
