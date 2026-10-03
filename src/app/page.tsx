import Link from "next/link";
import { Activity, Package, Wrench, ShieldCheck, ArrowRight } from "lucide-react";

const cards = [
  {
    href: "/equipos",
    icon: Package,
    step: "01",
    title: "Equipos",
    tag: "demo CMMS",
    tagClass: "text-blue-600 bg-blue-50 border-blue-200",
    desc: "Registrar un equipo y generar su assetId público seudónimo.",
    hover: "hover:border-blue-300 hover:shadow-blue-600/10",
  },
  {
    href: "/service",
    icon: Wrench,
    step: "02",
    title: "Service",
    tag: "demo CMMS",
    tagClass: "text-blue-600 bg-blue-50 border-blue-200",
    desc: "Registrar un evento de mantenimiento y anclarlo en devnet.",
    hover: "hover:border-blue-300 hover:shadow-blue-600/10",
  },
  {
    href: "/verificar",
    icon: ShieldCheck,
    step: "03",
    title: "Verificar",
    tag: "portal público",
    tagClass: "text-emerald-700 bg-emerald-50 border-emerald-200",
    desc: "Ver el historial on-chain y comprobar la integridad de un registro.",
    hover: "hover:border-emerald-300 hover:shadow-emerald-600/10",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-home">
      <div className="max-w-3xl w-full space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 border border-emerald-200 bg-emerald-50 text-emerald-700 rounded-full px-4 py-1.5 text-xs font-mono tracking-widest">
            <Activity size={14} />
            MEDTRC · SOLANA DEVNET
          </div>
          <h1 className="text-5xl font-bold tracking-tight leading-[1.1] text-zinc-900">
            Pasaporte verificable
            <br />
            del{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              equipo médico
            </span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-xl leading-relaxed">
            Cada evento del ciclo de vida de un equipo queda anclado en Solana
            como hash verificable. El registro completo vive off-chain y
            privado; la cadena solo prueba que nadie lo alteró.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={`group border border-white/70 bg-white/70 backdrop-blur-xl rounded-2xl p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${c.hover}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-xl bg-zinc-50 border border-zinc-100 group-hover:scale-110 transition-transform">
                  <c.icon size={18} className="text-zinc-500" />
                </div>
                <span className="text-xs text-zinc-400 font-mono">{c.step}</span>
              </div>
              <h2 className="font-semibold text-zinc-900 flex items-center gap-2 flex-wrap">
                {c.title}
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${c.tagClass}`}
                >
                  {c.tag}
                </span>
              </h2>
              <p className="text-sm text-zinc-500 mt-2 leading-relaxed">
                {c.desc}
              </p>
              <ArrowRight
                size={16}
                className="mt-4 text-zinc-300 group-hover:text-zinc-600 group-hover:translate-x-1 transition-all"
              />
            </Link>
          ))}
        </div>

        <div className="border-t border-zinc-200 pt-6">
          <p className="text-xs text-zinc-400 font-mono leading-relaxed">
            On-chain: assetId · tipo de evento · resultado · sha256 · eslabón.
            <br />
            El documento se hashea del lado del CMMS — Meditrace es un
            pasamanos: no guarda nada.
          </p>
        </div>
      </div>
    </main>
  );
}
