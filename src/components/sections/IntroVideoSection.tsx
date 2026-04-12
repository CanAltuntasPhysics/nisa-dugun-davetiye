"use client";

import { useEffect, useRef, useState } from "react";

/**
 * IntroVideoSection
 *
 * Shows a "Dokunarak Başla" splash until the user taps it. The tap is a
 * user gesture, which lets the video start playing with sound (autoplay
 * with audio is otherwise blocked on first visit). After the tap the
 * video plays for `duration` ms, then the overlay fades out.
 *
 * The parent is notified via `onStart` so it can kick off the rest of
 * the timed sequence (names reveal, hero) from the same moment.
 */
export default function IntroVideoSection({
  videoSrc = "/hero-video.mp4",
  duration = 10000,
  onStart,
}: {
  videoSrc?: string;
  duration?: number;
  onStart?: () => void;
}) {
  const [started, setStarted] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!started) return;
    const fadeTimer = setTimeout(() => setIsFading(true), duration);
    const hideTimer = setTimeout(() => setIsVisible(false), duration + 1200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [started, duration]);

  const handleStart = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      video.play().catch(() => {
        // Fallback: if sound-on play fails for some reason, play muted.
        video.muted = true;
        video.play().catch(() => {});
      });
    }
    setStarted(true);
    onStart?.();
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-[var(--color-warm-black)] transition-opacity duration-[1200ms] ease-out
        ${isFading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      role="presentation"
    >
      <video
        ref={videoRef}
        src={videoSrc}
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {!started && (
        <button
          onClick={handleStart}
          className="absolute inset-0 z-20 flex items-end justify-center pb-28 sm:pb-32 bg-[var(--color-warm-black)]/55 cursor-pointer group"
          aria-label="Davetiyeyi başlat"
        >
          <span
            className="font-serif uppercase text-lg sm:text-xl md:text-2xl font-light tracking-[0.3em] text-[var(--color-cream)] animate-slow-pulse transition-transform duration-500 group-hover:scale-[1.03]"
            style={{
              textShadow:
                "0 2px 14px rgba(0,0,0,0.65), 0 0 28px rgba(0,0,0,0.4)",
            }}
          >
            DOKUNARAK BAŞLA
          </span>
        </button>
      )}
    </div>
  );
}
