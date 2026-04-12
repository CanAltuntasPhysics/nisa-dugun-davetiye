"use client";

import { useReveal } from "@/lib/useReveal";

/**
 * RevealSection — wrapper that animates children into view on scroll.
 * Uses the fade-in-up CSS class with intersection observer.
 */
export default function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [ref, isVisible] = useReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`fade-in-up ${isVisible ? "visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
