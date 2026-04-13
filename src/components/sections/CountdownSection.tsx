"use client";

import { useCountdown } from "@/lib/useCountdown";
import RevealSection from "@/components/ui/RevealSection";
import { useEffect, useRef, useState } from "react";

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

interface DigitLayer {
  id: number;
  value: string;
  y: -1 | 0 | 1;
}

function AnimatedDigit({ digit }: { digit: string }) {
  const [layers, setLayers] = useState<DigitLayer[]>([
    { id: 0, value: digit, y: 0 },
  ]);
  const prevRef = useRef(digit);
  const idRef = useRef(1);

  useEffect(() => {
    if (digit === prevRef.current) return;
    prevRef.current = digit;
    const newId = idRef.current++;

    setLayers((prev) => [...prev, { id: newId, value: digit, y: 1 }]);

    const raf1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setLayers((prev) =>
          prev.map((l) =>
            l.id === newId ? { ...l, y: 0 } : { ...l, y: -1 }
          )
        );
      });
    });

    const t = setTimeout(() => {
      setLayers((prev) => prev.filter((l) => l.id === newId));
    }, 650);

    return () => {
      cancelAnimationFrame(raf1);
      clearTimeout(t);
    };
  }, [digit]);

  return (
    <span
      className="relative inline-block overflow-hidden align-baseline"
      style={{ width: "0.62em", height: "1em", lineHeight: 1 }}
    >
      {layers.map((l) => (
        <span
          key={l.id}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translateY(${l.y * 100}%)`,
            opacity: l.y === 0 ? 1 : 0,
            transition:
              "transform 550ms var(--ease-romantic), opacity 550ms var(--ease-romantic)",
          }}
        >
          {l.value}
        </span>
      ))}
    </span>
  );
}

function CountdownUnit({ value, label, delay }: CountdownUnitProps) {
  const padded = String(value).padStart(2, "0");
  return (
    <RevealSection delay={delay}>
      <div className="flex flex-col items-center">
        <span
          className="font-serif text-5xl sm:text-6xl md:text-7xl font-light text-[var(--color-warm-charcoal)] leading-none tabular-nums flex"
          suppressHydrationWarning
        >
          <AnimatedDigit digit={padded[0]} />
          <AnimatedDigit digit={padded[1]} />
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
      className="section-spacing !pb-0 bg-[var(--color-ivory)]"
    >
      <div className="max-w-[var(--container-narrow)] mx-auto px-6">
        <RevealSection>
          <div className="text-center mb-16">
            <p className="text-eyebrow mb-3">Büyük Güne Kalan Süre</p>
            <div className="ornament-line" />
            <h2 className="font-serif text-5xl sm:text-6xl text-[var(--color-warm-charcoal)] font-light mt-6">
              2 Mayıs 2026
            </h2>
            <p className="text-[var(--color-champagne-muted)] text-lg mt-3">
              Cumartesi, Saat 19:00
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
          <div className="text-center mt-20 pt-10 border-t border-[var(--color-champagne)]/30 mx-auto max-w-2xl">
            <div className="flex items-center justify-center gap-3 mb-10">
               <div className="w-12 h-px bg-[var(--color-champagne)]"></div>
               <div className="text-[var(--color-champagne-muted)]">♥</div>
               <div className="w-12 h-px bg-[var(--color-champagne)]"></div>
            </div>

            <p className="text-eyebrow mb-4 tracking-[0.3em]">Düğün Yeri</p>
            <h3 className="font-serif text-4xl sm:text-5xl font-light text-[var(--color-warm-charcoal)]">
              RUELYA GARDEN
            </h3>

            <div className="mt-5 flex items-center justify-center gap-2 text-[var(--color-taupe)]">
              <svg
                className="w-4 h-4 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <span className="text-sm sm:text-base tracking-wide">
                Alanya, Antalya
              </span>
            </div>

            <div className="mt-8 overflow-hidden rounded-sm border border-[var(--color-champagne)]/40 shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d200.2861708620731!2d32.04722036867439!3d36.56426918118974!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14dc9b8bf8ceecff%3A0x51a6052ab2a9b67c!2sRuelya%20Garden!5e0!3m2!1sen!2str!4v1776058168211!5m2!1sen!2str"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ruelya Garden Konumu"
              />
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
