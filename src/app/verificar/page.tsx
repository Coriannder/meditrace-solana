"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Search,
  FileText,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Upload,
  Link2,
  Globe,
  Loader2,
  History,
  Lock,
} from "lucide-react";
import Nav from "@/components/Nav";
import { PRIVATE_MARK, hashRecord, pickRecordFields } from "@/lib/hash";

interface ChainEvent {
  signature: string;
  blockTime: number | null;
  parsed: {
    assetId: string;
    eventType: string;
    result: string;
    recordHash: string;
    prevHash: string | null;
  } | null;
}

interface DocRecord {
  registroId?: string;
  assetId?: string;
  tipoEvento?: string;
  resultado?: string;
  fechaISO?: string;
  tecnicoId?: string;
  observaciones?: string;
  hashRegistroAnterior?: string;
}

interface VerifyResult {
  verified: boolean;
  computedHash: string;
  explorerUrl: string | null;
}

const card =
  "border border-white/10 bg-white/[0.04] backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/40";
const inputCls =
  "bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400/60 focus:ring-4 focus:ring-emerald-500/15 transition";

function chainStatus(events: ChainEvent[]) {
  const evs = events
    .filter((e) => e.parsed)
    .slice()
    .sort((a, b) => (a.blockTime ?? 0) - (b.blockTime ?? 0));
  const chained = evs.filter((e) => e.parsed!.prevHash);
  if (chained.length === 0)
    return evs.length
      ? { ok: null, text: "Eventos antiguos sin encadenar (previos a la v2)" }
      : null;
  let ok = true;
  let expected = "GENESIS";
  for (const ev of evs) {
    if (ev.parsed!.prevHash && ev.parsed!.prevHash !== expected) {
      ok = false;
      break;
    }
    expected = ev.parsed!.recordHash;
  }
  return {
    ok,
    text: ok
      ? `Cadena íntegra — ${chained.length} evento(s) encadenados sin agujeros`
      : "Cadena ROTA — un eslabón no apunta al evento anterior",
  };
}

function VerificarInner() {
  const params = useSearchParams();
  const [assetId, setAssetId] = useState(params.get("a") ?? "");
  const [history, setHistory] = useState<{
    assetAddress: string;
    events: ChainEvent[];
    explorerUrl: string;
  } | null>(null);
  const [docJson, setDocJson] = useState("");
  const [docRecord, setDocRecord] = useState<DocRecord | null>(null);
  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  // Cuando aparece un resultado, lo traemos a la vista
  useEffect(() => {
    if (verifyResult || verifyError) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [verifyResult, verifyError]);

  const loadHistory = async (id: string) => {
    setLoadingHistory(true);
    setSearchError("");
    try {
      const res = await fetch(`/api/history/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error");
      setHistory(data);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoadingHistory(false);
    }
  };

  const runVerification = async (record: DocRecord) => {
    setVerifying(true);
    setVerifyError("");
    setVerifyResult(null);
    try {
      const id = String(record.assetId ?? assetId).trim();
      if (!id) throw new Error("El documento no trae assetId — escribilo arriba");
      setDocRecord(record);
      setAssetId(id);
      const recordHash = await hashRecord(
        pickRecordFields(record as Record<string, unknown>)
      );
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId: id, recordHash }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setVerifyResult(data);
      void loadHistory(id);
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : "Error");
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    const r = params.get("r");
    if (r) {
      try {
        const record = JSON.parse(decodeURIComponent(r));
        setDocJson(JSON.stringify(record, null, 2));
        void runVerification(record);
      } catch {
        setVerifyError("El QR del documento no trae un JSON válido");
      }
      return;
    }
    const a = params.get("a");
    if (a) {
      setAssetId(a);
      void loadHistory(a);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyDoc = () => {
    try {
      void runVerification(JSON.parse(docJson));
    } catch {
      setVerifyResult(null);
      setVerifyError("JSON inválido — pegá el registro completo");
    }
  };

  const onDocChange = (text: string) => {
    setDocJson(text);
    // El resultado anterior ya no aplica al texto editado
    setVerifyResult(null);
    setVerifyError("");
    setDocRecord(null);
  };

  const loadFile = async (f: File | null) => {
    if (!f) return;
    onDocChange(await f.text());
  };

  const chain = history ? chainStatus(history.events) : null;

  return (
    <main className="min-h-screen p-8 bg-public">
      <Nav dark />
      <div className="max-w-3xl mx-auto space-y-8">
        {/* ---------- Encabezado ---------- */}
        <div className="text-center space-y-5 pt-2">
          <div className="inline-flex items-center gap-2 border border-emerald-400/30 bg-emerald-400/10 text-emerald-300 rounded-full px-4 py-1.5 text-xs font-mono tracking-[0.2em]">
            <Globe size={13} />
            PORTAL PÚBLICO · ON-CHAIN
          </div>
          <div className="mx-auto grid place-items-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-xl shadow-emerald-500/30">
            <ShieldCheck size={30} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Verificar{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
              equipo
            </span>
          </h1>
          <p className="text-zinc-400 max-w-md mx-auto">
            Comprobá un documento o consultá el historial de un equipo, leído
            directo de Solana.
          </p>
        </div>

        {/* ---------- 1. Verificar documento ---------- */}
        <section className={`${card} p-6 space-y-4`}>
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-emerald-400/15 text-emerald-300 text-sm font-bold">
              1
            </span>
            <div>
              <h2 className="font-semibold text-white">
                ¿El documento es auténtico?
              </h2>
              <p className="text-xs text-zinc-500">
                El hash se calcula en tu navegador — el documento nunca viaja a
                ningún servidor.
              </p>
            </div>
          </div>

          <textarea
            value={docJson}
            onChange={(e) => onDocChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && docJson) {
                e.preventDefault();
                verifyDoc();
              }
            }}
            placeholder='Pegá acá el JSON del registro: {"registroId":"…","assetId":"…",…}'
            rows={6}
            className={`w-full ${inputCls} font-mono text-xs`}
          />

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={verifyDoc}
              disabled={!docJson || verifying}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-emerald-950 rounded-xl px-6 py-2.5 font-semibold transition shadow-lg shadow-emerald-500/25"
            >
              {verifying ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <ShieldCheck size={16} />
              )}
              {verifying ? "Verificando…" : "Verificar integridad"}
            </button>
            <label className="inline-flex items-center gap-2 text-sm text-zinc-300 cursor-pointer border border-white/10 bg-white/5 hover:bg-white/10 rounded-xl px-4 py-2.5 transition">
              <Upload size={14} />
              Subir .json
              <input
                type="file"
                accept=".json,application/json"
                onChange={(e) => loadFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
            </label>
            <span className="text-xs text-zinc-600 hidden sm:inline">
              Ctrl + Enter para verificar
            </span>
          </div>

          {/* Resultado — justo debajo del botón */}
          <div ref={resultRef} className="space-y-4 scroll-mt-24">
            {verifyError && (
              <div className="flex items-center gap-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                <XCircle size={18} className="shrink-0" />
                {verifyError}
              </div>
            )}

            {verifyResult && (
              <div
                className={`rounded-2xl p-5 border animate-[fadeIn_.3s_ease-out] ${
                  verifyResult.verified
                    ? "bg-emerald-500/10 border-emerald-400/40 shadow-2xl shadow-emerald-500/20"
                    : "bg-red-500/10 border-red-400/40 shadow-2xl shadow-red-500/20"
                }`}
              >
                <div className="flex items-center gap-4">
                  {verifyResult.verified ? (
                    <CheckCircle2 size={40} className="text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle size={40} className="text-red-400 shrink-0" />
                  )}
                  <div>
                    <p
                      className={`text-lg font-bold ${
                        verifyResult.verified ? "text-emerald-300" : "text-red-300"
                      }`}
                    >
                      {verifyResult.verified ? "VERIFICADO" : "NO COINCIDE"}
                    </p>
                    <p className="text-sm text-zinc-400">
                      {verifyResult.verified
                        ? "El documento no fue alterado desde que se ancló."
                        : "El documento fue modificado o no pertenece a este equipo."}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500 mt-4 font-mono break-all">
                  sha256: {verifyResult.computedHash}
                </p>
                {verifyResult.explorerUrl && (
                  <a
                    href={verifyResult.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-emerald-200 mt-2 transition"
                  >
                    <ExternalLink size={12} />
                    Ver la transacción que lo prueba
                  </a>
                )}
              </div>
            )}

            {docRecord && verifyResult && (
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5 space-y-3">
                <p className="text-sm font-semibold text-white flex items-center gap-2">
                  <FileText size={16} className="text-emerald-400" />
                  Contenido del documento
                </p>
                <p className="text-xs text-zinc-500">
                  Compará estos valores con el papel — si difieren, el documento
                  fue alterado.
                </p>
                <dl className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-2 text-sm pt-1">
                  {(
                    [
                      ["registro", docRecord.registroId, true],
                      ["equipo", docRecord.assetId, true],
                      ["evento", `${docRecord.tipoEvento ?? "—"} · ${docRecord.resultado ?? "—"}`, false],
                      ["fecha", docRecord.fechaISO ? new Date(docRecord.fechaISO).toLocaleString() : "—", false],
                      ["técnico", docRecord.tecnicoId || "—", false],
                      ["observac.", docRecord.observaciones || "—", false],
                    ] as const
                  ).map(([k, v, mono]) => (
                    <div key={k} className="contents">
                      <dt className="text-zinc-500">{k}</dt>
                      <dd className={`text-zinc-200 break-all ${mono ? "font-mono text-xs" : ""}`}>
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </section>

        {/* ---------- 2. Historial del equipo ---------- */}
        <section className={`${card} p-6 space-y-5`}>
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-8 h-8 rounded-lg bg-emerald-400/15 text-emerald-300 text-sm font-bold">
              2
            </span>
            <div>
              <h2 className="font-semibold text-white flex items-center gap-2">
                <History size={16} className="text-zinc-400" />
                Historial del equipo
              </h2>
              <p className="text-xs text-zinc-500">
                Se completa solo al verificar un documento, o buscalo por assetId.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && assetId && loadHistory(assetId)}
              placeholder="AST-XXXXXXXXXX"
              className={`flex-1 ${inputCls} font-mono`}
            />
            <button
              onClick={() => loadHistory(assetId)}
              disabled={loadingHistory || !assetId}
              className="inline-flex items-center gap-2 border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-40 text-zinc-100 rounded-xl px-5 font-medium transition"
            >
              {loadingHistory ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Search size={16} />
              )}
              Buscar
            </button>
          </div>
          {searchError && <p className="text-red-400 text-sm">{searchError}</p>}

          {history && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm min-w-0">
                  <p className="text-zinc-500 text-xs mb-0.5">Buzón on-chain</p>
                  <a
                    href={history.explorerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-300 hover:text-emerald-200 font-mono text-xs break-all transition"
                  >
                    {history.assetAddress}
                  </a>
                </div>
                {chain && (
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${
                      chain.ok === true
                        ? "text-emerald-300 bg-emerald-400/10 border-emerald-400/30"
                        : chain.ok === false
                          ? "text-red-300 bg-red-400/10 border-red-400/30"
                          : "text-zinc-400 bg-white/5 border-white/10"
                    }`}
                  >
                    <Link2 size={12} />
                    {chain.text}
                  </span>
                )}
              </div>

              <div className="relative pl-8 space-y-3 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-gradient-to-b before:from-emerald-400/60 before:to-transparent">
                {history.events.map((ev) => {
                  const isMatch =
                    verifyResult?.verified &&
                    ev.parsed?.recordHash === verifyResult.computedHash;
                  const isPrivate = ev.parsed?.eventType === PRIVATE_MARK;
                  return (
                    <div key={ev.signature} className="relative">
                      <span className="absolute -left-[26px] top-5 w-3 h-3 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20 shadow-lg shadow-emerald-400/50" />
                      <div
                        className={`rounded-xl border p-4 transition ${
                          isMatch
                            ? "border-emerald-400/50 bg-emerald-400/10"
                            : "border-white/10 bg-black/20 hover:border-emerald-400/30"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-white flex items-center gap-2">
                            {isPrivate ? (
                              <>
                                <Lock size={14} className="text-zinc-400" />
                                <span className="text-zinc-300">Evento privado</span>
                              </>
                            ) : (
                              (ev.parsed?.eventType ?? "tx sin memo MEDTRC")
                            )}
                            {isMatch && (
                              <span className="text-[10px] font-medium text-emerald-300">
                                ← este documento
                              </span>
                            )}
                          </p>
                          {isPrivate && (
                            <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full border bg-white/5 text-zinc-400 border-white/10">
                              solo hash
                            </span>
                          )}
                          {!isPrivate && ev.parsed?.result && (
                            <span
                              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                                ev.parsed.result === "PASS"
                                  ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/30"
                                  : ev.parsed.result === "FAIL"
                                    ? "bg-red-400/10 text-red-300 border-red-400/30"
                                    : "bg-amber-400/10 text-amber-300 border-amber-400/30"
                              }`}
                            >
                              {ev.parsed.result}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                          {ev.blockTime
                            ? new Date(ev.blockTime * 1000).toLocaleString()
                            : "sin fecha"}
                        </p>
                        <div className="flex items-center justify-between gap-3 mt-3">
                          {ev.parsed && (
                            <p className="text-[11px] font-mono text-zinc-500 truncate">
                              {ev.parsed.recordHash.slice(0, 32)}…
                            </p>
                          )}
                          <a
                            href={`https://explorer.solana.com/tx/${ev.signature}?cluster=devnet`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-emerald-300 hover:text-emerald-200 shrink-0 transition"
                          >
                            ver tx
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {history.events.length === 0 && (
                  <p className="text-zinc-500 text-sm">
                    Sin eventos on-chain para este equipo.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function VerificarPage() {
  return (
    <Suspense>
      <VerificarInner />
    </Suspense>
  );
}
