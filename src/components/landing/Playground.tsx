"use client";

import { Fragment, useEffect, useState } from "react";
import {
  ArrowDown,
  CheckCircle2,
  ExternalLink,
  Hash,
  Link2,
  Loader2,
  Lock,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import {
  DEMO_ASSET_ID,
  DEMO_CHAIN,
  DEMO_RECORD_HASH,
  DEMO_RECORD_JSON,
} from "@/lib/demo-asset";
import { GENESIS, PRIVATE_MARK, hashRecord, pickRecordFields } from "@/lib/hash";
import type { LandingCopy } from "@/lib/landing-i18n";
import Reveal from "./Reveal";

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

interface History {
  assetAddress: string;
  events: ChainEvent[];
  explorerUrl: string;
}

interface VerifyResult {
  verified: boolean;
  computedHash: string;
  explorerUrl: string | null;
}

const card =
  "rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl";

export default function Playground({ t }: { t: LandingCopy["playground"] }) {
  const [text, setText] = useState(DEMO_RECORD_JSON);
  // El hash del JSON inicial ya se conoce: se muestra desde el SSR
  // (sin esperar al efecto del navegador) y se recalcula al editar.
  const [hash, setHash] = useState<string | null>(DEMO_RECORD_HASH);
  const [jsonValid, setJsonValid] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [verifyError, setVerifyError] = useState("");

  // La cadena arranca con los datos reales sembrados (los cards se ven en
  // SSR y sin JS); el fetch la refresca en vivo contra devnet.
  const [history, setHistory] = useState<History>(DEMO_CHAIN);

  // Lectura en vivo del sha256 (debounce ~150ms) — igual que el CMMS:
  // canonicaliza los campos del registro y hashea en el navegador.
  useEffect(() => {
    const id = setTimeout(() => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        setJsonValid(false);
        setHash(null);
        return;
      }
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        setJsonValid(false);
        setHash(null);
        return;
      }
      setJsonValid(true);
      void hashRecord(pickRecordFields(parsed as Record<string, unknown>)).then(
        setHash
      );
    }, 150);
    return () => clearTimeout(id);
  }, [text]);

  // Refresco del historial on-chain: si falla no pasa nada, queda la
  // versión sembrada que ya se está mostrando.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/history/${encodeURIComponent(DEMO_ASSET_ID)}`)
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setHistory(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const onTextChange = (v: string) => {
    setText(v);
    setResult(null);
    setVerifyError("");
  };

  const verify = async () => {
    if (!hash || verifying) return;
    setVerifying(true);
    setVerifyError("");
    setResult(null);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetId: DEMO_ASSET_ID, recordHash: hash }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "error");
      setResult(data);
    } catch {
      setVerifyError(t.verifyError);
    } finally {
      setVerifying(false);
    }
  };

  // Cadena: eventos parseados en orden de bloque; cada prevHash debe apuntar
  // al recordHash del eslabón anterior, arrancando en GENESIS.
  const evs = (history?.events ?? [])
    .filter(
      (e): e is ChainEvent & { parsed: NonNullable<ChainEvent["parsed"]> } =>
        e.parsed !== null
    )
    .sort((a, b) => (a.blockTime ?? 0) - (b.blockTime ?? 0));
  let chainIntact = evs.length > 0;
  {
    let expected = GENESIS;
    for (const ev of evs) {
      if (ev.parsed.prevHash && ev.parsed.prevHash !== expected) {
        chainIntact = false;
        break;
      }
      expected = ev.parsed.recordHash;
    }
  }

  return (
    <section id="playground" className="mx-auto max-w-5xl px-5 py-24">
      <Reveal className="max-w-2xl space-y-4">
        <p className="font-mono text-xs tracking-[0.25em] text-emerald-400">
          {t.kicker}
        </p>
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {t.title}
        </h2>
        <p className="leading-relaxed text-zinc-400">{t.lead}</p>
      </Reveal>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        {/* ---------- Verificación interactiva ---------- */}
        <Reveal className={`${card} space-y-4 p-5 sm:p-6`}>
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-xs text-zinc-400">{t.jsonLabel}</p>
            <button
              type="button"
              onClick={() => onTextChange(DEMO_RECORD_JSON)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-white/10"
            >
              <RotateCcw size={12} />
              {t.restore}
            </button>
          </div>

          <textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            spellCheck={false}
            rows={13}
            className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-xs leading-5 text-zinc-100 transition focus:border-emerald-400/60 focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
          />

          <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-black/30 px-4 py-3">
            <Hash size={14} className="mt-0.5 shrink-0 text-emerald-300" />
            <div className="min-w-0">
              <p className="font-mono text-[10px] tracking-[0.25em] text-zinc-500">
                {t.hashLabel}
              </p>
              {jsonValid && hash ? (
                <p className="mt-1 break-all font-mono text-xs text-emerald-300">
                  {hash}
                </p>
              ) : (
                <p className="mt-1 text-xs text-amber-300">{t.invalidJson}</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={verify}
            disabled={!hash || !jsonValid || verifying}
            className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold shadow-lg transition disabled:opacity-40 sm:w-auto ${
              result && !result.verified
                ? "bg-red-500 text-red-950 shadow-red-500/25 hover:bg-red-400"
                : "bg-emerald-500 text-emerald-950 shadow-emerald-500/25 hover:bg-emerald-400"
            }`}
          >
            {verifying ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <ShieldCheck size={16} />
            )}
            {verifying ? t.verifying : t.verifyButton}
          </button>
          <p className="text-xs leading-relaxed text-zinc-500">{t.hint}</p>

          {verifyError && (
            <div className="flex items-center gap-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <XCircle size={18} className="shrink-0" />
              {verifyError}
            </div>
          )}

          {result && (
            <div
              className={`animate-[fadeIn_.3s_ease-out] rounded-2xl border p-5 ${
                result.verified
                  ? "border-emerald-400/40 bg-emerald-500/10 shadow-2xl shadow-emerald-500/20"
                  : "border-red-400/40 bg-red-500/10 shadow-2xl shadow-red-500/20"
              }`}
            >
              <div className="flex items-center gap-4">
                {result.verified ? (
                  <CheckCircle2
                    size={40}
                    className="shrink-0 text-emerald-400"
                  />
                ) : (
                  <XCircle size={40} className="shrink-0 text-red-400" />
                )}
                <div>
                  <p
                    className={`text-lg font-bold ${
                      result.verified ? "text-emerald-300" : "text-red-300"
                    }`}
                  >
                    {result.verified ? t.verifiedTitle : t.mismatchTitle}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {result.verified ? t.verifiedDesc : t.mismatchDesc}
                  </p>
                </div>
              </div>
              <p className="mt-4 break-all font-mono text-[11px] text-zinc-500">
                sha256: {result.computedHash}
              </p>
              {result.explorerUrl && (
                <a
                  href={result.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-300 transition hover:text-emerald-200"
                >
                  <ExternalLink size={12} />
                  {t.explorerLink}
                </a>
              )}
            </div>
          )}
        </Reveal>

        {/* ---------- Cadena on-chain del asset demo ---------- */}
        <Reveal delay={120} className={`${card} space-y-4 p-5 sm:p-6`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-white">{t.chainTitle}</h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                {t.chainLead}
              </p>
            </div>
            {evs.length > 0 && (
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                  chainIntact
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                    : "border-red-400/30 bg-red-400/10 text-red-300"
                }`}
              >
                <Link2 size={12} />
                {chainIntact ? t.chainIntact : t.chainBroken}
              </span>
            )}
          </div>

          <div className="rounded-xl border border-white/10 bg-black/20 px-4 py-3">
            <p className="text-xs text-zinc-500">{t.mailboxLabel}</p>
            <a
              href={history.explorerUrl}
              target="_blank"
              rel="noreferrer"
              className="break-all font-mono text-xs text-emerald-300 transition hover:text-emerald-200"
            >
              {history.assetAddress}
            </a>
          </div>

          {evs.length > 0 && (
            <div className="flex flex-col">
              {evs.map((ev, i) => {
                const isPrivate = ev.parsed.eventType === PRIVATE_MARK;
                return (
                  <Fragment key={ev.signature}>
                    {i > 0 && (
                      <div className="flex items-center justify-center py-1.5 text-emerald-400/60">
                        <ArrowDown size={15} />
                      </div>
                    )}
                    <div className="min-w-0 rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-emerald-400/30">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="flex min-w-0 items-center gap-1.5 break-all text-sm font-semibold text-white">
                          {isPrivate ? (
                            <>
                              <Lock size={13} className="text-zinc-400" />
                              <span className="text-zinc-300">PRIVADO</span>
                            </>
                          ) : (
                            ev.parsed.eventType
                          )}
                        </p>
                        {!isPrivate && ev.parsed.result && (
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                              ev.parsed.result === "PASS"
                                ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                                : ev.parsed.result === "FAIL"
                                  ? "border-red-400/30 bg-red-400/10 text-red-300"
                                  : "border-amber-400/30 bg-amber-400/10 text-amber-300"
                            }`}
                          >
                            {ev.parsed.result}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 break-all font-mono text-[10px] leading-4 text-zinc-500">
                        ← {ev.parsed.prevHash === GENESIS || !ev.parsed.prevHash
                          ? GENESIS
                          : `${ev.parsed.prevHash.slice(0, 12)}…`}
                      </p>
                      <p className="mt-1 break-all font-mono text-[10px] leading-4 text-emerald-300/80">
                        {ev.parsed.recordHash.slice(0, 16)}…
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <p className="text-[11px] text-zinc-600">
                          {ev.blockTime
                            ? new Date(ev.blockTime * 1000).toLocaleDateString()
                            : "—"}
                        </p>
                        <a
                          href={`https://explorer.solana.com/tx/${ev.signature}?cluster=devnet`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-300 transition hover:text-emerald-200"
                        >
                          {t.viewTx}
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
