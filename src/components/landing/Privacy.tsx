import { Globe, Lock } from "lucide-react";
import type { LandingCopy } from "@/lib/landing-i18n";
import Reveal from "./Reveal";

export default function Privacy({ t }: { t: LandingCopy["privacy"] }) {
  return (
    <section className="mx-auto max-w-5xl px-5 py-24">
      <Reveal className="max-w-2xl space-y-4">
        <p className="font-mono text-xs tracking-[0.25em] text-emerald-400">
          {t.kicker}
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t.title}
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <h3 className="flex items-center gap-2 font-semibold text-white">
              <Globe size={16} className="text-emerald-400" />
              {t.publicTitle}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {t.publicItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-zinc-300"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <h3 className="flex items-center gap-2 font-semibold text-white">
              <Lock size={16} className="text-zinc-400" />
              {t.privateTitle}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {t.privateItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-zinc-400"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* Los dos modos de exposición, elegidos por el hospital */}
      <Reveal>
        <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
            <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 font-mono text-xs tracking-[0.2em] text-emerald-300">
              {t.modePublicName.toUpperCase()}
            </span>
            <span className="text-zinc-400">{t.modePublicDesc}</span>
          </p>
          <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
            <span className="inline-flex rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-xs tracking-[0.2em] text-zinc-300">
              {t.modePrivateName.toUpperCase()}
            </span>
            <span className="text-zinc-400">{t.modePrivateDesc}</span>
          </p>
          <p className="border-t border-white/10 pt-4 text-xs leading-relaxed text-zinc-500">
            {t.note}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
