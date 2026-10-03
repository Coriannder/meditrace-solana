import { NextRequest } from "next/server";
import { PRIVATE_MARK } from "@/lib/hash";
import { anchorEvent, buildMemo } from "@/lib/solana";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

const HASH_RE = /^[0-9a-f]{64}$/i;

/**
 * POST /api/anchor — ancla la huella de un registro en Solana. Stateless:
 * Meditrace no persiste registros; el documento queda en el CMMS.
 *
 * El CMMS hashea el registro de su lado: el documento nunca viaja.
 * Body: { assetId, eventType, result, recordHash, prevHash?, visibility? }
 * prevHash = hash del evento anterior del activo; "GENESIS" si es el primero.
 * visibility = "public" (default: tipo y resultado legibles on-chain) o
 *              "hash-only" (no hace falta enviar tipo/resultado; on-chain va PRIVADO).
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const assetId = String(body?.assetId ?? "").trim();
  const hashOnly = body?.visibility === "hash-only";
  const eventType = hashOnly
    ? PRIVATE_MARK
    : String(body?.eventType ?? "").toUpperCase();
  const result = hashOnly
    ? PRIVATE_MARK
    : String(body?.result ?? "PASS").toUpperCase();
  const recordHash = String(body?.recordHash ?? "").toLowerCase();
  const prevHash = String(body?.prevHash ?? "GENESIS");

  if (!assetId || assetId.length > 32) {
    return Response.json(
      { error: "assetId inválido (máx. 32 caracteres para derivar el buzón)" },
      { status: 400 }
    );
  }
  if (!hashOnly && !EVENT_TYPES.includes(eventType)) {
    return Response.json(
      { error: `eventType debe ser uno de: ${EVENT_TYPES.join("/")}` },
      { status: 400 }
    );
  }
  if (!HASH_RE.test(recordHash)) {
    return Response.json(
      { error: "recordHash debe ser un sha256 hex (64 caracteres)" },
      { status: 400 }
    );
  }

  try {
    const out = await anchorEvent({
      assetId,
      eventType,
      result,
      recordHash,
      prevHash,
    });
    return Response.json({
      signature: out.signature,
      assetAddress: String(out.assetAddress),
      memo: buildMemo({ assetId, eventType, result, recordHash, prevHash }),
      visibility: hashOnly ? "hash-only" : "public",
      recordHash,
      explorerUrl: `https://explorer.solana.com/tx/${out.signature}?cluster=devnet`,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return Response.json(
      { error: `Fallo el anclaje en devnet: ${msg.slice(0, 300)}` },
      { status: 502 }
    );
  }
}
