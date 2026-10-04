"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";

// useLayoutEffect en el browser (antes del paint: no hay flash), useEffect
// en SSR (donde layout no corre y React lo ignora).
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Entrada al hacer scroll, fail-open: el contenido es VISIBLE por defecto.
 * Este efecto solo agrega .reveal-armed (opacity 0 + translateY) a elementos
 * fuera del viewport, y lo quita cuando el IntersectionObserver los ve
 * entrar — ahí corre la transición CSS. Si JS no corre, si IO no existe o
 * si nunca entrega callbacks (iframes, previews, crawlers), nada se oculta.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) return;
    el.classList.add("reveal-armed");
    let gotCallback = false;
    const io = new IntersectionObserver(
      (entries) => {
        gotCallback = true;
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.remove("reveal-armed");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    const failsafe = setTimeout(() => {
      if (!gotCallback) el.classList.remove("reveal-armed");
    }, 800);
    return () => {
      io.disconnect();
      clearTimeout(failsafe);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
