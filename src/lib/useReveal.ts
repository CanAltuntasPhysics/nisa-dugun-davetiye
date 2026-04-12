"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Custom hook for reveal-on-scroll animations.
 * Returns a ref to attach to the element and a boolean for visibility.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.15, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}
