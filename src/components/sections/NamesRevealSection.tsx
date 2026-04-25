"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * NamesRevealSection
 *
 * A transient full-screen overlay that appears after the intro video,
 * reveals three lines sequentially (top → bottom) over a background
 * photo, holds briefly, then fades away to reveal the hero beneath.
 *
 *   1. Düğünümüze Davetlisiniz
 *   2. Nisa & Ömer
 *   3. — Evleniyoruz —
 *
 * Timeline — total from reveal start to overlay removal is 4.5s:
 *   - startDelay:         wait for intro video to begin fading
 *   - +1.9s:              final line fully visible (stagger 0 / 500 / 1000, 900ms each)
 *   - +holdAfterReveal:   pause so the user can read it
 *   - +1.0s:              overlay fully faded out
 */
export default function NamesRevealSection({
  started = false,
  startDelay = 10000,
  holdAfterReveal = 1600,
}: {
  started?: boolean;
  startDelay?: number;
  holdAfterReveal?: number;
}) {
  const [revealed, setRevealed] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!started) return;
    const revealTimer = setTimeout(() => setRevealed(true), startDelay);

    // Last line fully visible: 1000ms (delay) + 900ms (duration) after reveal starts.
    const revealCompleteMs = 1000 + 900;
    const fadeStartDelay = startDelay + revealCompleteMs + holdAfterReveal;
    const fadeTimer = setTimeout(() => setIsFading(true), fadeStartDelay);
    const hideTimer = setTimeout(() => setIsVisible(false), fadeStartDelay + 1000);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [started, startDelay, holdAfterReveal]);

  if (!started || !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-40 overflow-hidden bg-[var(--color-warm-black)] transition-opacity duration-[1000ms] ease-out lg:bg-[var(--color-cream)]
        ${isFading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      role="presentation"
      style={{ height: "100dvh" }}
    >
      <div className="absolute inset-0 lg:flex lg:items-center lg:justify-center">
        <div className="relative h-full w-full lg:w-auto lg:aspect-[736/920] lg:max-w-full">
          <Image
            src="/hero-image.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center lg:object-contain"
          />

          <div className="absolute inset-0 bg-[var(--color-warm-black)]/35" />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-warm-black)]/30 via-transparent to-[var(--color-warm-black)]/50" />
        </div>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
          <p
            className={`font-sans uppercase text-sm sm:text-base tracking-[0.22em] text-[var(--color-warm-white)]/90 mb-8
              transition-all duration-[900ms] ease-out
              ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            Düğünümüze Davetlisiniz
          </p>

          <h1
            className={`font-serif italic text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-[var(--color-warm-white)] tracking-tight leading-[1.05] mb-10
              transition-all duration-[900ms] ease-out
              ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ transitionDelay: revealed ? "500ms" : "0ms" }}
          >
            Nisa{" "}
            <span className="not-italic text-[var(--color-champagne-light)] text-[0.7em]">
              &
            </span>{" "}
            Ömer
          </h1>

          <div
            className={`flex items-center justify-center w-64 sm:w-80 max-w-full gap-4
              transition-all duration-[900ms] ease-out
              ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: revealed ? "1000ms" : "0ms" }}
          >
            <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--color-warm-white)]/70" />
            <span className="font-sans uppercase text-xs sm:text-sm tracking-[0.3em] text-[var(--color-warm-white)]/90 whitespace-nowrap">
              Evleniyoruz
            </span>
            <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--color-warm-white)]/70" />
          </div>
        </div>
      </div>
    </div>
  );
}
