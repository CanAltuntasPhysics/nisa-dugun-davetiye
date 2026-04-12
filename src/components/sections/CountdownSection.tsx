"use client";

import { useCountdown } from "@/lib/useCountdown";
import RevealSection from "@/components/ui/RevealSection";

/**
 * Countdown Section
 *
 * Elegant, typographic countdown to 2 Mayıs 2026.
 * Looks like refined editorial print, not a dashboard widget.
 */

const WEDDING_DATE = new Date("2026-05-02T15:00:00+03:00");

interface CountdownUnitProps {
  value: number;
  label: string;
  delay: number;
}

function CountdownUnit({ value, label, delay }: CountdownUnitProps) {
  return (
    <RevealSection delay={delay}>
      <div className="flex flex-col items-center">
        <span
          className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-[var(--color-warm-charcoal)] leading-none tabular-nums"
          suppressHydrationWarning
        >
          {String(value).padStart(2, "0")}
        </span>
        <span className="text-eyebrow mt-3 text-[var(--color-taupe)]">
          {label}
        </span>
      </div>
    </RevealSection>
  );
}

export default function CountdownSection() {
  const timeLeft = useCountdown(WEDDING_DATE);

  return (
    <section
      id="countdown"
      className="section-spacing bg-[var(--color-ivory)]"
    >
      <div className="max-w-[var(--container-narrow)] mx-auto px-6">
        <RevealSection>
          <div className="text-center mb-16">
            <p className="text-eyebrow mb-3">Büyük Güne Kalan Süre</p>
            <div className="ornament-line" />
            <h2 className="font-serif text-5xl sm:text-6xl text-[var(--color-warm-charcoal)] font-light mt-6">
              16 Mayıs 2026
            </h2>
            <p className="text-[var(--color-champagne-muted)] text-lg mt-3">
              Cumartesi, Saat 16:00
            </p>
          </div>
        </RevealSection>

        {/* Countdown grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 max-w-lg sm:max-w-2xl mx-auto">
          <CountdownUnit value={timeLeft.days} label="Gün" delay={100} />
          <CountdownUnit value={timeLeft.hours} label="Saat" delay={200} />
          <CountdownUnit value={timeLeft.minutes} label="Dakika" delay={300} />
          <CountdownUnit value={timeLeft.seconds} label="Saniye" delay={400} />
        </div>

        {/* Wedding Venue Big */}
        <RevealSection delay={500}>
          <div className="text-center mt-20 pt-10 border-t border-[var(--color-champagne)]/30 mx-auto max-w-sm">
            <div className="flex items-center justify-center gap-3 mb-10">
               <div className="w-12 h-px bg-[var(--color-champagne)]"></div>
               <div className="text-[var(--color-champagne-muted)]">♥</div>
               <div className="w-12 h-px bg-[var(--color-champagne)]"></div>
            </div>
            
            <p className="text-eyebrow mb-4 tracking-[0.3em]">Düğün Yeri</p>
            <h3 className="font-serif text-4xl sm:text-5xl font-light text-[var(--color-warm-charcoal)]">
              RUELYA GARDEN
            </h3>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
