"use client";

import RevealSection from "@/components/ui/RevealSection";

/**
 * Event Program Section
 *
 * Refined timeline of the wedding day.
 * Clean information architecture within the romantic design language.
 */

interface ProgramItem {
  time: string;
  title: string;
  description: string;
  location?: string;
  mapsLink?: string;
  icon: string;
}

const PROGRAM: ProgramItem[] = [
  {
    time: "13:30",
    title: "Gelin Alma",
    description: "Baba evinden çıkış.",
    icon: "🥁",
  },
  {
    time: "19:00",
    title: "Nikah",
    description: "Resmi nikâh töreni ile yeni bir hayata adım atıyoruz.",
    location: "Ruelya Garden · Alanya, Antalya",
    mapsLink: "https://maps.google.com/?q=Ruelya+Garden+Alanya",
    icon: "💍",
  },
  {
    time: "19:30",
    title: "Yemek",
    description: "Özel menümüzle sizleri ağırlıyoruz.",
    location: "Ruelya Garden · Alanya, Antalya",
    mapsLink: "https://maps.google.com/?q=Ruelya+Garden+Alanya",
    icon: "🍽️",
  },
];

function ProgramCard({
  item,
  index,
}: {
  item: ProgramItem;
  index: number;
}) {
  return (
    <RevealSection delay={index * 100}>
      <div className="flex gap-6 sm:gap-8 group">
        {/* Timeline line and dot */}
        <div className="flex flex-col items-center pt-1">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-champagne)] border-2 border-[var(--color-champagne-light)] flex-shrink-0 group-hover:scale-125 transition-transform duration-500" />
          <div className="w-px flex-1 bg-gradient-to-b from-[var(--color-champagne-light)] to-transparent mt-2" />
        </div>

        {/* Content */}
        <div className="pb-12 sm:pb-16 flex-1">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="font-sans text-xs tracking-[0.2em] text-[var(--color-champagne-muted)] font-medium">
              {item.time}
            </span>
            <span className="text-base">{item.icon}</span>
          </div>

          <h3 className="font-serif text-xl sm:text-2xl font-light text-[var(--color-warm-charcoal)] mb-2">
            {item.title}
          </h3>

          <p className="text-sm text-[var(--color-warm-charcoal-light)] leading-relaxed max-w-md">
            {item.description}
          </p>

          {item.location && (
            <div className="mt-3 flex items-center gap-2">
              <svg
                className="w-3.5 h-3.5 text-[var(--color-taupe)]"
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
              {item.mapsLink ? (
                <a
                  href={item.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-caption hover:text-[var(--color-champagne-muted)] transition-colors duration-300 underline underline-offset-2 decoration-[var(--color-taupe-light)]"
                >
                  {item.location}
                </a>
              ) : (
                <span className="text-caption">{item.location}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </RevealSection>
  );
}

export default function ProgramSection() {
  return (
    <section
      id="program"
      className="section-spacing !pt-16 bg-[var(--color-cream)]"
    >
      <div className="max-w-[var(--container-text)] mx-auto px-6">
        <RevealSection>
          <div className="text-center mb-16">
            <p className="text-eyebrow mb-3">Düğün Programı</p>
            <div className="ornament-line" />
            <h2 className="text-headline text-3xl sm:text-4xl mt-6">
              Günün Akışı
            </h2>
            <p className="text-body-elegant mt-4 max-w-md mx-auto">
              Özel günümüzün her anını birlikte yaşayacağız.
            </p>
            <p className="font-serif italic text-lg text-[var(--color-warm-charcoal-light)] mt-4">
              "İşin olsun 28-29-30 Nisan tarihlerinde Gelin Evinde yapılacaktır."
            </p>
          </div>
        </RevealSection>

        {/* Timeline */}
        <div className="ml-2 sm:ml-4">
          {PROGRAM.map((item, index) => (
            <ProgramCard key={item.time} item={item} index={index} />
          ))}
        </div>

        {/* Map CTA */}
        <RevealSection delay={600}>
          <div className="text-center mt-8">
            <a
              href="https://maps.google.com/?q=Ruelya+Garden+Alanya"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                />
              </svg>
              Haritayı Aç
            </a>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}
