"use client";

/**
 * SectionDivider — a soft, ornamental breathing space between sections.
 * Supports variations for different visual rhythms.
 */
export default function SectionDivider({
  variant = "line",
}: {
  variant?: "line" | "dot" | "space";
}) {
  if (variant === "space") {
    return <div className="h-8 sm:h-12" />;
  }

  if (variant === "dot") {
    return (
      <div className="flex items-center justify-center py-6 sm:py-8">
        <div className="flex gap-2">
          <div className="w-1 h-1 rounded-full bg-[var(--color-champagne-light)]" />
          <div className="w-1 h-1 rounded-full bg-[var(--color-champagne)]" />
          <div className="w-1 h-1 rounded-full bg-[var(--color-champagne-light)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-4">
      <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--color-champagne-light)] to-transparent" />
    </div>
  );
}
