import { useEffect, type RefObject } from "react";

/**
 * Crossfade claro→oscuro de la landing ("del papel a la cadena").
 * Escribe `opacity` directo sobre la capa aurora oscura (sin re-render):
 * 0 cuando el borde superior del centinela toca el borde inferior del
 * viewport → 1 tras recorrer ~55% del alto de pantalla.
 * Con prefers-reduced-motion el fade es binario (0/1), sin transición.
 */
export function useAuroraCrossfade(
  sentinelRef: RefObject<HTMLElement | null>,
  layerRef: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const layer = layerRef.current;
    if (!sentinel || !layer) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const top = sentinel.getBoundingClientRect().top;
      let p = (vh - top) / (vh * 0.55);
      p = Math.min(1, Math.max(0, p));
      if (reduced) p = p >= 0.5 ? 1 : 0;
      layer.style.opacity = String(p);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sentinelRef, layerRef]);
}
