import { Activity, ExternalLink } from "lucide-react";
import type { LandingCopy } from "@/lib/landing-i18n";

export default function Footer({ t }: { t: LandingCopy["footer"] }) {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto max-w-5xl space-y-8 px-5 py-12">
        <ul className="max-w-2xl space-y-2">
          {t.disclaimers.map((d) => (
            <li
              key={d}
              className="flex items-start gap-2.5 text-xs leading-relaxed text-zinc-500"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
              {d}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-mono text-sm font-semibold tracking-[0.2em] text-white">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-md shadow-emerald-500/30">
              <Activity size={13} />
            </span>
            MEDTRC
            <span className="ml-2 font-sans text-xs font-normal normal-case tracking-normal text-zinc-500">
              {t.tagline}
            </span>
          </div>
          <div className="flex items-center gap-5 text-xs text-zinc-500">
            <p>{t.built}</p>
            <a
              href="https://github.com/Coriannder/meditrace-solana"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-zinc-400 transition hover:text-white"
            >
              <ExternalLink size={13} />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
