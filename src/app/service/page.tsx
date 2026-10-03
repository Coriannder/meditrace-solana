"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import {
  Globe,
  Lock,
  Wrench,
  Anchor,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
} from "lucide-react";
import Nav from "@/components/Nav";
import { GENESIS, hashRecord, type Visibility } from "@/lib/hash";

const EVENT_TYPES = [
  "ALTA",
  "PREVENTIVO",
  "CORRECTIVO",
  "CALIBRACION",
  "VERIFICACION",
  "TRASLADO",
  "SWAP",
  "INCIDENTE",
  "BAJA",
];

const LS_KEY = "meditrace:equipment";

const inputCls =
  "w-full bg-white border border-zinc-300 rounded-xl px-4 py-2.5 placeholder:text-zinc-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition";

interface StoredEquipment {
  assetId: string;
  internalRef: string;
}

export default function ServicePage() {
  const [assets, setAssets] = useState<StoredEquipment[]>([]);
  const [assetId, setAssetId] = useState("");
  const [eventType, setEventType] = useState("PREVENTIVO");
  const [result, setResult] = useState("PASS");
  const [tecnicoId, setTecnicoId] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<{
    explorerUrl: string;
    signature: string;
    recordHash: string;
    recordJson: string;
    memo: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    const list: StoredEquipment[] = raw ? JSON.parse(raw) : [];
    setAssets(list);
    if (list.length) setAssetId(list[0].assetId);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDone(null);
    try {
      let prevHash = GENESIS;
      const histRes = await fetch(`/api/history/${encodeURIComponent(assetId)}`);
      if (histRes.ok) {
        const hist = await histRes.json();
        const last = (hist.events ?? []).find(
          (ev: { parsed: { recordHash: string } | null }) => ev.parsed
        );
        if (last?.parsed?.recordHash) prevHash = last.parsed.recordHash;
      }

      const record = {
        registroId: crypto.randomUUID(),
        assetId,
        tipoEvento: eventType,
        resultado: result,
        fechaISO: new Date().toISOString(),
        tecnicoId,
        observaciones,
        hashRegistroAnterior: prevHash,
      };
      const recordHash = await hashRecord(record);

      const res = await fetch("/api/anchor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // En modo "solo hash" ni siquiera le contamos a Meditrace el tipo/resultado
        body: JSON.stringify(
          visibility === "hash-only"
            ? { assetId, recordHash, prevHash, visibility }
            : { assetId, eventType, result, recordHash, prevHash, visibility }
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDone({
        explorerUrl: data.explorerUrl,
        signature: data.signature,
        recordHash,
        recordJson: JSON.stringify(record, null, 2),
        memo: data.memo,
      });
      setObservaciones("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const copyRecord = async () => {
    if (!done) return;
    await navigator.clipboard.writeText(done.recordJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const downloadRecord = () => {
    if (!done) return;
    const blob = new Blob([done.recordJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registro-${done.recordHash.slice(0, 8)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen p-8 bg-cmms">
      <Nav />
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100">
            <Wrench size={24} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              Registrar service{" "}
              <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full align-middle font-medium">
                DEMO CMMS
              </span>
            </h1>
            <p className="text-sm text-blue-600/80 mt-2">
              Esta pantalla simula el CMMS del hospital. En producción, el
              registro se hashea en el CMMS y se manda a{" "}
              <code className="font-mono">POST /api/anchor</code> por API.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div className="border border-emerald-200 bg-emerald-50/60 rounded-2xl p-4 flex gap-3">
            <Globe size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-emerald-700 font-semibold mb-1">
                Viaja a Solana (público)
              </p>
              <p className="text-zinc-500">
                {visibility === "public"
                  ? "assetId · tipo de evento · resultado · hash sha256"
                  : "assetId · hash sha256 (evento y resultado ocultos)"}
              </p>
            </div>
          </div>
          <div className="border border-white/70 bg-white/70 backdrop-blur-xl rounded-2xl p-4 flex gap-3 shadow-sm">
            <Lock size={18} className="text-zinc-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-zinc-800 font-semibold mb-1">
                Se queda en tu navegador (privado)
              </p>
              <p className="text-zinc-500">
                técnico · observaciones · el JSON completo
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="border border-white/70 bg-white/70 backdrop-blur-xl rounded-2xl p-6 space-y-4 shadow-sm"
        >
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              Equipo (assetId)
            </label>
            <input
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              list="known-assets"
              placeholder="AST-XXXXXXXXXX"
              className={`${inputCls} font-mono`}
              required
            />
            <datalist id="known-assets">
              {assets.map((a) => (
                <option key={a.assetId} value={a.assetId}>
                  {a.internalRef}
                </option>
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Evento
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className={inputCls}
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Resultado
              </label>
              <select
                value={result}
                onChange={(e) => setResult(e.target.value)}
                className={inputCls}
              >
                <option>PASS</option>
                <option>FAIL</option>
                <option>PENDIENTE</option>
              </select>
            </div>
          </div>

          <input
            value={tecnicoId}
            onChange={(e) => setTecnicoId(e.target.value)}
            placeholder="ID interno del técnico (legajo — nunca nombre/DNI)"
            className={inputCls}
          />
          <textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Observaciones del service (se queda off-chain)"
            rows={3}
            className={inputCls}
          />

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1.5">
              ¿Qué se publica en Solana?
            </label>
            <div className="grid sm:grid-cols-2 gap-3">
              {(
                [
                  {
                    v: "public",
                    icon: Globe,
                    title: "Público",
                    desc: "Tipo de evento y resultado legibles por cualquiera",
                  },
                  {
                    v: "hash-only",
                    icon: Lock,
                    title: "Solo hash",
                    desc: "Se publica la huella; evento y resultado quedan ocultos",
                  },
                ] as const
              ).map((o) => (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => setVisibility(o.v)}
                  className={`text-left rounded-xl border p-3 flex gap-3 transition ${
                    visibility === o.v
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/15"
                      : "border-zinc-300 bg-white hover:border-zinc-400"
                  }`}
                >
                  <o.icon
                    size={18}
                    className={`shrink-0 mt-0.5 ${
                      visibility === o.v ? "text-blue-600" : "text-zinc-400"
                    }`}
                  />
                  <span>
                    <span className="block text-sm font-semibold text-zinc-800">
                      {o.title}
                    </span>
                    <span className="block text-xs text-zinc-500">{o.desc}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Lo decide el hospital. En los dos modos el documento se verifica
              igual y la cadena detecta eventos borrados.
            </p>
          </div>

          <button
            disabled={loading || !assetId}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl px-6 py-2.5 font-medium transition shadow-sm"
          >
            <Anchor size={16} />
            {loading ? "Anclando en devnet…" : "Anclar evento"}
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>

        {done && (
          <div className="border border-emerald-200 bg-emerald-50/50 rounded-2xl p-6 space-y-4">
            <p className="text-emerald-700 font-semibold flex items-center gap-2">
              <CheckCircle2 size={18} />
              Anclado en Solana
            </p>
            <p className="text-xs text-zinc-500 font-mono break-all">
              firma: {done.signature}
            </p>
            <p className="text-xs text-zinc-500 font-mono break-all">
              hash del registro: {done.recordHash}
            </p>
            <div className="rounded-xl border border-emerald-200 bg-white/70 px-3 py-2">
              <p className="text-[11px] text-zinc-500 mb-0.5">
                Lo que quedó público on-chain (memo):
              </p>
              <p className="text-xs font-mono text-zinc-800 break-all">
                {done.memo}
              </p>
            </div>
            <a
              href={done.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm transition"
            >
              <ExternalLink size={14} />
              Ver transacción en Solana Explorer
            </a>

            <div className="border-t border-emerald-200 pt-4 space-y-3">
              <p className="text-sm text-zinc-700">
                Este JSON es tu registro privado — guardalo para verificarlo
                después (simula lo que guarda el CMMS):
              </p>
              <div className="flex gap-4 items-start">
                <div className="border border-zinc-200 bg-white p-2.5 rounded-xl shrink-0">
                  <QRCode
                    value={`${origin}/verificar?r=${encodeURIComponent(
                      JSON.stringify(JSON.parse(done.recordJson))
                    )}`}
                    size={110}
                  />
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  QR del documento: lleva el registro adentro. Quien lo escanea
                  ve el contenido, recomputa el hash y lo compara con la chain —
                  verificando contra el informe impreso.
                </p>
              </div>
              <pre className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs font-mono overflow-x-auto max-h-40 text-zinc-700">
                {done.recordJson}
              </pre>
              <div className="flex gap-3">
                <button
                  onClick={copyRecord}
                  className="inline-flex items-center gap-2 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-700 rounded-xl px-4 py-2 text-sm transition shadow-sm"
                >
                  <Copy size={14} />
                  {copied ? "¡Copiado!" : "Copiar JSON"}
                </button>
                <button
                  onClick={downloadRecord}
                  className="inline-flex items-center gap-2 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-700 rounded-xl px-4 py-2 text-sm transition shadow-sm"
                >
                  <Download size={14} />
                  Descargar .json
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
