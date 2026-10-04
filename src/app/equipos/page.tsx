"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  Lock,
  Package,
  ExternalLink,
  Plus,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import Nav from "@/components/Nav";

const LS_KEY = "meditrace:equipment";

interface Equipment {
  assetId: string;
  internalRef: string;
  description: string;
  assetAddress: string;
  createdAt: string;
}

const inputCls =
  "w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 placeholder:text-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition";

export default function EquiposPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [internalRef, setInternalRef] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) setEquipment(JSON.parse(raw));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/equipment", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const eq: Equipment = {
        assetId: data.assetId,
        assetAddress: data.assetAddress,
        createdAt: data.createdAt,
        internalRef,
        description,
      };
      const next = [eq, ...equipment];
      setEquipment(next);
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      setInternalRef("");
      setDescription("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="min-h-screen p-8 bg-cmms">
      <Nav />
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 border border-blue-200 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 text-xs font-mono tracking-[0.2em]">
            PASO 01 · DEMO CMMS
          </div>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100">
              <Package size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                Registrar equipo
              </h1>
              <p className="text-sm text-zinc-500 mt-2">
                Esta pantalla simula el sistema del hospital. En producción, el
                CMMS llama a{" "}
                <code className="font-mono">POST /api/equipment</code> por API.
              </p>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="border border-white/70 bg-white/70 backdrop-blur-xl rounded-2xl p-4 flex gap-3 shadow-sm">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
              <Globe size={16} />
            </span>
            <div>
              <p className="text-zinc-800 font-semibold mb-0.5">
                Público on-chain
              </p>
              <p className="text-zinc-500">
                solo el <code>assetId</code> seudónimo y su buzón
              </p>
            </div>
          </div>
          <div className="border border-white/70 bg-white/70 backdrop-blur-xl rounded-2xl p-4 flex gap-3 shadow-sm">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-zinc-100 text-zinc-500 shrink-0">
              <Lock size={16} />
            </span>
            <div>
              <p className="text-zinc-800 font-semibold mb-0.5">
                Privado (tu navegador = el CMMS)
              </p>
              <p className="text-zinc-500">
                referencia interna, descripción — nunca viajan al servidor
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="border border-white/70 bg-white/70 backdrop-blur-xl rounded-2xl p-6 space-y-4 shadow-sm"
        >
          <input
            value={internalRef}
            onChange={(e) => setInternalRef(e.target.value)}
            placeholder="Referencia interna (ej. HOSP-BOMB-045) — solo local"
            className={inputCls}
            required
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción (ej. Bomba de infusión) — solo local"
            className={inputCls}
          />
          <button
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl px-6 py-2.5 font-medium transition shadow-lg shadow-blue-600/20"
          >
            <Plus size={16} />
            {loading ? "Creando…" : "Crear assetId"}
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-zinc-700">
            Equipos registrados
            {equipment.length > 0 && (
              <span className="text-zinc-400 font-normal">
                {" "}
                · {equipment.length}
              </span>
            )}
          </h2>
          {equipment.map((eq) => (
            <div
              key={eq.assetId}
              className="border border-white/70 bg-white/70 backdrop-blur-xl rounded-2xl p-6 flex flex-wrap gap-6 items-center justify-between shadow-sm"
            >
              <div className="space-y-1.5 min-w-0">
                <p className="font-mono text-emerald-600 font-semibold text-lg">
                  {eq.assetId}
                </p>
                <p className="text-sm text-zinc-500">
                  ref interna: {eq.internalRef}
                  {eq.description ? ` · ${eq.description}` : ""}
                  <span className="text-zinc-400"> (local)</span>
                </p>
                <a
                  href={`https://explorer.solana.com/address/${eq.assetAddress}?cluster=devnet`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition break-all"
                >
                  <ExternalLink size={12} />
                  Buzón on-chain: {eq.assetAddress.slice(0, 24)}…
                </a>
              </div>
              <Link
                href={`/verificar?a=${eq.assetId}`}
                className="group inline-flex items-center gap-2 shrink-0 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2.5 text-sm font-medium transition"
              >
                <ShieldCheck size={16} />
                Ver historial on-chain
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
          {equipment.length === 0 && (
            <p className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-400">
              Todavía no hay equipos registrados.
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <Link
            href="/service"
            className="group inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white/70 backdrop-blur-xl px-5 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-50 transition shadow-sm"
          >
            Siguiente: registrá un service
            <ArrowRight
              size={14}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </main>
  );
}
