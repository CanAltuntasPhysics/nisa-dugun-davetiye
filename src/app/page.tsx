"use client";

import { useState } from "react";
import HeroSection from "@/components/sections/HeroSection";
import IntroVideoSection from "@/components/sections/IntroVideoSection";
import NamesRevealSection from "@/components/sections/NamesRevealSection";
import CountdownSection from "@/components/sections/CountdownSection";
import ProgramSection from "@/components/sections/ProgramSection";
import DriveSection from "@/components/sections/DriveSection";
import FooterSection from "@/components/sections/FooterSection";

/**
 * Main Wedding Invitation Page
 *
 * Cinematic scrolling experience. The opening sequence is gated on a
 * user tap ("Dokunarak Başla") so the video can play with sound.
 *
 * Stage 1 (overlay): intro video, 10s
 * Stage 2 (overlay): names reveal on background photo, 4.5s
 * Stage 3 (in flow): hero section — reveals as stage 2 fades away
 * Then: countdown → program → drive → footer
 */
export default function Home() {
  const [started, setStarted] = useState(false);

  return (
    <main>
      <IntroVideoSection onStart={() => setStarted(true)} />
      <NamesRevealSection started={started} />
      <HeroSection started={started} />

      {/* Soft transition: cream → ivory */}
      <div className="section-transition-cream-to-ivory" />

      {/* Typographic countdown — ivory bg */}
      <CountdownSection />

      {/* Soft transition: ivory → cream */}
      <div className="section-transition-ivory-to-cream" />

      {/* Wedding day program timeline — cream bg */}
      <ProgramSection />

      {/* Soft transition: cream → ivory (shortened between program & memories) */}
      <div className="section-transition-cream-to-ivory" style={{ height: 32 }} />

      {/* Photo sharing invitation with QR — ivory bg */}
      <DriveSection />

      {/* Warm closing — charcoal bg */}
      <FooterSection />
    </main>
  );
}
