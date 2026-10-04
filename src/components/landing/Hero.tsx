import Link from "next/link";
import { Activity, ArrowRight, Play } from "lucide-react";
import { DEMO_RECORD, DEMO_RECORD_HASH } from "@/lib/demo-asset";
import type { LandingCopy } from "@/lib/landing-i18n";
import Reveal from "./Reveal";

const snippet = [
  `  "registroId": "${DEMO_RECORD.registroId}",`,
  `  "assetId": "${DEMO_RECORD.assetId}",`,
  `  "tipoEvento": "${DEMO_RECORD.tipoEvento}",`,
  `  "resultado": "${DEMO_RECORD.resultado}",`,
  '  "observaciones": "Preventivo semestral. Des…",',
  "  …",
].join("\n");

export default function Hero({ t }: { t: LandingCopy["hero"] }) {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-20 pt-32 sm:pt-40">
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-300/80 bg-white/70 px-4 py-1.5 text-xs font-mono tracking-[0.2em] text-zinc-600 backdrop-blur-xl">
              <Activity size={13} className="text-emerald-600" />
              {t.badge}
            </div>
            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              {t.titleA}
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                {t.titleB}
              </span>
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-zinc-500">
              <strong className="font-semibold text-zinc-800">
                {t.subBrand}
              </strong>{" "}
              {t.sub}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/equipos"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-emerald-950 shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
              >
                {t.ctaPrimary}
                <ArrowRight size={16} />
              </Link>
              <a
                href="#video"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-300/80 bg-white/70 px-6 py-3 font-medium text-zinc-700 backdrop-blur-xl transition hover:bg-white"
              >
                <Play size={15} />
                {t.ctaVideo}
              </a>
            </div>
          </div>
        </Reveal>

        {/* Micro-visual: el registro JSON se "comprime" a un hash de 64 chars */}
        <Reveal delay={160}>
          <div className="json-hash-card">
            <div className="rounded-2xl border border-white/70 bg-white/70 p-5 shadow-xl shadow-zinc-900/5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs text-zinc-400">
                  {t.cardFileLabel}
                </p>
                <span className="flex gap-1.5" aria-hidden>
                  <span className="h-2 w-2 rounded-full bg-zinc-200" />
                  <span className="h-2 w-2 rounded-full bg-zinc-200" />
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                </span>
              </div>
              <div className="relative mt-4 min-h-36">
                <pre className="json-cycle font-mono text-[11px] leading-6 text-zinc-600 whitespace-pre-wrap break-all">
                  {`{\n${snippet}\n}`}
                </pre>
                <div className="hash-cycle absolute inset-0 flex items-center">
                  <p className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 font-mono text-[11px] leading-5 text-emerald-700 break-all">
                    {DEMO_RECORD_HASH}
                  </p>
                </div>
              </div>
              <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-zinc-400">
                {t.cardHashLabel}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
