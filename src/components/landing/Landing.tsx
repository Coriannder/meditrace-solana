"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { LANDING_I18N, type Lang } from "@/lib/landing-i18n";
import { useAuroraCrossfade } from "./useAuroraCrossfade";
import TopBar from "./TopBar";
import Hero from "./Hero";
import Problem from "./Problem";
import Flow from "./Flow";
import Playground from "./Playground";
import Privacy from "./Privacy";
import VideoSection from "./VideoSection";
import TryIt from "./TryIt";
import Footer from "./Footer";

/**
 * Root de la landing scrollytelling ("del papel a la cadena").
 * Dos capas aurora fijas: la clara siempre abajo; la oscura sube de
 * opacity 0→1 según la sección Flow entra en viewport.
 */
export default function Landing() {
  // Idioma detectado: "es" en SSR/hidratación, navigator.language después del
  // mount (useSyncExternalStore evita el flash de setState en efecto).
  const detected = useSyncExternalStore<Lang>(
    () => () => {},
    () => (navigator.language.startsWith("es") ? "es" : "en"),
    () => "es"
  );
  const [choice, setChoice] = useState<Lang | null>(null);
  const lang = choice ?? detected;

  const flowRef = useRef<HTMLElement | null>(null);
  const darkRef = useRef<HTMLDivElement | null>(null);
  useAuroraCrossfade(flowRef, darkRef);

  const t = LANDING_I18N[lang];

  return (
    <main className="landing-scope relative min-h-screen overflow-x-clip">
      <div aria-hidden className="aurora-layer aurora-light" />
      <div
        aria-hidden
        ref={darkRef}
        className="aurora-layer aurora-dark"
        style={{ willChange: "opacity" }}
      />
      <TopBar t={t.topbar} lang={lang} onLang={setChoice} />
      <Hero t={t.hero} />
      <Problem t={t.problem} />
      {/* Zona oscura: también es la view-timeline que gobierna el
          crossfade claro→oscuro (CSS puro; el hook JS es fallback). */}
      <div className="landing-dark-zone">
        <Flow t={t.flow} sentinelRef={flowRef} />
        <Playground t={t.playground} />
        <Privacy t={t.privacy} />
        <VideoSection t={t.video} />
        <TryIt t={t.tryit} />
        <Footer t={t.footer} />
      </div>
    </main>
  );
}
