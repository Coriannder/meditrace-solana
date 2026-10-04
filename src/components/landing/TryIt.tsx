import Link from "next/link";
import { ArrowRight, Package, ShieldCheck, Wrench } from "lucide-react";
import { DEMO_ASSET_ID } from "@/lib/demo-asset";
import type { LandingCopy } from "@/lib/landing-i18n";
import Reveal from "./Reveal";

const steps = [
  { href: "/equipos", icon: Package },
  { href: "/service", icon: Wrench },
  { href: `/verificar?a=${DEMO_ASSET_ID}`, icon: ShieldCheck },
];

export default function TryIt({ t }: { t: LandingCopy["tryit"] }) {
  return (
    <section className="mx-auto max-w-5xl px-5 py-24">
      <Reveal className="space-y-4 text-center">
        <p className="font-mono text-xs tracking-[0.25em] text-emerald-400">
          {t.kicker}
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t.title}
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {t.cards.map((card, i) => {
          const { href, icon: Icon } = steps[i];
          return (
            <Reveal key={card.title} delay={i * 100}>
              <Link
                href={href}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-emerald-400/40"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-emerald-300">
                    <Icon size={18} />
                  </span>
                  <span className="font-mono text-xs text-zinc-600">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-semibold text-white">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">
                  {card.desc}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-300 transition group-hover:text-emerald-200">
                  {card.cta}
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
