import Link from "next/link";
import { Activity } from "lucide-react";

export default function Nav({ dark = false }: { dark?: boolean }) {
  const shell = dark
    ? "border-white/10 bg-white/5 shadow-black/40"
    : "border-white/70 bg-white/70 shadow-slate-900/5";
  const link = dark
    ? "text-zinc-400 hover:text-white"
    : "text-zinc-500 hover:text-zinc-900";

  return (
    <nav
      className={`max-w-3xl mx-auto mb-12 flex items-center justify-between border backdrop-blur-xl rounded-full pl-5 pr-2 py-2 shadow-lg ${shell}`}
    >
      <Link
        href="/"
        className="flex items-center gap-2 font-mono text-sm tracking-[0.2em] font-semibold"
      >
        <span className="grid place-items-center w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 text-white shadow-md shadow-emerald-500/30">
          <Activity size={14} />
        </span>
        <span className={dark ? "text-white" : "text-zinc-900"}>MEDTRC</span>
      </Link>
      <div className="flex items-center gap-1 text-sm">
        <Link href="/equipos" className={`px-3 py-1.5 rounded-full transition ${link}`}>
          Equipos
        </Link>
        <Link href="/service" className={`px-3 py-1.5 rounded-full transition ${link}`}>
          Service
        </Link>
        <Link
          href="/verificar"
          className="px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-medium transition shadow-lg shadow-emerald-500/25"
        >
          Verificar
        </Link>
      </div>
    </nav>
  );
}
