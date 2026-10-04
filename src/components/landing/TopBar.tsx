import Link from "next/link";
import { Activity, ArrowRight } from "lucide-react";
import type { Lang, LandingCopy } from "@/lib/landing-i18n";

export default function TopBar({
  t,
  lang,
  onLang,
}: {
  t: LandingCopy["topbar"];
  lang: Lang;
  onLang: (lang: Lang) => void;
}) {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-5 py-5">
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-sm font-semibold tracking-[0.2em] text-zinc-900"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-md shadow-emerald-500/30">
            <Activity size={15} />
          </span>
          MEDTRC
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            role="group"
            aria-label="Language / Idioma"
            className="flex rounded-full border border-zinc-300/80 bg-white/70 p-1 backdrop-blur-xl"
          >
            {(["es", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-3 py-1 font-mono text-[11px] tracking-[0.15em] transition ${
                  lang === l
                    ? "bg-emerald-500 text-emerald-950 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-900"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <Link
            href="/equipos"
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300/80 bg-white/70 px-4 py-1.5 text-sm text-zinc-700 backdrop-blur-xl transition hover:bg-white"
          >
            <span className="hidden sm:inline">{t.openDemo}</span>
            <span className="sm:hidden">{t.openDemoShort}</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </header>
  );
}
