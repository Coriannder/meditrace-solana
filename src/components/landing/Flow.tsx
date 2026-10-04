"use client";

import { useEffect, useState, type RefObject } from "react";
import {
  DEMO_ASSET_ID,
  DEMO_RECORD,
  DEMO_RECORD_HASH,
} from "@/lib/demo-asset";
import type { LandingCopy } from "@/lib/landing-i18n";
import Reveal from "./Reveal";

/**
 * Sección centinela del crossfade claro→oscuro: su `sentinelRef` alimenta
 * useAuroraCrossfade en Landing. Ya renderiza con tipografía oscura.
 */
export default function Flow({
  t,
  sentinelRef,
}: {
  t: LandingCopy["flow"];
  sentinelRef: RefObject<HTMLElement | null>;
}) {
  const [sel, setSel] = useState(0);
  const [paused, setPaused] = useState(false);
  const step = t.steps[sel];

  // Auto-avance del stepper: la sección se cuenta sola sin depender de
  // que el visitante descubra que es clickeable. Se pausa al pasar el
  // mouse por encima y no corre con prefers-reduced-motion.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const id = setInterval(() => {
      setSel((s) => (s + 1) % t.steps.length);
    }, 4000);
    return () => clearInterval(id);
  }, [paused, t.steps.length]);

  return (
    <section
      ref={sentinelRef}
      className="mx-auto max-w-5xl px-5 pb-24 pt-32 sm:pt-44"
    >
      <Reveal className="max-w-2xl space-y-4">
        <p className="font-mono text-xs tracking-[0.25em] text-emerald-400">
          {t.kicker}
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t.title}
        </h2>
        <p className="leading-relaxed text-zinc-400">{t.lead}</p>
      </Reveal>

      {/* Stepper: horizontal en sm+, vertical en mobile */}
      <Reveal delay={100}>
        <ol
          className="relative mt-12 grid gap-6 sm:grid-cols-4 sm:gap-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <span
            aria-hidden
            className="absolute bottom-4 left-5 top-4 w-px bg-white/10 sm:hidden"
          />
          <span
            aria-hidden
            className="absolute left-[12.5%] right-[12.5%] top-5 hidden h-px bg-white/10 sm:block"
          />
          {t.steps.map((s, i) => (
            <li key={s.label} className="relative">
              <button
                type="button"
                onClick={() => setSel(i)}
                onMouseEnter={() => setSel(i)}
                aria-pressed={sel === i}
                className="group flex w-full items-center gap-4 text-left sm:flex-col sm:gap-3 sm:text-center"
              >
                <span
                  className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border font-mono text-sm transition ${
                    sel === i
                      ? "border-emerald-400 bg-emerald-400 text-emerald-950 shadow-lg shadow-emerald-500/30"
                      : "border-white/15 bg-[#0b1512] text-zinc-400 group-hover:border-emerald-400/50 group-hover:text-emerald-300"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="flex flex-col sm:items-center">
                  <span
                    className={`text-sm font-medium transition ${
                      sel === i ? "text-white" : "text-zinc-300"
                    }`}
                  >
                    {s.label}
                  </span>
                  {i === 2 && (
                    <span className="mt-1.5 inline-flex w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300">
                      {t.storesNothing}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </Reveal>

      {/* Detalle del nodo seleccionado */}
      <Reveal>
        <div
          key={sel}
          className="mt-8 animate-[fadeIn_.3s_ease-out] rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
        >
          <p className="font-mono text-[11px] tracking-[0.25em] text-emerald-400">
            PASO 0{sel + 1}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-white">{step.title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
            {step.desc}
          </p>
        </div>
      </Reveal>

      {/* El memo real: todo lo que se hace público */}
      <Reveal>
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
          <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500">
            {t.memoLabel}
          </p>
          <p className="mt-3 break-all font-mono text-xs leading-6 text-emerald-300 sm:text-sm">
            MEDTRC|{DEMO_ASSET_ID}|{DEMO_RECORD.tipoEvento}|
            {DEMO_RECORD.resultado}|{DEMO_RECORD_HASH.slice(0, 8)}…|
            {DEMO_RECORD.hashRegistroAnterior.slice(0, 8)}…
          </p>
          <p className="mt-3 text-xs text-zinc-500">{t.memoCaption}</p>
        </div>
      </Reveal>
    </section>
  );
}
