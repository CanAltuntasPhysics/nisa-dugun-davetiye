"use client";

import { useEffect, useState } from "react";

/**
 * Hero Section
 *
 * Full-viewport cinematic opening with atmospheric background,
 * elegant typography, and scroll indicator.
 * Elements fade in sequentially (top → bottom) after the intro
 * video and names-reveal overlays clear.
 *
 * `startDelay` is the time (ms from page mount) at which the hero's
 * top-to-bottom stagger should begin. It should line up with the
 * moment NamesRevealSection starts fading out, so the hero assembles
 * itself in view as the overlay disappears.
 */
export default function HeroSection({
  started = false,
  startDelay = 13500,
}: {
  started?: boolean;
  startDelay?: number;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const timer = setTimeout(() => setMounted(true), startDelay);
    return () => clearTimeout(timer);
  }, [started, startDelay]);

  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[var(--color-cream)]"
    >
      {/* Background (no photo, just romantic tone with light beam) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Soft base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-cream)] via-[var(--color-cream-dark)] to-[var(--color-champagne-light)] opacity-40" />
        
        {/* Animated light beam flowing left to right slowly */}
        <div className="absolute inset-0 opacity-70">
          <div className="absolute inset-0 animate-light-beam
            bg-gradient-to-r from-transparent via-[var(--color-champagne-light)] to-transparent" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto flex flex-col items-center">
        {/* Top ornament — line with three staggered blinking dots */}
        <div
          className={`flex items-center justify-center w-64 sm:w-72 max-w-full mb-6 transition-all duration-[1200ms] ease-out
            ${mounted ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "100ms" }}
          aria-hidden
        >
          <span
            className="w-1 h-1 rounded-full bg-[var(--color-champagne)]/70 animate-elegant-blink"
            style={{ animationDelay: "0s" }}
          />
          <span className="flex-1 mx-2 h-px bg-gradient-to-r from-transparent via-[var(--color-champagne)] to-transparent" />
          <span
            className="w-1.5 h-1.5 rounded-full bg-[var(--color-champagne)] animate-elegant-blink"
            style={{ animationDelay: "0.9s" }}
          />
          <span className="flex-1 mx-2 h-px bg-gradient-to-r from-transparent via-[var(--color-champagne)] to-transparent" />
          <span
            className="w-1 h-1 rounded-full bg-[var(--color-champagne)]/70 animate-elegant-blink"
            style={{ animationDelay: "1.8s" }}
          />
        </div>

        {/* Big Save the Date on top */}
        <p
          className={`font-script text-5xl sm:text-8xl md:text-9xl whitespace-nowrap text-[var(--color-warm-charcoal)] mb-6 sm:mb-8 leading-[1.1] transition-all duration-[1200ms] ease-out
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "200ms" }}
        >
          Save the Date
        </p>

        {/* Divider ornament — line with single center dot */}
        <div
          className={`flex items-center justify-center w-56 sm:w-64 max-w-full mb-5 transition-all duration-[1200ms] ease-out
            ${mounted ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: "300ms" }}
          aria-hidden
        >
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--color-champagne)] to-transparent" />
          <span
            className="mx-3 w-1.5 h-1.5 rounded-full bg-[var(--color-champagne)] animate-elegant-blink"
            style={{ animationDelay: "0.4s" }}
          />
          <span className="flex-1 h-px bg-gradient-to-r from-transparent via-[var(--color-champagne)] to-transparent" />
        </div>

        {/* Eyebrow */}
        <p
          className={`font-sans uppercase text-base sm:text-sm tracking-[0.14em] sm:tracking-[0.2em] whitespace-nowrap text-[var(--color-taupe)] mb-6 transition-all duration-[1200ms] ease-out
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "400ms" }}
        >
          Düğünümüze Davetlisiniz
        </p>

        {/* Ornament line */}
        <div
          className={`ornament-line mb-8 transition-all duration-[1200ms] ease-out
            ${mounted ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
          style={{ transitionDelay: "600ms", background: "linear-gradient(90deg, transparent, var(--color-champagne-muted), transparent)" }}
        />

        {/* Names */}
        <h1
          className={`font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-[var(--color-warm-charcoal)] tracking-tight leading-[1.05] mb-6
            transition-all duration-[1400ms] ease-out
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          style={{ transitionDelay: "800ms" }}
        >
          Nisa{" "}
          <span className="text-[var(--color-champagne-muted)] font-serif italic text-[0.7em]">
            &
          </span>{" "}
          Ömer
        </h1>

        {/* Invitation tagline */}
        <p
          className={`text-eyebrow text-[var(--color-taupe)] mb-8 transition-all duration-[1200ms] ease-out
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "1000ms" }}
        >
          Evleniyoruz
        </p>

        {/* Date box */}
        <div
          className={`inline-block border border-[var(--color-champagne)] px-8 py-4 mb-4
            transition-all duration-[1200ms] ease-out
            ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "1200ms" }}
        >
          <p className="font-serif text-2xl text-[var(--color-warm-charcoal)]">
            2 Mayıs 2026
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollDown}
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 cursor-pointer
          transition-all duration-[1200ms] ease-out
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{ transitionDelay: "1500ms" }}
        aria-label="Aşağı kaydır"
      >
        <span className="text-[var(--color-taupe)] text-xs tracking-[0.2em] uppercase font-sans">
          Keşfet
        </span>
        <svg
          className="w-5 h-5 text-[var(--color-champagne-muted)] animate-scroll-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>
    </section>
  );
}
