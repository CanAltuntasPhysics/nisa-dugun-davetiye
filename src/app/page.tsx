"use client";

import { useRef, useState } from "react";
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Start background music in sync with the intro video. play() is
  // called inside the user tap, so iOS/Safari allow audible playback.
  const handleStart = () => {
    setStarted(true);
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    audio.volume = 0.45;
    const p = audio.play();
    if (p) p.catch(() => {});
  };

  return (
    <main>
      <audio
        ref={audioRef}
        src="/bg-music.mp3"
        loop
        preload="auto"
        playsInline
      />
      <IntroVideoSection onStart={handleStart} />
      <NamesRevealSection started={started} />
      <HeroSection started={started} audioRef={audioRef} />

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
