import {
  ShoppingBag,
  ArrowLeftRight,
  ClipboardCheck,
  Scale,
} from "lucide-react";
import type { LandingCopy } from "@/lib/landing-i18n";
import Reveal from "./Reveal";

const icons = [ShoppingBag, ArrowLeftRight, ClipboardCheck, Scale];

export default function Problem({ t }: { t: LandingCopy["problem"] }) {
  return (
    <section className="mx-auto max-w-5xl px-5 py-24">
      <Reveal className="max-w-2xl space-y-4">
        <p className="font-mono text-xs tracking-[0.25em] text-blue-600">
          {t.kicker}
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          {t.title}
        </h2>
        <p className="leading-relaxed text-zinc-500">{t.lead}</p>
      </Reveal>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {t.cards.map((card, i) => {
          const Icon = icons[i] ?? ShoppingBag;
          return (
            <Reveal key={card.title} delay={i * 90}>
              <div className="h-full rounded-2xl border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur-xl">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 font-semibold text-zinc-900">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  {card.desc}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal>
        <p className="mt-10 max-w-2xl border-l-2 border-blue-200 pl-4 text-sm leading-relaxed text-zinc-500">
          {t.foot}
        </p>
      </Reveal>
    </section>
  );
}
