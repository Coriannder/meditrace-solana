import type { LandingCopy } from "@/lib/landing-i18n";
import Reveal from "./Reveal";

export default function VideoSection({ t }: { t: LandingCopy["video"] }) {
  return (
    <section id="video" className="mx-auto max-w-4xl scroll-mt-16 px-5 py-24">
      <Reveal className="space-y-4 text-center">
        <p className="font-mono text-xs tracking-[0.25em] text-emerald-400">
          {t.kicker}
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t.title}
        </h2>
      </Reveal>
      <Reveal delay={120}>
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl sm:p-4">
          <video
            controls
            preload="none"
            poster="/demo-poster.jpg"
            src="/demo.mp4"
            className="aspect-video w-full rounded-xl bg-black"
          />
          <p className="px-2 pb-1 pt-3 text-center text-xs text-zinc-500">
            {t.caption}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
